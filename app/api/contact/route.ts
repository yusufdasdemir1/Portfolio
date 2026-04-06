import net from 'node:net';
import tls from 'node:tls';

import { NextRequest, NextResponse } from 'next/server';

import {
  CONTACT_RATE_LIMIT_MAX_REQUESTS,
  CONTACT_RATE_LIMIT_WINDOW_MS,
  ContactFormValues,
  normalizeContactForm,
  validateContactForm
} from '@/lib/contact';

type RequestWindow = {
  count: number;
  resetAt: number;
};

type SocketLike = net.Socket | tls.TLSSocket;

type MailConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  toEmail: string;
  fromEmail: string;
};

const requestLog = new Map<string, RequestWindow>();

function getClientIdentifier(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for');

  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() ?? 'unknown';
  }

  return 'unknown';
}

function isRateLimited(identifier: string) {
  const now = Date.now();
  const currentEntry = requestLog.get(identifier);

  if (!currentEntry || currentEntry.resetAt <= now) {
    requestLog.set(identifier, {
      count: 1,
      resetAt: now + CONTACT_RATE_LIMIT_WINDOW_MS
    });

    return false;
  }

  if (currentEntry.count >= CONTACT_RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  currentEntry.count += 1;
  requestLog.set(identifier, currentEntry);

  return false;
}

function escapeHtml(input: string) {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function parseMailConfig(): MailConfig {
  const host = (process.env.SMTP_HOST ?? 'smtp.gmail.com').trim();
  const port = Number.parseInt((process.env.SMTP_PORT ?? '465').trim(), 10);
  const user = (process.env.SMTP_USER ?? '').trim();
  const pass = (process.env.SMTP_PASS ?? '').trim();
  const toEmail = (process.env.CONTACT_TO_EMAIL ?? '').trim();
  const fromEmail = (process.env.CONTACT_FROM_EMAIL ?? user).trim();

  if (!Number.isFinite(port) || port <= 0) {
    throw new Error('SMTP_PORT must be a valid number.');
  }

  if (!user || !pass || !toEmail || !fromEmail) {
    throw new Error('Email is not configured. Set SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL, and CONTACT_FROM_EMAIL.');
  }

  return {
    host,
    port,
    secure: port === 465,
    user,
    pass,
    toEmail,
    fromEmail
  };
}

function createSocket(config: MailConfig) {
  return new Promise<SocketLike>((resolve, reject) => {
    const onError = (error: Error) => reject(error);

    if (config.secure) {
      const secureSocket = tls.connect({
        host: config.host,
        port: config.port,
        servername: config.host,
        minVersion: 'TLSv1.2'
      });

      secureSocket.once('secureConnect', () => {
        secureSocket.off('error', onError);
        resolve(secureSocket);
      });
      secureSocket.once('error', onError);
      return;
    }

    const plainSocket = net.connect({ host: config.host, port: config.port });

    plainSocket.once('connect', () => {
      plainSocket.off('error', onError);
      resolve(plainSocket);
    });
    plainSocket.once('error', onError);
  });
}

function sendCommand(socket: SocketLike, command: string) {
  socket.write(`${command}\r\n`);
}

function getLastLine(response: string) {
  const lines = response.split(/\r?\n/).filter(Boolean);
  return lines.at(-1) ?? '';
}

function getLastStatusCode(response: string) {
  return Number(getLastLine(response).slice(0, 3));
}

function waitForResponse(socket: SocketLike, timeoutMs = 10_000) {
  return new Promise<string>((resolve, reject) => {
    let buffer = '';

    const timer = setTimeout(() => {
      cleanup();
      reject(new Error('SMTP server timed out while waiting for a response.'));
    }, timeoutMs);

    const onData = (chunk: Buffer | string) => {
      buffer += chunk.toString();
      const lines = buffer.split(/\r?\n/).filter(Boolean);
      const lastLine = lines.at(-1);

      if (lastLine && /^\d{3} /.test(lastLine)) {
        cleanup();
        resolve(buffer);
      }
    };

    const onError = (error: Error) => {
      cleanup();
      reject(error);
    };

    const onClose = () => {
      cleanup();
      reject(new Error('SMTP connection closed unexpectedly.'));
    };

    const cleanup = () => {
      clearTimeout(timer);
      socket.off('data', onData);
      socket.off('error', onError);
      socket.off('close', onClose);
    };

    socket.on('data', onData);
    socket.on('error', onError);
    socket.on('close', onClose);
  });
}

function assertStatus(response: string, expectedCodes: number[]) {
  const code = getLastStatusCode(response);

  if (!expectedCodes.includes(code)) {
    throw new Error(`SMTP error ${code}: ${getLastLine(response)}`);
  }
}

function toBase64(value: string) {
  return Buffer.from(value, 'utf8').toString('base64');
}

async function upgradeToTls(socket: net.Socket, config: MailConfig) {
  sendCommand(socket, `EHLO ${config.host}`);
  const ehloResponse = await waitForResponse(socket);
  assertStatus(ehloResponse, [250]);

  if (!/\bSTARTTLS\b/i.test(ehloResponse)) {
    throw new Error('SMTP server does not support STARTTLS on this port.');
  }

  sendCommand(socket, 'STARTTLS');
  assertStatus(await waitForResponse(socket), [220]);

  const secureSocket = tls.connect({
    socket,
    servername: config.host,
    minVersion: 'TLSv1.2'
  });

  await new Promise<void>((resolve, reject) => {
    secureSocket.once('secureConnect', resolve);
    secureSocket.once('error', reject);
  });

  sendCommand(secureSocket, `EHLO ${config.host}`);
  assertStatus(await waitForResponse(secureSocket), [250]);

  return secureSocket;
}

async function authenticateSmtp(socket: SocketLike, config: MailConfig) {
  sendCommand(socket, 'AUTH LOGIN');
  assertStatus(await waitForResponse(socket), [334]);

  sendCommand(socket, toBase64(config.user));
  assertStatus(await waitForResponse(socket), [334]);

  sendCommand(socket, toBase64(config.pass));
  const authResponse = await waitForResponse(socket);
  const authStatus = getLastStatusCode(authResponse);

  if (authStatus !== 235) {
    if (authStatus === 534 || authStatus === 535) {
      throw new Error('SMTP authentication failed. Use your Gmail address and a 16-digit App Password.');
    }

    throw new Error(`SMTP authentication failed: ${getLastLine(authResponse)}`);
  }
}

function sanitizeSmtpText(input: string) {
  return input
    .replaceAll('\r\n', '\n')
    .replaceAll('\r', '\n')
    .replace(/\n\./g, '\n..');
}

async function sendContactMail(values: ContactFormValues) {
  const config = parseMailConfig();
  const rawSocket = await createSocket(config);

  let socket: SocketLike = rawSocket;

  try {
    assertStatus(await waitForResponse(socket), [220]);

    if (config.secure) {
      sendCommand(socket, `EHLO ${config.host}`);
      assertStatus(await waitForResponse(socket), [250]);
    } else {
      socket = await upgradeToTls(rawSocket as net.Socket, config);
    }

    await authenticateSmtp(socket, config);

    sendCommand(socket, `MAIL FROM:<${config.user}>`);
    assertStatus(await waitForResponse(socket), [250]);

    sendCommand(socket, `RCPT TO:<${config.toEmail}>`);
    assertStatus(await waitForResponse(socket), [250, 251]);

    sendCommand(socket, 'DATA');
    assertStatus(await waitForResponse(socket), [354]);

    const safeName = escapeHtml(values.name);
    const safeEmail = escapeHtml(values.email);
    const safeSubject = escapeHtml(values.subject);
    const safeMessage = escapeHtml(values.message).replace(/\n/g, '<br/>');

    const plainMessage = sanitizeSmtpText(
      `Name: ${values.name}\nEmail: ${values.email}\nSubject: ${values.subject}\n\nMessage:\n${values.message}`
    );

    const htmlMessage = sanitizeSmtpText(`
<p><strong>Name:</strong> ${safeName}</p>
<p><strong>Email:</strong> ${safeEmail}</p>
<p><strong>Subject:</strong> ${safeSubject}</p>
<p><strong>Message:</strong></p>
<p>${safeMessage}</p>
`.trim());

    const boundary = `portfolio-${Date.now()}`;
    const mimeData = [
      `From: ${config.fromEmail}`,
      `To: ${config.toEmail}`,
      `Reply-To: ${values.email}`,
      `Subject: [Portfolio Contact] ${values.subject}`,
      'MIME-Version: 1.0',
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      '',
      `--${boundary}`,
      'Content-Type: text/plain; charset="UTF-8"',
      '',
      plainMessage,
      '',
      `--${boundary}`,
      'Content-Type: text/html; charset="UTF-8"',
      '',
      htmlMessage,
      '',
      `--${boundary}--`,
      '.'
    ].join('\r\n');

    socket.write(`${mimeData}\r\n`);
    assertStatus(await waitForResponse(socket), [250]);

    sendCommand(socket, 'QUIT');
    await waitForResponse(socket);
  } finally {
    rawSocket.end();
  }
}

function toPublicError(error: unknown) {
  if (!(error instanceof Error)) {
    return {
      status: 502,
      message: 'Unable to send your message right now. Please try again shortly.'
    };
  }

  const lowered = error.message.toLowerCase();

  if (lowered.includes('not configured') || lowered.includes('smtp_port')) {
    return {
      status: 500,
      message: 'Server email settings are incomplete. Please contact the site owner.'
    };
  }

  if (lowered.includes('authentication failed')) {
    return {
      status: 502,
      message: 'SMTP authentication failed. Use your Gmail address and a 16-digit App Password.'
    };
  }

  if (lowered.includes('timed out') || lowered.includes('econnrefused') || lowered.includes('enotfound')) {
    return {
      status: 502,
      message: 'Unable to reach the SMTP server. Please try again later.'
    };
  }

  return {
    status: 502,
    message: 'Unable to send your message right now. Please try again shortly.'
  };
}

export async function POST(request: NextRequest) {
  try {
    const clientId = getClientIdentifier(request);

    if (isRateLimited(clientId)) {
      return NextResponse.json({ error: 'Too many requests. Please try again in a minute.' }, { status: 429 });
    }

    const payload = (await request.json()) as ContactFormValues;
    const normalized = normalizeContactForm(payload);
    const errors = validateContactForm(normalized);

    if (Object.keys(errors).length > 0) {
      if (errors.company) {
        return NextResponse.json({ ok: true }, { status: 200 });
      }

      return NextResponse.json({ error: 'Invalid form data. Please check your inputs.' }, { status: 400 });
    }

    await sendContactMail(normalized);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    const publicError = toPublicError(error);
    console.error('Failed to send contact email:', error);

    return NextResponse.json({ error: publicError.message }, { status: publicError.status });
  }
}

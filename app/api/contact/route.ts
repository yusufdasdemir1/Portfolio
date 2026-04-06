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

function toBase64(value: string) {
  return Buffer.from(value, 'utf8').toString('base64');
}


function extractEmailAddress(value: string) {
  const match = value.match(/<([^>]+)>/);

  if (match?.[1]) {
    return match[1].trim();
  }

  return value.trim();
}

function sendCommand(socket: tls.TLSSocket, command: string) {
  socket.write(`${command}\r\n`);
}

function sanitizeSmtpText(input: string) {
  return input
    .replaceAll('\r\n', '\n')
    .replaceAll('\r', '\n')
    .replace(/\n\./g, '\n..');
}

function waitForResponse(socket: tls.TLSSocket) {
  return new Promise<string>((resolve, reject) => {
    const chunks: string[] = [];

    const onData = (buffer: Buffer) => {
      const text = buffer.toString('utf8');
      chunks.push(text);

      const merged = chunks.join('');
      const lines = merged.split(/\r?\n/).filter(Boolean);
      const lastLine = lines.at(-1);

      if (lastLine && /^\d{3} /.test(lastLine)) {
        cleanup();
        resolve(merged);
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
  const lines = response.split(/\r?\n/).filter(Boolean);
  const lastLine = lines.at(-1) ?? '';
  const code = Number(lastLine.slice(0, 3));

  if (!expectedCodes.includes(code)) {
    if (code == 535) {
      throw new Error('SMTP authentication failed. Use your Gmail address and a 16-digit App Password.');
    }

    throw new Error(`SMTP error: ${lastLine || response}`);
  }
}

async function sendSmtpMail(values: ContactFormValues) {
  const host = (process.env.SMTP_HOST ?? 'smtp.gmail.com').trim();
  const port = Number(process.env.SMTP_PORT ?? 465);
  const user = (process.env.SMTP_USER ?? '').trim();
  const pass = (process.env.SMTP_PASS ?? '').replaceAll(' ', '').trim();
  const toEmail = (process.env.CONTACT_TO_EMAIL ?? '').trim();
  const fromEmail = (process.env.CONTACT_FROM_EMAIL ?? '').trim();

  if (!user || !pass || !toEmail || !fromEmail) {
    throw new Error('Server is not configured for email delivery.');
  }

  const mailFromAddress = extractEmailAddress(fromEmail);
  const rcptToAddress = extractEmailAddress(toEmail);

  const socket = tls.connect({
    host,
    port,
    servername: host,
    minVersion: 'TLSv1.2'
  });

  socket.setEncoding('utf8');

  await new Promise<void>((resolve, reject) => {
    socket.once('secureConnect', () => resolve());
    socket.once('error', reject);
  });

  try {
    assertStatus(await waitForResponse(socket), [220]);

    sendCommand(socket, `EHLO ${host}`);
    assertStatus(await waitForResponse(socket), [250]);

    sendCommand(socket, 'AUTH LOGIN');
    assertStatus(await waitForResponse(socket), [334]);

    sendCommand(socket, toBase64(user));
    assertStatus(await waitForResponse(socket), [334]);

    sendCommand(socket, toBase64(pass));
    assertStatus(await waitForResponse(socket), [235]);

    sendCommand(socket, `MAIL FROM:<${mailFromAddress}>`);
    assertStatus(await waitForResponse(socket), [250]);

    sendCommand(socket, `RCPT TO:<${rcptToAddress}>`);
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
      `From: ${fromEmail}`,
      `To: ${toEmail}`,
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
    assertStatus(await waitForResponse(socket), [221]);
  } finally {
    socket.end();
  }
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

    await sendSmtpMail(normalized);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('Failed to send contact email:', error);

    const message = error instanceof Error ? error.message : 'Unable to send message right now. Please try again later.';
    const status = message.includes('configured') ? 500 : 502;

    return NextResponse.json({ error: message }, { status });
  }
}

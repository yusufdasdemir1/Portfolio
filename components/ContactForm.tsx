'use client';

import { FormEvent, useMemo, useState } from 'react';

import { ContactFormValues, validateContactForm } from '@/lib/contact';
import { translations, type Locale } from '@/data/i18n';

type FormStatus =
  | { type: 'idle' }
  | { type: 'success'; message: string }
  | { type: 'error'; message: string };

const initialValues: ContactFormValues = {
  name: '',
  email: '',
  subject: '',
  message: '',
  company: ''
};

type ContactFormProps = {
  locale?: Locale;
};

export function ContactForm({ locale = 'en' }: ContactFormProps) {
  const [formValues, setFormValues] = useState(initialValues);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<FormStatus>({ type: 'idle' });

  const copy = translations[locale].form;

  const fieldErrors = useMemo(
    () => validateContactForm(formValues, copy.validation),
    [copy.validation, formValues]
  );

  const hasErrors = Object.keys(fieldErrors).length > 0;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setStatus({ type: 'idle' });

    if (hasErrors) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formValues)
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? 'Something went wrong while sending your message.');
      }

      setStatus({ type: 'success', message: copy.success });
      setFormValues(initialValues);
      setSubmitted(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong while sending your message.';
      setStatus({ type: 'error', message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" noValidate onSubmit={onSubmit}>
      <input
        aria-hidden="true"
        tabIndex={-1}
        autoComplete="off"
        type="text"
        name="company"
        value={formValues.company}
        onChange={(event) => setFormValues((prev) => ({ ...prev, company: event.target.value }))}
        className="hidden"
      />

      <div>
        <label htmlFor="name" className="mb-2 block text-sm text-slate-200">
          {copy.name}
        </label>
        <input
          id="name"
          name="name"
          value={formValues.name}
          onChange={(event) => setFormValues((prev) => ({ ...prev, name: event.target.value }))}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-50 outline-none transition focus:border-brand-400"
          placeholder={copy.namePlaceholder}
        />
        {submitted && fieldErrors.name ? <p className="mt-1 text-sm text-rose-300">{fieldErrors.name}</p> : null}
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-sm text-slate-200">
          {copy.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formValues.email}
          onChange={(event) => setFormValues((prev) => ({ ...prev, email: event.target.value }))}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-50 outline-none transition focus:border-brand-400"
          placeholder="you@example.com"
        />
        {submitted && fieldErrors.email ? <p className="mt-1 text-sm text-rose-300">{fieldErrors.email}</p> : null}
      </div>

      <div>
        <label htmlFor="subject" className="mb-2 block text-sm text-slate-200">
          {copy.subject}
        </label>
        <input
          id="subject"
          name="subject"
          value={formValues.subject}
          onChange={(event) => setFormValues((prev) => ({ ...prev, subject: event.target.value }))}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-50 outline-none transition focus:border-brand-400"
          placeholder={copy.subjectPlaceholder}
        />
        {submitted && fieldErrors.subject ? <p className="mt-1 text-sm text-rose-300">{fieldErrors.subject}</p> : null}
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm text-slate-200">
          {copy.message}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={formValues.message}
          onChange={(event) => setFormValues((prev) => ({ ...prev, message: event.target.value }))}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-50 outline-none transition focus:border-brand-400"
          placeholder={copy.messagePlaceholder}
        />
        {submitted && fieldErrors.message ? <p className="mt-1 text-sm text-rose-300">{fieldErrors.message}</p> : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? copy.submitting : copy.submit}
      </button>

      {status.type === 'success' ? <p className="text-sm text-emerald-300">{status.message}</p> : null}
      {status.type === 'error' ? <p className="text-sm text-rose-300">{status.message}</p> : null}
      <p className="text-xs text-slate-400">{copy.secureText}</p>
    </form>
  );
}

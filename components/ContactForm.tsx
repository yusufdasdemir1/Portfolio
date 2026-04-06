'use client';

import { FormEvent, useMemo, useState } from 'react';

const initialValues = {
  name: '',
  email: '',
  message: ''
};

export function ContactForm() {
  const [formValues, setFormValues] = useState(initialValues);
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => {
    const nextErrors: Partial<typeof initialValues> = {};

    if (formValues.name.trim().length < 2) {
      nextErrors.name = 'Please enter your full name.';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formValues.email)) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (formValues.message.trim().length < 15) {
      nextErrors.message = 'Please write at least 15 characters.';
    }

    return nextErrors;
  }, [formValues]);

  const hasErrors = Object.keys(errors).length > 0;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    if (!hasErrors) {
      window.alert('Thanks! This is a UI-only form. Connect it to your backend or form service.');
      setFormValues(initialValues);
      setSubmitted(false);
    }
  };

  return (
    <form className="space-y-4" noValidate onSubmit={onSubmit}>
      <div>
        <label htmlFor="name" className="mb-2 block text-sm text-slate-200">
          Name
        </label>
        <input
          id="name"
          name="name"
          value={formValues.name}
          onChange={(event) => setFormValues((prev) => ({ ...prev, name: event.target.value }))}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-50 outline-none transition focus:border-brand-400"
          placeholder="Your full name"
        />
        {submitted && errors.name ? <p className="mt-1 text-sm text-rose-300">{errors.name}</p> : null}
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-sm text-slate-200">
          Email
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
        {submitted && errors.email ? <p className="mt-1 text-sm text-rose-300">{errors.email}</p> : null}
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm text-slate-200">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={formValues.message}
          onChange={(event) => setFormValues((prev) => ({ ...prev, message: event.target.value }))}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-50 outline-none transition focus:border-brand-400"
          placeholder="Tell me about your project, role, or collaboration idea..."
        />
        {submitted && errors.message ? <p className="mt-1 text-sm text-rose-300">{errors.message}</p> : null}
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-brand-400"
      >
        Send Message
      </button>
      <p className="text-xs text-slate-400">Form validation is active. Connect this to Formspree, Resend, or a custom API route to enable delivery.</p>
    </form>
  );
}

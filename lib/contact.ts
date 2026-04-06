export const CONTACT_RATE_LIMIT_WINDOW_MS = 60_000;
export const CONTACT_RATE_LIMIT_MAX_REQUESTS = 3;

export type ContactFormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string;
};

export type ContactFormFieldErrors = Partial<Record<keyof ContactFormValues, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(values: ContactFormValues): ContactFormFieldErrors {
  const errors: ContactFormFieldErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = 'Please enter your full name.';
  }

  if (!emailPattern.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (values.subject.trim().length < 3) {
    errors.subject = 'Please provide a subject.';
  }

  if (values.message.trim().length < 15) {
    errors.message = 'Please write at least 15 characters.';
  }

  if ((values.company ?? '').length > 0) {
    errors.company = 'Bot submission rejected.';
  }

  return errors;
}

export function normalizeContactForm(values: ContactFormValues): ContactFormValues {
  return {
    name: values.name.trim(),
    email: values.email.trim(),
    subject: values.subject.trim(),
    message: values.message.trim(),
    company: (values.company ?? '').trim()
  };
}

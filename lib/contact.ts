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
type ContactValidationMessages = Record<keyof ContactFormValues, string>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(
  values: ContactFormValues,
  messages?: Partial<ContactValidationMessages>
): ContactFormFieldErrors {
  const fallbackMessages: ContactValidationMessages = {
    name: 'Please enter your full name.',
    email: 'Please enter a valid email address.',
    subject: 'Please provide a subject.',
    message: 'Please write at least 15 characters.',
    company: 'Bot submission rejected.'
  };

  const resolvedMessages = { ...fallbackMessages, ...messages };
  const errors: ContactFormFieldErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = resolvedMessages.name;
  }

  if (!emailPattern.test(values.email.trim())) {
    errors.email = resolvedMessages.email;
  }

  if (values.subject.trim().length < 3) {
    errors.subject = resolvedMessages.subject;
  }

  if (values.message.trim().length < 15) {
    errors.message = resolvedMessages.message;
  }

  if ((values.company ?? '').length > 0) {
    errors.company = resolvedMessages.company;
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

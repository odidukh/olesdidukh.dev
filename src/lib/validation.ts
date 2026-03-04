const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s\-\+\(\)]+$/;
const MIN_PHONE_DIGITS = 10;

export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function validatePhone(phone: string): boolean {
  if (!phone) return true; // Phone is optional
  return (
    PHONE_REGEX.test(phone) &&
    phone.replace(/\D/g, '').length >= MIN_PHONE_DIGITS
  );
}

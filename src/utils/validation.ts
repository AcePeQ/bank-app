import { DIGIT_REGEX, EMAIL_REGEX, LOWERCASE_REGEX, NAME_REGEX, PHONE_REGEX, SPECIAL_CHARACTER_REGEX, UPPERCASE_REGEX, WHITESPACE_REGEX } from "./constants";

function validResult(strength?: number) {
  return {
    isValid: true,
    message: null,
    strength: strength,
  }
}

function invalidResult(message: string, strength?: number) {
  return {
    isValid: false,
    message,
    strength,
  }
}

export type ValidationResult = {
  isValid: boolean,
  message: string | null
  strength: number | undefined,
}

function validateName(value: string, fieldLabel: string) {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return invalidResult(`${fieldLabel} is required.`)
  }

  if (normalizedValue.length < 2 || normalizedValue.length > 50) {
    return invalidResult(`${fieldLabel} must contain 2 and 50 characters`);
  }

  if (!NAME_REGEX.test(normalizedValue)) {
    return invalidResult(`${fieldLabel} may contain only letters, spaces, apostrophes and hyphens.`)
  }

  return validResult();
}

export const validateFirstName = (value: string) => validateName(value, "First name")

export const validateLastName = (value: string) => validateName(value, "Last name")

export function validateEmail(value: string): ValidationResult {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return invalidResult("Email address is required.");
  }

  if (normalizedValue.length > 254) {
    return invalidResult(
      "Email address must not exceed 254 characters."
    );
  }

  if (!EMAIL_REGEX.test(normalizedValue)) {
    return invalidResult(
      "Enter a valid email address."
    );
  }

  return validResult();
}

export function validatePhoneNumber(
  value: string
): ValidationResult {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return invalidResult("Phone number is required.");
  }

  if (!PHONE_REGEX.test(normalizedValue)) {
    return invalidResult(
      "Enter a valid phone number, for example +48123456789.",
    );
  }

  return validResult();
}

export function validatePassword(
  value: string
): ValidationResult {
  if (!value) {
    return invalidResult("Password is required.", 0);
  }

  if (value.length < 8) {
    return invalidResult(
      "Password must contain at least 8 characters.", 1
    );
  }

  if (value.length > 64) {
    return invalidResult(
      "Password must not exceed 64 characters.", 1
    );
  }


  if (WHITESPACE_REGEX.test(value)) {
    return invalidResult(
      "Password must not contain spaces.", 2
    );
  }

  if (!LOWERCASE_REGEX.test(value)) {
    return invalidResult(
      "Password must contain at least one lowercase letter.", 2
    );
  }

  if (!UPPERCASE_REGEX.test(value)) {
    return invalidResult(
      "Password must contain at least one uppercase letter.", 2
    );
  }

  if (!DIGIT_REGEX.test(value)) {
    return invalidResult(
      "Password must contain at least one number.", 3
    );
  }

  if (!SPECIAL_CHARACTER_REGEX.test(value)) {
    return invalidResult(
      "Password must contain at least one special character.", 3
    );
  }

  return validResult(4);
}

export function validateConfirmPassword(
  value: string,
  password: string
): ValidationResult {
  if (!value) {
    return invalidResult(
      "Password confirmation is required."
    );
  }

  if (value !== password) {
    return invalidResult("Passwords do not match.");
  }

  return validResult();
}

export function validateTerms(
  isChecked: boolean
): ValidationResult {
  if (!isChecked) {
    return invalidResult(
      "You must accept the Terms of Service and Privacy Policy."
    );
  }

  return validResult();
}
import { DIGIT_REGEX, EMAIL_REGEX, LOWERCASE_REGEX, NAME_REGEX, PHONE_REGEX, SPECIAL_CHARACTER_REGEX, UPPERCASE_REGEX, WHITESPACE_REGEX } from "./constants";

function validResult() {
  return {
    isValid: true,
    message: null,
  }
}

function invalidResult(message:string) {
  return {
    isValid: false,
    message,
  }
}

export type ValidationResult = {
  isValid: boolean,
  message: string | null
}

export function validateFirstName(value: string):ValidationResult {
  const normalizedValue = value.trim();

  if(!normalizedValue) {
    return invalidResult("First name is required.")
  }

  if(normalizedValue.length < 2 || normalizedValue.length > 50) {
    return invalidResult("First name must contain 2 and 50 characters");
  }

  if(!NAME_REGEX.test(normalizedValue)) {
    return invalidResult("First name may contain only letters, spaces, apostrophes and hyphens.")
  }

  return validResult();
}

export function validateLastName(value: string):ValidationResult {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return invalidResult("Last name is required.");
  }

  if (
    normalizedValue.length < 2 ||
    normalizedValue.length > 50
  ) {
    return invalidResult(
      "Last name must contain between 2 and 50 characters."
    );
  }

  if (!NAME_REGEX.test(normalizedValue)) {
    return invalidResult(
      "Last name may contain only letters, spaces, apostrophes and hyphens."
    );
  }

  return validResult();
}

export function validateEmail(value: string):ValidationResult {
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
):ValidationResult {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return invalidResult("Phone number is required.");
  }

  if (!PHONE_REGEX.test(normalizedValue)) {
    return invalidResult(
      "Enter the phone number in the format (555) 000-0000."
    );
  }

  return validResult();
}

export function validatePassword(
  value: string
):ValidationResult {
  if (!value) {
    return invalidResult("Password is required.");
  }

  if (value.length < 8) {
    return invalidResult(
      "Password must contain at least 8 characters."
    );
  }

  if (value.length > 64) {
    return invalidResult(
      "Password must not exceed 64 characters."
    );
  }

  if (WHITESPACE_REGEX.test(value)) {
    return invalidResult(
      "Password must not contain spaces."
    );
  }

  if (!LOWERCASE_REGEX.test(value)) {
    return invalidResult(
      "Password must contain at least one lowercase letter."
    );
  }

  if (!UPPERCASE_REGEX.test(value)) {
    return invalidResult(
      "Password must contain at least one uppercase letter."
    );
  }

  if (!DIGIT_REGEX.test(value)) {
    return invalidResult(
      "Password must contain at least one number."
    );
  }

  if (!SPECIAL_CHARACTER_REGEX.test(value)) {
    return invalidResult(
      "Password must contain at least one special character."
    );
  }

  return validResult();
}

export function validateConfirmPassword(
  value: string,
  password: string
):ValidationResult {
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
):ValidationResult {
  if (!isChecked) {
    return invalidResult(
      "You must accept the Terms of Service and Privacy Policy."
    );
  }

  return validResult();
}
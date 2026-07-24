import { createIcons, Eye, EyeOff } from "lucide";
import { validateConfirmPassword, validateEmail, validateFirstName, validateLastName, validatePassword, validatePhoneNumber, validateTerms, type ValidationResult } from "../utils/validation";

import { getErrorElement, getRequiredElement, mapStrengthValue } from "../utils/helpers";
import type { RegisterData } from "../types/auth";
import { registerUser } from "../services/auth";

function init() {


  createIcons({
    icons: {
      Eye,
      EyeOff,
    }
  })

  const formEl = getRequiredElement("#form", HTMLFormElement);
  const formErrorEl = getRequiredElement("#formError", HTMLParagraphElement);
  const firstNameInputEl = getRequiredElement("#firstName", HTMLInputElement);
  const lastNameInputEl = getRequiredElement("#lastName", HTMLInputElement);
  const emailInputEl = getRequiredElement("#email", HTMLInputElement);
  const phoneNumberInputEl = getRequiredElement("#phoneNumber", HTMLInputElement);
  const passwordInputEl = getRequiredElement("#password", HTMLInputElement);
  const confirmPasswordInputEl = getRequiredElement("#confirmPassword", HTMLInputElement);
  const termsCheckboxEl = getRequiredElement("#terms", HTMLInputElement);
  const passwordProgressEl = getRequiredElement("#passwordProgress", HTMLDivElement);

  const submitBtnEl = getRequiredElement("#registerBtn", HTMLButtonElement);
  const submitBtnTextEl = getRequiredElement("#registerBtnText", HTMLSpanElement);
  const loaderEl = getRequiredElement("#loader", HTMLSpanElement);

  const showPasswordBtnEl = getRequiredElement("#showPasswordBtn", HTMLButtonElement);
  const showPasswordIconEl = getRequiredElement("#showPasswordIcon", Element);
  const hidePasswordIconEl = getRequiredElement("#hidePasswordIcon", Element);

  let isLoading = false;

  const validators = {
    firstName: validateFirstName,
    lastName: validateLastName,
    email: validateEmail,
    phoneNumber: validatePhoneNumber,
  };

  type ValidatorName = keyof typeof validators;

  function isValidatorName(name: string): name is ValidatorName {
    return name in validators;
  }

  function handleValidationInput(inputEl: HTMLInputElement, errorEl: HTMLParagraphElement) {
    const name = inputEl.getAttribute("name");
    if (!name) return;

    const inputValue = inputEl.value;

    if (!isValidatorName(name)) return;

    const validationObj = validators[name](inputValue);

    // switch (name) {
    //   case "firstName":
    //     validationObj = validateFirstName(inputValue);
    //     break;
    //   case "lastName":
    //     validationObj = validateLastName(inputValue);
    //     break;
    //   case "email":
    //     validationObj = validateEmail(inputValue);
    //     break;
    //   case "phoneNumber":
    //     validationObj = validatePhoneNumber(inputValue);
    //     break;
    //   case "password":
    //     validationObj = validatePassword(inputValue);
    //     handlePasswordStrength(validationObj.strength ?? 0)
    //     break;
    //   case "confirmPassword":
    //     const passwordValue = passwordInputEl.value;
    //     validationObj = validateConfirmPassword(inputValue, passwordValue);
    //     break;
    //   default:
    //     return null;
    // }

    if (validationObj.isValid) {
      handleValidInput(inputEl, errorEl);
    } else {
      handleInvalidInput(inputEl, errorEl, validationObj.message ?? "Invalid format.");
    }

    return validationObj;
  }

  function handleValidInput(inputEl: HTMLInputElement, errorEl: HTMLParagraphElement) {
    errorEl.textContent = "";
    errorEl.classList.add("hidden");

    inputEl.classList.remove("invalid");
    inputEl.classList.add("valid");

    inputEl.setAttribute("aria-invalid", "false");
  }

  function handleInvalidInput(inputEl: HTMLInputElement, errorEl: HTMLParagraphElement, message: string) {
    errorEl.textContent = message;
    errorEl.classList.remove("hidden");

    inputEl.classList.remove("valid");
    inputEl.classList.add("invalid");

    inputEl.setAttribute("aria-invalid", "true");
  }

  function handleInput(event: Event) {
    if (!(event.target instanceof HTMLInputElement)) return;

    const target = event.target;

    const inputRowEl = target.closest<HTMLDivElement>(".form__row");
    if (!inputRowEl) return;

    const errorEl = inputRowEl.querySelector<HTMLParagraphElement>(".form__error");

    if (!errorEl) return;

    const shouldClearFormError = formErrorEl.classList.contains("hidden");

    if (!shouldClearFormError) {
      clearFormError();
    }

    handleValidationInput(target, errorEl)

    const shouldRevalidateConfirmation = target === passwordInputEl && confirmPasswordInputEl.value.length > 0;

    if (shouldRevalidateConfirmation) {
      const confirmPasswordErrorEl = getErrorElement(confirmPasswordInputEl);
      handleValidationInput(confirmPasswordInputEl, confirmPasswordErrorEl);
    }
  }


  function handleValidationCheckbox() {
    const termsValidation = validateTerms(termsCheckboxEl.checked);
    const termsErrorEl = getErrorElement(termsCheckboxEl);

    if (termsValidation.isValid) {
      termsCheckboxEl.classList.remove("invalid");
      termsCheckboxEl.classList.add("valid");

      termsErrorEl.textContent = "";
      termsCheckboxEl.setAttribute("aria-invalid", "false");
    } else {
      termsCheckboxEl.classList.remove("valid");
      termsCheckboxEl.classList.add("invalid");
      termsCheckboxEl.setAttribute("aria-invalid", "true");
      termsErrorEl.textContent = termsValidation.message;
    }

    return termsValidation;
  }

  function focusFirstInvalidInput() {
    const firstInvalidInput = formEl.querySelector<HTMLInputElement>(".invalid");
    firstInvalidInput?.focus();
  }

  function showFormError(message: string) {
    formErrorEl.textContent = message;
    formErrorEl.classList.remove("hidden");
  }

  function clearFormError() {
    formErrorEl.textContent = "";
    formErrorEl.classList.add("hidden");
  }


  function handlePasswordStrength(strength: number) {
    const passwordProgressChildren = Array.from(passwordProgressEl.children) as HTMLSpanElement[];
    const arrayLength = passwordProgressChildren.length;

    passwordProgressEl.setAttribute("aria-valuenow", String(strength));

    strength >= 1
      ? passwordProgressEl.setAttribute("aria-valuetext", `Password is ${mapStrengthValue(strength)}`)
      : passwordProgressEl.setAttribute("aria-valuetext", "No password requirements met")

    if (!passwordInputEl.value) {
      for (let i = 0; i < arrayLength; i++) {
        passwordProgressChildren[i].classList.add("cover");
      }
      return
    }

    for (let i = 0; i < strength; i++) {
      passwordProgressChildren[i].classList.remove("cover");
    }

    for (let i = strength; i <= arrayLength - 1; i++) {
      passwordProgressChildren[i].classList.add("cover");
    }
  }

  function handleLoading() {
    loaderEl.classList.toggle("hidden", !isLoading);
    submitBtnTextEl.classList.toggle("hidden", isLoading);
  }

  function toggleInputs() {
    firstNameInputEl.disabled = isLoading;
    lastNameInputEl.disabled = isLoading;
    emailInputEl.disabled = isLoading;
    phoneNumberInputEl.disabled = isLoading;
    passwordInputEl.disabled = isLoading;
    confirmPasswordInputEl.disabled = isLoading;
    termsCheckboxEl.disabled = isLoading;
    showPasswordBtnEl.disabled = isLoading;
  }

  function toggleShowPassword() {
    const shouldShowPassword = passwordInputEl.type === "password";

    passwordInputEl.type = shouldShowPassword ? "text" : "password";
    confirmPasswordInputEl.type = shouldShowPassword ? "text" : "password";

    showPasswordIconEl.classList.toggle("hidden", shouldShowPassword);
    hidePasswordIconEl.classList.toggle("hidden", !shouldShowPassword);

    showPasswordBtnEl.setAttribute(
      "aria-label",
      shouldShowPassword ? "Hide password" : "Show password",
    );
  }

  async function handleRequest(registerData: RegisterData) {
    try {
      clearFormError();
      isLoading = true;
      submitBtnEl.disabled = true;
      toggleInputs();
      handleLoading();
      formEl.setAttribute("aria-busy", "true");
      await registerUser(registerData);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        showFormError(error.message)
      } else {
        console.error("Unknown registration error occurred!");
        showFormError("Unknown registration error occurred!")
      }

    } finally {
      isLoading = false;
      submitBtnEl.disabled = false;
      toggleInputs();
      handleLoading();
      formEl.setAttribute("aria-busy", "false");
    }
  }

  function handleSubmit(event: Event) {
    event.preventDefault();

    if (isLoading) return;

    const firstNameErrorEl = getErrorElement(firstNameInputEl);
    const lastNameErrorEl = getErrorElement(lastNameInputEl);
    const emailErrorEl = getErrorElement(emailInputEl);
    const phoneNumberErrorEl = getErrorElement(phoneNumberInputEl);
    const passwordErrorEl = getErrorElement(passwordInputEl);
    const confirmPasswordErrorEl = getErrorElement(confirmPasswordInputEl);

    const isFormValid = [
      handleValidationInput(firstNameInputEl, firstNameErrorEl)?.isValid,
      handleValidationInput(lastNameInputEl, lastNameErrorEl)?.isValid,
      handleValidationInput(emailInputEl, emailErrorEl)?.isValid,
      handleValidationInput(phoneNumberInputEl, phoneNumberErrorEl)?.isValid,
      handleValidationInput(passwordInputEl, passwordErrorEl)?.isValid,
      handleValidationInput(confirmPasswordInputEl, confirmPasswordErrorEl)?.isValid,
      handleValidationCheckbox().isValid,
    ].every(Boolean);

    if (!isFormValid) {
      focusFirstInvalidInput();
      return;
    };

    const registerData = {
      firstName: firstNameInputEl.value.trim(),
      lastName: lastNameInputEl.value.trim(),
      email: emailInputEl.value.trim().toLowerCase(),
      phoneNumber: phoneNumberInputEl.value.trim(),
      password: passwordInputEl.value,
    }

    handleRequest(registerData);
  }

  termsCheckboxEl.addEventListener("change", handleValidationCheckbox);
  showPasswordBtnEl.addEventListener("click", toggleShowPassword);
  formEl.addEventListener("submit", handleSubmit);
  formEl.addEventListener("input", handleInput);
};

init();

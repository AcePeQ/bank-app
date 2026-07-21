import { createIcons, Eye, EyeOff } from "lucide";
import { validateConfirmPassword, validateEmail, validateFirstName, validateLastName, validatePassword, validatePhoneNumber, validateTerms, type ValidationResult } from "../utils/validation";
import { registerUser } from "../services/api";
import { getErrorElement, getRequiredElement } from "../utils/helpers";

export type RegisterData = {
  firstName: string,
  lastName: string,
  email: string;
  phoneNumber: string,
  password: string;
}

function init() {
  createIcons({
    icons: {
      Eye,
      EyeOff,
    }
  })

  const formEl = getRequiredElement("#form", HTMLFormElement);
  const firstNameInputEl = getRequiredElement("#firstName", HTMLInputElement);
  const lastNameInputEl = getRequiredElement("#lastName", HTMLInputElement);
  const emailInputEl = getRequiredElement("#email", HTMLInputElement);
  const phoneNumberInputEl = getRequiredElement("#phoneNumber", HTMLInputElement);
  const passwordInputEl = getRequiredElement("#password", HTMLInputElement);
  const confirmPasswordInputEl = getRequiredElement("#confirmPassword", HTMLInputElement);
  const termsCheckboxEl = getRequiredElement("#terms", HTMLInputElement);
  const passwordProgressEl = getRequiredElement("#passwordProgress", HTMLDivElement);

  const submitBtnEl = getRequiredElement("#register-btn", HTMLButtonElement);
  const submitBtnTextEl = getRequiredElement("#register-btn-text", HTMLSpanElement);
  const loaderEl = getRequiredElement("#loader", HTMLSpanElement);

  const showPasswordBtnEl = getRequiredElement("#show-password-btn", HTMLButtonElement);
  const showPasswordIconEl = getRequiredElement("#show-password-icon", Element);
  const hidePasswordIconEl = getRequiredElement("#hide-password-icon", Element);

  let isLoading = false;

  function handleValidationInput(inputEl: HTMLInputElement, errorEl: HTMLParagraphElement) {
    const name = inputEl.getAttribute("name");

    const inputValue = inputEl.value;
    let validationObj: ValidationResult;

    switch (name) {
      case "firstName":
        validationObj = validateFirstName(inputValue);
        break;
      case "lastName":
        validationObj = validateLastName(inputValue);
        break;
      case "email":
        validationObj = validateEmail(inputValue);
        break;
      case "phoneNumber":
        validationObj = validatePhoneNumber(inputValue);
        break;
      case "password":
        validationObj = validatePassword(inputValue);
        handlePasswordStrength(validationObj.strength ?? 0)
        break;
      case "confirmPassword":
        const passwordValue = passwordInputEl.value;
        validationObj = validateConfirmPassword(inputValue, passwordValue);
        break;
      default:
        return null;
    }

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
    if (!target) return;

    const inputRowEl = target.closest<HTMLDivElement>(".form__row");
    if (!inputRowEl) return;

    const errorEl = inputRowEl.querySelector<HTMLParagraphElement>(".form__error");

    if (!errorEl) return;

    handleValidationInput(target, errorEl)
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

  function handlePasswordStrength(strength: number) {
    const passwordProgressChildren = Array.from(passwordProgressEl.children) as HTMLSpanElement[];
    const arrayLength = passwordProgressChildren.length;

    passwordProgressEl.setAttribute("aria-valuenow", String(strength));

    if (strength >= 1) {
      passwordProgressEl.setAttribute("aria-valuetext", `Password meets ${strength} of 4 requirements`)
    } else {
      passwordProgressEl.setAttribute("aria-valuetext", "No password requirements met")
    }


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
  }

  function toggleShowPassword() {
    if (passwordInputEl.type === "password") {
      passwordInputEl.type = "text";
      confirmPasswordInputEl.type = "text";

      showPasswordIconEl.classList.add("hidden");
      hidePasswordIconEl.classList.remove("hidden");

      showPasswordBtnEl.setAttribute(
        "aria-label",
        "Hide password",
      );
    } else {
      passwordInputEl.type = "password";
      confirmPasswordInputEl.type = "password";
      showPasswordIconEl.setAttribute("data-lucide", "eye-off");

      showPasswordIconEl.classList.remove("hidden");
      hidePasswordIconEl.classList.add("hidden");

      showPasswordBtnEl.setAttribute(
        "aria-label",
        "Show password",
      );
    }
  }

  async function handleRequest(registerData: RegisterData) {
    try {
      isLoading = true;
      submitBtnEl.disabled = true;
      toggleInputs();
      handleLoading();
      formEl.setAttribute("aria-busy", "true");
      await registerUser(registerData);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Unknown registration error: ", error);
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
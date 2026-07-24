import { createIcons, Eye, EyeOff } from "lucide";
import { getRequiredElement } from "../utils/helpers";
import { validateEmail, type ValidationResult } from "../utils/validation";
import { loginUser } from "../services/auth";
import type { LoginData } from "../types/auth";

function init() {
  createIcons({
    icons: {
      Eye,
      EyeOff,
    }
  })

  const formEl = getRequiredElement("#form", HTMLFormElement);
  const formErrorEl = getRequiredElement("#formError", HTMLParagraphElement);
  const loginBtn = getRequiredElement("#loginBtn", HTMLButtonElement);
  const emailInputEl = getRequiredElement("#email", HTMLInputElement);
  const passwordInputEl = getRequiredElement("#password", HTMLInputElement);
  const rememberSessionEl = getRequiredElement("#rememberSession", HTMLInputElement);

  const emailInputErrorEl = getRequiredElement("#emailError", HTMLParagraphElement);
  const passwordInputErrorEl = getRequiredElement("#passwordError", HTMLParagraphElement);

  const loaderEl = getRequiredElement("#loader", HTMLSpanElement);
  const loginBtnTextEl = getRequiredElement("#loginBtnText", HTMLSpanElement);

  const showPasswordBtnEl = getRequiredElement("#buttonShowPassword", HTMLButtonElement);
  const showPasswordIconEl = getRequiredElement("#showPasswordIcon", Element);
  const hidePasswordIconEl = getRequiredElement("#hidePasswordIcon", Element);

  let isLoading: boolean = false;

  const validators = {
    email: handleEmailValidation,
    password: handlePasswordValidation,
  }

  type ValidatorId = keyof typeof validators;

  function isValidatorId(id: string): id is ValidatorId {
    return id in validators;
  }

  function handleLoading() {
    loaderEl.classList.toggle("hidden", !isLoading);
    loginBtnTextEl.classList.toggle("hidden", isLoading);
  }

  function focusFirstInvalidInput() {
    const firstInvalidInput = formEl.querySelector<HTMLInputElement>(".invalid");
    firstInvalidInput?.focus();
  }

  function handleEmailValidation(value: string): ValidationResult {
    return validateEmail(value);
  }

  function handlePasswordValidation(value: string): ValidationResult {
    const normalizedPassword = value.trim();
    const isValid = normalizedPassword.length > 0;

    return {
      isValid,
      message: isValid ? "" : "Password is required."
    };
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

  function showFormError(message: string) {
    formErrorEl.textContent = message;
    formErrorEl.classList.remove("hidden");
  }

  function clearFormError() {
    formErrorEl.textContent = "";
    formErrorEl.classList.remove("hidden");
  }

  function handleInputValidation(input: HTMLInputElement, errorEl: HTMLParagraphElement) {
    const shouldClearFormError = !formErrorEl.classList.contains("hidden");

    if (shouldClearFormError) {
      clearFormError();
    }

    const inputId = input.id;

    if (!inputId) return;

    const inputValue = input.value;

    if (!isValidatorId(inputId)) return;

    const validationObj = validators[inputId](inputValue);

    if (validationObj.isValid) {
      handleValidInput(input, errorEl);
    } else {
      handleInvalidInput(input, errorEl, validationObj.message ?? "Invalid format.");
    }
  }

  function toggleInputs() {
    emailInputEl.disabled = isLoading;
    passwordInputEl.disabled = isLoading;
    rememberSessionEl.disabled = isLoading;
  }

  function toggleShowPassword() {
    const shouldShowPassword = passwordInputEl.type === "password";

    passwordInputEl.type = shouldShowPassword ? "text" : "password";

    showPasswordIconEl.classList.toggle("hidden", shouldShowPassword);
    hidePasswordIconEl.classList.toggle("hidden", !shouldShowPassword);

    showPasswordBtnEl.setAttribute(
      "aria-label",
      shouldShowPassword ? "Hide password" : "Show password",
    );
  }

  async function handleRequest(loginData: LoginData) {
    try {
      clearFormError();
      isLoading = true;
      loginBtn.disabled = true;
      toggleInputs();
      handleLoading();
      formEl.setAttribute("aria-busy", "true");
      await loginUser(loginData);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        showFormError(error.message);
      } else {
        console.error("Unknown registration error occurred!", error);
        showFormError("Unknown registration error occurred!")
      }
    } finally {
      isLoading = false;
      loginBtn.disabled = false;
      toggleInputs();
      handleLoading();
      formEl.setAttribute("aria-busy", "false");
    }
  }

  function handleSubmit(event: Event) {
    event.preventDefault();

    if (isLoading) return;

    const isFormValid = [
      handleInputValidation(emailInputEl, emailInputErrorEl),
      handleInputValidation(passwordInputEl, passwordInputErrorEl)
    ].every(Boolean);

    if (!isFormValid) {
      focusFirstInvalidInput();
      return;
    }

    const loginData: LoginData = {
      email: emailInputEl.value.trim().toLowerCase(),
      password: passwordInputEl.value,
      rememberSession: rememberSessionEl.checked,
    }

    handleRequest(loginData);
  }

  emailInputEl.addEventListener("input", () => handleInputValidation(emailInputEl, emailInputErrorEl))
  passwordInputEl.addEventListener("input", () => handleInputValidation(passwordInputEl, passwordInputErrorEl))
  showPasswordBtnEl.addEventListener("click", toggleShowPassword);
  formEl.addEventListener("submit", handleSubmit);
}

init();

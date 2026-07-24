import { createIcons, Eye, EyeOff } from "lucide";
import { getRequiredElement } from "../utils/helpers";
import { validateEmail } from "../utils/validation";
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
  const loginBtn = getRequiredElement("#loginBtn", HTMLButtonElement);
  const emailInputEl = getRequiredElement("#email", HTMLInputElement);
  const passwordInputEl = getRequiredElement("#password", HTMLInputElement);
  const rememberSessionEl = getRequiredElement("#rememberSession", HTMLInputElement);

  const emailInputErrorEl = getRequiredElement("#emailError", HTMLParagraphElement);
  const passwordInputErrorEl = getRequiredElement("#passwordError", HTMLParagraphElement);

  const loaderEl = getRequiredElement("#loader", HTMLSpanElement);
  const loginBtnTextEl = getRequiredElement("#login-btn-text", HTMLSpanElement);

  const showPasswordBtnEl = getRequiredElement(".button-show-password", HTMLButtonElement);
  const showPasswordIconEl = getRequiredElement("#show-password-icon", Element);
  const hidePasswordIconEl = getRequiredElement("#hide-password-icon", Element);

  let isLoading: boolean = false;

  function handleLoading() {
    loaderEl.classList.toggle("hidden", !isLoading);
    loginBtnTextEl.classList.toggle("hidden", isLoading);
  }

  function focusFirstInvalidInput() {
    const firstInvalidInput = formEl.querySelector<HTMLInputElement>(".invalid");
    firstInvalidInput?.focus();
  }

  function handleInputValidation(input: HTMLInputElement, errorEl: HTMLParagraphElement) {
    const inputValue = input.value;
    const inputId = input.id;

    if (inputId === "email") {
      const emailValidation = validateEmail(inputValue);

      errorEl.textContent = emailValidation.message ?? "";
      input.classList.toggle("invalid", !emailValidation.isValid);
      input.classList.toggle("valid", emailValidation.isValid);
      input.setAttribute("aria-invalid", String(!emailValidation.isValid));

      return emailValidation.isValid;
    }

    if (inputId === "password") {
      const normalizedPassword = inputValue.trim();
      const isNotEmpty = normalizedPassword.length > 0;

      errorEl.textContent = isNotEmpty ? "" : "Password is required.";
      input.classList.toggle("invalid", !isNotEmpty);
      input.classList.toggle("valid", isNotEmpty);
      input.setAttribute("aria-invalid", String(!isNotEmpty));

      return isNotEmpty;
    }

    return false;
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
      isLoading = true;
      loginBtn.disabled = true;
      toggleInputs();
      handleLoading();
      formEl.setAttribute("aria-busy", "true");
      await loginUser(loginData);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Unknown login error: ", error);
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

import { createIcons, Eye, EyeOff } from "lucide";
import { loginUser } from "../services/api";
import { getRequiredElement } from "../utils/helpers";

export type LoginData = {
  email: string,
  password: string,
  rememberSession: boolean,
}

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
    const normalizedValue = input.value.trim();
    const inputName = input.name;

    input.classList.remove("invalid")
    errorEl.textContent = "";
    input.setAttribute("aria-invalid", "false");

    if (!normalizedValue) {
      input.classList.add("invalid");
      input.setAttribute("aria-invalid", "true");

      if (inputName === "email") {
        errorEl.textContent = "Email Address is required."
      }

      if (inputName === "password") {
        errorEl.textContent = "Password is required."
      }

      return false;
    }

    return true;
  }

  function toggleInputs() {
    emailInputEl.disabled = isLoading;
    passwordInputEl.disabled = isLoading;
    rememberSessionEl.disabled = isLoading;
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
  formEl.addEventListener("submit", handleSubmit);
}

init();
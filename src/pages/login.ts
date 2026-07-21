import { createIcons, Eye, EyeOff } from "lucide";
import { loginUser } from "../services/api";
import { getRequiredElement } from "../utils/helpers";

export type LoginData = {
  email: string,
  password: string,
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

  function handleSubmitValidation() {
    const normalizedEmailValue = emailInputEl.value.trim().toLowerCase();
    const normalizedPasswordValue = passwordInputEl.value.trim();

    if (!normalizedEmailValue) {
      emailInputErrorEl.textContent = "Email Address is required."
      emailInputEl.classList.add("invalid");
    }

    if (!normalizedPasswordValue) {
      passwordInputErrorEl.textContent = "Password is required."
      passwordInputEl.classList.add("invalid");
    }

    return normalizedEmailValue && normalizedPasswordValue;
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

    const isFormValid = handleSubmitValidation();

    if (!isFormValid) {
      focusFirstInvalidInput();
      return;
    }

    const loginData: LoginData = {
      email: emailInputEl.value.trim().toLowerCase(),
      password: passwordInputEl.value.trim(),
    }

    handleRequest(loginData);
  }

  formEl.addEventListener("submit", handleSubmit);
}

init();
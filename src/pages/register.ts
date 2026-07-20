import { createIcons, Eye, EyeOff } from "lucide";
import { validateConfirmPassword, validateEmail, validateFirstName, validateLastName, validatePassword, validatePhoneNumber, validateTerms, type ValidationResult } from "../utils/validation";
import { registerUser } from "../services/api";
import { getRequiredElement } from "../utils/helpers";

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

  const form = getRequiredElement("#form", HTMLFormElement);
  const firstNameInputEl = getRequiredElement("#firstName", HTMLInputElement);
  const lastNameInputEl = getRequiredElement("#lastName", HTMLInputElement);
  const emailInputEl = getRequiredElement("#email", HTMLInputElement);
  const phoneNumberInputEl = getRequiredElement("#phoneNumber", HTMLInputElement);
  const passwordInputEl = getRequiredElement("#password", HTMLInputElement);
  const confirmPasswordInputEl =  getRequiredElement("#confirmPassword", HTMLInputElement);
  const termsCheckboxEl = getRequiredElement("#terms", HTMLInputElement);
  const passwordProgressEl = getRequiredElement("#passwordProgress", HTMLDivElement);

  const submitBtnEl = getRequiredElement("#register-btn", HTMLButtonElement);
  const submitBtnTextEl = getRequiredElement("#register-btn-text", HTMLSpanElement);
  const loaderEl = getRequiredElement("#loader", HTMLSpanElement);

  const showPasswordBtnEl = getRequiredElement("#show-password-btn", HTMLButtonElement);
  const showPasswordIconEl = getRequiredElement("#show-password-icon", HTMLElement);
  const hidePasswordIconEl = getRequiredElement("#hiden-password-icon", HTMLElement);

  let isLoading = false;

  function handleValidationInput(inputEl:HTMLInputElement, errorEl: HTMLParagraphElement) {
    const name = inputEl.getAttribute("name");

    const inputValue = inputEl.value;
    let validationObj:ValidationResult;

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

    if(validationObj.isValid) {
      handleValidInput(inputEl, errorEl);
    } else {
      handleInvalidInput(inputEl, errorEl, validationObj.message ?? "Invalid format.");
    }

    return validationObj;
  }

  function handleValidInput(inputEl:HTMLInputElement, errorEl:HTMLParagraphElement) {
    errorEl.textContent = "";
    errorEl.classList.add("hidden");

    inputEl.classList.remove("invalid");
    inputEl.classList.add("valid");
  }

  function handleInvalidInput(inputEl:HTMLInputElement, errorEl:HTMLParagraphElement, message: string) {
    errorEl.textContent = message;
    errorEl.classList.remove("hidden");

    inputEl.classList.remove("valid");
    inputEl.classList.add("invalid");
  }

  function handleInput(event: Event) {
    if(!(event.target instanceof HTMLInputElement)) return;

    const target = event.target;
    if(!target) return;

    const inputRowEl = target.closest(".form__row") as HTMLDivElement
    if(!inputRowEl) return;

    const errorEl = inputRowEl.querySelector(".form__error") as HTMLParagraphElement;
    
    handleValidationInput(target, errorEl)
  }

  function handleValidationCheckbox() {
    const termsValidation = validateTerms(termsCheckboxEl.checked);

    if(termsValidation.isValid) {
      termsCheckboxEl.classList.remove("invalid");
      termsCheckboxEl.classList.add("valid");
    } else {
      termsCheckboxEl.classList.remove("valid");
      termsCheckboxEl.classList.add("invalid");
    }

    return termsValidation;
  }

  function handlePasswordStrength(strength: number) {
    const passwordProgressChildren = Array.from(passwordProgressEl.children) as HTMLSpanElement[];
    const arrayLength = passwordProgressChildren.length;

    if(!passwordInputEl.value) {
      for(let i=0; i < arrayLength; i++) {
        passwordProgressChildren[i].classList.add("cover");
      } 
      return
    }

    for(let i=0; i < strength; i++) {
      passwordProgressChildren[i].classList.remove("cover");
    }

     for(let i=strength; i <= arrayLength - 1; i++) {
      passwordProgressChildren[i].classList.add("cover");
    }
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
    if(passwordInputEl.type === "password") {
      passwordInputEl.type = "text";
      confirmPasswordInputEl.type = "text";
    
      showPasswordIconEl.classList.add("hidden");
      hidePasswordIconEl.classList.remove("hidden");
    } else {
      passwordInputEl.type = "password";
      confirmPasswordInputEl.type = "password";
      showPasswordIconEl.setAttribute("data-lucide", "eye-off");

      showPasswordIconEl.classList.remove("hidden");
      hidePasswordIconEl.classList.add("hidden");
    }
  }

  function handleSubmit(event:Event) {
    event.preventDefault();

    if(isLoading) return;

    const firstNameErrorEl = firstNameInputEl.closest(".form__row")?.querySelector(".form__error") as HTMLParagraphElement;
    const lastNameErrorEl = lastNameInputEl.closest(".form__row")?.querySelector(".form__error") as HTMLParagraphElement;
    const emailErrorEl = emailInputEl.closest(".form__row")?.querySelector(".form__error") as HTMLParagraphElement;
    const phoneNumberErrorEl = phoneNumberInputEl.closest(".form__row")?.querySelector(".form__error") as HTMLParagraphElement;
    const passwordErrorEl = passwordInputEl.closest(".form__row")?.querySelector(".form__error") as HTMLParagraphElement;
    const confirmPasswordErrorEl = confirmPasswordInputEl.closest(".form__row")?.querySelector(".form__error") as HTMLParagraphElement;

    const isFormValid = [
      handleValidationInput(firstNameInputEl, firstNameErrorEl)?.isValid,
      handleValidationInput(lastNameInputEl, lastNameErrorEl)?.isValid,
      handleValidationInput(emailInputEl, emailErrorEl)?.isValid,
      handleValidationInput(phoneNumberInputEl, phoneNumberErrorEl)?.isValid,
      handleValidationInput(passwordInputEl, passwordErrorEl)?.isValid,
      handleValidationInput(confirmPasswordInputEl, confirmPasswordErrorEl)?.isValid,
      handleValidationCheckbox().isValid,
    ].every(Boolean);

    if(!isFormValid) return;

    const registerData = {
      firstName: firstNameInputEl.value.trim(),
      lastName: lastNameInputEl.value.trim(),
      email: emailInputEl.value.trim().toLowerCase(),
      phoneNumber: phoneNumberInputEl.value.trim(),
      password: passwordInputEl.value,
    }

    handleRequest(registerData);
  }

  function handleLoading() {
    loaderEl.classList.toggle("hidden", !isLoading);
    submitBtnTextEl.classList.toggle("hidden", isLoading);
  }

  async function handleRequest(registerData: RegisterData) {
  try {
      isLoading = true;
      submitBtnEl.disabled = true;
      toggleInputs();
      handleLoading();
      await registerUser(registerData);
    } catch (error) {
      if(error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Unknown registration error: ", error);
      }
    } finally {
      isLoading = false;
      submitBtnEl.disabled = false;
      toggleInputs();
      handleLoading();
    }
  }

  termsCheckboxEl.addEventListener("change", handleValidationCheckbox);
  showPasswordBtnEl.addEventListener("click", toggleShowPassword);
  form.addEventListener("submit", handleSubmit);
  form.addEventListener("input", handleInput);
};

init();
import { createIcons, Eye, EyeOff } from "lucide";
import { validateConfirmPassword, validateEmail, validateFirstName, validateLastName, validatePassword, validatePhoneNumber, validateTerms, type ValidationResult } from "../utils/validation";
import { testPromise } from "../services/api";

function init() {
    createIcons({
    icons: {
      Eye,
      EyeOff,
    }
  })

  const form = document.querySelector("#form") as HTMLFormElement;
  const firstNameInputEl = document.querySelector("#firstName") as HTMLInputElement;
  const lastNameInputEl = document.querySelector("#lastName") as HTMLInputElement;
  const emailInputEl = document.querySelector("#email") as HTMLInputElement;
  const phoneNumberInputEl = document.querySelector("#phoneNumber") as HTMLInputElement;
  const passwordInputEl = document.querySelector("#password") as HTMLInputElement;
  const confirmPasswordInputEl = document.querySelector("#confirmPassword") as HTMLInputElement;
  const termsCheckboxEl = document.querySelector("#terms") as HTMLInputElement
  const passwordProgressEl = document.querySelector("#passwordProgress") as HTMLDivElement

  const submitBtnEl = document.querySelector("#register-btn") as HTMLButtonElement;
  const submitBtnTextEl = document.querySelector("#register-btn-text") as HTMLParagraphElement;
  const loaderEl = document.querySelector("#loader") as HTMLDivElement;

  const showPasswordBtnEl = document.querySelector("#show-password-btn") as HTMLButtonElement
  const showPasswordIconEl = document.querySelector("#show-password-icon") as HTMLDivElement
  const hidePasswordIconEl = document.querySelector("#hide-password-icon") as HTMLDivElement

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
          return;
    }

    if(validationObj.isValid) {
      handleValidInput(inputEl, errorEl);
    } else {
      handleInvalidInput(inputEl, errorEl, validationObj.message ?? "Invalid format.");
    }
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

    const firstNameValue  = firstNameInputEl.value;
    const lastNameValue = lastNameInputEl.value;
    const emailValue = emailInputEl.value;
    const phoneNumberValue = phoneNumberInputEl.value;
    const passwordValue = passwordInputEl.value;
    const confirmPasswordValue = confirmPasswordInputEl.value;

    const firstNameValidation = validateFirstName(firstNameValue);
    const lastNameValidation = validateLastName(lastNameValue);
    const emailValidation = validateEmail(emailValue);
    const phoneNumberValidation = validatePhoneNumber(phoneNumberValue);
    const passwordValidation = validatePassword(passwordValue);
    const confirmPasswordValidation = validateConfirmPassword(confirmPasswordValue, passwordValue);
    const termsValueValidation = handleValidationCheckbox();

    const firstNameErrorEl = firstNameInputEl.closest(".form__row")?.querySelector(".form__error") as HTMLParagraphElement;
    const lastNameErrorEl = lastNameInputEl.closest(".form__row")?.querySelector(".form__error") as HTMLParagraphElement;
    const emailErrorEl = emailInputEl.closest(".form__row")?.querySelector(".form__error") as HTMLParagraphElement;
    const phoneNumberErrorEl = phoneNumberInputEl.closest(".form__row")?.querySelector(".form__error") as HTMLParagraphElement;
    const passwordErrorEl = passwordInputEl.closest(".form__row")?.querySelector(".form__error") as HTMLParagraphElement;
    const confirmPasswordErrorEl = confirmPasswordInputEl.closest(".form__row")?.querySelector(".form__error") as HTMLParagraphElement;

    if(
      !firstNameValidation.isValid ||
      !lastNameValidation.isValid ||
      !emailValidation.isValid ||
      !phoneNumberValidation.isValid ||
      !passwordValidation.isValid ||
      !confirmPasswordValidation.isValid ||
      !termsValueValidation.isValid
    ) {
      handleValidationInput(firstNameInputEl, firstNameErrorEl);
      handleValidationInput(lastNameInputEl, lastNameErrorEl);
      handleValidationInput(emailInputEl, emailErrorEl);
      handleValidationInput(phoneNumberInputEl, phoneNumberErrorEl);
      handleValidationInput(passwordInputEl, passwordErrorEl);
      handleValidationInput(confirmPasswordInputEl, confirmPasswordErrorEl);
      return;
    }

    handleRequest();
  }

  function handleLoading() {
    loaderEl.classList.toggle("hidden", !isLoading);
    submitBtnTextEl.classList.toggle("hidden", isLoading);
  }

  async function handleRequest() {
  try {
      isLoading = true;
      submitBtnEl.disabled = true;
      toggleInputs();
      handleLoading();

      await testPromise();
    } catch (error) {
      console.log("error");
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
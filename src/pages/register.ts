import { createIcons, Eye } from "lucide";
import { validateConfirmPassword, validateEmail, validateFirstName, validateLastName, validatePassword, validatePhoneNumber, validateTerms, type ValidationResult } from "../utils/validation";

function init() {
    createIcons({
    icons: {
      Eye,
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

  function handleSubmit(event:Event) {
    event.preventDefault();

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
  }



  termsCheckboxEl.addEventListener("change", handleValidationCheckbox);
  form.addEventListener("submit", handleSubmit);
  form.addEventListener("input", handleInput);
};

init();
import { createIcons, Eye } from "lucide";
import { validateConfirmPassword, validateEmail, validateFirstName, validateLastName, validatePassword, validatePhoneNumber, type ValidationResult } from "../utils/validation";

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
        break;
      case "confirmPassword":
        const passwordValue = passwordInputEl.value;
         validationObj = validateConfirmPassword(inputValue, passwordValue);
        break;
        default:
          return;
    }

    if(validationObj.isValid) {
      handleValidationInput(inputEl, errorEl);
    } else {
      handleInvalidInput(inputEl, errorEl, validationObj.message);
    }
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



  // form.addEventListener("submit", handleSubmit);
  form.addEventListener("input", handleInput);
};

init();
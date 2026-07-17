import { createIcons, Eye } from "lucide";

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

    switch (name) {
      case "firstName":
        break;
      case "lastName":
        break;
      case "email":
        break;
      case "phoneNumber":
        break;
      case "password":
        break;
      case "confirmPassword":
        break;
        default:
    }
  }

  function handleInput(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    if(!target) return;

    const inputRowEl = target.closest(".form__row") as HTMLDivElement
    if(!inputRowEl) return;

    const inputEl = inputRowEl.querySelector(".form__input") as HTMLInputElement;
    const errorEl = inputRowEl.querySelector(".form__error") as HTMLParagraphElement;
    
    handleValidationInput(inputEl, errorEl)
  }



  // form.addEventListener("submit", handleSubmit);
  form.addEventListener("input", handleInput);
};

init();
import { getRequiredElement, getRequiredElements } from "../utils/helpers";

function init() {
  document.addEventListener("DOMContentLoaded", () => {
    const customSelects = getRequiredElements(".custom-select", HTMLDivElement)
    customSelects.forEach((customSelect) => {
      const selectButton = getRequiredElement(".select-button", HTMLButtonElement, customSelect);
      const dropdown = getRequiredElement(".select-dropdown", HTMLUListElement, customSelect)
      customSelect.querySelector(".select-dropdown");
      const toggleDropdown = (expand = null) => {
        const isOpen =
          expand !== null ? expand : dropdown.classList.contains("hidden");
        dropdown.classList.toggle("hidden", !isOpen);
        selectButton.setAttribute("aria-expanded", String(isOpen));
      };
      selectButton.addEventListener("click", () => {
        toggleDropdown();
      });
    });
  });
}

init();
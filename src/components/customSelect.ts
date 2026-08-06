import { getRequiredElement, getRequiredElements } from "../utils/helpers";

export function initCustomSelects() {
  let focusedIndex = -1;

  document.addEventListener("DOMContentLoaded", () => {
    const customSelects = getRequiredElements(".custom-select", HTMLDivElement)
    customSelects.forEach((customSelect) => {
      const selectButton = getRequiredElement(".select-button", HTMLButtonElement, customSelect);
      const dropdown = getRequiredElement(".select-dropdown", HTMLUListElement, customSelect)

      const options = getRequiredElements("li", HTMLLIElement, dropdown);
      const selectedValue = getRequiredElement(".selected-value", HTMLSpanElement, selectButton);

      const handleOptionSelect = (option: HTMLLIElement) => {
        options.forEach((opt) => opt.classList.remove("selected"));
        option.classList.add("selected");
        selectedValue.textContent = option.textContent.trim();
      };

      const updateFocus = () => {
        options.forEach((option, index) => {
          if (option) {
            option.setAttribute("tabindex", index === focusedIndex ? "0" : "-1");
            if (index === focusedIndex) option.focus();
          }
        });
      };

      options.forEach((option) => {
        option.addEventListener("click", () => {
          handleOptionSelect(option);
          toggleDropdown(false);
        });
      });

      const toggleDropdown = (expand: boolean | null = null) => {
        const isOpen =
          expand !== null ? expand : dropdown.classList.contains("hidden");

        if (isOpen) {
          focusedIndex = [...options].findIndex((option) => option.classList.contains("selected"));
          focusedIndex = focusedIndex === -1 ? 0 : focusedIndex;
          updateFocus();
        } else {
          focusedIndex = -1;
          selectButton.focus();
        }

        dropdown.classList.toggle("hidden", !isOpen);
        selectButton.setAttribute("aria-expanded", String(isOpen));
      };

      selectButton.addEventListener("click", () => {
        toggleDropdown();
      });

      selectButton.addEventListener("keydown", (event) => {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          toggleDropdown(true);
        } else if (event.key === "Escape") {
          toggleDropdown(false);
        }
      });

      dropdown.addEventListener("keydown", (event) => {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          focusedIndex = (focusedIndex + 1) % options.length;
          updateFocus();
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          focusedIndex = (focusedIndex - 1 + options.length) % options.length;
          updateFocus();
        } else if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleOptionSelect(options[focusedIndex]);
          toggleDropdown(false);
        } else if (event.key === "Escape") {
          toggleDropdown(false);
        }
      });

      document.addEventListener("click", (event) => {
        const isOutsideClick = !customSelect.contains(event.target as Node);
        if (isOutsideClick) toggleDropdown(false);
      })
    });
  });
}
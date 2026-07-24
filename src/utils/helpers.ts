export function getRequiredElement<T extends Element>(
  selector: string,
  ElementClass: new () => T,
): T {
  const element = document.querySelector(selector);

  if (!(element instanceof ElementClass)) {
    throw new Error(
      `Required element "${selector}" was not found or has an incorrect type.`,
    );
  }

  return element;
}

export function getErrorElement(
  input: HTMLInputElement,
): HTMLParagraphElement {
  const errorElement = input
    .closest(".form__row")
    ?.querySelector(".form__error");

  if (!(errorElement instanceof HTMLParagraphElement)) {
    throw new Error(
      `Error element for input "${input.name}" was not found.`,
    );
  }

  return errorElement;
}

export function mapStrengthValue(strength: number) {
  let mappedStrength;

  switch (strength) {
    case 0:
      mappedStrength = "very weak"
      break;
    case 1:
      mappedStrength = "weak"
      break;
    case 2:
      mappedStrength = "medium"
      break;
    case 3:
      mappedStrength = "strong"
      break;
    case 4:
      mappedStrength = "valid"
      break;
    default:
      mappedStrength = "invlaid"
  }

  return mappedStrength;
}
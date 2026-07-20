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
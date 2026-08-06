export function getRequiredElement<T extends Element>(
  selector: string,
  ElementClass: new () => T,
  root: ParentNode = document
): T {
  const element = root.querySelector(selector);

  if (!(element instanceof ElementClass)) {
    throw new Error(
      `Required element "${selector}" was not found or has an incorrect type.`,
    );
  }

  return element;
}

export function getRequiredElements<T extends Element>(
  selector: string,
  ElementClass: new () => T,
  root: ParentNode = document
): T[] {
  const elements = Array.from(root.querySelectorAll(selector), (element) => element as T);

  if (elements.length === 0) {
    throw new Error(
      `Required elements "${selector}" list is empty!`,
    );
  }

  const areElementsCorrect = elements.every(
    (element) => element instanceof ElementClass,
  );

  if (!areElementsCorrect) {
    throw new Error(
      `Required elements "${selector}" was not found or has an incorrect type.`,
    );
  }

  return elements;
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

export function createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, classList?: string[], content?: string) {
  const newElement = document.createElement(tagName);

  if (classList) {
    const filteredClassList = classList?.filter((className) => className !== "" && className !== null);
    newElement.classList.add(...filteredClassList);
  }

  newElement.textContent = content ?? "";

  return newElement;
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
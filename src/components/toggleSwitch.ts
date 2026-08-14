import { createElement } from "../utils/helpers";

export function createSwtich(id: string, handler: (e: Event) => void, container: HTMLElement) {
  const labelEl = createElement("label", ["switch"]);
  labelEl.setAttribute("for", id);

  const checkboxEl = createElement("input");
  checkboxEl.type = "checkbox";
  checkboxEl.id = id;

  checkboxEl.addEventListener("change", handler)

  const spanEl = createElement("span", ["slider", "round"]);

  labelEl.append(checkboxEl, spanEl);

  container.append(labelEl);
}
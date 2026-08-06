import { createElement } from "../utils/helpers";

export function createSearch(id: string, labelValue: string, placeholderValue: string, classList: string[]) {
  const form = createElement("form", classList);
  form.setAttribute("role", "search");

  const label = createElement("label", ["sr-only"]);
  label.setAttribute("for", id);
  label.textContent = labelValue;
  form.appendChild(label);

  const button = createElement("button", ["search-btn"]);
  button.setAttribute("aria-label", labelValue);
  button.type = "submit";

  const icon = createElement("i", []);
  icon.dataset.lucide = "search";
  button.appendChild(icon);

  const input = createElement("input", ["input-search"]);
  input.id = id;
  input.type = "text";
  input.name = id;
  input.placeholder = placeholderValue;

  form.appendChild(button);
  form.appendChild(input);

  return form;
}
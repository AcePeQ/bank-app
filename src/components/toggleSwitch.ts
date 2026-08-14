import { createElement } from "../utils/helpers";

type SwitchOptions = {
  id: string;
}

export function createSwtich(options: SwitchOptions, handler: (e: Event) => void, container: HTMLElement) {
  const labelEl = createElement("label", ["switch"]);
  labelEl.setAttribute("for", options.id);

  const checkboxEl = createElement("input");
  checkboxEl.type = "checkbox";
  checkboxEl.id = options.id;

  checkboxEl.addEventListener("change", handler)

  const spanEl = createElement("span", ["slider", "round"]);

  labelEl.append(checkboxEl, spanEl);

  container.append(labelEl);
}
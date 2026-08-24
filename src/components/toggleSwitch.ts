import { createElement } from "../utils/helpers";

type SwitchOptions = {
  id: string;
  checked: boolean,
}

export function createSwitch(options: SwitchOptions, container: HTMLElement) {
  const labelEl = createElement("label", ["switch"]);
  labelEl.setAttribute("for", options.id);

  const checkboxEl = createElement("input");
  checkboxEl.type = "checkbox";
  checkboxEl.id = options.id;
  checkboxEl.checked = options.checked;

  const spanEl = createElement("span", ["slider", "round"]);

  labelEl.append(checkboxEl, spanEl);

  container.append(labelEl);

  return checkboxEl
}
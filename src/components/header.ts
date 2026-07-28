import { createElement, getRequiredElement } from "../utils/helpers";

export function createHeader() {
  const headerEl = getRequiredElement("#header", HTMLElement);
  headerEl.textContent = "";

  const logo = createLogo();
  const search = createSearch();
  const actions = createActions();

  headerEl.appendChild(logo);
  headerEl.appendChild(search);
  headerEl.appendChild(actions);
}

function createLogo() {
  const logoLink = createElement("a", ["logo-wrapper"]);
  const logoImage = createElement("img", ["logo-image"]);
  logoImage.alt = "";
  logoImage.src = "/icons/IFLogo.svg";
  logoLink.appendChild(logoImage);
  return logoLink;
}

function createSearch() {
  const div = createElement("div", ["input-box"]);
  const button = createElement("button", ["search-btn"]);
  button.setAttribute("role", "search");
  button.setAttribute("aria-label", "Search accounts or assets");
  const icon = createElement("i", []);
  icon.dataset.lucide = "search";
  button.appendChild(icon);
  const input = createElement("input", ["input-search"]);
  input.id = "search";
  input.type = "text";
  input.name = "search";
  input.placeholder = "Search accounts or assets...";
  div.appendChild(button);
  div.appendChild(input);
  return div;
}

function createActions() {
  const div = createElement("div", ["actions"]);

  const notifications = createElement("button", ["notifications"]);
  const icon = createElement("i", []);
  icon.dataset.lucide = "bell";
  notifications.appendChild(icon);
  div.appendChild(notifications);

  const avatar = createElement("div", ["avatar"], "M.N");
  avatar.setAttribute("aria-hidden", "true");
  div.appendChild(avatar);

  const logout = createElement("button", ["logout-btn"]);
  const iconLogout = createElement("i", []);
  iconLogout.dataset.lucide = "log-out";

  const span = createElement("span", ["sr-only"]);
  span.textContent = "Logout";
  logout.appendChild(span);
  logout.appendChild(iconLogout);
  div.appendChild(logout);

  return div;
}




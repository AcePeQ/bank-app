import { createElement, getRequiredElement } from "../utils/helpers";

type NavigationItem = {
  element: "a" | "button",
  icon: string,
  text: string,
}

const NAVIGATION_LINKS: NavigationItem[] = [
  {
    element: "a",
    icon: "house",
    text: "Dashboard"
  },
  {
    element: "a",
    icon: "credit-card",
    text: "Cards"
  },
  {
    element: "a",
    icon: "repeat",
    text: "Transfers"
  },
  {
    element: "a",
    icon: "settings",
    text: "Settings"
  },
]

const NAVIGATION_ACTIONS: NavigationItem[] = [
  {
    element: "a",
    icon: "settings",
    text: "Settings"
  },
  {
    element: "button",
    icon: "log-out",
    text: "Logout"
  },
]


export function createSidebar() {
  const sidebarEl = getRequiredElement("#sidebar", HTMLElement);
  sidebarEl.textContent = "";

  const heading = createHeading();
  const navigation = createNavigation();
  const actionNavigation = createActionNavigation();

  sidebarEl.appendChild(heading);
  sidebarEl.appendChild(navigation);
  sidebarEl.appendChild(actionNavigation);
}


function createHeading() {
  const hgroup = createElement("hgroup", ["title-group"]);
  const title = createElement("h1", ["title"], "Infinity Finance");
  const subTitle = createElement("p", ["subtitle"], "Wealth Managment")

  hgroup.appendChild(title);
  hgroup.appendChild(subTitle);

  return hgroup;
}

function createNavigation() {
  const navigation = createElement("nav", ["navigation"]);

  NAVIGATION_LINKS.forEach(item => {
    const link = createNavigationItem(item);
    const icon = createElement("i");
    icon.dataset.lucide = item.icon;

    link.insertAdjacentElement("afterbegin", icon)
    navigation.appendChild(link);
  })

  return navigation;
}

function createNavigationItem(item: NavigationItem) {
  const link = createElement(item.element, ["navigation__link"], item.text);

  return link;
}

function createActionNavigation() {
  const navigation = createElement("nav", ["sidebar-actions"]);

  NAVIGATION_ACTIONS.forEach(item => {
    const link = createNavigationItem(item);
    const icon = createElement("i");
    icon.dataset.lucide = item.icon;

    link.insertAdjacentElement("afterbegin", icon)
    navigation.appendChild(link);
  })

  return navigation;
}







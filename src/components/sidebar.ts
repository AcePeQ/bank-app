import { ROUTES } from "../utils/constants";
import { createElement, getRequiredElement } from "../utils/helpers";

type NavigationItemBase = {
  icon: string;
  text: string;
}

type NavigationLink = NavigationItemBase & {
  element: "a";
  href: string;
}

type NavigationButton = NavigationItemBase & {
  element: "button";
  action: () => void;
}

type NavigationItem = NavigationLink | NavigationButton


const NAVIGATION_LINKS: NavigationItem[] = [
  {
    element: "a",
    icon: "house",
    text: "Dashboard",
    href: ROUTES.dashboard
  },
  {
    element: "a",
    icon: "credit-card",
    text: "Cards",
    href: ROUTES.cards
  },
  {
    element: "a",
    icon: "repeat",
    text: "Transfers",
    href: ROUTES.transfers
  },
  {
    element: "a",
    icon: "settings",
    text: "Settings",
    href: ROUTES.settings
  },
]

const NAVIGATION_ACTIONS: NavigationItem[] = [
  {
    element: "a",
    icon: "settings",
    text: "Settings",
    href: ROUTES.settings
  },
  {
    element: "button",
    icon: "log-out",
    text: "Logout",
    action: () => {
      console.log("Logout")
    }
  },
]


export function createSidebar() {
  const sidebarEl = getRequiredElement("#sidebar", HTMLElement);
  sidebarEl.textContent = "";

  const heading = createHeading();
  const navigation = createNavigation(NAVIGATION_LINKS, ["navigation"], "Main navigation");
  const actionNavigation = createNavigation(NAVIGATION_ACTIONS, ["sidebar-actions"], "Actions navigation");

  sidebarEl.appendChild(heading);
  sidebarEl.appendChild(navigation);
  sidebarEl.appendChild(actionNavigation);
}


function createHeading() {
  const hgroup = createElement("hgroup", ["title-group"]);
  const title = createElement("h2", ["title"], "Infinity Finance");
  const subTitle = createElement("p", ["subtitle"], "Wealth Management")

  hgroup.appendChild(title);
  hgroup.appendChild(subTitle);

  return hgroup;
}

function createNavigation(items: NavigationItem[], className: string[], accessibleName: string) {
  const navigation = createElement("nav", className);
  navigation.ariaLabel = accessibleName;

  items.forEach(item => {
    const itemEl = createNavigationItem(item);
    const icon = createElement("i");
    icon.dataset.lucide = item.icon;

    itemEl.insertAdjacentElement("afterbegin", icon)
    navigation.appendChild(itemEl);
  })

  return navigation;
}

function createNavigationItem(
  item: NavigationItem,
): HTMLAnchorElement | HTMLButtonElement {
  if (item.element === "a") {
    const link = createElement("a", ["navigation__link"], item.text);
    link.href = item.href;
    return link;
  }

  const button = createElement("button", ["navigation__link"], item.text);
  button.type = "button";
  button.addEventListener("click", item.action);

  return button;
}
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  Bell,
  ChevronRight,
  Contact,
  createIcons,
  CreditCard,
  House,
  Landmark,
  LogOut,
  Repeat,
  Search,
  SendHorizontal,
  Settings,
  User,
} from "lucide";
import { createSidebar } from "../components/sidebar";
import { createHeader } from "../components/header";
import { createElement, getRequiredElement } from "../utils/helpers";
import { ROUTES } from "../utils/constants";

type RecentRecipient = {
  id: string;
  firstName: string;
  lastName: string;
};

const recentRecipients = [
  { id: "1", firstName: "Maciej", lastName: "Nowak" },
  { id: "2", firstName: "Michał", lastName: "Nowicki" },
  { id: "3", firstName: "Łukasz", lastName: "Nawrocki" },
  { id: "4", firstName: "Ava", lastName: "Anderson" },
] satisfies RecentRecipient[];

function createRecentRecipient(recipient: RecentRecipient): HTMLLIElement {
  const itemEl = createElement("li", ["recipients__item"]);
  const linkEl = createElement("a", ["recipient"]);
  const avatarEl = createElement("span", ["recipient__avatar"]);
  const nameEl = createElement(
    "span",
    ["recipient__name"],
    `${recipient.firstName} ${recipient.lastName.charAt(0)}.`,
  );

  avatarEl.textContent = `${recipient.firstName.charAt(0)}${recipient.lastName.charAt(0)}`;
  avatarEl.ariaHidden = "true";
  linkEl.href = `${ROUTES.payFriend}?recipient=${recipient.id}`;
  linkEl.ariaLabel = `Pay ${recipient.firstName} ${recipient.lastName}`;
  linkEl.append(avatarEl, nameEl);
  itemEl.append(linkEl);

  return itemEl;
}

function renderRecentRecipients(recipients: RecentRecipient[]): void {
  const recipientsListEl = getRequiredElement("#recentRecipientsList", HTMLUListElement);
  const recipientElements = recipients.map(createRecentRecipient);

  recipientsListEl.replaceChildren(...recipientElements);
}

function init(): void {
  createSidebar();
  createHeader();
  renderRecentRecipients(recentRecipients);

  createIcons({
    icons: {
      Bell,
      Search,
      LogOut,
      House,
      CreditCard,
      Repeat,
      Settings,
      SendHorizontal,
      BanknoteArrowUp,
      BanknoteArrowDown,
      ChevronRight,
      Landmark,
      User,
      Contact,
    },
  });
}

init();

import {
  ArrowLeft,
  Bell,
  CreditCard,
  createIcons,
  House,
  LogOut,
  Repeat,
  Search,
  Settings,
} from "lucide";
import { createHeader } from "../components/header";
import { createSidebar } from "../components/sidebar";

function selectRecipientFromQuery(): void {
  const recipientSelectEl = document.querySelector("#friendRecipient");

  if (!(recipientSelectEl instanceof HTMLSelectElement)) return;

  const recipientId = new URLSearchParams(location.search).get("recipient");
  const isKnownRecipient = Array.from(recipientSelectEl.options).some(
    (option) => option.value === recipientId,
  );

  if (recipientId && isKnownRecipient) {
    recipientSelectEl.value = recipientId;
  }
}

function init(): void {
  createSidebar();
  createHeader();
  selectRecipientFromQuery();

  createIcons({
    icons: {
      ArrowLeft,
      Bell,
      CreditCard,
      House,
      LogOut,
      Repeat,
      Search,
      Settings,
    },
  });
}

init();

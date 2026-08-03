import { BanknoteArrowDown, BanknoteArrowUp, Bell, ChevronRight, createIcons, CreditCard, House, LogOut, Repeat, Search, SendHorizontal, Settings } from "lucide";
import { createSidebar } from "../components/sidebar";
import { createHeader } from "../components/header";
import { createCard } from "../components/card";
import type { Card } from "../types/card";
import { getRequiredElement } from "../utils/helpers";
import { getCurrentDate, getFormatCurrency } from "../utils/formats";

const TEMP_CARD: Card = {
  id: 1,
  type: "Visa",
  lastFourDigits: "1234",
  cardHolder: "John Doe",
  expirationDate: "10/24"
}

function init() {
  const currentDateEl = getRequiredElement("#currentDate", HTMLElement);
  const greetingEl = getRequiredElement("#greeting", HTMLHeadingElement);
  const cardBalanceValueEl = getRequiredElement("#cardBalanceValue", HTMLParagraphElement);
  const monthSpendingValueEl = getRequiredElement("#monthSpendingValue", HTMLSpanElement);

  const currentDate = getCurrentDate();
  const cardBalance = getFormatCurrency(1524.12);

  currentDateEl.textContent = currentDate;
  greetingEl.textContent = `Hello, ${TEMP_CARD.cardHolder}!`;
  cardBalanceValueEl.textContent = cardBalance;




  createSidebar();
  createHeader();
  createCard(TEMP_CARD);


  createIcons({
    icons: {
      Bell,
      Search,
      House,
      CreditCard,
      Repeat,
      Settings,
      LogOut,
      SendHorizontal,
      BanknoteArrowUp,
      BanknoteArrowDown,
      ChevronRight,
    }
  })
}

init();
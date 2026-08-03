import { BanknoteArrowDown, BanknoteArrowUp, Bell, ChevronRight, createIcons, CreditCard, House, LogOut, Repeat, Search, SendHorizontal, Settings } from "lucide";
import { createSidebar } from "../components/sidebar";
import { createHeader } from "../components/header";
import { createCard } from "../components/card";
import { getRequiredElement } from "../utils/helpers";
import { getCurrentDate, getFormatCurrency } from "../utils/formats";
import { createTransactionItem } from "../components/transaction";
import type { Transaction } from "../types/transaction";
import { dashboardMock } from "../mocks/dashboard.mock";



function init() {
  const currentDateEl = getRequiredElement("#currentDate", HTMLElement);
  const greetingEl = getRequiredElement("#greeting", HTMLHeadingElement);
  const cardBalanceValueEl = getRequiredElement("#cardBalanceValue", HTMLParagraphElement);
  const monthSpendingValueEl = getRequiredElement("#monthSpendingValue", HTMLSpanElement);
  const recentActivityWrapperEl = getRequiredElement("#recentActivityList", HTMLElement);

  const dashbaordData = dashboardMock;


  function addTransactions(transactions: Transaction[]) {
    transactions.forEach((transaction) => {
      const transactionEl = document.createElement("li");
      transactionEl.classList.add("card-activity__list__item");

      const transactionItem = createTransactionItem(transaction);

      transactionEl.append(transactionItem);
      recentActivityWrapperEl.append(transactionEl);
    })
  }

  function createGreeting() {
    const date = getCurrentDate();
    currentDateEl.textContent = date;

    greetingEl.textContent = `Hi, ${dashbaordData.account.ownerName}!`;
  }

  createSidebar();
  createHeader();

  createGreeting();

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

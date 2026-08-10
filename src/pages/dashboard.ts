import { BanknoteArrowDown, BanknoteArrowUp, Bell, ChevronRight, createIcons, CreditCard, House, LogOut, Repeat, Search, SendHorizontal, Settings } from "lucide";
import { createSidebar } from "../components/sidebar";
import { createHeader } from "../components/header";
import { createCard } from "../components/card";
import { createElement, getRequiredElement } from "../utils/helpers";
import { formatCurrency, getCurrentDate } from "../utils/formats";
import { createTransactionItem } from "../components/transaction";
import type { Transaction } from "../types/transaction";
import { dashboardMock } from "../mocks/dashboard.mock";
import { createSpendingChart } from "../components/monthlySpendingChart";

function init() {
  const currentDateEl = getRequiredElement("#currentDate", HTMLElement);
  const greetingEl = getRequiredElement("#greeting", HTMLHeadingElement);
  const cardBalanceValueEl = getRequiredElement("#cardBalanceValue", HTMLParagraphElement);
  const monthSpendingValueEl = getRequiredElement("#monthSpendingValue", HTMLSpanElement);
  const recentActivityWrapperEl = getRequiredElement("#recentActivityList", HTMLElement);
  const progressBarEl = getRequiredElement("#spentProgressBar", HTMLProgressElement);
  const monthlyChartSpendingValueEl = getRequiredElement("#monthlySpendingTotal", HTMLSpanElement);
  const cardWrapperEl = getRequiredElement("#cardWrapper", HTMLDivElement);
  const canvasEl = getRequiredElement("#monthlySpendingCanvas", HTMLCanvasElement);

  const dashboardData = dashboardMock;


  function addTransactions(transactions: Transaction[]) {
    recentActivityWrapperEl.replaceChildren();

    const fragment = document.createDocumentFragment();;

    transactions.forEach((transaction) => {
      const listItem = createElement("li", ["card-activity__list__item"]);

      listItem.append(createTransactionItem(transaction));
      fragment.append(listItem);
    })

    recentActivityWrapperEl.replaceChildren(fragment);
  }

  function updateSpendingProgress() {
    const totalSpent = dashboardData.monthlySpending.spent;
    const totalBudget = dashboardData.monthlySpending.budget;

    const isOverBudget = totalSpent > totalBudget;

    progressBarEl.value = totalSpent;
    progressBarEl.max = totalBudget;

    progressBarEl.classList.toggle("month-spent-progress--over-budget", isOverBudget);
  }

  function createGreeting() {
    const date = getCurrentDate();
    currentDateEl.textContent = date;
    currentDateEl.setAttribute("data-time", new Date().toISOString());
    greetingEl.textContent = `Hi, ${dashboardData.account.ownerName}!`;
  }

  createSidebar();
  createHeader();

  createGreeting();
  updateSpendingProgress();

  cardBalanceValueEl.textContent = formatCurrency(
    dashboardData.account.balance,
    dashboardData.account.currency,
  );
  monthSpendingValueEl.textContent = formatCurrency(
    dashboardData.monthlySpending.spent,
    dashboardData.account.currency,
  );

  monthlyChartSpendingValueEl.textContent = formatCurrency(
    dashboardData.monthlySpending.spent,
    dashboardData.account.currency,
  );

  cardWrapperEl.replaceChildren(createCard(dashboardData.card));
  addTransactions(dashboardData.recentTransactions);
  createSpendingChart(canvasEl, dashboardData.monthlySpending, dashboardData.account.currency);

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
    }
  })
}

init();

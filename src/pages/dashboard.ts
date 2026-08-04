import { BanknoteArrowDown, BanknoteArrowUp, Bell, ChevronRight, createIcons, CreditCard, House, LogOut, Repeat, Search, SendHorizontal, Settings } from "lucide";
import { createSidebar } from "../components/sidebar";
import { createHeader } from "../components/header";
import { createCard } from "../components/card";
import { getRequiredElement } from "../utils/helpers";
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

  const MAX_PROGRESS_BAR_VALUE = Number(progressBarEl.max);

  const dashboardData = dashboardMock;


  function addTransactions(transactions: Transaction[]) {
    recentActivityWrapperEl.innerHTML = "";

    transactions.forEach((transaction) => {
      const transactionEl = document.createElement("li");
      transactionEl.classList.add("card-activity__list__item");

      const transactionItem = createTransactionItem(transaction);

      transactionEl.append(transactionItem);
      recentActivityWrapperEl.append(transactionEl);
    })
  }

  function updateSpendingProgress() {
    const totalSpent = dashboardData.monthlySpending.spent;
    const totalBudget = dashboardData.monthlySpending.budget;
    const percent = (totalSpent / totalBudget) * MAX_PROGRESS_BAR_VALUE;
    progressBarEl.value = percent;
  }

  function createGreeting() {
    const date = getCurrentDate();
    currentDateEl.textContent = date;
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

  createCard(dashboardData.card);
  addTransactions(dashboardData.recentTransactions);
  createSpendingChart(dashboardData.monthlySpending, dashboardData.account.currency);

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

import { BanknoteArrowDown, BanknoteArrowUp, Bell, ChevronRight, createIcons, CreditCard, House, LogOut, Repeat, Search, SendHorizontal, Settings } from "lucide";
import { createSidebar } from "../components/sidebar";
import { createHeader } from "../components/header";
import { createCard } from "../components/card";
import { createElement, getRequiredElement } from "../utils/helpers";
import { formatCurrency, getCurrentDate } from "../utils/formats";
import { createTransactionItem } from "../components/transaction";
import type { Transaction } from "../types/transaction";
import { createSpendingChart } from "../components/monthlySpendingChart";
import { ACCOUNT_ID } from "../utils/constants";
import { getAccount } from "../services/account";
import { getCard } from "../services/card";
import { getLimitTransactions } from "../services/transactions";
import { getBudget } from "../services/budget";

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

  const loaderEl = getRequiredElement("#loaderWrapper", HTMLDivElement);
  const errorDialogEl = getRequiredElement("#errorDialog", HTMLDialogElement);
  const errorRetryEl = getRequiredElement("#errorRetry", HTMLAnchorElement, errorDialogEl);

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

  function createGreeting(accountName: string) {
    const date = getCurrentDate();
    currentDateEl.textContent = date;
    currentDateEl.setAttribute("data-time", new Date().toISOString());
    greetingEl.textContent = `Hi, ${accountName}!`;
  }

  createSidebar();
  createHeader();


  async function initLoadData() {
    try {
      loaderEl.classList.remove("hidden");

      if (errorDialogEl.open) {
        errorDialogEl.close();
      }

      const [account, card, transactions, budget] = await Promise.all([
        getAccount(ACCOUNT_ID),
        getCard(ACCOUNT_ID),
        getLimitTransactions(ACCOUNT_ID, 10),
        getBudget(ACCOUNT_ID),
      ])


      createGreeting(account.ownerName);
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


    } catch (error) {
      console.error(error);

      if (!errorDialogEl.open) {
        errorDialogEl.showModal();
        errorRetryEl.focus();
      }
    } finally {
      loaderEl.classList.add("hidden");
    }
  }

  errorDialogEl.addEventListener("cancel", (event) => event.preventDefault());
  initLoadData();

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

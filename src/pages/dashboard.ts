import { BanknoteArrowDown, BanknoteArrowUp, Bell, ChevronRight, createIcons, CreditCard, House, LogOut, Repeat, Search, SendHorizontal, Settings } from "lucide";
import { createSidebar } from "../components/sidebar";
import { createHeader } from "../components/header";
import { createCard } from "../components/card";
import { createElement, getRequiredElement, isCurrentMonth } from "../utils/helpers";
import { formatCurrency, getCurrentDate } from "../utils/formats";
import { createTransactionItem } from "../components/transaction";
import type { Transaction } from "../types/transaction";
import { createSpendingChart } from "../components/monthlySpendingChart";
import { ACCOUNT_ID } from "../utils/constants";
import { getAccount } from "../services/account";
import { getCard } from "../services/card";
import { getTransactions } from "../services/transactions";
import { getBudget } from "../services/budget";
import type { Account } from "../types/dashboard";
import type { ChartData, SpendingCategory } from "../types/chart";

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

  function updateSpendingProgress(thisMonthSpent: number, budget: number) {
    const totalSpent = thisMonthSpent;
    const totalBudget = budget;

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

  function getMonthSpentAmount(transactions: Transaction[]) {
    return transactions.filter(transaction => transaction.direction === "expense" && transaction.status === "completed" && isCurrentMonth(transaction.occurredAt))
      .reduce((acc, val) => {
        if (val.currency === "EUR") {
          return val.amount * 1.70 + acc;
        }

        return val.amount + acc;
      }, 0);
  }

  function getMonthTransactions(transactions: Transaction[]) {
    return transactions.filter(transaction => transaction.direction === "expense" && transaction.status === "completed" && isCurrentMonth(transaction.occurredAt))
  }

  function updateUI(account: Account, thisMonthExpenseValue: number) {
    cardBalanceValueEl.textContent = formatCurrency(
      account.balance,
      account.currency,
    );
    monthSpendingValueEl.textContent = formatCurrency(
      thisMonthExpenseValue,
      account.currency,
    );

    monthlyChartSpendingValueEl.textContent = formatCurrency(
      thisMonthExpenseValue,
      account.currency,
    );
  }

  createSidebar();
  createHeader();

  function createChartOptions(transactions: Transaction[], budget: number): ChartData {
    if (transactions.length === 0) {
      return {
        month: getCurrentDate(),
        spent: 0,
        budget: budget,
        categories: [],
      }
    }

    const categories = getMonthTransactions(transactions).reduce((acc: SpendingCategory[], val) => {
      const category = acc.find(category => category.category === val.category);

      if (category) {
        category.amount += val.amount;
      } else {
        acc.push({ category: val.category, amount: val.amount });
      }

      return acc;
    }, [])

    return {
      month: getCurrentDate(),
      spent: getMonthSpentAmount(transactions),
      budget: budget,
      categories: categories,
    }
  }


  async function initLoadData() {
    try {
      loaderEl.classList.remove("hidden");

      if (errorDialogEl.open) {
        errorDialogEl.close();
      }

      const [account, cards, budgets, transactions] = await Promise.all([
        getAccount(ACCOUNT_ID),
        getCard(ACCOUNT_ID),
        getBudget(ACCOUNT_ID),
        getTransactions(ACCOUNT_ID),
      ])
      const card = cards[0];
      const budget = budgets[0];
      const thisMonthExpenseValue = getMonthSpentAmount(transactions);
      const thisMonthTransactions = getMonthTransactions(transactions);
      const lastTransactions = transactions.toSorted((transaction1, transaction2) => {
        const firstTimestamp = Date.parse(transaction1.occurredAt);
        const secondTimestamp = Date.parse(transaction2.occurredAt);

        return secondTimestamp - firstTimestamp
      }).slice(0, 2);
      const chartOptions = createChartOptions(thisMonthTransactions, budget.amount);

      createGreeting(card.cardHolder);
      updateSpendingProgress(thisMonthExpenseValue, budget.amount);
      updateUI(account, thisMonthExpenseValue);

      cardWrapperEl.replaceChildren(createCard(card));
      addTransactions(lastTransactions);
      createSpendingChart(canvasEl, chartOptions, account.currency);

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
}

init();

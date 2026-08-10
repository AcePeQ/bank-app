import type { Transaction, TransactionsState } from "../types/transaction";
import { createElement, getRequiredElement } from "../utils/helpers";
import { createSidebar } from "../components/sidebar";
import { createHeader } from "../components/header";
import { createSearch } from "../components/search";
import { formatCurrency } from "../utils/formats";
import { initCustomSelects } from "../components/customSelect";
import { transactionsMock } from "../mocks/transactions.mock";
import { createTransactionItem } from "../components/transaction";
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  Bell,
  createIcons,
  CreditCard,
  House,
  LogOut,
  Repeat,
  Search,
  Settings,
} from "lucide";


function init() {
  const state: TransactionsState = {
    transactions: [...transactionsMock],
    query: "",
    direction: "all",
    sortBy: "newest"
  }

  const outflowValueEl = getRequiredElement("#outflowValue", HTMLSpanElement);
  const transactionsSearchWrapperEl = getRequiredElement("#transactionsSearchWrapper", HTMLDivElement);
  const transactionsListWrapperEl = getRequiredElement("#transactionsListWrapper", HTMLDivElement);

  function selectVisibleTransactions(state: TransactionsState): Transaction[] {
    // filter: query, direction, sortowanie

    return state.transactions.filter(transaction => transaction).filter(transaction => transaction).toSorted((a, b) => a.amount - b.amount)
  }

  function groupTransactions(transactions: Transaction[]) {
    const currentDateTime = new Date().getTime();
    const miliSecsInOneDay = 86_400_400

    transactions.forEach(transaction => {
      const transactionDateTime = new Date(transaction.occurredAt).getTime();
      const timeDiff = transactionDateTime - currentDateTime;
      const daysPast = Math.floor(timeDiff / miliSecsInOneDay);

      console.log(daysPast);
    })
  }

  function renderTransactions(container: HTMLElement, transactions: Transaction[]) {
    groupTransactions(transactions);




    // container.textContent = "";

    // const divWrapper = createElement("div", ["transactions-list-box"]);

    // const titleEl = createElement("h3", ["transactions-title"]);
    // titleEl.textContent = "Today"

    // divWrapper.appendChild(titleEl);

    // const listEl = createElement("ol", ["transactions-list"]);

    // transactions.forEach(transaction => {
    //   const liEl = createElement("li", ["transaction-item"]);
    //   const transactionItem = createTransactionItem(transaction)

    //   console.log(transactionItem);

    //   liEl.appendChild(transactionItem);
    //   listEl.appendChild(liEl);
    //   divWrapper.appendChild(listEl);
    // })

    // container.appendChild(divWrapper);
  }

  function updateOutflowValue(value: number, currency: string) {
    outflowValueEl.textContent = formatCurrency(value, currency);
  }

  function render() {
    const visibleTransactions = selectVisibleTransactions(state);
    renderTransactions(transactionsListWrapperEl, visibleTransactions)

    createIcons({
      icons: {
        Bell,
        Search,
        LogOut,
        House,
        CreditCard,
        Repeat,
        Settings,
        BanknoteArrowUp,
        BanknoteArrowDown,
      }
    })
  }

  updateOutflowValue(4_230.2, "USD")

  const searchFormEl = createSearch("searchTransactions", "Search transactions", "Search transactions...", ["input-box", "input-box--transactions"]);
  transactionsSearchWrapperEl.appendChild(searchFormEl);


  createHeader();
  createSidebar();
  initCustomSelects();
  render();
}

init();

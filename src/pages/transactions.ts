import type { GroupTransaction, Transaction, TransactionsState } from "../types/transaction";
import { createElement, getRequiredElement } from "../utils/helpers";
import { createSidebar } from "../components/sidebar";
import { createHeader } from "../components/header";
import { createSearch } from "../components/search";
import { formatCurrency, formatDate } from "../utils/formats";
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

  const MILISECONDS_IN_ONE_DAY = 1000 * 60 * 60 * 24

  const outflowValueEl = getRequiredElement("#outflowValue", HTMLSpanElement);
  const transactionsSearchWrapperEl = getRequiredElement("#transactionsSearchWrapper", HTMLDivElement);
  const transactionsListWrapperEl = getRequiredElement("#transactionsListWrapper", HTMLDivElement);

  function selectVisibleTransactions(state: TransactionsState): Transaction[] {
    // filter: query, direction, sortowanie

    return state.transactions;
  }



  function groupTransactions(transactions: Transaction[]) {
    const newArray = transactions.reduce((acc: GroupTransaction[], val: Transaction) => {
      const daysPast = determineDateGroup(val);
      const label = daysPast === 0 ? "Today" : daysPast === -1 ? "Yesterday" :
        daysPast < -1 && daysPast >= -7 ? "Last 7 days" : daysPast < -7 && daysPast >= -14 ? "Last 14 days" : formatDate(val.occurredAt, {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

      const currentGroup = acc.find(transaction => transaction.label === label);

      if (currentGroup) {
        currentGroup.transactions.push(val);
      } else {
        acc.push({
          label,
          transactions: [val],
        })
      }

      return acc;
    }, [])

    return newArray
  }

  function determineDateGroup(transaction: Transaction) {
    const currentDate = new Date();
    const transactionDate = new Date(transaction.occurredAt);

    const currentDateUTC = Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const transactionDateUTC = Date.UTC(transactionDate.getFullYear(), transactionDate.getMonth(), transactionDate.getDate());

    const timeDiff = transactionDateUTC - currentDateUTC;
    const daysPast = timeDiff / MILISECONDS_IN_ONE_DAY;

    return daysPast;
  }


  function renderTransactions(container: HTMLElement, transactions: GroupTransaction[]) {
    container.textContent = "";


    transactions.forEach(item => {
      const divWrapper = createElement("div", ["transactions-list-box"]);

      const titleEl = createElement("h3", ["transactions-title"]);
      titleEl.textContent = item.label;

      divWrapper.appendChild(titleEl);

      const listEl = createElement("ol", ["transactions-list"]);

      item.transactions.forEach(transaction => {
        const liEl = createElement("li", ["transaction-item"]);
        const transactionItem = createTransactionItem(transaction)

        console.log(transactionItem);

        liEl.appendChild(transactionItem);
        listEl.appendChild(liEl);
      })

      divWrapper.appendChild(listEl);
      container.appendChild(divWrapper);
    })






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
    const groupedTransactions = groupTransactions(visibleTransactions);

    renderTransactions(transactionsListWrapperEl, groupedTransactions)

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

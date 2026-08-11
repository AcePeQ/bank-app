import type { GroupTransaction, SortOption, Transaction, TransactionsState } from "../types/transaction";
import { assertUnreachable, createElement, getRequiredElement } from "../utils/helpers";
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
  const MILISECONDS_IN_ONE_DAY = 1000 * 60 * 60 * 24

  const outflowValueEl = getRequiredElement("#outflowValue", HTMLSpanElement);
  const transactionsSearchWrapperEl = getRequiredElement("#transactionsSearchWrapper", HTMLDivElement);
  const transactionsListWrapperEl = getRequiredElement("#transactionsListWrapper", HTMLDivElement);

  const state: TransactionsState = {
    transactions: [...transactionsMock],
    query: "",
    direction: "all",
    sortBy: "newest"
  }


  function sortByHandler(transaction1: Transaction, transaction2: Transaction, sortOption: SortOption) {
    switch (sortOption) {
      case "newest": {
        const t1Date = new Date(transaction1.occurredAt).getTime();
        const t2Date = new Date(transaction2.occurredAt).getTime();

        return t2Date - t1Date;
      };
      case "oldest": {
        const t1Date = new Date(transaction1.occurredAt).getTime();
        const t2Date = new Date(transaction2.occurredAt).getTime();

        return t1Date - t2Date;
      };
      default: {
        return assertUnreachable(sortOption);
      }
    }
  }

  function selectVisibleTransactions(state: TransactionsState): Transaction[] {
    const queryArray = state.transactions.filter(transaction => state.query.length > 2 ? transaction.name.includes(state.query) : transaction);
    const directionArray = queryArray.filter((transaction => state.direction !== "all" ? transaction.direction === state.direction : transaction));
    const sortedArray = directionArray.toSorted((a, b) => sortByHandler(a, b, state.sortBy));

    return sortedArray;
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
  const searchFormInputEl = getRequiredElement("input", HTMLInputElement, searchFormEl);

  function handleSearchQuery(state: TransactionsState) {
    const query = searchFormInputEl.value;
    if (query.length < 2) return;
    state.query = query;
    render();
  }

  searchFormEl.addEventListener("submit", (e) => {
    e.preventDefault();
    handleSearchQuery(state);
  })

  searchFormInputEl.addEventListener("input", () => {
    handleSearchQuery(state);
  })

  const SORT_OPTIONS = [
    "newest",
    "oldest",
  ] as const satisfies readonly SortOption[];

  function isSortOption(
    value: string,
  ): value is SortOption {
    return SORT_OPTIONS.some(
      (option) => option === value,
    );
  }

  function handleSelectOption(value: string) {
    if (!isSortOption(value)) {
      console.error(`Unknown sort option: ${value}`);
      return;
    }

    state.sortBy = value;
    render();
  }


  createHeader();
  createSidebar();
  initCustomSelects(handleSelectOption);
  render();
}

init();

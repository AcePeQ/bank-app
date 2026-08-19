import type { FilterDirection, GroupTransaction, SortOption, Transaction, TransactionsState } from "../types/transaction";
import { assertUnreachable, createElement, getRequiredElement, getRequiredElements } from "../utils/helpers";
import { createSidebar } from "../components/sidebar";
import { createHeader } from "../components/header";
import { createSearch } from "../components/search";
import { formatCurrency, formatDate } from "../utils/formats";
import { initCustomSelects } from "../components/customSelect";
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
import { getTransactions } from "../services/transactions";
import { getAccounts } from "../services/account";
import { USER_ID } from "../utils/constants";



function init() {
  const MILLISECONDS_IN_ONE_DAY = 1000 * 60 * 60 * 24

  const SORT_OPTIONS = [
    "newest",
    "oldest",
  ] as const satisfies readonly SortOption[];

  const FILTER_VALUES = [
    "income",
    "expense",
    "all"
  ] as const satisfies readonly FilterDirection[]

  const outflowValueEl = getRequiredElement("#outflowValue", HTMLSpanElement);
  const transactionsSearchWrapperEl = getRequiredElement("#transactionsSearchWrapper", HTMLDivElement);
  const transactionsListWrapperEl = getRequiredElement("#transactionsListWrapper", HTMLDivElement);
  const transactionsFiltersWrapperEl = getRequiredElement("#transactionsFiltersWrapper", HTMLDivElement);
  const filterButtonsEls = getRequiredElements("button[data-filter]", HTMLButtonElement, transactionsFiltersWrapperEl);
  const loaderEl = getRequiredElement("#loaderWrapper", HTMLDivElement);

  const state: TransactionsState = {
    transactions: [],
    query: "",
    direction: "all",
    sortBy: "newest"
  }


  function sortByHandler(transaction1: Transaction, transaction2: Transaction, sortOption: SortOption) {
    const firstTimestamp = Date.parse(transaction1.occurredAt);
    const secondTimestamp = Date.parse(transaction2.occurredAt);

    switch (sortOption) {
      case "newest":
        return secondTimestamp - firstTimestamp;

      case "oldest":
        return firstTimestamp - secondTimestamp;

      default:
        return assertUnreachable(sortOption);
    }
  }

  function selectVisibleTransactions(state: TransactionsState): Transaction[] {
    const normalizedQuery = state.query.trim().toLowerCase();

    const matchingQuery = state.transactions.filter(transaction => {
      const isQueryTooShort = normalizedQuery.length < 2;
      const matchesQuery = transaction.name.toLowerCase().includes(normalizedQuery);
      return isQueryTooShort || matchesQuery;
    });
    const matchingDirection = matchingQuery.filter((transaction => state.direction === "all" || transaction.direction === state.direction));
    const sortedTransactions = matchingDirection.toSorted((a, b) => sortByHandler(a, b, state.sortBy));

    return sortedTransactions;
  }

  function getDateGrouplabel(transaction: Transaction): string {
    const daysDifference = determineDateGroup(transaction);

    if (daysDifference === 0) return "Today";
    if (daysDifference === -1) return "Yesterday";
    if (daysDifference >= -7) return "Last 7 days";
    if (daysDifference >= -14) return "Last 14 days";

    return formatDate(transaction.occurredAt, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function groupTransactions(transactions: Transaction[]) {
    const newArray = transactions.reduce((acc: GroupTransaction[], val: Transaction) => {
      const label = getDateGrouplabel(val);
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
    const daysPast = timeDiff / MILLISECONDS_IN_ONE_DAY;

    return daysPast;
  }


  function renderTransactions(container: HTMLElement, groups: GroupTransaction[]) {
    container.textContent = "";

    if (groups.length === 0) {
      const emptyMessage = createElement(
        "p",
        ["transactions-empty"],
        "No transactions found.",
      );

      container.replaceChildren(emptyMessage);
      return;
    }

    groups.forEach(item => {
      const divWrapper = createElement("div", ["transactions-list-box"]);

      const titleEl = createElement("h3", ["transactions-title"]);
      titleEl.textContent = item.label;

      divWrapper.appendChild(titleEl);

      const listEl = createElement("ol", ["transactions-list"]);

      item.transactions.forEach(group => {
        const liEl = createElement("li", ["transaction-item"]);
        const transactionItem = createTransactionItem(group)


        liEl.appendChild(transactionItem);
        listEl.appendChild(liEl);
      })

      divWrapper.appendChild(listEl);
      container.appendChild(divWrapper);
    })
  }

  function updateOutflowValue(transactions: Transaction[], currency: string) {
    const value = 1000;

    outflowValueEl.textContent = formatCurrency(value, currency);
  }

  function render() {
    renderDirectionFilters();

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

  function handleSearchQuery() {
    render();
  }

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

  function isFilterValue(value: string): value is FilterDirection {
    return FILTER_VALUES.some(filter => filter === value);
  }

  function handleSelectFilter(value: string) {
    if (!isFilterValue(value)) {
      console.error(`Unknown filter value: ${value}`);
      return;
    }

    state.direction = value;

    render();
  }

  function renderDirectionFilters() {
    filterButtonsEls.forEach((button) => {
      const isActive =
        button.dataset.filter === state.direction;

      button.classList.toggle(
        "filter__button--active",
        isActive,
      );
    });
  }

  async function loadInitData() {
    try {
      loaderEl.classList.remove("hidden");

      const [transactions, accounts] = await Promise.all([getTransactions(USER_ID), getAccounts(USER_ID)]);
      state.transactions = transactions;
      const account = accounts[0];
      updateOutflowValue(transactions, account.currency);
      render();
    } catch (error) {

    } finally {
      loaderEl.classList.add("hidden");
    }
  }

  createHeader();
  createSidebar();

  loadInitData();


  const searchFormEl = createSearch("searchTransactions", "Search transactions", "Search transactions...", ["input-box", "input-box--transactions"]);
  transactionsSearchWrapperEl.appendChild(searchFormEl);
  const searchFormInputEl = getRequiredElement("input", HTMLInputElement, searchFormEl);
  initCustomSelects(handleSelectOption);

  searchFormEl.addEventListener("submit", (e) => {
    e.preventDefault();
    handleSearchQuery();
  })

  searchFormInputEl.addEventListener("input", () => {
    state.query = searchFormInputEl.value;
    handleSearchQuery();
  })

  transactionsFiltersWrapperEl.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;

    const button = event.target.closest<HTMLButtonElement>("[data-filter]");

    if (!button) return;
    if (!transactionsFiltersWrapperEl.contains(button)) return;

    const filterValue = button.dataset.filter;
    if (!filterValue) return;

    handleSelectFilter(filterValue);
  })
}

init();

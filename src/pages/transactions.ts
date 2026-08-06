import type { Transaction, TransactionsState } from "../types/transaction";
import { getRequiredElement } from "../utils/helpers";
import { createSidebar } from "../components/sidebar";
import { createHeader } from "../components/header";
import { createSearch } from "../components/search";
import { formatCurrency } from "../utils/formats";

function init() {
  const outflowValueEl = getRequiredElement("#outflowValue", HTMLSpanElement);
  const transactionsSearchWrapperEl = getRequiredElement("#transactionsSearchWrapper", HTMLDivElement);
  const transactionsListWrapperEl = getRequiredElement("#transactionsListWrapper", HTMLDivElement);

  function selectVisibleTransactions(state: TransactionsState): Transaction[] {
    // filter: query, direction, sortowanie

    return state.transactions.filter(transaction => transaction).filter(transaction => transaction).toSorted((a, b) => a.amount - b.amount)
  }

  function renderTransactions(container: HTMLElement, transactions: Transaction[]) {
    // aktualizacja dom
  }

  function updateOutflowValue(value: number, currency: string) {
    outflowValueEl.textContent = formatCurrency(value, currency);
  }

  updateOutflowValue(4_230.2, "USD")

  const searchFormEl = createSearch("searchTransactions", "Search transactions", "Search transactions...", ["input-box", "input-box--transactions"]);
  transactionsSearchWrapperEl.appendChild(searchFormEl);


  createHeader();
  createSidebar();
}

init();

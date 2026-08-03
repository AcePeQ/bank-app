import { createElement } from "../utils/helpers";
import type { Transaction } from "../types/transaction";
import { formatCurrency, formatDate } from "../utils/formats";

export function createTransactionItem(transaction: Transaction) {
  const paymentWrapper = createElement("article", ["card-payment"]);

  const paymentIcon = createElement("div", ["card-payment__icon"]);
  const iconName = transaction.direction === "income" ? "banknote-arrow-down" : "banknote-arrow-up";
  paymentIcon.innerHTML = `<i data-lucide="${iconName}"></i>`;

  const transactionDate = formatDate(transaction.occurredAt, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const transactionAmount = formatCurrency(transaction.amount, transaction.currency);

  const paymentInfo = createElement("div", ["card-payment__info"]);
  paymentInfo.innerHTML = `
    <h3>${transaction.name}</h3>
    <div>
      <time datetime="${transaction.occurredAt}">${transactionDate}</time>
      •
      <p>${transaction.category}</p>
    </div>
  `;

  const paymentTotal = createElement("div", ["card-payment__total"]);
  paymentTotal.innerHTML = `
    <p class="card-payment__value card-payment__value--${transaction.direction}">${transactionAmount}</p>
    <p class="card-payment__status">${transaction.status}</p>
  `;

  paymentWrapper.append(paymentIcon, paymentInfo, paymentTotal);
  return paymentWrapper;
}

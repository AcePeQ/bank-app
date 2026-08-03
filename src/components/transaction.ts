import { createElement } from "../utils/helpers";
import type { Transaction } from "../types/transaction";

export function createTransactionItem(transaction: Transaction) {
  const paymentWrapper = createElement("article", ["card-payment"]);

  const paymentIcon = createElement("div", ["card-payment__icon"]);
  paymentIcon.innerHTML = `<i data-lucide="banknote-arrow-up"></i>`;

  const paymentInfo = createElement("div", ["card-payment__info"]);
  paymentInfo.innerHTML = `
    <h3>${transaction.name}</h3>
    <div>
      <time>${transaction.date}</time>
      •
      <p>${transaction.category}</p>
    </div>
  `;

  const paymentTotal = createElement("div", ["card-payment__total"]);
  paymentTotal.innerHTML = `
    <p class="card-payment__value card-payment__value--income">${transaction.amount}</p>
    <p class="card-payment__status">${transaction.status}</p>
  `;

  paymentWrapper.append(paymentIcon, paymentInfo, paymentTotal);
  return paymentWrapper;
}

import { createElement } from "../utils/helpers";
import type { Transaction } from "../types/transaction";
import { formatCurrency, formatDate } from "../utils/formats";

export function createTransactionItem(transaction: Transaction) {
  const paymentWrapper = createElement("article", ["card-payment"]);

  const paymentIconWrapper = createElement("div", ["card-payment__icon"]);
  const iconName = transaction.direction === "income" ? "banknote-arrow-down" : "banknote-arrow-up";
  const paymentIcon = createElement("i");
  paymentIcon.dataset.lucide = iconName;
  paymentIconWrapper.append(paymentIcon);

  const transactionDate = formatDate(transaction.occurredAt, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const transactionAmount = formatCurrency(transaction.amount, transaction.currency);

  const paymentInfoWrapper = createElement("div", ["card-payment__info"]);
  const paymentInfoHeading = createElement("h3", [], transaction.name);
  const paymentInfoDetails = createElement("div");
  const paymentInfoTime = createElement("time", [], transactionDate);
  paymentInfoTime.setAttribute("datetime", transaction.occurredAt);
  const paymentInfoCategory = createElement("p", [], transaction.category);
  paymentInfoDetails.append(paymentInfoTime, "•", paymentInfoCategory);
  paymentInfoWrapper.append(paymentInfoHeading, paymentInfoDetails);


  const paymentTotal = createElement("div", ["card-payment__total"]);
  const paymentTotalValue = createElement("p", ["card-payment__value", `card-payment__value--${transaction.direction}`], transactionAmount);
  const paymentTotalStatus = createElement("p", ["card-payment__status"], transaction.status);
  paymentTotal.append(paymentTotalValue, paymentTotalStatus);

  paymentWrapper.append(paymentIconWrapper, paymentInfoWrapper, paymentTotal);
  return paymentWrapper;
}

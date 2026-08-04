import type { Card } from "../types/card";
import { createElement, getRequiredElement } from "../utils/helpers";

export function createCard(card: Card) {
  const cardWrapperEl = getRequiredElement("#cardItem", HTMLElement);
  cardWrapperEl.textContent = "";

  const cardTypeEl = createElement("p", ["card__type"], card.network);
  const cardOwnerEl = createElement("h3", ["card__owner"], card.cardHolder);
  const cardNumberEl = createElement("p", ["card__number"], `•••• •••• •••• ${card.lastFourDigits}`);

  const cardDetailsEl = createElement("div", ["card__details"]);

  const cardCvvEl = createElement("p", ["card__detail"], "CVV");
  const cardCvvValueEl = createElement("span", ["card__detail__value"], "•••");

  const cardExpiryEl = createElement("p", ["card__detail"], "Expiry");
  const cardExpiryValueEl = createElement("span", ["card__detail__value"], card.expirationDate);

  cardCvvEl.append(cardCvvValueEl);
  cardExpiryEl.append(cardExpiryValueEl);

  cardDetailsEl.append(cardExpiryEl, cardCvvEl);
  cardWrapperEl.append(cardTypeEl, cardOwnerEl, cardNumberEl, cardDetailsEl);
}


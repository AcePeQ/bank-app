import { Bell, ChevronRight, createIcons, CreditCard, Eye, Gauge, HandCoins, House, Landmark, LogOut, Repeat, Search, Settings, ShoppingCart, Snowflake, SquareArrowRightEnter } from "lucide";
import { createSidebar } from "../components/sidebar";
import { createHeader } from "../components/header";
import { createCard } from "../components/card";
import { getLimitDialogElements, getRequiredElement } from "../utils/helpers";
import { createSwitch } from "../components/toggleSwitch";
import type { LimitDialogElements } from "../types/dialog";
import { getCard, setDailySpendingLimit, setSinglePaymentLimit, toggleAtmWithdrawalsOption, toggleCardStatus, toggleOnlinePaymentsOption } from "../services/card";
import { ACCOUNT_ID } from "../utils/constants";
import { formatCurrency } from "../utils/formats";
import type { CardStatus } from "../types/card";

function init() {
  const cardWrapperEl = getRequiredElement("#cardContainer", HTMLDivElement);
  const onlinePaymentsEl = getRequiredElement("#cardSettingsOnlinePayments", HTMLDivElement);
  const atmWithdrawalsEl = getRequiredElement("#cardSettingsAtmWithdrawals", HTMLDivElement);
  const cardFreezeButtonEl = getRequiredElement("#cardFreezeButton", HTMLButtonElement);
  const cardFreezeOptionTextEl = getRequiredElement("#cardFreezeOptionText", HTMLSpanElement);

  const loaderEl = getRequiredElement("#loaderWrapper", HTMLDivElement);
  const errorDialogEl = getRequiredElement("#errorDialog", HTMLDialogElement);
  const errorRetryEl = getRequiredElement("#errorRetry", HTMLAnchorElement, errorDialogEl);

  const dailySpendingLimitElements = getLimitDialogElements("dailySpendingLimit");
  const singlePaymentLimitElements = getLimitDialogElements("singlePaymentLimit");

  function openDialog(dialog: HTMLDialogElement) {
    dialog.showModal();
  }

  function closeDialog(dialog: HTMLDialogElement) {
    dialog.close();
  }

  function initLimitDialog(elements: LimitDialogElements) {
    elements.openButtonEl.addEventListener("click", () => openDialog(elements.dialogEl));
    elements.cancelButtonEl.addEventListener("click", () => closeDialog(elements.dialogEl));
  }

  function setDefaultCardSettings(singlePaymentLimit: number, dailySpendingLimit: number, cardStatus: CardStatus) {
    const formatedDailyLimit = formatCurrency(dailySpendingLimit, "USD")
    const formatedSinglePaymentLimit = formatCurrency(singlePaymentLimit, "USD")

    dailySpendingLimitElements.valueEl.textContent = String(formatedDailyLimit);
    dailySpendingLimitElements.inputEl.value = String(dailySpendingLimit);

    singlePaymentLimitElements.valueEl.textContent = String(formatedSinglePaymentLimit);
    singlePaymentLimitElements.inputEl.value = String(singlePaymentLimit);

    updateCardStatusUI(cardStatus);
  }

  function updateCardStatusUI(status: CardStatus) {
    cardFreezeOptionTextEl.textContent = status === "disabled" ? "Unfreeze Card" : "Freeze Card";
  }

  async function toggleOnlinePayments(cardId: string, inputEl: HTMLInputElement) {
    const nextEnabled = inputEl.checked;
    const previousEnabled = !nextEnabled;

    inputEl.disabled = true;

    try {
      const updatedCard = await toggleOnlinePaymentsOption(cardId, nextEnabled)
      inputEl.checked = updatedCard.onlinePaymentsEnabled;
    } catch (error) {
      console.error(error);
      inputEl.checked = previousEnabled;

      if (!errorDialogEl.open) {
        errorDialogEl.showModal();
        errorRetryEl.focus();
      }
    } finally {
      inputEl.disabled = false;
    }
  }

  async function toggleAtmWithdrawals(cardId: string, inputEl: HTMLInputElement) {
    const nextEnabled = inputEl.checked;
    const previousEnabled = !nextEnabled;

    inputEl.disabled = true;

    try {
      const updatedCard = await toggleAtmWithdrawalsOption(cardId, nextEnabled);
      inputEl.checked = updatedCard.atmWithdrawalsEnabled;
    } catch (error) {
      console.error(error);
      inputEl.checked = previousEnabled;

      if (!errorDialogEl.open) {
        errorDialogEl.showModal();
        errorRetryEl.focus();
      }
    } finally {
      inputEl.disabled = false;
    }
  }

  async function toggleFreezeCard(cardId: string, currentStatus: CardStatus): Promise<CardStatus> {
    const previousStatus = currentStatus;
    const nextStatus: CardStatus = currentStatus === "active" ? "disabled" : "active";

    cardFreezeButtonEl.disabled = true;
    updateCardStatusUI(nextStatus);

    try {
      const updatedCard = await toggleCardStatus(cardId, nextStatus);
      updateCardStatusUI(updatedCard.status);
      return updatedCard.status;
    } catch (error) {
      console.error(error);
      updateCardStatusUI(previousStatus);

      if (!errorDialogEl.open) {
        errorDialogEl.showModal();
        errorRetryEl.focus();
      }

      return previousStatus;
    } finally {
      cardFreezeButtonEl.disabled = false;
    }
  }

  function showLimitError(elements: LimitDialogElements, message: string) {
    elements.errorEl.textContent = message;
    elements.inputEl.setAttribute("aria-invalid", "true");
    elements.inputEl.focus();
  }

  function clearLimitError(elements: LimitDialogElements) {
    elements.errorEl.textContent = "";
    elements.inputEl.setAttribute("aria-invalid", "false");
  }

  function validateLimitInput(elements: LimitDialogElements): number | null {
    clearLimitError(elements);

    const { inputEl } = elements;
    const value = inputEl.valueAsNumber;

    if (inputEl.validity.valueMissing || inputEl.value.trim() === "") {
      showLimitError(elements, "Enter a limit.");
      return null;
    }

    if (inputEl.validity.badInput || !Number.isFinite(value)) {
      showLimitError(elements, "Enter a valid amount.");
      return null;
    }

    if (inputEl.validity.rangeUnderflow) {
      showLimitError(elements, `Limit must be at least ${formatCurrency(Number(inputEl.min), "USD")}.`);
      return null;
    }

    if (inputEl.validity.rangeOverflow) {
      showLimitError(elements, `Limit cannot exceed ${formatCurrency(Number(inputEl.max), "USD")}.`);
      return null;
    }

    if (inputEl.validity.stepMismatch) {
      showLimitError(elements, "Enter an amount with no more than two decimal places.");
      return null;
    }

    return value;
  }

  function setLimitLoading(elements: LimitDialogElements, isLoading: boolean) {
    elements.inputEl.disabled = isLoading;
    elements.cancelButtonEl.disabled = isLoading;
    elements.submitButtonEl.disabled = isLoading;
    elements.formEl.setAttribute("aria-busy", String(isLoading));
  }

  async function setSpendingLimit(cardId: string, currentLimit: number, singlePaymentLimit: number): Promise<number> {
    const previousLimit = currentLimit;
    const nextLimit = validateLimitInput(dailySpendingLimitElements);

    if (nextLimit === null) return currentLimit;

    if (nextLimit < singlePaymentLimit) {
      showLimitError(
        dailySpendingLimitElements,
        `Daily spending limit cannot be lower than the single payment limit (${formatCurrency(singlePaymentLimit, "USD")}).`,
      );
      return currentLimit;
    }

    setLimitLoading(dailySpendingLimitElements, true);

    try {
      const updatedCard = await setDailySpendingLimit(cardId, nextLimit);
      dailySpendingLimitElements.inputEl.valueAsNumber = updatedCard.dailySpendingLimit;
      dailySpendingLimitElements.valueEl.textContent = formatCurrency(updatedCard.dailySpendingLimit, "USD");
      return updatedCard.dailySpendingLimit;
    } catch (error) {
      console.error(error);
      dailySpendingLimitElements.inputEl.valueAsNumber = previousLimit;
      dailySpendingLimitElements.valueEl.textContent = formatCurrency(previousLimit, "USD");

      if (!errorDialogEl.open) {
        errorDialogEl.showModal();
        errorRetryEl.focus();
      }

      return previousLimit;
    } finally {
      setLimitLoading(dailySpendingLimitElements, false);
      dailySpendingLimitElements.dialogEl.close();
    }
  }

  async function setPaymentLimit(cardId: string, currentLimit: number, dailySpendingLimit: number): Promise<number> {
    const previousLimit = currentLimit;
    const nextLimit = validateLimitInput(singlePaymentLimitElements);

    if (nextLimit === null) return currentLimit;

    if (nextLimit > dailySpendingLimit) {
      showLimitError(
        singlePaymentLimitElements,
        `Single payment limit cannot be higher than the daily spending limit (${formatCurrency(dailySpendingLimit, "USD")}).`,
      );
      return currentLimit;
    }

    setLimitLoading(singlePaymentLimitElements, true);

    try {
      const updatedCard = await setSinglePaymentLimit(cardId, nextLimit);
      singlePaymentLimitElements.inputEl.valueAsNumber = updatedCard.singlePaymentLimit;
      singlePaymentLimitElements.valueEl.textContent = formatCurrency(updatedCard.singlePaymentLimit, "USD");
      return updatedCard.singlePaymentLimit;
    } catch (error) {
      console.error(error);
      singlePaymentLimitElements.inputEl.valueAsNumber = previousLimit;
      singlePaymentLimitElements.valueEl.textContent = formatCurrency(previousLimit, "USD");

      if (!errorDialogEl.open) {
        errorDialogEl.showModal();
        errorRetryEl.focus();
      }

      return previousLimit;
    } finally {
      setLimitLoading(singlePaymentLimitElements, false);
      singlePaymentLimitElements.dialogEl.close();
    }

  }

  createSidebar();
  createHeader();

  async function loadInitData() {
    try {
      loaderEl.classList.remove("hidden");

      if (errorDialogEl.open) {
        errorDialogEl.close();
      }

      const [card] = await getCard(ACCOUNT_ID);

      if (!card) return;

      const cardNode = createCard(card);
      cardWrapperEl.appendChild(cardNode);

      const onlinePaymentsSwitch = createSwitch({ id: "onlinePayments", checked: card.onlinePaymentsEnabled }, onlinePaymentsEl);
      const atmWithdrawalsSwitch = createSwitch({ id: "atmWithdrawals", checked: card.atmWithdrawalsEnabled }, atmWithdrawalsEl);
      let cardStatus = card.status;
      let dailySpendingLimit = card.dailySpendingLimit;
      let singlePaymentLimit = card.singlePaymentLimit;

      setDefaultCardSettings(card.singlePaymentLimit, card.dailySpendingLimit, card.status)

      onlinePaymentsSwitch.addEventListener("change", () => {
        toggleOnlinePayments(card.id, onlinePaymentsSwitch);
      });

      atmWithdrawalsSwitch.addEventListener("change", () => {
        toggleAtmWithdrawals(card.id, atmWithdrawalsSwitch)
      })

      cardFreezeButtonEl.addEventListener("click", async () => {
        cardStatus = await toggleFreezeCard(card.id, cardStatus);
      });

      dailySpendingLimitElements.formEl.addEventListener("submit", async (e) => {
        e.preventDefault();
        dailySpendingLimit = await setSpendingLimit(card.id, dailySpendingLimit, singlePaymentLimit);
      })

      singlePaymentLimitElements.formEl.addEventListener("submit", async (e) => {
        e.preventDefault();
        singlePaymentLimit = await setPaymentLimit(card.id, singlePaymentLimit, dailySpendingLimit);
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
  loadInitData();


  initLimitDialog(dailySpendingLimitElements);
  initLimitDialog(singlePaymentLimitElements);


  createIcons({
    icons: {
      Bell,
      Search,
      LogOut,
      House,
      CreditCard,
      Repeat,
      Settings,
      SquareArrowRightEnter,
      ChevronRight,
      Snowflake,
      Eye,
      ShoppingCart,
      Landmark,
      Gauge,
      HandCoins
    }
  })
}

init();

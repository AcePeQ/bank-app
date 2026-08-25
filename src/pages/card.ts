import { Bell, ChevronRight, createIcons, CreditCard, Eye, Gauge, HandCoins, House, Landmark, LogOut, Repeat, Search, Settings, ShoppingCart, Snowflake, SquareArrowRightEnter } from "lucide";
import { createSidebar } from "../components/sidebar";
import { createHeader } from "../components/header";
import { createCard } from "../components/card";
import { getLimitDialogElements, getRequiredElement } from "../utils/helpers";
import { createSwitch } from "../components/toggleSwitch";
import type { LimitDialogElements } from "../types/dialog";
import { getCard, toggleAtmWithdrawalsOption, toggleCardStatus, toggleOnlinePaymentsOption } from "../services/card";
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

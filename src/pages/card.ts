import { Bell, ChevronRight, createIcons, CreditCard, Eye, Gauge, HandCoins, House, Landmark, LogOut, Repeat, Search, Settings, ShoppingCart, Snowflake, SquareArrowRightEnter } from "lucide";
import { createSidebar } from "../components/sidebar";
import { createHeader } from "../components/header";
import { createCard } from "../components/card";
import { getLimitDialogElements, getRequiredElement } from "../utils/helpers";
import { createSwtich } from "../components/toggleSwitch";
import type { LimitDialogElements } from "../types/dialog";
import { getCard } from "../services/card";
import { ACCOUNT_ID } from "../utils/constants";
import { formatCurrency } from "../utils/formats";

function init() {
  const cardWrapperEl = getRequiredElement("#cardContainer", HTMLDivElement);
  const onlinePaymentsEl = getRequiredElement("#cardSettingsOnlinePayments", HTMLDivElement);
  const atmWithdrawalsEl = getRequiredElement("#cardSettingsAtmWithdrawals", HTMLDivElement);

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

  function setDefaultCardSettings(atmWithdrawals: boolean, onlinePayments: boolean, singlePaymentLimit: number, dailySpendingLimit: number) {
    const onlinePaymentsEl = getRequiredElement("#onlinePayments", HTMLInputElement);
    const atmWithdrawalsEl = getRequiredElement("#atmWithdrawals", HTMLInputElement);

    const dailySpendingLimitValueEl = getRequiredElement("#dailySpendingLimitValue", HTMLSpanElement);
    const dailySpendingLimitInputEl = getRequiredElement("#dailySpendingLimitInput", HTMLInputElement);

    const singlePaymentLimitValueEl = getRequiredElement("#singlePaymentLimitValue", HTMLSpanElement);
    const singlePaymentLimitInputEl = getRequiredElement("#singlePaymentLimitInput", HTMLInputElement);

    const formatedDailyLimit = formatCurrency(dailySpendingLimit, "USD")
    const formatedSinglePaymentLimit = formatCurrency(singlePaymentLimit, "USD")

    dailySpendingLimitValueEl.textContent = String(formatedDailyLimit);
    dailySpendingLimitInputEl.value = String(dailySpendingLimit);

    singlePaymentLimitValueEl.textContent = String(formatedSinglePaymentLimit);
    singlePaymentLimitInputEl.value = String(singlePaymentLimit);

    onlinePaymentsEl.checked = onlinePayments;
    atmWithdrawalsEl.checked = atmWithdrawals;
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

      console.log(card);

      const cardNode = createCard(card);
      cardWrapperEl.appendChild(cardNode);

      setDefaultCardSettings(card.atmWithdrawalsEnabled, card.onlinePaymentsEnabled, card.singlePaymentLimit, card.dailySpendingLimit)


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


  createSwtich({ id: "onlinePayments" }, () => { }, onlinePaymentsEl);
  createSwtich({ id: "atmWithdrawals" }, () => { }, atmWithdrawalsEl);
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

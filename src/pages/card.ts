import { Bell, ChevronRight, createIcons, CreditCard, Eye, Gauge, HandCoins, House, Landmark, LogOut, Repeat, Search, Settings, ShoppingCart, Snowflake, SquareArrowRightEnter } from "lucide";
import { createSidebar } from "../components/sidebar";
import { createHeader } from "../components/header";
import { createCard } from "../components/card";
import { getLimitDialogElements, getRequiredElement } from "../utils/helpers";
import { dashboardMock } from "../mocks/dashboard.mock";
import { createSwtich } from "../components/toggleSwitch";
import type { LimitDialogElements } from "../types/dialog";

const dashboardData = dashboardMock;


function init() {
  const cardWrapperEl = getRequiredElement("#cardContainer", HTMLDivElement);
  const onlinePaymentsEl = getRequiredElement("#cardSettingsOnlinePayments", HTMLDivElement);
  const atmWithdrawalsEl = getRequiredElement("#cardSettingsAtmWithdrawals", HTMLDivElement);

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

  createSidebar();
  createHeader();

  const card = createCard(dashboardData.card);
  cardWrapperEl.appendChild(card);

  initLimitDialog(dailySpendingLimitElements);
  initLimitDialog(singlePaymentLimitElements);


  createSwtich({ id: "onlinePayments" }, () => { }, onlinePaymentsEl);
  createSwtich({ id: "atmWithdrawals" }, () => { }, atmWithdrawalsEl);

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

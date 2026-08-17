import { Bell, ChevronRight, createIcons, CreditCard, Eye, Gauge, HandCoins, House, Landmark, LogOut, Repeat, Search, Settings, ShoppingCart, Snowflake, SquareArrowRightEnter } from "lucide";
import { createSidebar } from "../components/sidebar";
import { createHeader } from "../components/header";
import { createCard } from "../components/card";
import { getRequiredElement } from "../utils/helpers";
import { dashboardMock } from "../mocks/dashboard.mock";
import { createSwtich } from "../components/toggleSwitch";

const dashboardData = dashboardMock;


function init() {
  const cardWrapperEl = getRequiredElement("#cardContainer", HTMLDivElement);
  const onlinePaymentsEl = getRequiredElement("#cardSettingsOnlinePayments", HTMLDivElement);
  const atmWithdrawalsEl = getRequiredElement("#cardSettingsAtmWithdrawals", HTMLDivElement);

  const dailySpendingLimitBtnEl = getRequiredElement("#dailySpendingLimitButton", HTMLButtonElement);
  const dailySpendingDialogEl = getRequiredElement("#dailySpendingLimitDialog", HTMLDialogElement);

  const singlePaymentLimitBtnEl = getRequiredElement("#singlePaymentLimitButton", HTMLButtonElement);
  const singlePaymentLimitDialogEl = getRequiredElement("#singlePaymentLimitDialog", HTMLDialogElement)


  function openDialog(dialog: HTMLDialogElement) {
    dialog.showModal();
  }

  function closeDialog(dialog: HTMLDialogElement) {
    dialog.close();
  }

  createSidebar();
  createHeader();

  const card = createCard(dashboardData.card);
  cardWrapperEl.appendChild(card);

  dailySpendingLimitBtnEl.addEventListener("click", () => openDialog(dailySpendingDialogEl));
  singlePaymentLimitBtnEl.addEventListener("click", () => openDialog(singlePaymentLimitDialogEl));


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

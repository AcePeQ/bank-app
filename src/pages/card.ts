import { BanknoteArrowDown, BanknoteArrowUp, Bell, ChevronRight, createIcons, CreditCard, Eye, Gauge, HandCoins, House, Landmark, LogOut, Repeat, Search, SendHorizontal, Settings, ShoppingCart, Snowflake, SquareArrowRightEnter } from "lucide";
import { createSidebar } from "../components/sidebar";
import { createHeader } from "../components/header";
import { createCard } from "../components/card";
import { getRequiredElement } from "../utils/helpers";
import { dashboardMock } from "../mocks/dashboard.mock";

const dashboardData = dashboardMock;


function init() {
  const cardWrapperEl = getRequiredElement("#cardContainer", HTMLDivElement);

  createSidebar();
  createHeader();

  const card = createCard(dashboardData.card);
  cardWrapperEl.appendChild(card);


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

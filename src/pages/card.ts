import { BanknoteArrowDown, BanknoteArrowUp, Bell, ChevronRight, createIcons, CreditCard, House, LogOut, Repeat, Search, SendHorizontal, Settings } from "lucide";
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
      SendHorizontal,
      BanknoteArrowUp,
      BanknoteArrowDown,
      ChevronRight,
    }
  })
}

init();

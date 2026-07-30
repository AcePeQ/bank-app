import { BanknoteArrowDown, BanknoteArrowUp, Bell, ChevronRight, createIcons, CreditCard, House, LogOut, Repeat, Search, SendHorizontal, Settings } from "lucide";
import { createSidebar } from "../components/sidebar";
import { createHeader } from "../components/header";

function init() {
  createSidebar();
  createHeader();


  createIcons({
    icons: {
      Bell,
      Search,
      House,
      CreditCard,
      Repeat,
      Settings,
      LogOut,
      SendHorizontal,
      BanknoteArrowUp,
      BanknoteArrowDown,
      ChevronRight,
    }
  })
}

init();
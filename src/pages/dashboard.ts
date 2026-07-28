import { Bell, createIcons, CreditCard, House, LogOut, Repeat, Search, Settings } from "lucide";
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
      LogOut
    }
  })
}

init();
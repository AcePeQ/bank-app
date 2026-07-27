import { Bell, createIcons, CreditCard, House, LogOut, Repeat, Search, Settings } from "lucide";
import { createSidebar } from "../components/sidebar";

function init() {
  createSidebar();


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
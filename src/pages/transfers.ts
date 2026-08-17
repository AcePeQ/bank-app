import { BanknoteArrowDown, BanknoteArrowUp, Bell, ChevronRight, Contact, createIcons, CreditCard, House, Landmark, LogOut, Repeat, Search, SendHorizontal, Settings, User } from "lucide";
import { createSidebar } from "../components/sidebar";
import { createHeader } from "../components/header";


function init() {

  createSidebar();
  createHeader();


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
      Landmark,
      User,
      Contact,
    }
  })
}

init();

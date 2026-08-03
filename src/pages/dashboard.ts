import { BanknoteArrowDown, BanknoteArrowUp, Bell, ChevronRight, createIcons, CreditCard, House, LogOut, Repeat, Search, SendHorizontal, Settings } from "lucide";
import { createSidebar } from "../components/sidebar";
import { createHeader } from "../components/header";
import { createCard } from "../components/card";
import type { Card } from "../types/card";

const TEMP_CARD: Card = {
  id: 1,
  type: "Visa",
  lastFourDigits: "1234",
  cardHolder: "John Doe",
  expirationDate: "10/24"
}

function init() {
  createSidebar();
  createHeader();

  createCard(TEMP_CARD);


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
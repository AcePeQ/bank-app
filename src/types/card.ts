export type Card = {
  accountId: string;
  atmWithdrawalsEnabled: boolean;
  cardHolder: string;
  dailySpendingLimit: number;
  expirationDate: string;
  id: string;
  lastFourDigits: string;
  network: string;
  onlinePaymentsEnabled: boolean;
  singlePaymentLimit: number;
  status: "active" | "disabled";
  userId: string;
};



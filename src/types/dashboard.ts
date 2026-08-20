import type { Card } from "./card";
import type { Transaction } from "./transaction";

export type Account = {
  id: string;
  userId: string;
  name: string;
  accountNumber: string;
  balance: number;
  currency: string;
  status: string;
};

export type SpendingCategory = {
  category: string;
  amount: number;
};

export type MonthlySpending = {
  month: string;
  spent: number;
  budget: number;
  categories: SpendingCategory[];
};

export type DashboardData = {
  account: Account;
  card: Card;
  recentTransactions: Transaction[];
  monthlySpending: MonthlySpending;
};

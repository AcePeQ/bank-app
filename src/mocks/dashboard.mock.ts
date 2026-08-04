import type { DashboardData } from "../types/dashboard";

export const dashboardMock = {
  account: {
    id: 1,
    ownerName: "John Doe",
    balance: 15_524.12,
    currency: "USD",
  },

  card: {
    id: 1,
    network: "Visa",
    lastFourDigits: "1234",
    cardHolder: "John Doe",
    expirationDate: "2029-10",
  },

  recentTransactions: [
    {
      id: 1,
      name: "Salary",
      occurredAt: "2026-08-01T08:00:00Z",
      category: "Income",
      amount: 4_850,
      currency: "USD",
      direction: "income",
      status: "completed",
    },
    {
      id: 2,
      name: "Apple Store",
      occurredAt: "2026-07-30T14:25:00Z",
      category: "Electronics",
      amount: 1_299,
      currency: "USD",
      direction: "expense",
      status: "pending",
    },
  ],

  monthlySpending: {
    month: "2026-08",
    spent: 3_245.5,
    budget: 5_000,
    categories: [
      { category: "Subscriptions", amount: 400 },
      { category: "Transport", amount: 100 },
      { category: "Daily life", amount: 1_500 },
      { category: "Shopping", amount: 945.5 },
      { category: "Bills", amount: 800 },
      { category: "Others", amount: 800 },
    ],
  },
} satisfies DashboardData;

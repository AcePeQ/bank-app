export type TransactionDirection = "income" | "expense" | "all";
export type TransactionStatus = "pending" | "completed" | "failed";
export type SortOption =
  | "newest"
  | "oldest"

export type Transaction = {
  id: number;
  name: string;
  occurredAt: string;
  category: string;
  amount: number;
  currency: string;
  direction: TransactionDirection;
  status: TransactionStatus;
};

export type TransactionsState = {
  transactions: Transaction[];
  query: string;
  direction: TransactionDirection | "all";
  sortBy: SortOption;
}

export type GroupTransaction = {
  label: string;
  transactions: Transaction[]
}
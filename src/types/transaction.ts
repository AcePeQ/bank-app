export type TransactionDirection = "income" | "expense";
export type TransactionStatus = "pending" | "completed" | "failed";
export type SortOption =
  | "newest"
  | "oldest"

export type Transaction = {
  id: string;
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
  direction: FilterDirection;
  sortBy: SortOption;
}

export type GroupTransaction = {
  label: string;
  transactions: Transaction[]
}

export type FilterDirection = TransactionDirection | "all";
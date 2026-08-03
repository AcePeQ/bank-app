export type TransactionDirection = "income" | "expense";
export type TransactionStatus = "pending" | "completed" | "failed";

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

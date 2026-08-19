import type { Transaction } from "../types/transaction";
import { apiRequest } from "./api";

export function getTransactions(userId: string): Promise<Transaction[]> {
  return apiRequest<Transaction[]>(`/transactions?userId=${userId}`);
}
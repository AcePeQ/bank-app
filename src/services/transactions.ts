import type { Transaction } from "../types/transaction";
import { apiRequest } from "./api";

export function getTransactions(accountId: string): Promise<Transaction[]> {
  return apiRequest<Transaction[]>(`/transactions?accountId=${accountId}`);
}

export function getLimitTransactions(accountId: string, limit: number): Promise<Transaction[]> {
  return apiRequest<Transaction[]>(`/transactions?accountId=${accountId}&_limit=${limit}`);
}
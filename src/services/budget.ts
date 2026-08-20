import type { Budget } from "../types/budget";
import { apiRequest } from "./api";

export async function getBudget(accountId: string): Promise<Budget> {
  return apiRequest<Budget>(`/budgets/${accountId}`);
}
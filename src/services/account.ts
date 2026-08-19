import type { Account } from "../types/dashboard";
import { apiRequest } from "./api";

export async function getAccounts(userId: string): Promise<Account[]> {
  return apiRequest<Account[]>(`/accounts?userId=${userId}`);
}
import type { Account } from "../types/dashboard";
import { apiRequest } from "./api";

export async function getAccount(accountId: string): Promise<Account> {
  return apiRequest<Account>(`/accounts/${accountId}`);
}
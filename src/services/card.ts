import type { Card } from "../types/card";
import { apiRequest } from "./api";

export async function getCard(accountId: string): Promise<Card> {
  return apiRequest<Card>(`/cards/${accountId}`);
}
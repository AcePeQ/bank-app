import type { Card } from "../types/card";
import { apiRequest } from "./api";

export async function getCard(accountId: string): Promise<Card[]> {
  return apiRequest<Card[]>(`/cards?accountId=${accountId}`);
}

export async function toggleOnlinePaymentsOption(cardId: string, enabled: boolean) {
  return apiRequest<Card>(`/cards/${cardId}`, {
    method: "PATCH",
    body: JSON.stringify({
      onlinePaymentsEnabled: enabled,
    })
  })
}

export async function toggleAtmWithdrawalsOption(cardId: string, enabled: boolean) {
  return apiRequest<Card>(`/cards/${cardId}`, {
    method: "PATCH",
    body: JSON.stringify({
      atmWithdrawalsEnabled: enabled,
    }),
  });
}
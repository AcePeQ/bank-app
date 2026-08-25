import type { Card, CardStatus } from "../types/card";
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

export async function toggleCardStatus(cardId: string, status: CardStatus) {
  return apiRequest<Card>(`/cards/${cardId}`, {
    method: "PATCH",
    body: JSON.stringify({
      status,
    }),
  });
}

export async function setDailySpendingLimit(cardId: string, limit: number): Promise<Card> {
  return apiRequest<Card>(`/cards/${cardId}`, {
    method: "PATCH",
    body: JSON.stringify({
      dailySpendingLimit: limit,
    }),
  });
}

export async function setSinglePaymentLimit(cardId: string, limit: number): Promise<Card> {
  return apiRequest<Card>(`/cards/${cardId}`, {
    method: "PATCH",
    body: JSON.stringify({
      singlePaymentLimit: limit,
    }),
  });
}

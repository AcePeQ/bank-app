# Mock API

Ten katalog zawiera fikcyjne dane przeznaczone wyłącznie do nauki pracy z `fetch`.
Hasła i sesje nie są bezpieczne i nie mogą być używane w prawdziwej aplikacji.

## Uruchomienie

Zainstaluj JSON Server lokalnie:

```sh
npm install --save-dev json-server
```

Uruchom API i Vite w dwóch terminalach:

```sh
npm run api
npm run dev
```

JSON Server działa pod `http://localhost:3001`. Vite przekazuje żądania zaczynające
się od `/api` do tego serwera, dlatego kod aplikacji może używać adresów takich jak:

```ts
fetch("/api/transactions?userId=user-1");
```

Konto demonstracyjne:

- email: `demo@infinity.test`
- hasło: `Demo123!`

## Kolekcje

- `users` — rejestracja i demonstracyjne logowanie,
- `sessions` — demonstracyjne sesje,
- `accounts` — saldo i rachunki użytkownika,
- `cards` — karta, ustawienia oraz limity,
- `budgets` — miesięczny budżet,
- `recipients` — ostatni odbiorcy,
- `transactions` — historia operacji,
- `transfers` — przelewy bankowe i płatności znajomym,
- `paymentRequests` — prośby o płatność,
- `notifications` — powiadomienia użytkownika.

Identyfikatory są stringami, ponieważ JSON Server v1 zawsze zapisuje `id` jako
string. Typy `id: number` w obecnych modelach frontendu trzeba zmienić na `string`
podczas podłączania API.

## Przydatne zapytania

```text
GET /api/users?email=demo%40infinity.test&password=Demo123%21
GET /api/accounts?userId=user-1
GET /api/cards?userId=user-1
GET /api/recipients?ownerUserId=user-1&_sort=-lastUsedAt
GET /api/transactions?userId=user-1&_sort=-occurredAt
GET /api/transactions?userId=user-1&direction=expense
GET /api/paymentRequests?requesterUserId=user-1
GET /api/notifications?userId=user-1&isRead=false
```

Każda kolekcja obsługuje zwykłe operacje REST:

```text
GET    /api/transactions
GET    /api/transactions/transaction-1
POST   /api/transactions
PATCH  /api/transactions/transaction-1
DELETE /api/transactions/transaction-1
```

## TODO

### Rejestracja

1. Pobierz `/api/users?email=...` i sprawdź, czy tablica jest pusta.
2. Wyślij `POST /api/users` z danymi nowego użytkownika.
3. Wyślij `POST /api/accounts`, tworząc jego pierwszy rachunek.
4. Zapisz demonstracyjną sesję przez `POST /api/sessions`.

Obecne endpointy `/api/register`, `/api/login` i `/api/session` z `auth.ts` nie są
automatycznie tworzone przez JSON Server. Serwis auth powinien korzystać z zasobów
`users` i `sessions`.

### Dashboard

Pobierz równolegle użytkownika, konto, kartę, budżet i transakcje przy pomocy
`Promise.all`. Ostatnie transakcje, sumę wydatków oraz wydatki według kategorii
obliczaj po stronie frontendu.

### Przelew

1. Wyślij `POST /api/transfers` ze statusem `pending`.
2. Wyślij `POST /api/transactions`.
3. Zaktualizuj saldo przez `PATCH /api/accounts/account-1`.
4. Zmień przelew na `completed` przez `PATCH /api/transfers/:id`.
5. Opcjonalnie zaktualizuj `lastUsedAt` odbiorcy.

To kilka niezależnych requestów i JSON Server nie zapewnia transakcji bazodanowej.
W projekcie edukacyjnym jest to dobre ćwiczenie obsługi częściowego błędu, ale nie
jest to poprawny sposób realizacji prawdziwych operacji bankowych.

### Ustawienia karty

Do przełączników i limitów użyj `PATCH /api/cards/card-1`, wysyłając tylko zmienione
pole, na przykład:

```json
{
  "dailySpendingLimit": 2000
}
```

### Request payment

Utwórz rekord przez `POST /api/paymentRequests`. Później zmieniaj jego `status`
na `paid`, `declined` albo `cancelled` za pomocą `PATCH`.

## Reset danych

JSON Server zapisuje zmiany bezpośrednio w `server/db.json`. Jeżeli chcesz łatwo
resetować dane, zachowaj kopię początkową pliku przed rozpoczęciem ćwiczeń.

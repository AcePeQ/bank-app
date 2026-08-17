export const NAME_REGEX = /^[\p{L}\p{M}]+(?:[ '-][\p{L}\p{M}]+)*$/u;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const PHONE_REGEX = /^\+?[1-9]\d{7,14}$/;

export const LOWERCASE_REGEX = /[a-z]/;
export const UPPERCASE_REGEX = /[A-Z]/;
export const DIGIT_REGEX = /\d/;
export const SPECIAL_CHARACTER_REGEX = /[^A-Za-z0-9\s]/;
export const WHITESPACE_REGEX = /\s/;

export const ROUTES = {
  login: "/",
  register: "/register/",
  dashboard: "/dashboard/",
  card: "/card/",
  transfers: "/transfers/",
  bankTransfer: "/transfers/bank-transfer/",
  payFriend: "/transfers/pay-a-friend/",
  requestPayment: "/transfers/request-payment/",
  transactions: "/transfers/transactions/",
  settings: "/settings/"
} as const

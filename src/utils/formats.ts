export function formatDate(
  value: string | number | Date,
  options: Intl.DateTimeFormatOptions = {},
  locale?: string,
) {
  return new Intl.DateTimeFormat(locale, options).format(new Date(value));
}

export function getCurrentDate() {
  return formatDate(new Date(), {
    weekday: "long",
    day: "2-digit",
    month: "short",
  });
}

export function formatCurrency(value: number, currency: string, locale?: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
}

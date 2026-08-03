export function getCurrentDate() {
  const date = new Date();
  return date.toLocaleString(undefined, { weekday: "long", day: "2-digit", month: "short" });
}

export function getFormatCurrency(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
}
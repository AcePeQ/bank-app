export type LimitDialogPrefix = "dailySpendingLimit" | "singlePaymentLimit";

export type LimitDialogElements = {
  openButtonEl: HTMLButtonElement;
  valueEl: HTMLSpanElement;
  dialogEl: HTMLDialogElement;
  formEl: HTMLFormElement;
  inputEl: HTMLInputElement;
  errorEl: HTMLParagraphElement;
  cancelButtonEl: HTMLButtonElement;
};
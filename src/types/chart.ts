export type ChartData = {
  month: string;
  spent: number;
  budget: number;
  categories: SpendingCategory[];
}

export type SpendingCategory = {
  category: string;
  amount: number;
}
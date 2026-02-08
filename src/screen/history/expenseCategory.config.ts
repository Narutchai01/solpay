export const EXPENSE_CATEGORY_CONFIG = {
  "Food/Drink": {
    color: "violet",
    icon: "food",
  },
  Shopping: {
    color: "coral",
    icon: "shopping",
  },
  Invest: {
    color: "cyan",
    icon: "chart-line",
  },
  Others: {
    color: "amber",
    icon: "dots-horizontal-circle-outline",
  },
} as const;

export type ExpenseCategory = keyof typeof EXPENSE_CATEGORY_CONFIG;

import type { Category, Transaction } from "@/generated/prisma/client";

export type TransactionWithCategory = Transaction & { category: Category };

export type CategoryBreakdown = {
  categoryId: string;
  name: string;
  color: string;
  total: number;
};

export type MonthlyBreakdown = {
  month: string;
  income: number;
  expense: number;
};

export type Stats = {
  totals: { income: number; expense: number; balance: number };
  byCategory: CategoryBreakdown[];
  byMonth: MonthlyBreakdown[];
};

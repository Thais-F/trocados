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
  categories: CategoryBreakdown[];
};

export type Stats = {
  byMonth: MonthlyBreakdown[];
};

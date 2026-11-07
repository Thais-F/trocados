import type { Category, Transaction } from "@/generated/prisma/client";

export type TransactionWithCategory = Transaction & { category: Category };

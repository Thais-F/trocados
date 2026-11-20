"use client";

import type { TransactionWithCategory } from "@/lib/types";
import { useFetchList } from "@/lib/useFetchList";
import { TransactionForm } from "./TransactionForm";
import { TransactionList } from "./TransactionList";
import { IndicatorCards } from "./IndicatorCards";
import { ErrorRetry, LoadingSkeleton } from "./StateCard";

export function TransactionsPanel() {
  const {
    data: transactions,
    loading,
    error,
    reload,
  } = useFetchList<TransactionWithCategory>("/api/transactions", "transactions");

  const income = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const expense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const balance = income - expense;

  return (
    <div className="flex w-full flex-col gap-6">
      <IndicatorCards income={income} expense={expense} balance={balance} />

      <TransactionForm onSaved={reload} />

      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorRetry message={error} onRetry={reload} />
      ) : (
        <TransactionList transactions={transactions} onChanged={reload} />
      )}
    </div>
  );
}

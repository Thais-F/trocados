"use client";

import { useState } from "react";
import type { TransactionWithCategory } from "@/lib/types";
import { useFetchList } from "@/lib/useFetchList";
import { TransactionForm } from "./TransactionForm";
import { TransactionList } from "./TransactionList";
import { IndicatorCards } from "./IndicatorCards";
import { MonthNavigator } from "./MonthNavigator";
import { ErrorRetry, LoadingSkeleton } from "./StateCard";

export function TransactionsPanel() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const {
    data: transactions,
    loading,
    error,
    reload,
  } = useFetchList<TransactionWithCategory>(
    `/api/transactions?year=${year}&month=${month}`,
    "transactions"
  );

  function goToPrevMonth() {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
  }

  function goToNextMonth() {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  }

  const income = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const expense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const balance = income - expense;

  return (
    <div className="flex w-full flex-col gap-6">
      <MonthNavigator year={year} month={month} onPrev={goToPrevMonth} onNext={goToNextMonth} />

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

"use client";

import { useCallback, useEffect, useState } from "react";
import type { Transaction } from "@/generated/prisma/client";
import { TransactionForm } from "./TransactionForm";
import { TransactionList } from "./TransactionList";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function TransactionsPanel() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch("/api/transactions");
    if (res.ok) {
      const data = await res.json();
      setTransactions(data.transactions);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const income = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const expense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const balance = income - expense;

  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded border border-zinc-200 p-3 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">Receitas</p>
          <p className="font-semibold text-green-600">{currency.format(income)}</p>
        </div>
        <div className="rounded border border-zinc-200 p-3 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">Despesas</p>
          <p className="font-semibold text-red-600">{currency.format(expense)}</p>
        </div>
        <div className="rounded border border-zinc-200 p-3 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">Saldo</p>
          <p
            className={`font-semibold ${
              balance >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {currency.format(balance)}
          </p>
        </div>
      </div>

      <TransactionForm onSaved={load} />

      {loading ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Carregando...</p>
      ) : (
        <TransactionList transactions={transactions} onChanged={load} />
      )}
    </div>
  );
}

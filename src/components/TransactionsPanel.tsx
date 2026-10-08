"use client";

import { useCallback, useEffect, useState } from "react";
import type { Transaction } from "@/generated/prisma/client";
import { TransactionForm } from "./TransactionForm";
import { TransactionList } from "./TransactionList";
import { ArrowDownIcon, ArrowUpIcon, WalletIcon } from "./icons";

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
    <div className="flex w-full flex-col gap-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-success/15 text-success">
            <ArrowUpIcon className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs text-muted">Receitas</p>
            <p className="font-semibold text-success">{currency.format(income)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-danger/15 text-danger">
            <ArrowDownIcon className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs text-muted">Despesas</p>
            <p className="font-semibold text-danger">{currency.format(expense)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <WalletIcon className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs text-muted">Saldo</p>
            <p
              className={`font-semibold ${balance >= 0 ? "text-success" : "text-danger"}`}
            >
              {currency.format(balance)}
            </p>
          </div>
        </div>
      </div>

      <TransactionForm onSaved={load} />

      {loading ? (
        <p className="text-sm text-muted">Carregando...</p>
      ) : (
        <TransactionList transactions={transactions} onChanged={load} />
      )}
    </div>
  );
}

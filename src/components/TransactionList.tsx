"use client";

import { useState } from "react";
import type { Transaction } from "@/generated/prisma/client";
import { TransactionForm } from "./TransactionForm";

type Props = {
  transactions: Transaction[];
  onChanged: () => void;
};

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateFormat = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" });

export function TransactionList({ transactions, onChanged }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Excluir esta transação?")) return;

    setDeletingId(id);
    const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    setDeletingId(null);

    if (res.ok) onChanged();
  }

  if (transactions.length === 0) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Nenhuma transação cadastrada ainda.
      </p>
    );
  }

  return (
    <ul className="flex w-full flex-col gap-2">
      {transactions.map((t) => (
        <li
          key={t.id}
          className="rounded border border-zinc-200 p-3 dark:border-zinc-800"
        >
          {editingId === t.id ? (
            <TransactionForm
              transaction={t}
              onSaved={() => {
                setEditingId(null);
                onChanged();
              }}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="font-medium">{t.category}</span>
                {t.description && (
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {t.description}
                  </span>
                )}
                <span className="text-xs text-zinc-500">
                  {dateFormat.format(new Date(t.date))}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`font-semibold ${
                    t.type === "INCOME" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {t.type === "INCOME" ? "+" : "-"}
                  {currency.format(Number(t.amount))}
                </span>
                <button
                  onClick={() => setEditingId(t.id)}
                  className="text-sm font-medium underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  disabled={deletingId === t.id}
                  className="text-sm font-medium text-red-600 underline disabled:opacity-50"
                >
                  {deletingId === t.id ? "Excluindo..." : "Excluir"}
                </button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

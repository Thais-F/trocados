"use client";

import { useState } from "react";
import type { Transaction } from "@/generated/prisma/client";
import { TransactionForm } from "./TransactionForm";
import { ArrowDownIcon, ArrowUpIcon, PencilIcon, TrashIcon } from "./icons";

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
      <p className="rounded-2xl border border-dashed border-border px-5 py-8 text-center text-sm text-muted">
        Nenhuma transação cadastrada ainda.
      </p>
    );
  }

  return (
    <ul className="flex w-full flex-col gap-2">
      {transactions.map((t) => (
        <li
          key={t.id}
          className="rounded-2xl border border-border bg-surface p-4"
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
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    t.type === "INCOME"
                      ? "bg-success/15 text-success"
                      : "bg-danger/15 text-danger"
                  }`}
                >
                  {t.type === "INCOME" ? (
                    <ArrowUpIcon className="h-4 w-4" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4" />
                  )}
                </span>
                <div className="flex flex-col">
                  <span className="font-medium">{t.category}</span>
                  {t.description && (
                    <span className="text-sm text-muted">{t.description}</span>
                  )}
                  <span className="text-xs text-muted/80">
                    {dateFormat.format(new Date(t.date))}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span
                  className={`mr-1 font-semibold ${
                    t.type === "INCOME" ? "text-success" : "text-danger"
                  }`}
                >
                  {t.type === "INCOME" ? "+" : "-"}
                  {currency.format(Number(t.amount))}
                </span>
                <button
                  onClick={() => setEditingId(t.id)}
                  aria-label="Editar"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-surface-hover hover:text-foreground"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  disabled={deletingId === t.id}
                  aria-label="Excluir"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-danger/15 hover:text-danger disabled:opacity-50"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

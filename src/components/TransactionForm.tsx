"use client";

import { useState } from "react";
import type { Transaction } from "@/generated/prisma/client";

type Props = {
  transaction?: Transaction;
  onSaved: () => void;
  onCancel?: () => void;
};

function toDateInputValue(date: Date | string) {
  return new Date(date).toISOString().slice(0, 10);
}

export function TransactionForm({ transaction, onSaved, onCancel }: Props) {
  const isEditing = !!transaction;
  const [type, setType] = useState<"INCOME" | "EXPENSE">(
    transaction?.type ?? "EXPENSE"
  );
  const [amount, setAmount] = useState(
    transaction ? String(transaction.amount) : ""
  );
  const [category, setCategory] = useState(transaction?.category ?? "");
  const [description, setDescription] = useState(
    transaction?.description ?? ""
  );
  const [date, setDate] = useState(
    transaction ? toDateInputValue(transaction.date) : toDateInputValue(new Date())
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const url = isEditing
      ? `/api/transactions/${transaction!.id}`
      : "/api/transactions";
    const method = isEditing ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, amount, category, description, date }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Erro ao salvar.");
      return;
    }

    if (!isEditing) {
      setAmount("");
      setCategory("");
      setDescription("");
    }

    onSaved();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-3 rounded border border-zinc-300 p-4 dark:border-zinc-700"
    >
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setType("EXPENSE")}
          className={`flex-1 rounded px-3 py-2 text-sm font-medium ${
            type === "EXPENSE"
              ? "bg-red-600 text-white"
              : "bg-zinc-100 dark:bg-zinc-800"
          }`}
        >
          Despesa
        </button>
        <button
          type="button"
          onClick={() => setType("INCOME")}
          className={`flex-1 rounded px-3 py-2 text-sm font-medium ${
            type === "INCOME"
              ? "bg-green-600 text-white"
              : "bg-zinc-100 dark:bg-zinc-800"
          }`}
        >
          Receita
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="amount" className="text-sm font-medium">
            Valor
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="date" className="text-sm font-medium">
            Data
          </label>
          <input
            id="date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="category" className="text-sm font-medium">
          Categoria
        </label>
        <input
          id="category"
          type="text"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Mercado, transporte, salário..."
          className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium">
          Descrição (opcional)
        </label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded bg-zinc-900 px-4 py-2 font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-900"
        >
          {loading ? "Salvando..." : isEditing ? "Salvar alterações" : "Adicionar"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-zinc-300 px-4 py-2 font-medium dark:border-zinc-700"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

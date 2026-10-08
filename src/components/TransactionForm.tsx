"use client";

import { useState } from "react";
import type { Transaction } from "@/generated/prisma/client";

type Props = {
  transaction?: Transaction;
  onSaved: () => void;
  onCancel?: () => void;
};

const inputClass =
  "rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25";

const labelClass = "text-sm font-medium text-foreground/90";

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
      className="flex w-full flex-col gap-4 rounded-2xl border border-border bg-surface p-5"
    >
      <div className="flex gap-2 rounded-lg bg-background/60 p-1">
        <button
          type="button"
          onClick={() => setType("EXPENSE")}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${
            type === "EXPENSE"
              ? "bg-danger text-white shadow-sm"
              : "text-muted hover:text-foreground"
          }`}
        >
          Despesa
        </button>
        <button
          type="button"
          onClick={() => setType("INCOME")}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${
            type === "INCOME"
              ? "bg-success text-white shadow-sm"
              : "text-muted hover:text-foreground"
          }`}
        >
          Receita
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="amount" className={labelClass}>
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
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="date" className={labelClass}>
            Data
          </label>
          <input
            id="date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="category" className={labelClass}>
          Categoria
        </label>
        <input
          id="category"
          type="text"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Mercado, transporte, salário..."
          className={`${inputClass} placeholder:text-muted/60`}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className={labelClass}>
          Descrição (opcional)
        </label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
        />
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Salvando..." : isEditing ? "Salvar alterações" : "Adicionar"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground/90 transition hover:bg-surface-hover"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

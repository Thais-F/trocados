"use client";

import { useState } from "react";
import type { Category } from "@/generated/prisma/client";
import { CategoryForm } from "./CategoryForm";
import { PencilIcon, TrashIcon } from "./icons";

type Props = {
  categories: Category[];
  onChanged: () => void;
};

export function CategoryList({ categories, onChanged }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Excluir esta categoria?")) return;

    setError(null);
    setDeletingId(id);
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    setDeletingId(null);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Erro ao excluir.");
      return;
    }

    onChanged();
  }

  if (categories.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border px-5 py-8 text-center text-sm text-muted">
        Nenhuma categoria cadastrada ainda.
      </p>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2">
      {error && <p className="text-sm text-danger">{error}</p>}
      <ul className="flex w-full flex-col gap-2">
        {categories.map((c) => (
          <li key={c.id} className="rounded-2xl border border-border bg-surface p-4">
            {editingId === c.id ? (
              <CategoryForm
                category={c}
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
                    className="h-4 w-4 shrink-0 rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                  <span className="font-medium">{c.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingId(c.id)}
                    aria-label="Editar"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-surface-hover hover:text-foreground"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    disabled={deletingId === c.id}
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
    </div>
  );
}

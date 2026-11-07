"use client";

import { useState } from "react";
import type { Category } from "@/generated/prisma/client";
import { CATEGORY_COLORS } from "@/lib/colors";
import { ColorSwatchPicker } from "./ColorSwatchPicker";

type Props = {
  category?: Category;
  onSaved: () => void;
  onCancel?: () => void;
};

const inputClass =
  "rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25";

export function CategoryForm({ category, onSaved, onCancel }: Props) {
  const isEditing = !!category;
  const [name, setName] = useState(category?.name ?? "");
  const [color, setColor] = useState<string>(category?.color ?? CATEGORY_COLORS[0]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const url = isEditing ? `/api/categories/${category!.id}` : "/api/categories";
    const method = isEditing ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, color }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Erro ao salvar.");
      return;
    }

    if (!isEditing) {
      setName("");
      setColor(CATEGORY_COLORS[0]);
    }

    onSaved();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-4 rounded-2xl border border-border bg-surface p-5"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="category-name" className="text-sm font-medium text-foreground/90">
          Nome
        </label>
        <input
          id="category-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Assinaturas, saúde, educação..."
          className={`${inputClass} placeholder:text-muted/60`}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground/90">Cor</span>
        <ColorSwatchPicker value={color} onChange={setColor} />
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Salvando..." : isEditing ? "Salvar alterações" : "Adicionar categoria"}
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

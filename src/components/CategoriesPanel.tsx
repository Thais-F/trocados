"use client";

import { useCallback, useEffect, useState } from "react";
import type { Category } from "@/generated/prisma/client";
import { CategoryForm } from "./CategoryForm";
import { CategoryList } from "./CategoryList";

export function CategoriesPanel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch("/api/categories");
    if (res.ok) {
      const data = await res.json();
      setCategories(data.categories);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="flex w-full flex-col gap-6">
      <CategoryForm onSaved={load} />

      {loading ? (
        <p className="text-sm text-muted">Carregando...</p>
      ) : (
        <CategoryList categories={categories} onChanged={load} />
      )}
    </div>
  );
}

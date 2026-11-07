"use client";

import type { Category } from "@/generated/prisma/client";
import { useFetchList } from "@/lib/useFetchList";
import { CategoryForm } from "./CategoryForm";
import { CategoryList } from "./CategoryList";
import { ErrorRetry, LoadingSkeleton } from "./StateCard";

export function CategoriesPanel() {
  const { data: categories, loading, error, reload } = useFetchList<Category>(
    "/api/categories",
    "categories"
  );

  return (
    <div className="flex w-full flex-col gap-6">
      <CategoryForm onSaved={reload} />

      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorRetry message={error} onRetry={reload} />
      ) : (
        <CategoryList categories={categories} onChanged={reload} />
      )}
    </div>
  );
}

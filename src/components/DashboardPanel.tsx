"use client";

import type { Stats } from "@/lib/types";
import { useFetchOne } from "@/lib/useFetchOne";
import { IndicatorCards } from "./IndicatorCards";
import { CategoryPieChart } from "./CategoryPieChart";
import { MonthlyBarChart } from "./MonthlyBarChart";
import { ErrorRetry, LoadingSkeleton } from "./StateCard";

export function DashboardPanel() {
  const { data: stats, loading, error, reload } = useFetchOne<Stats>("/api/stats", "stats");

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !stats) {
    return <ErrorRetry message={error ?? "Não foi possível carregar."} onRetry={reload} />;
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <IndicatorCards {...stats.totals} />

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground/90">Despesas por categoria</h2>
        <CategoryPieChart data={stats.byCategory} />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground/90">
          Receitas x despesas (últimos 6 meses)
        </h2>
        <MonthlyBarChart data={stats.byMonth} />
      </div>
    </div>
  );
}

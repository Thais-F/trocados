"use client";

import { useState } from "react";
import type { Stats } from "@/lib/types";
import { useFetchOne } from "@/lib/useFetchOne";
import { IndicatorCards } from "./IndicatorCards";
import { CategoryPieChart } from "./CategoryPieChart";
import { MonthlyBarChart } from "./MonthlyBarChart";
import { ErrorRetry, LoadingSkeleton } from "./StateCard";

export function DashboardPanel() {
  const { data: stats, loading, error, reload } = useFetchOne<Stats>("/api/stats", "stats");
  const [selectedMonth, setSelectedMonth] = useState(5);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !stats) {
    return <ErrorRetry message={error ?? "Não foi possível carregar."} onRetry={reload} />;
  }

  const month = stats.byMonth[selectedMonth] ?? stats.byMonth[stats.byMonth.length - 1];

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex gap-1 rounded-lg border border-border bg-surface p-1">
        {stats.byMonth.map((m, i) => (
          <button
            key={`${m.month}-${i}`}
            type="button"
            onClick={() => setSelectedMonth(i)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize transition ${
              i === selectedMonth
                ? "bg-primary text-white"
                : "text-muted hover:text-foreground"
            }`}
          >
            {m.month}
          </button>
        ))}
      </div>

      <IndicatorCards
        income={month.income}
        expense={month.expense}
        balance={month.income - month.expense}
      />

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground/90">Despesas por categoria</h2>
        <CategoryPieChart data={month.categories} />
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

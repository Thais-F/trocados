import type { MonthlyBreakdown } from "@/lib/types";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

export function MonthlyBarChart({ data }: { data: MonthlyBreakdown[] }) {
  const max = Math.max(1, ...data.flatMap((m) => [m.income, m.expense]));

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-success" /> Receitas
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-danger" /> Despesas
        </span>
      </div>
      <div className="flex h-36 items-end justify-between gap-2">
        {data.map((m) => (
          <div key={m.month} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex h-32 w-full items-end justify-center gap-1">
              <div
                className="w-2.5 rounded-t-sm bg-success"
                style={{ height: `${(m.income / max) * 100}%` }}
                title={currency.format(m.income)}
              />
              <div
                className="w-2.5 rounded-t-sm bg-danger"
                style={{ height: `${(m.expense / max) * 100}%` }}
                title={currency.format(m.expense)}
              />
            </div>
            <span className="text-xs capitalize text-muted">{m.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

import type { CategoryBreakdown } from "@/lib/types";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function CategoryPieChart({ data }: { data: CategoryBreakdown[] }) {
  const total = data.reduce((sum, c) => sum + c.total, 0);

  if (total === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border px-5 py-8 text-center text-sm text-muted">
        Nenhuma despesa registrada ainda.
      </p>
    );
  }

  const stops = data.reduce<{ cumulative: number; parts: string[] }>(
    (acc, c) => {
      const start = (acc.cumulative / total) * 360;
      const cumulative = acc.cumulative + c.total;
      const end = (cumulative / total) * 360;
      return { cumulative, parts: [...acc.parts, `${c.color} ${start}deg ${end}deg`] };
    },
    { cumulative: 0, parts: [] }
  ).parts;

  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-surface p-5 sm:flex-row">
      <div
        className="relative h-40 w-40 shrink-0 rounded-full"
        style={{ background: `conic-gradient(${stops.join(", ")})` }}
      >
        <div className="absolute inset-[18%] flex flex-col items-center justify-center rounded-full bg-surface">
          <span className="text-xs text-muted">Total</span>
          <span className="text-sm font-semibold">{currency.format(total)}</span>
        </div>
      </div>
      <ul className="flex w-full flex-col gap-2">
        {data.map((c) => (
          <li key={c.categoryId} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: c.color }}
              />
              {c.name}
            </span>
            <span className="text-muted">
              {currency.format(c.total)} · {Math.round((c.total / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { Stats } from "@/lib/types";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    include: { category: true },
  });

  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      key: `${d.getFullYear()}-${d.getMonth()}`,
      month: d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", ""),
      income: 0,
      expense: 0,
    };
  });

  let income = 0;
  let expense = 0;
  const categoryTotals = new Map<string, { name: string; color: string; total: number }>();

  for (const t of transactions) {
    const amount = Number(t.amount);

    if (t.type === "INCOME") {
      income += amount;
    } else {
      expense += amount;
      const current = categoryTotals.get(t.categoryId) ?? {
        name: t.category.name,
        color: t.category.color,
        total: 0,
      };
      current.total += amount;
      categoryTotals.set(t.categoryId, current);
    }

    const date = new Date(t.date);
    const month = months.find((m) => m.key === `${date.getFullYear()}-${date.getMonth()}`);
    if (month) {
      if (t.type === "INCOME") month.income += amount;
      else month.expense += amount;
    }
  }

  const byCategory = Array.from(categoryTotals.entries())
    .map(([categoryId, v]) => ({ categoryId, ...v }))
    .sort((a, b) => b.total - a.total);

  const stats: Stats = {
    totals: { income, expense, balance: income - expense },
    byCategory,
    byMonth: months.map(({ month, income, expense }) => ({ month, income, expense })),
  };

  return NextResponse.json({ stats });
}

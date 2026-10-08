import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { transactionSchema } from "@/lib/validation";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
  });

  return NextResponse.json({ transactions });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await req.json();
  const parsed = transactionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { type, amount, category, description, date } = parsed.data;

  const transaction = await prisma.transaction.create({
    data: {
      userId: session.user.id,
      type,
      amount,
      category,
      description: description || null,
      date,
    },
  });

  return NextResponse.json({ transaction }, { status: 201 });
}

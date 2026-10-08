import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { transactionSchema } from "@/lib/validation";

async function getOwnedTransaction(id: string, userId: string) {
  const transaction = await prisma.transaction.findUnique({ where: { id } });
  if (!transaction || transaction.userId !== userId) return null;
  return transaction;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getOwnedTransaction(id, session.user.id);
  if (!existing) {
    return NextResponse.json({ error: "Não encontrado." }, { status: 404 });
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

  const transaction = await prisma.transaction.update({
    where: { id },
    data: { type, amount, category, description: description || null, date },
  });

  return NextResponse.json({ transaction });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getOwnedTransaction(id, session.user.id);
  if (!existing) {
    return NextResponse.json({ error: "Não encontrado." }, { status: 404 });
  }

  await prisma.transaction.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}

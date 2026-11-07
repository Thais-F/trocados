import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validation";

async function getOwnedCategory(id: string, userId: string) {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category || category.userId !== userId) return null;
  return category;
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
  const existing = await getOwnedCategory(id, session.user.id);
  if (!existing) {
    return NextResponse.json({ error: "Não encontrado." }, { status: 404 });
  }

  const body = await req.json();
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { name, color } = parsed.data;

  const nameTaken = await prisma.category.findUnique({
    where: { userId_name: { userId: session.user.id, name } },
  });
  if (nameTaken && nameTaken.id !== id) {
    return NextResponse.json(
      { error: "Você já tem uma categoria com esse nome." },
      { status: 409 }
    );
  }

  const category = await prisma.category.update({
    where: { id },
    data: { name, color },
  });

  return NextResponse.json({ category });
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
  const existing = await getOwnedCategory(id, session.user.id);
  if (!existing) {
    return NextResponse.json({ error: "Não encontrado." }, { status: 404 });
  }

  const inUse = await prisma.transaction.count({ where: { categoryId: id } });
  if (inUse > 0) {
    return NextResponse.json(
      {
        error: `Essa categoria tem ${inUse} transação(ões) vinculada(s). Exclua ou reclassifique-as antes.`,
      },
      { status: 409 }
    );
  }

  await prisma.category.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}

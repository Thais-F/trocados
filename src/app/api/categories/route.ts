import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validation";
import { isForeignKeyError } from "@/lib/prisma-errors";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const categories = await prisma.category.findMany({
    where: { userId: session.user.id },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ categories });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
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

  const existing = await prisma.category.findUnique({
    where: { userId_name: { userId: session.user.id, name } },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Você já tem uma categoria com esse nome." },
      { status: 409 }
    );
  }

  try {
    const category = await prisma.category.create({
      data: { userId: session.user.id, name, color },
    });
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    if (isForeignKeyError(error)) {
      return NextResponse.json(
        { error: "Sessão inválida. Faça login novamente." },
        { status: 401 }
      );
    }
    throw error;
  }
}

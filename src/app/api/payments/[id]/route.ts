import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const payment = await prisma.payment.findUnique({ where: { id: params.id } });
  if (!payment) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });

  return NextResponse.json(payment);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await req.json();
  const { name, age, value, paidTo } = body;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof age !== "number" ||
    age < 0 ||
    typeof value !== "number" ||
    value < 0 ||
    (paidTo !== "FRANCISCA" && paidTo !== "EDVALDO")
  ) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const payment = await prisma.payment.update({
    where: { id: params.id },
    data: { name: name.trim(), age, value, paidTo },
  });

  return NextResponse.json(payment);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  await prisma.payment.delete({ where: { id: params.id } });

  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(payments);
}

export async function POST(req: Request) {
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

  const payment = await prisma.payment.create({
    data: { name: name.trim(), age, value, paidTo },
  });

  return NextResponse.json(payment, { status: 201 });
}

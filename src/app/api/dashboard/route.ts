import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateMuseumCost } from "@/lib/museum";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const payments = await prisma.payment.findMany();

  const count0to11 = payments.filter((p) => p.age <= 11).length;
  const count12plus = payments.filter((p) => p.age >= 12).length;

  const totalArrecadado = payments.reduce((sum, p) => sum + Number(p.value), 0);
  const totalFrancisca = payments
    .filter((p) => p.paidTo === "FRANCISCA")
    .reduce((sum, p) => sum + Number(p.value), 0);
  const totalEdvaldo = payments
    .filter((p) => p.paidTo === "EDVALDO")
    .reduce((sum, p) => sum + Number(p.value), 0);

  const museu = calculateMuseumCost(count0to11, count12plus);

  return NextResponse.json({
    totalInscritos: payments.length,
    count0to11,
    count12plus,
    totalArrecadado,
    totalFrancisca,
    totalEdvaldo,
    museu,
  });
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { calculateMuseumCost } from "@/lib/museum";
import Nav from "../nav";
import dynamic from "next/dynamic";

const PieChart = dynamic(() => import("@/components/PieChart"), { ssr: false });

function kz(value: number) {
  return new Intl.NumberFormat("pt-AO", { minimumFractionDigits: 2 }).format(value) + " Kz";
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

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

  return (
    <div className="container">
      <Nav />
      <h1 style={{ marginTop: 0 }}>Dashboard</h1>

      <div className="grid">
        <div className="card">
          <h3>Total de inscritos</h3>
          <div className="value">{payments.length}</div>
        </div>
        <div className="card">
          <h3>Crianças 0–11 anos</h3>
          <div className="value">{count0to11}</div>
        </div>
        <div className="card">
          <h3>12 anos ou mais</h3>
          <div className="value">{count12plus}</div>
        </div>
        <div className="card">
          <h3>Total arrecadado</h3>
          <div className="value">{kz(totalArrecadado)}</div>
        </div>
      </div>

      <div className="grid" style={{ marginTop: 4 }}>
        <div className="card">
          <h3>Recebido pela Francisca</h3>
          <div className="value">{kz(totalFrancisca)}</div>
        </div>
        <div className="card">
          <h3>Recebido pelo Edvaldo</h3>
          <div className="value">{kz(totalEdvaldo)}</div>
        </div>
      </div>

      <h2>Valor a pagar ao museu</h2>
      <div className="grid">
        <div className="card">
          <h3>0–11 anos ({museu.count0to11} crianças, {museu.blocks0to11} bloco{museu.blocks0to11 === 1 ? "" : "s"} de 25)</h3>
          <div className="value">{kz(museu.cost0to11)}</div>
        </div>
        <div className="card">
          <h3>12+ anos ({museu.count12plus} pessoas × 265 Kz)</h3>
          <div className="value">{kz(museu.cost12plus)}</div>
        </div>
        <div className="card">
          <h3>Total a pagar ao museu</h3>
          <div className="value">{kz(museu.total)}</div>
        </div>
      </div>
      
      <h2 style={{ marginTop: 20 }}>Arrecadações por responsável</h2>
      <div className="card" style={{ marginTop: 8, textAlign: "center" }}>
        <PieChart labels={["Francisca", "Edvaldo"]} data={[totalFrancisca, totalEdvaldo]} />
        <div style={{ marginTop: 8, color: "#4a1f57", fontWeight: 700 }}>
          {kz(totalFrancisca + totalEdvaldo)} arrecadado
        </div>
      </div>
    </div>
  );
}

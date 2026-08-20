"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "../nav";

type Payment = {
  id: string;
  name: string;
  age: number;
  value: string;
  paidTo: "FRANCISCA" | "EDVALDO";
  createdAt: string;
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/payments");
    const data = await res.json();
    setPayments(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Apagar este pagamento?")) return;
    await fetch(`/api/payments/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="container">
      <Nav />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Pagamentos</h1>
        <Link className="btn" href="/payments/new">
          + Novo pagamento
        </Link>
      </div>

      {loading ? (
        <p>A carregar...</p>
      ) : (
        <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Idade</th>
              <th>Valor</th>
              <th>Pago a</th>
              <th>Data</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.age}</td>
                <td>{Number(p.value).toLocaleString("pt-AO")} Kz</td>
                <td>
                    <span className={p.paidTo === "FRANCISCA" ? "badge badge-francisca" : "badge badge-edvaldo"}>
                      {p.paidTo === "FRANCISCA" ? "Francisca" : "Edvaldo"}
                    </span>
                </td>
                <td>{new Date(p.createdAt).toLocaleDateString("pt-AO")}</td>
                <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Link href={`/payments/${p.id}/edit`} className="btn">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="#fff" opacity="0.9"/></svg>
                        Editar
                      </Link>
                      <button className="btn btn-secondary" onClick={() => handleDelete(p.id)}>
                        Apagar
                      </button>
                    </div>
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan={6}>Nenhum pagamento registado ainda.</td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
}

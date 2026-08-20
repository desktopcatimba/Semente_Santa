"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

type Payment = { id: string; name: string; age: number; value: number; paidTo: string };

export default function EditPayment({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/payments/${id}`)
      .then((r) => r.json())
      .then((data) => setPayment(data))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave(e: any) {
    e.preventDefault();
    if (!payment) return;
    setSaving(true);
    const res = await fetch(`/api/payments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: payment.name, age: Number(payment.age), value: Number(payment.value), paidTo: payment.paidTo }),
    });
    setSaving(false);
    if (res.ok) router.push("/payments");
    else alert("Erro ao salvar");
  }

  if (loading) return <div className="container"><p>A carregar...</p></div>;
  if (!payment) return <div className="container"><p>Pagamento não encontrado.</p></div>;

  return (
    <div className="container">
      <Link href="/payments" className="btn btn-secondary">← Voltar</Link>
      <h1>Editar pagamento</h1>
      <div className="form-panel card">
      <form onSubmit={handleSave} style={{ marginTop: 12 }}>
        <label>
          Nome
          <input value={payment.name} onChange={(e) => setPayment({ ...payment, name: e.target.value })} />
        </label>
        <label>
          Idade
          <input type="number" value={payment.age} onChange={(e) => setPayment({ ...payment, age: Number(e.target.value) })} />
        </label>
        <label>
          Valor
          <input type="number" value={payment.value} onChange={(e) => setPayment({ ...payment, value: Number(e.target.value) })} />
        </label>
        <label>
          Pago a
          <select value={payment.paidTo} onChange={(e) => setPayment({ ...payment, paidTo: e.target.value })}>
            <option value="FRANCISCA">Francisca</option>
            <option value="EDVALDO">Edvaldo</option>
          </select>
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn" type="submit" disabled={saving}>{saving ? "A gravar..." : "Gravar"}</button>
          <Link href="/payments" className="btn btn-secondary">Cancelar</Link>
        </div>
      </form>
      </div>
    </div>
  );
}

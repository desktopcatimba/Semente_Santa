"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../../nav";

export default function NewPaymentPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [value, setValue] = useState("");
  const [paidTo, setPaidTo] = useState<"FRANCISCA" | "EDVALDO">("FRANCISCA");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        age: Number(age),
        value: Number(value),
        paidTo,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Não foi possível guardar. Verifica os dados.");
      return;
    }

    router.push("/payments");
    router.refresh();
  }

  return (
    <div className="container">
      <Nav />
      <h1>Novo pagamento</h1>
      <div className="form-panel card">
      <form onSubmit={handleSubmit}>
        <label>
          Nome completo
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Idade
          <input
            type="number"
            min={0}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </label>
        <label>
          Valor (Kz)
          <input
            type="number"
            min={0}
            step="0.01"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
        </label>
        <label>
          Pago a
          <select value={paidTo} onChange={(e) => setPaidTo(e.target.value as any)}>
            <option value="FRANCISCA">Francisca</option>
            <option value="EDVALDO">Edvaldo</option>
          </select>
        </label>
        {error && <div className="error">{error}</div>}
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "A guardar..." : "Guardar"}
        </button>
      </form>
      </div>
    </div>
  );
}

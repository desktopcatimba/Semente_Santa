"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Utilizador ou senha inválidos.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="login-page">
  <div className="login-background login-background-one" />
  <div className="login-background login-background-two" />

  <div className="login-container">
    <div className="login-logo">CR</div>

    <div className="login-card">
      <div className="login-header">
        <h1>Campanha do Retiro</h1>
        <p>Inicia sessão para continuar.</p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-form-group">
          <label htmlFor="username">
            Utilizador
          </label>

          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Digite o seu utilizador"
            required
          />
        </div>

        <div className="login-form-group">
          <label htmlFor="password">
            Senha
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite a sua senha"
            required
          />
        </div>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <button
          className="login-button"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="login-spinner" />
              A entrar...
            </>
          ) : (
            "Entrar"
          )}
        </button>
      </form>

      <p className="login-footer">
        © {new Date().getFullYear()} Campanha do Retiro
      </p>
    </div>
  </div>
</main>
  );
}
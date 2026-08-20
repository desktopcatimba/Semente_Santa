"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function Nav() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand">
          <Link href="/dashboard" className="logo">
            <strong>Retiro</strong>
          </Link>
        </div>

        <nav className="desktop-nav">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/payments">Pagamentos</Link>
          <Link href="/payments/new">Novo pagamento</Link>
        </nav>

        <div className="actions">
          <div className="user">{session?.user?.name ? `Olá, ${session.user.name}` : null}</div>
          <button className="btn btn-secondary" onClick={() => signOut({ callbackUrl: "/login" })}>
            Sair
          </button>
          <button
            aria-label="Abrir menu"
            onClick={() => setOpen(true)}
            className="btn mobile-menu-btn"
          >
            ☰
          </button>
        </div>
      </div>

      {open && (
        <div className="drawer-backdrop" role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
          <aside
            className="drawer"
            onClick={(e) => e.stopPropagation()}
            aria-label="Menu de navegação"
          >
            <button className="btn btn-secondary close-drawer" onClick={() => setOpen(false)}>
              ✕
            </button>
            <nav className="drawer-nav">
              <Link href="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
              <Link href="/payments" onClick={() => setOpen(false)}>Pagamentos</Link>
              <Link href="/payments/new" onClick={() => setOpen(false)}>Novo pagamento</Link>
            </nav>
            <div style={{ marginTop: 16 }}>
              <div style={{ marginBottom: 8 }}>{session?.user?.name}</div>
              <button className="btn" onClick={() => signOut({ callbackUrl: "/login" })}>
                Sair
              </button>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}

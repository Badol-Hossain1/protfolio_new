"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLogin({ showDefaultWarning }: { showDefaultWarning: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Login failed");
    } catch {
      setError("Network error — is the server running?");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-svh items-center justify-center px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-5 rounded-2xl border border-border bg-surface/70 p-8 backdrop-blur"
      >
        <div>
          <h1 className="text-xl font-bold">Admin panel</h1>
          <p className="mt-1 text-sm text-muted">Sign in to edit portfolio content.</p>
        </div>

        <label className="block space-y-2">
          <span className="font-mono text-xs uppercase tracking-widest text-muted">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoFocus
            required
            className="w-full rounded-lg border border-border bg-background/70 px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
          />
        </label>

        {error && (
          <p role="alert" className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        {showDefaultWarning && (
          <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-400">
            ADMIN_PASSWORD is not set — the default password is <code className="font-mono">admin123</code>.
            Set it in <code className="font-mono">.env.local</code> before deploying.
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-accent py-2.5 text-sm font-semibold text-background transition-opacity disabled:opacity-50"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>

        <a href="/" className="block text-center font-mono text-xs text-muted transition-colors hover:text-accent">
          ← back to site
        </a>
      </form>
    </main>
  );
}

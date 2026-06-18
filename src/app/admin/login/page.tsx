"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return; // guard against double-submit
    setError("");
    setLoading(true);

    const res = await signIn("credentials", { username, password, redirect: false });

    if (res?.error) {
      setError("Wrong username or password.");
      setLoading(false);
      return;
    }
    // Keep the button in its loading state through the redirect so it can't be
    // clicked again and the user sees continuous feedback.
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-cream px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-7 text-center">
          <div className="font-serif text-2xl font-semibold text-ink">
            Baker&apos;s Perk<span className="text-accent">.</span>
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-[3px] text-muted">Admin backoffice</div>
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl border border-line bg-paper p-6 shadow-sm">
          <label className="block">
            <span className="text-xs text-muted">Username</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoFocus
              autoCapitalize="none"
              autoComplete="username"
              className="mt-1.5 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none transition-colors focus:border-accent disabled:opacity-60"
            />
          </label>
          <label className="mt-4 block">
            <span className="text-xs text-muted">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
              className="mt-1.5 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none transition-colors focus:border-accent disabled:opacity-60"
            />
          </label>

          {error && <p className="mt-4 text-sm text-accent">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-sm font-medium text-on-ink transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
          >
            {loading && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-on-ink/30 border-t-on-ink" />
            )}
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

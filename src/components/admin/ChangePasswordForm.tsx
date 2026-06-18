"use client";

import { useActionState } from "react";
import { changePassword, type PasswordState } from "@/app/admin/actions";

const INPUT =
  "mt-1.5 w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent";

export default function ChangePasswordForm() {
  const [state, action, pending] = useActionState<PasswordState, FormData>(changePassword, {});

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="text-xs text-muted">Current password</span>
          <input name="current" type="password" autoComplete="current-password" className={INPUT} required />
        </label>
        <label className="block">
          <span className="text-xs text-muted">New password</span>
          <input name="next" type="password" autoComplete="new-password" className={INPUT} required />
        </label>
        <label className="block">
          <span className="text-xs text-muted">Confirm new password</span>
          <input name="confirm" type="password" autoComplete="new-password" className={INPUT} required />
        </label>
      </div>

      {state.error && <p className="text-sm text-accent">{state.error}</p>}
      {state.ok && <p className="text-sm text-wa">Password updated.</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-on-ink transition-transform hover:scale-[1.01] disabled:opacity-60"
      >
        {pending ? "Updating…" : "Change password"}
      </button>
    </form>
  );
}

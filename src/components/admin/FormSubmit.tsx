"use client";

import { createContext, useContext } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { ActionState } from "@/app/admin/actions";

const FormStateContext = createContext<ActionState>({});

export type FormAction = (prev: ActionState, fd: FormData) => Promise<ActionState>;

export function FormStatusProvider({
  action,
  className,
  children,
}: {
  action: FormAction;
  className?: string;
  children: React.ReactNode;
}) {
  const [state, formAction] = useActionState(action, {});

  return (
    <FormStateContext.Provider value={state}>
      <form action={formAction} className={className}>
        {children}
      </form>
    </FormStateContext.Provider>
  );
}

export function ActionFeedback() {
  const state = useContext(FormStateContext);
  if (state.error) {
    return <span className="text-xs font-medium text-accent">{state.error}</span>;
  }
  if (state.ok) {
    return <span className="text-xs font-medium text-wa">Saved</span>;
  }
  return null;
}

export function SubmitButton({
  children,
  className,
  pendingLabel = "Saving…",
}: {
  children: React.ReactNode;
  className?: string;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={`disabled:opacity-60 ${className ?? ""}`}>
      {pending ? pendingLabel : children}
    </button>
  );
}

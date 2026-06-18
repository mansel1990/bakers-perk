import { getAdminMessages } from "@/lib/admin-data";
import { markMessageRead, deleteMessage } from "@/app/admin/actions";
import ConfirmButton from "@/components/admin/ConfirmButton";

const BTN_DANGER =
  "inline-flex items-center gap-1.5 rounded-full border border-accent/40 px-4 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent hover:text-on-ink";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await getAdminMessages();

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold text-ink">Messages</h1>
      <p className="mt-2 text-sm text-muted">Contact-form submissions. Customers are still encouraged to reach you on WhatsApp.</p>

      <div className="mt-7 space-y-3">
        {messages.length === 0 && (
          <p className="rounded-2xl border border-line bg-paper p-6 text-sm text-muted">No messages yet.</p>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`rounded-2xl border p-5 ${m.isRead ? "border-line bg-paper" : "border-accent bg-paper"}`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-serif text-lg font-semibold">{m.name}</span>
              {!m.isRead && (
                <span className="rounded-full bg-accent px-2 py-0.5 text-[9px] uppercase tracking-[1.5px] text-ink">
                  New
                </span>
              )}
              <span className="ml-auto text-[11px] text-muted">
                {new Date(m.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
              </span>
            </div>

            <div className="mt-1 text-xs text-muted">
              {m.phone && <span>{m.phone}</span>}
              {m.phone && m.email && <span> · </span>}
              {m.email && <span>{m.email}</span>}
            </div>

            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{m.message}</p>

            <div className="mt-4 flex gap-2">
              {!m.isRead && (
                <form action={markMessageRead}>
                  <input type="hidden" name="id" value={m.id} />
                  <button className="rounded-full border border-line px-4 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent">
                    Mark read
                  </button>
                </form>
              )}
              <form action={deleteMessage}>
                <input type="hidden" name="id" value={m.id} />
                <ConfirmButton confirmText={`Delete the message from ${m.name}?`} className={BTN_DANGER}>
                  🗑 Delete
                </ConfirmButton>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

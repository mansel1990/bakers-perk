import { getSettings } from "@/lib/data";
import { updateSettings } from "@/app/admin/actions";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";

export const dynamic = "force-dynamic";

const INPUT =
  "mt-1.5 w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent";

function Field({
  label,
  name,
  defaultValue,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs text-muted">{label}</span>
      <input name={name} type={type} defaultValue={defaultValue} className={INPUT} />
    </label>
  );
}

export default async function AdminSettingsPage() {
  const s = await getSettings();

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold text-ink">Settings</h1>
      <p className="mt-2 text-sm text-muted">Shop details shown across the site. Changes go live within a minute.</p>

      <form action={updateSettings} className="mt-7 max-w-2xl space-y-5">
        <div className="rounded-2xl border border-line bg-paper p-5 lg:p-6">
          <div className="text-[10px] uppercase tracking-[3px] text-accent">Brand</div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Name" name="name" defaultValue={s.name} />
            <Field label="Byline" name="byline" defaultValue={s.byline} />
          </div>
          <div className="mt-4">
            <Field label="Tagline" name="tagline" defaultValue={s.tagline} />
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-paper p-5 lg:p-6">
          <div className="text-[10px] uppercase tracking-[3px] text-accent">Contact</div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="WhatsApp number (e.g. 919566074342)" name="whatsapp_number" defaultValue={s.whatsapp} />
            <Field label="Contact email" name="contact_email" defaultValue={s.email} />
            <Field label="Instagram URL" name="instagram" defaultValue={s.instagram} />
            <Field label="Hours" name="hours" defaultValue={s.hours} />
          </div>
          <div className="mt-4">
            <Field label="Address" name="address" defaultValue={s.address} />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Delivery note" name="delivery_note" defaultValue={s.deliveryNote} />
            <Field label="Min lead-time (days)" name="min_lead_days" type="number" defaultValue={s.minLeadDays} />
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-paper p-5 lg:p-6">
          <div className="text-[10px] uppercase tracking-[3px] text-accent">Announcement banner</div>
          <label className="mt-4 flex items-center gap-2 text-sm">
            <input type="checkbox" name="banner_enabled" defaultChecked={s.bannerEnabled} className="h-4 w-4 accent-[var(--accent)]" />
            Show banner at the top of the site
          </label>
          <div className="mt-4">
            <Field label="Banner text" name="banner_text" defaultValue={s.bannerText} />
          </div>
        </div>

        <button
          type="submit"
          className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-on-ink transition-transform hover:scale-[1.01]"
        >
          Save settings
        </button>
      </form>

      <div className="mt-8 max-w-2xl rounded-2xl border border-line bg-paper p-5 lg:p-6">
        <div className="text-[10px] uppercase tracking-[3px] text-accent">Account &amp; security</div>
        <h2 className="mt-1 font-serif text-lg font-semibold">Change password</h2>
        <p className="mb-4 mt-1 text-sm text-muted">
          Forgot it? An owner can reset it from the server with <code className="rounded bg-cream px-1.5 py-0.5 text-xs">npm run db:seed-admin</code>.
        </p>
        <ChangePasswordForm />
      </div>
    </div>
  );
}

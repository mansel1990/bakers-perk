import Link from "next/link";
import { eq, gte } from "drizzle-orm";
import { db } from "@/db";
import { categories, menuItems, galleryImages, contactMessages } from "@/db/schema";
import { getAdminMenu } from "@/lib/admin-data";
import EnableNotifications from "@/components/admin/EnableNotifications";
import { EnquiriesChart, CategoryChart } from "@/components/admin/DashboardCharts";

export const dynamic = "force-dynamic";

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export default async function AdminDashboard() {
  const since = startOfDay(new Date());
  since.setDate(since.getDate() - 13);

  const [items, photos, unread, totalMsgs, cats, menu, recentMsgs] = await Promise.all([
    db.$count(menuItems),
    db.$count(galleryImages),
    db.$count(contactMessages, eq(contactMessages.isRead, false)),
    db.$count(contactMessages),
    db.$count(categories),
    getAdminMenu(),
    db
      .select({ createdAt: contactMessages.createdAt })
      .from(contactMessages)
      .where(gte(contactMessages.createdAt, since)),
  ]);

  // Bucket the last 14 days of enquiries.
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = startOfDay(new Date());
    d.setDate(d.getDate() - (13 - i));
    return { ts: d.getTime(), label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }), count: 0 };
  });
  for (const m of recentMsgs) {
    const ts = startOfDay(new Date(m.createdAt)).getTime();
    const bucket = days.find((d) => d.ts === ts);
    if (bucket) bucket.count++;
  }
  const enquiries = days.map((d) => ({ label: d.label, count: d.count }));
  const perCategory = menu
    .map((c) => ({ name: c.name, count: c.items.length }))
    .sort((a, b) => b.count - a.count);

  const stats = [
    { label: "Menu items", value: items, href: "/admin/menu", icon: "✦" },
    { label: "Categories", value: cats, href: "/admin/menu", icon: "❖" },
    { label: "Gallery photos", value: photos, href: "/admin/gallery", icon: "❑" },
    { label: "Unread messages", value: unread, href: "/admin/messages", icon: "✉", highlight: unread > 0 },
  ];

  const actions = [
    { label: "Edit menu & prices", desc: "Items, ½kg/1kg, add-ons", href: "/admin/menu", icon: "✦" },
    { label: "Add gallery photo", desc: "Upload a new cake", href: "/admin/gallery", icon: "❑" },
    { label: "Messages", desc: `${totalMsgs} total · ${unread} unread`, href: "/admin/messages", icon: "✉" },
    { label: "Shop settings", desc: "Hours, WhatsApp, banner", href: "/admin/settings", icon: "⚙" },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold text-ink">Dashboard</h1>
      <p className="mt-2 text-sm text-muted">A quick pulse on your shop — manage everything from here.</p>

      {/* Stat cards */}
      <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`group rounded-2xl border p-4 transition-colors lg:p-5 ${
              s.highlight ? "border-accent bg-accent/5" : "border-line bg-paper hover:border-accent"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-lg ${s.highlight ? "text-accent" : "text-muted"}`}>{s.icon}</span>
            </div>
            <div className="mt-2 font-serif text-3xl font-semibold text-ink lg:text-4xl">{s.value}</div>
            <div className="mt-0.5 text-[11px] uppercase tracking-[1.5px] text-muted">{s.label}</div>
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-paper p-5">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-lg font-semibold">Enquiries</h2>
            <span className="text-[11px] uppercase tracking-[1.5px] text-muted">Last 14 days</span>
          </div>
          <div className="mt-4">
            <EnquiriesChart data={enquiries} />
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-paper p-5">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-lg font-semibold">Items per category</h2>
            <span className="text-[11px] uppercase tracking-[1.5px] text-muted">{items} total</span>
          </div>
          <div className="mt-4">
            {perCategory.length ? (
              <CategoryChart data={perCategory} />
            ) : (
              <p className="py-10 text-center text-sm text-muted">No categories yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <h2 className="mt-8 font-serif text-lg font-semibold text-ink">Quick actions</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className="rounded-2xl border border-line bg-paper p-4 transition-colors hover:border-accent"
          >
            <div className="text-lg text-accent">{a.icon}</div>
            <div className="mt-2 text-sm font-medium text-ink">{a.label}</div>
            <div className="mt-0.5 text-xs text-muted">{a.desc}</div>
          </Link>
        ))}
      </div>

      {/* Notifications */}
      <div className="mt-6">
        <EnableNotifications />
      </div>
    </div>
  );
}

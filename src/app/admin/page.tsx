import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Baker's Perk", robots: { index: false } };

export default function AdminPage() {
  return (
    <div className="px-5 py-12 lg:px-10 lg:py-16">
      <h1 className="font-serif text-3xl font-semibold">Admin</h1>
      <p className="mt-3 max-w-md text-sm text-muted">
        Backoffice (auth, menu CRUD, orders, gallery, settings) arrives in the DB phase.
        This route is a placeholder and is excluded from search indexing.
      </p>
    </div>
  );
}

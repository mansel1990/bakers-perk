import type { Metadata } from "next";

export const metadata: Metadata = { title: "Gallery — Baker's Perk" };

export default function GalleryPage() {
  return (
    <div className="px-5 py-12 lg:px-10 lg:py-16">
      <div className="text-[10px] uppercase tracking-[3px] text-accent">From the oven</div>
      <h1 className="mt-2 font-serif text-4xl font-semibold lg:text-5xl">Gallery</h1>
      <p className="mt-3 max-w-md text-sm text-muted">
        Admin-managed gallery arrives with the backoffice phase. Photos dropped in
        /public/images will be wired in here first.
      </p>
    </div>
  );
}

import Image from "next/image";
import { getAdminGallery } from "@/lib/admin-data";
import { updateGalleryImage, deleteGalleryImage } from "@/app/admin/actions";
import GalleryUploader from "@/components/admin/GalleryUploader";
import ConfirmButton from "@/components/admin/ConfirmButton";

const BTN_DANGER =
  "inline-flex items-center gap-1.5 rounded-full border border-accent/40 px-4 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent hover:text-on-ink";

export const dynamic = "force-dynamic";

const OCCASIONS = ["", "Weddings", "Birthdays & Themed", "Anniversary", "Character & Novelty"];
const INPUT =
  "w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm outline-none focus:border-accent";

export default async function AdminGalleryPage() {
  const images = await getAdminGallery();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-ink">Gallery</h1>
          <p className="mt-2 text-sm text-muted">Upload, caption, reorder (sort) and pick hero images.</p>
        </div>
        <GalleryUploader />
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        {images.map((g) => (
          <div key={g.id} className="rounded-2xl border border-line bg-paper p-4">
            <div className="flex gap-4">
              <div className="relative h-28 w-24 flex-none overflow-hidden rounded-xl bg-ink-2">
                <Image src={g.blobUrl} alt={g.alt} fill sizes="96px" className="object-cover" />
              </div>
              <form action={updateGalleryImage} className="flex-1 space-y-2">
                <input type="hidden" name="id" value={g.id} />
                <input name="alt" defaultValue={g.alt} placeholder="Alt text" className={INPUT} />
                <input name="caption" defaultValue={g.caption ?? ""} placeholder="Caption" className={INPUT} />
                <div className="flex gap-2">
                  <select name="occasion" defaultValue={g.occasion ?? ""} className={INPUT}>
                    {OCCASIONS.map((o) => (
                      <option key={o} value={o}>
                        {o || "— No occasion —"}
                      </option>
                    ))}
                  </select>
                  <input
                    name="sort"
                    type="number"
                    defaultValue={g.sort}
                    title="Sort order"
                    className="w-20 rounded-lg border border-line bg-cream px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <label className="flex items-center gap-1.5 text-xs text-muted">
                    <input type="checkbox" name="isHero" defaultChecked={g.isHero} className="h-4 w-4 accent-[var(--accent)]" />
                    Hero
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-muted">
                    <input type="checkbox" name="isVisible" defaultChecked={g.isVisible} className="h-4 w-4 accent-[var(--accent)]" />
                    Visible
                  </label>
                  <button className="ml-auto rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-on-ink">
                    Save
                  </button>
                </div>
              </form>
            </div>
            <form action={deleteGalleryImage} className="mt-2 text-right">
              <input type="hidden" name="id" value={g.id} />
              <ConfirmButton confirmText="Delete this photo? This also removes it from storage." className={BTN_DANGER}>
                🗑 Delete photo
              </ConfirmButton>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}

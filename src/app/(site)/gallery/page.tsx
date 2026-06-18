import type { Metadata } from "next";
import Image from "next/image";
import { getGallery } from "@/lib/data";

export const metadata: Metadata = { title: "Gallery — Baker's Perk" };
export const revalidate = 60;

export default async function GalleryPage() {
  const gallery = await getGallery();

  return (
    <div className="px-5 py-12 lg:px-10 lg:py-16">
      <div className="text-[10px] uppercase tracking-[3px] text-accent">From the oven</div>
      <h1 className="mt-2 font-serif text-4xl font-semibold lg:text-5xl">Gallery</h1>
      <p className="mt-3 max-w-md text-sm text-muted">
        Custom cakes we&apos;ve brought to life — photo cakes, fondant, toppers and celebration
        bakes. Yours could be next.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5">
        {gallery.map((photo) => (
          <figure
            key={photo.src}
            className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink-2"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 via-ink/35 to-transparent px-3 pb-3 pt-10">
              <span className="font-serif text-sm font-semibold text-on-ink lg:text-base">
                {photo.caption}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

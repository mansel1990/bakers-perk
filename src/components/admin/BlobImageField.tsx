"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";

/**
 * Shows the current image (if any) and an uploader. On upload it calls the
 * provided (already id-bound) server action, then refreshes the view.
 */
export default function BlobImageField({
  currentUrl,
  folder,
  onUpload,
  label = "Upload photo",
}: {
  currentUrl?: string | null;
  folder: "menu" | "gallery";
  onUpload: (url: string) => Promise<void>;
  label?: string;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-14 w-14 flex-none overflow-hidden rounded-lg bg-ink-2">
        {currentUrl && (
          <Image src={currentUrl} alt="" fill sizes="56px" className="object-cover" />
        )}
      </div>
      <ImageUploader
        folder={folder}
        label={currentUrl ? "Replace photo" : label}
        onUploaded={async (url) => {
          await onUpload(url);
          router.refresh();
        }}
      />
    </div>
  );
}

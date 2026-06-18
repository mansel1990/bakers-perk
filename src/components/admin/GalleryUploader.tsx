"use client";

import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";
import { createGalleryImage } from "@/app/admin/actions";

export default function GalleryUploader() {
  const router = useRouter();
  return (
    <ImageUploader
      folder="gallery"
      label="+ Add gallery photo"
      onUploaded={async (url) => {
        await createGalleryImage({ blobUrl: url, alt: "Baker's Perk cake" });
        router.refresh();
      }}
    />
  );
}

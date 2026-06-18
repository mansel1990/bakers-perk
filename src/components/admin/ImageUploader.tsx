"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";

/**
 * Uploads an image straight to Vercel Blob (under bakers-perk/<folder>/) and
 * calls `onUploaded` with the resulting public URL.
 */
export default function ImageUploader({
  folder,
  label = "Upload image",
  onUploaded,
}: {
  folder: "menu" | "gallery";
  label?: string;
  onUploaded: (url: string) => Promise<void> | void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");
    setBusy(true);
    try {
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
      const result = await upload(`bakers-perk/${folder}/${safeName}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
      });
      await onUploaded(result.url);
    } catch (e) {
      setError((e as Error).message || "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="rounded-full border border-line px-4 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-60"
      >
        {busy ? "Uploading…" : label}
      </button>
      {error && <span className="ml-2 text-xs text-accent">{error}</span>}
    </div>
  );
}

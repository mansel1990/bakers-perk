import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Baker's Perk";

export default async function OpengraphImage() {
  const iconPath = path.join(process.cwd(), "public/icon-512.png");
  const icon = await readFile(iconPath);
  const src = `data:image/png;base64,${icon.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2c4032",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={360} height={360} alt="" />
      </div>
    ),
    { ...size }
  );
}

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@react-pdf/renderer"],
  outputFileTracingIncludes: {
    "/api/menu/pdf": ["./src/assets/brand/**/*", "./scripts/assets/pdf/**/*"],
    "/api/admin/bill/pdf": ["./src/assets/brand/**/*"],
    "/opengraph-image": ["./public/icon-512.png"],
    "/twitter-image": ["./public/icon-512.png"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;

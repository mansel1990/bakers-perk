import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/share-metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ["", "/menu", "/gallery", "/custom-cakes", "/our-story", "/contact"];
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}

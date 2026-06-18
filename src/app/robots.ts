import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: "https://bakersperk.com/sitemap.xml",
    host: "https://bakersperk.com",
  };
}

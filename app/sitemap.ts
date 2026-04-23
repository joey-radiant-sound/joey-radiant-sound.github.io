import type { MetadataRoute } from "next";

const SITE_URL = "https://radiantsoundwny.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    "",
    "/weddings",
    "/weddings/about",
    "/weddings/contact",
    "/acappella",
    "/acappella/about",
    "/acappella/contact",
  ];
  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "monthly" : "monthly",
    priority: path === "" ? 1 : path.endsWith("/contact") ? 0.6 : 0.8,
  }));
}

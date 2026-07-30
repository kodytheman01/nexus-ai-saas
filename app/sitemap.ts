import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://apexcapitaladmin.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const engines = await db.calculationEngine.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  const engineEntries: MetadataRoute.Sitemap = engines.map((engine) => ({
    url: `${appUrl}/engine/${engine.slug}`,
    lastModified: engine.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    {
      url: appUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${appUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${appUrl}/grant-mode`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${appUrl}/notice-mode`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${appUrl}/go/notice`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${appUrl}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${appUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${appUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${appUrl}/success`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.1,
    },
    ...engineEntries,
  ];
}

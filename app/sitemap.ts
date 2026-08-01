import type { MetadataRoute } from "next";
import { MODE_AD_CATALOG } from "@/config/mode-catalog";
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

  const modeEntries: MetadataRoute.Sitemap = MODE_AD_CATALOG.flatMap((m) => [
    {
      url: `${appUrl}${m.hubPath}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${appUrl}${m.goPath}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.95,
    },
  ]);

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
      url: `${appUrl}/modes`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${appUrl}/vision`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },

    {
      url: `${appUrl}/platform`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${appUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${appUrl}/brand`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...modeEntries,
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

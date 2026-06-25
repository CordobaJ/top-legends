import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    { url: SITE_URL, lastModified: new Date(), priority: 1 },
    { url: `${SITE_URL}/productos`, lastModified: new Date(), priority: 0.9 },
    { url: `${SITE_URL}/carrito`, lastModified: new Date(), priority: 0.5 },
  ];

  try {
    const { prisma } = await import("@/lib/prisma");
    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.category.findMany({
        where: { isActive: true },
        select: { slug: true },
      }),
    ]);

    const productPages = products.map((p) => ({
      url: `${SITE_URL}/productos/${p.slug}`,
      lastModified: p.updatedAt,
      priority: 0.8 as const,
    }));

    const categoryPages = categories.map((c) => ({
      url: `${SITE_URL}/categorias/${c.slug}`,
      lastModified: new Date(),
      priority: 0.7 as const,
    }));

    return [...staticPages, ...productPages, ...categoryPages];
  } catch {
    return staticPages;
  }
}

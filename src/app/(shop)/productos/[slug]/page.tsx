import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true, team: true },
  });

  if (!product) return { title: "Producto no encontrado" };

  return {
    title: product.name,
    description: product.metaDescription ?? product.description,
    openGraph: {
      title: product.name,
      description: product.metaDescription ?? product.description,
      images: product.metaTitle ? [{ url: product.metaTitle }] : [],
    },
  };
}

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      images: { orderBy: { order: "asc" } },
      variants: true,
      category: true,
      team: true,
    },
  });

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-12">
        <ProductGallery
          images={product.images.map((img) => ({
            id: img.id,
            url: img.url,
            alt: img.alt ?? product.name,
            isPrimary: img.isPrimary,
          }))}
        />
        <ProductInfo
          product={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: Number(product.price),
            comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
            sku: product.sku,
            category: product.category ? { id: product.category.id, name: product.category.name, slug: product.category.slug } : null,
            team: product.team ? { id: product.team.id, name: product.team.name, slug: product.team.slug, logo: product.team.logo } : null,
            season: product.season,
            type: product.type,
            gender: product.gender,
            images: product.images.map((img) => ({ id: img.id, url: img.url, alt: img.alt ?? product.name, order: img.order, isPrimary: img.isPrimary })),
            variants: product.variants.map((v) => ({ id: v.id, size: v.size, stock: v.stock, priceAdj: Number(v.priceAdj) })),
            isFeatured: product.isFeatured,
            isActive: product.isActive,
            createdAt: product.createdAt,
          }}
        />
      </div>
    </div>
  );
}

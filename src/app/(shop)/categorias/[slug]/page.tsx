import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/product/ProductGrid";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });

  if (!category) return { title: "Categoría no encontrada" };

  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug, isActive: true } });

  if (!category) notFound();

  const sp = await searchParams;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">{category.name}</h1>
        {category.description && (
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{category.description}</p>
        )}
      </div>
      <ProductGrid searchParams={{ ...sp, category: slug }} />
    </div>
  );
}

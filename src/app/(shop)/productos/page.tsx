import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { FilterBar } from "@/components/product/FilterBar";
import { ProductGrid } from "@/components/product/ProductGrid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Productos",
  description: "Explora nuestra colección de camisetas de fútbol",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const [categories, teams] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.team.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Productos</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Explora nuestra colección completa
        </p>
      </div>

      <FilterBar categories={categories} teams={teams} />
      <ProductGrid searchParams={params} />
    </div>
  );
}

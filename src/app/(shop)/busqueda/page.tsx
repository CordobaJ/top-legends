import type { Metadata } from "next";
import { ProductGrid } from "@/components/product/ProductGrid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Búsqueda",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          {query ? `Resultados para "${query}"` : "Búsqueda"}
        </h1>
      </div>
      <ProductGrid searchParams={params} />
    </div>
  );
}

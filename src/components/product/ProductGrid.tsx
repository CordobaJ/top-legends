import { prisma } from "@/lib/prisma";
import { ProductCard } from "./ProductCard";
import { SortSelect } from "./SortSelect";
import type { Prisma } from "@prisma/client";

interface ProductGridProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export async function ProductGrid({ searchParams }: ProductGridProps) {
  const where: Prisma.ProductWhereInput = { isActive: true };

  const category = typeof searchParams.category === "string" ? searchParams.category : undefined;
  const team = typeof searchParams.team === "string" ? searchParams.team : undefined;
  const type = typeof searchParams.type === "string" ? searchParams.type : undefined;
  const size = typeof searchParams.size === "string" ? searchParams.size : undefined;
  const minPrice = typeof searchParams.minPrice === "string" ? Number(searchParams.minPrice) : undefined;
  const maxPrice = typeof searchParams.maxPrice === "string" ? Number(searchParams.maxPrice) : undefined;
  const search = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : undefined;

  if (category) where.category = { slug: category };
  if (team) where.team = { slug: team };
  if (type) where.type = type;
  if (size) where.variants = { some: { size, stock: { gt: 0 } } };

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { team: { name: { contains: search } } },
    ];
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput = sort === "price_asc"
    ? { price: "asc" }
    : sort === "price_desc"
    ? { price: "desc" }
    : sort === "name_asc"
    ? { name: "asc" }
    : sort === "name_desc"
    ? { name: "desc" }
    : { createdAt: "desc" };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      images: { orderBy: { order: "asc" } },
      variants: true,
      category: true,
      team: true,
    },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {products.length} {products.length === 1 ? "producto" : "productos"}
        </p>
        <SortSelect currentSort={sort} />
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-zinc-600 dark:text-zinc-400">No se encontraron productos</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                price: Number(product.price),
                comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
                images: product.images.map((img) => ({
                  ...img,
                  alt: img.alt ?? product.name,
                })),
                variants: product.variants.map((v) => ({
                  ...v,
                  priceAdj: Number(v.priceAdj),
                })),
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

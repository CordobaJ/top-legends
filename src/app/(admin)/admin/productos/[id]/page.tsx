import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminProductForm } from "@/components/admin/AdminProductForm";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  const [product, categories, teams] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: true, variants: true },
    }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.team.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Editar producto</h1>
      <AdminProductForm
        categories={categories}
        teams={teams}
        product={{
          ...product,
          price: Number(product.price),
          comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
        }}
      />
    </div>
  );
}

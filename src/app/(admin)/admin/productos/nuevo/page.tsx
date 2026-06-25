import { prisma } from "@/lib/prisma";
import { AdminProductForm } from "@/components/admin/AdminProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [categories, teams] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.team.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Nuevo producto</h1>
      <AdminProductForm categories={categories} teams={teams} />
    </div>
  );
}

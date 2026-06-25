import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { variants: true, category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Productos</h1>
        <Link href="/admin/productos/nuevo">
          <Button>Nuevo producto</Button>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left dark:border-zinc-800">
              <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">Producto</th>
              <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">SKU</th>
              <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">Precio</th>
              <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">Stock</th>
              <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">Estado</th>
              <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {products.map((product) => {
              const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
              return (
                <tr key={product.id} className="text-zinc-900 dark:text-white">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      {product.category && (
                        <p className="text-xs text-zinc-500">{product.category.name}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-500">{product.sku}</td>
                  <td className="px-4 py-3">{formatPrice(Number(product.price))}</td>
                  <td className="px-4 py-3">
                    <span className={totalStock === 0 ? "text-red-500" : totalStock < 10 ? "text-yellow-500" : ""}>
                      {totalStock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={product.isActive ? "success" : "danger"}>
                      {product.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/productos/${product.id}`}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

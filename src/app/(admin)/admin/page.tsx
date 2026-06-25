import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [productCount, orderCount, userCount, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Productos</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">{productCount}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Pedidos</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">{orderCount}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Usuarios</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">{userCount}</p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <h2 className="font-semibold text-zinc-900 dark:text-white">Pedidos recientes</h2>
        </div>
        <div className="p-4">
          {recentOrders.length === 0 ? (
            <p className="text-sm text-zinc-500">Sin pedidos</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-zinc-500 dark:text-zinc-400">
                  <th className="pb-2 font-medium">#</th>
                  <th className="pb-2 font-medium">Estado</th>
                  <th className="pb-2 font-medium">Items</th>
                  <th className="pb-2 font-medium">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="text-zinc-900 dark:text-white">
                    <td className="py-2">{order.orderNumber}</td>
                    <td className="py-2">{order.status}</td>
                    <td className="py-2">{order.items.length}</td>
                    <td className="py-2">{order.createdAt.toLocaleDateString("es-CO")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

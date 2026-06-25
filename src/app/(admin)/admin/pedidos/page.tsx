import { prisma } from "@/lib/prisma";
import { Badge, type BadgeProps } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS, PAYMENT_STATUS } from "@/lib/constants";

export const dynamic = "force-dynamic";

const statusBadge: Record<string, "warning" | "info" | "success" | "danger"> = {
  PENDING: "warning",
  CONFIRMED: "info",
  PROCESSING: "info",
  SHIPPED: "info",
  DELIVERED: "success",
  CANCELLED: "danger",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true, shippingAddress: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Pedidos</h1>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left dark:border-zinc-800">
              <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">#</th>
              <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">Cliente</th>
              <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">Total</th>
              <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">Estado</th>
              <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">Pago</th>
              <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {orders.map((order) => (
              <tr key={order.id} className="text-zinc-900 dark:text-white">
                <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                <td className="px-4 py-3 text-zinc-500">
                  {order.shippingAddress?.fullName ?? "—"}
                </td>
                <td className="px-4 py-3">{formatPrice(Number(order.total))}</td>
                <td className="px-4 py-3">
                  <Badge variant={statusBadge[order.status] as "warning" | "info" | "success" | "danger"}>
                    {ORDER_STATUS[order.status]}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={order.paymentStatus === "APPROVED" ? "success" : "warning"}>
                    {PAYMENT_STATUS[order.paymentStatus]}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-zinc-500">
                  {order.createdAt.toLocaleDateString("es-CO")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="p-4 text-sm text-zinc-500">Sin pedidos</p>
        )}
      </div>
    </div>
  );
}

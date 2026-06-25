"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatPrice } from "@/lib/utils";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: { productName: string; size: string; quantity: number; unitPrice: number }[];
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!session?.user) {
      router.push("/login");
      return;
    }
    Promise.all([
      fetch("/api/user/profile").then((r) => r.json()),
      fetch("/api/orders/my").then((r) => r.json()),
    ]).then(([profile, ordersRes]) => {
      if (profile.success) {
        setName(profile.data.name ?? "");
        setPhone(profile.data.phone ?? "");
      }
      if (ordersRes.success) setOrders(ordersRes.data);
      setLoading(false);
    });
  }, [session, router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone }),
    });
    const json = await res.json();
    if (json.success) {
      setSaved(true);
      update();
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-zinc-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-white">Mi perfil</h1>

      <div className="space-y-8">
        <form onSubmit={handleSave} className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Datos personales</h2>
          <div className="space-y-4">
            <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} id="name" required />
            <Input label="Email" value={session?.user?.email ?? ""} id="email" disabled />
            <Input label="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value)} id="phone" type="tel" />
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button type="submit" loading={saving}>Guardar</Button>
            {saved && <span className="text-sm text-green-600">Datos actualizados</span>}
          </div>
        </form>

        <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Mis pedidos</h2>
          </div>
          {orders.length === 0 ? (
            <p className="p-6 text-sm text-zinc-500">No tienes pedidos aún</p>
          ) : (
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {orders.map((order) => (
                <div key={order.id} className="p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-white">{order.orderNumber}</p>
                      <p className="text-xs text-zinc-500">{new Date(order.createdAt).toLocaleDateString("es-CO")}</p>
                    </div>
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      {order.status}
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {order.items.map((item, i) => (
                      <li key={i} className="flex justify-between text-sm">
                        <span className="text-zinc-600 dark:text-zinc-400">
                          {item.productName} — Talla {item.size} x{item.quantity}
                        </span>
                        <span className="text-zinc-900 dark:text-white">{formatPrice(item.unitPrice * item.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex justify-between border-t border-zinc-100 pt-3 dark:border-zinc-700">
                    <span className="text-sm font-semibold text-zinc-900 dark:text-white">Total</span>
                    <span className="text-sm font-semibold text-zinc-900 dark:text-white">{formatPrice(order.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

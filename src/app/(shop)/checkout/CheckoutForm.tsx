"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

interface UserProfile {
  name: string | null;
  email: string;
  phone: string | null;
  addresses: { fullName: string; street: string; city: string; state: string; zipCode: string }[];
}

export function CheckoutForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/user/profile")
        .then((r) => r.json())
        .then((json) => {
          if (json.success) setProfile(json.data);
        });
    }
  }, [session]);

  const subtotal = getSubtotal();
  const shipping = subtotal >= 200000 ? 0 : 15000;
  const total = subtotal + shipping;

  if (items.length === 0) {
    router.push("/carrito");
    return null;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const orderData = {
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        image: item.image,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress: {
        fullName: form.get("fullName"),
        email: form.get("email"),
        phone: form.get("phone"),
        street: form.get("street"),
        city: form.get("city"),
        state: form.get("state"),
        zipCode: form.get("zipCode"),
      },
      subtotal,
      shippingCost: shipping,
      total,
    };

    try {
      setError("");

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al crear el pedido");
        return;
      }

      clearCart();

      const payRes = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: data.orderId }),
      });

      let payData;
      try {
        payData = await payRes.json();
      } catch {
        setError("Error al procesar respuesta de pago");
        return;
      }

      if (!payRes.ok) {
        setError(payData.error || payData.detail || "Error al procesar el pago");
        return;
      }

      if (payData.sandbox) {
        router.push(`/checkout/success?order=${payData.orderNumber}`);
      } else if (payData.initPoint) {
        window.location.href = payData.initPoint;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error inesperado";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const addr = profile?.addresses[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Datos de envío</h2>
        <div className="space-y-4">
          <Input id="fullName" name="fullName" label="Nombre completo" required defaultValue={addr?.fullName ?? profile?.name ?? ""} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input id="email" name="email" label="Email" type="email" required defaultValue={profile?.email ?? ""} />
            <Input id="phone" name="phone" label="Teléfono" type="tel" required defaultValue={profile?.phone ?? ""} />
          </div>
          <Input id="street" name="street" label="Dirección" required defaultValue={addr?.street ?? ""} />
          <div className="grid gap-4 sm:grid-cols-3">
            <Input id="city" name="city" label="Ciudad" required defaultValue={addr?.city ?? ""} />
            <Input id="state" name="state" label="Departamento" required defaultValue={addr?.state ?? ""} />
            <Input id="zipCode" name="zipCode" label="Código postal" required defaultValue={addr?.zipCode ?? ""} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Resumen del pedido</h2>
        <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between py-3">
              <div>
                <p className="text-sm text-zinc-900 dark:text-white">{item.name}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Talla: {item.size} | Qty: {item.quantity}
                </p>
              </div>
              <span className="text-sm font-medium text-zinc-900 dark:text-white">
                {formatPrice(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <div className="flex justify-between text-sm">
            <dt className="text-zinc-600 dark:text-zinc-400">Subtotal</dt>
            <dd className="text-zinc-900 dark:text-white">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between text-sm">
            <dt className="text-zinc-600 dark:text-zinc-400">Envío</dt>
            <dd className="text-zinc-900 dark:text-white">
              {shipping === 0 ? <span className="text-green-600">Gratis</span> : formatPrice(shipping)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-zinc-200 pt-2 text-base font-semibold dark:border-zinc-800">
            <dt className="text-zinc-900 dark:text-white">Total</dt>
            <dd className="text-zinc-900 dark:text-white">{formatPrice(total)}</dd>
          </div>
        </dl>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}
      <Button type="submit" size="lg" className="w-full" loading={loading}>
        Confirmar pedido
      </Button>
    </form>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

export function CartContent() {
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg text-zinc-600 dark:text-zinc-400">Tu carrito está vacío</p>
        <Link
          href="/productos"
          className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-6 text-sm font-medium text-white hover:bg-blue-700"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="lg:grid lg:grid-cols-3 lg:gap-8">
      <div className="lg:col-span-2">
        <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 py-4">
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link
                    href={`/productos/${item.slug}`}
                    className="text-sm font-medium text-zinc-900 hover:text-blue-600 dark:text-white"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Talla: {item.size}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <select
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.productId, item.size, Number(e.target.value))
                      }
                      className="rounded-lg border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                    >
                      {Array.from({ length: item.maxStock }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                    <span className="text-sm font-medium text-zinc-900 dark:text-white">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.size)}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <button
            onClick={clearCart}
            className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            Vaciar carrito
          </button>
        </div>
      </div>

      <div className="mt-8 lg:mt-0">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Resumen</h2>
          <dl className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-zinc-600 dark:text-zinc-400">Subtotal</dt>
              <dd className="text-sm font-medium text-zinc-900 dark:text-white">
                {formatPrice(getSubtotal())}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm text-zinc-600 dark:text-zinc-400">Envío</dt>
              <dd className="text-sm text-zinc-900 dark:text-white">
                {getSubtotal() >= 200000 ? (
                  <span className="text-green-600">Gratis</span>
                ) : (
                  formatPrice(15000)
                )}
              </dd>
            </div>
            <div className="border-t border-zinc-200 pt-3 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <dt className="text-base font-semibold text-zinc-900 dark:text-white">Total</dt>
                <dd className="text-base font-semibold text-zinc-900 dark:text-white">
                  {formatPrice(getSubtotal() >= 200000 ? getSubtotal() : getSubtotal() + 15000)}
                </dd>
              </div>
            </div>
          </dl>
          <Link href="/checkout">
            <Button className="mt-6 w-full" size="lg">
              Ir a pagar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

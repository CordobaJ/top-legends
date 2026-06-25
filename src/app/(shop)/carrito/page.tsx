import type { Metadata } from "next";
import { CartContent } from "./CartContent";

export const metadata: Metadata = {
  title: "Carrito de compras",
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-white">Carrito de compras</h1>
      <CartContent />
    </div>
  );
}

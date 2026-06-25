"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import type { Product } from "@/types/product";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const inStockVariants = product.variants.filter((v) => v.stock > 0);

  const handleAdd = () => {
    if (!selectedSize) return;
    const variant = product.variants.find((v) => v.size === selectedSize);
    if (!variant) return;

    const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];

    addItem({
      id: `${product.id}-${selectedSize}`,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: primaryImage?.url ?? "",
      size: selectedSize,
      price: Number(product.price) + Number(variant.priceAdj),
      quantity: 1,
      maxStock: variant.stock,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        {product.team && (
          <p className="text-sm text-blue-600 dark:text-blue-400">{product.team.name}</p>
        )}
        <h1 className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
          {product.name}
        </h1>
        {product.category && (
          <Badge className="mt-2">{product.category.name}</Badge>
        )}
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-zinc-900 dark:text-white">
          {formatPrice(Number(product.price))}
        </span>
        {product.comparePrice && (
          <span className="text-lg text-zinc-400 line-through">
            {formatPrice(Number(product.comparePrice))}
          </span>
        )}
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">Talla</h3>
        <div className="flex flex-wrap gap-2">
          {product.variants.map((variant) => {
            const available = variant.stock > 0;
            return (
              <button
                key={variant.id}
                onClick={() => available && setSelectedSize(variant.size)}
                disabled={!available}
                className={`flex h-10 w-12 items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                  selectedSize === variant.size
                    ? "border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                    : available
                    ? "border-zinc-300 text-zinc-700 hover:border-zinc-900 dark:border-zinc-700 dark:text-zinc-300"
                    : "cursor-not-allowed border-zinc-200 text-zinc-300 dark:border-zinc-800 dark:text-zinc-600"
                }`}
              >
                {variant.size}
              </button>
            );
          })}
        </div>
        {inStockVariants.length === 0 && (
          <p className="mt-2 text-sm text-red-500">Producto agotado</p>
        )}
      </div>

      <Button
        size="lg"
        className="w-full"
        disabled={!selectedSize || inStockVariants.length === 0}
        onClick={handleAdd}
      >
        {added ? "Agregado ✓" : "Agregar al carrito"}
      </Button>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-white">Descripción</h3>
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {product.description}
        </p>
      </div>
    </div>
  );
}

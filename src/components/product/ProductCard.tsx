"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

function ProductImageFallback({ team }: { team?: string | null }) {
  const initials = team
    ? team.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "TL";
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800">
      <span className="text-3xl font-bold text-white/80">{initials}</span>
    </div>
  );
}

export function ProductCard({ product }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];

  return (
    <Link
      href={`/productos/${product.slug}`}
      className="group rounded-xl border border-zinc-200 bg-white p-3 transition-all hover:border-blue-500 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="relative aspect-square overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
        {primaryImage && !imgError ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt ?? product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <ProductImageFallback team={product.team?.name} />
        )}
        {product.comparePrice && (
          <Badge variant="danger" className="absolute left-2 top-2">
            -{Math.round((1 - Number(product.price) / Number(product.comparePrice)) * 100)}%
          </Badge>
        )}
      </div>

      <div className="mt-3 space-y-1">
        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          {product.team && <span>{product.team.name}</span>}
          {product.category && (
            <>
              <span>·</span>
              <span>{product.category.name}</span>
            </>
          )}
        </div>
        <h3 className="text-sm font-medium text-zinc-900 line-clamp-1 dark:text-white">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-zinc-900 dark:text-white">
            {formatPrice(Number(product.price))}
          </span>
          {product.comparePrice && (
            <span className="text-sm text-zinc-400 line-through">
              {formatPrice(Number(product.comparePrice))}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

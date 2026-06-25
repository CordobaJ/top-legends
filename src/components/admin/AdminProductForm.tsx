"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ImageUploader } from "./ImageUploader";
import { PRODUCT_SIZES, PRODUCT_TYPES } from "@/lib/constants";
import type { Category, Team, ProductVariant, ProductImage } from "@prisma/client";

interface ProductWithRelations {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice: number | null;
  sku: string;
  categoryId: string | null;
  teamId: string | null;
  season: string | null;
  type: string;
  gender: string;
  material: string | null;
  isActive: boolean;
  variants: ProductVariant[];
  images: ProductImage[];
}

interface AdminProductFormProps {
  categories: Category[];
  teams: Team[];
  product?: ProductWithRelations;
}

export function AdminProductForm({ categories, teams, product }: AdminProductFormProps) {
  const router = useRouter();
  const isEditing = !!product;
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState(
    PRODUCT_SIZES.map((size) => {
      const existing = product?.variants.find((v) => v.size === size);
      return {
        size,
        stock: existing?.stock ?? 0,
        priceAdj: existing ? Number(existing.priceAdj) : 0,
      };
    })
  );
  const [images, setImages] = useState(
    (product?.images ?? []).map((img) => ({
      url: img.url,
      alt: img.alt ?? undefined,
      isPrimary: img.isPrimary,
      order: img.order,
    }))
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const name = form.get("name") as string;
    const body = {
      name,
      slug: product?.slug ?? name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, ""),
      description: form.get("description"),
      price: Number(form.get("price")),
      comparePrice: form.get("comparePrice") ? Number(form.get("comparePrice")) : null,
      sku: form.get("sku"),
      categoryId: form.get("categoryId") || null,
      teamId: form.get("teamId") || null,
      season: form.get("season") || null,
      type: form.get("type"),
      gender: form.get("gender") || "unisex",
      material: form.get("material") || null,
      isActive: form.get("isActive") === "true",
      variants: variants.filter((v) => v.stock > 0),
      images,
    };

    try {
      const url = isEditing ? `/api/products/${product.id}` : "/api/products";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        router.push("/admin/productos");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Información básica</h2>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input id="name" name="name" label="Nombre" defaultValue={product?.name} required />
            <Input id="sku" name="sku" label="SKU" defaultValue={product?.sku} required />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              defaultValue={product?.description}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input id="price" name="price" label="Precio" type="number" defaultValue={product?.price} required />
            <Input id="comparePrice" name="comparePrice" label="Precio anterior" type="number" defaultValue={product?.comparePrice ?? undefined} />
            <Input id="material" name="material" label="Material" defaultValue={product?.material ?? undefined} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Clasificación</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Categoría
            </label>
            <select
              id="categoryId"
              name="categoryId"
              defaultValue={product?.categoryId ?? ""}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            >
              <option value="">Sin categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="teamId" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Equipo
            </label>
            <select
              id="teamId"
              name="teamId"
              defaultValue={product?.teamId ?? ""}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            >
              <option value="">Sin equipo</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Tipo
            </label>
            <select
              id="type"
              name="type"
              required
              defaultValue={product?.type ?? "CLUB"}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            >
              {Object.entries(PRODUCT_TYPES).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Imágenes</h2>
        <ImageUploader images={images} onChange={(imgs) => setImages(imgs)} />
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Inventario</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {variants.map((v, i) => (
            <div key={v.size}>
              <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">{v.size}</label>
              <input
                type="number"
                min={0}
                value={v.stock}
                onChange={(e) => {
                  const updated = [...variants];
                  updated[i] = { ...updated[i], stock: Number(e.target.value) };
                  setVariants(updated);
                }}
                className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
              />
            </div>
          ))}
        </div>
      </div>

      {isEditing && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Estado</h2>
          <div className="flex items-center gap-3">
            <select
              id="isActive"
              name="isActive"
              defaultValue={product?.isActive ? "true" : "false"}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" loading={loading}>
          {isEditing ? "Guardar cambios" : "Crear producto"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

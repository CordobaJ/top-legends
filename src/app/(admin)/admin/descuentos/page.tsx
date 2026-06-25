"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: number;
  comparePrice: number | null;
  category: { name: string } | null;
}

export default function BulkDiscountPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [percent, setPercent] = useState("");
  const [applying, setApplying] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/products");
    const json = await res.json();
    if (json.success) setProducts(json.data);
    setLoading(false);
  }

  function toggle(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
    setSelectAll(next.size === products.length);
  }

  function toggleAll() {
    if (selectAll) {
      setSelected(new Set());
      setSelectAll(false);
    } else {
      setSelected(new Set(products.map((p) => p.id)));
      setSelectAll(true);
    }
  }

  async function apply() {
    const pct = Number(percent);
    if (!pct || pct <= 0 || pct > 100) return;
    if (selected.size === 0) return;

    setApplying(true);
    const res = await fetch("/api/admin/bulk-discount", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productIds: Array.from(selected), discountPercent: pct }),
    });
    const json = await res.json();

    if (json.success) {
      setResult(`Descuento aplicado a ${json.updated} producto(s)`);
      setSelected(new Set());
      setPercent("");
      load();
    } else {
      setResult(`Error: ${json.error}`);
    }
    setApplying(false);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Descuentos por lote</h1>

      <div className="flex flex-wrap items-end gap-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="w-48">
          <Input
            label="% de descuento"
            type="number"
            min={1}
            max={100}
            value={percent}
            onChange={(e) => setPercent(e.target.value)}
            placeholder="Ej: 20"
          />
        </div>
        <Button onClick={apply} loading={applying} disabled={selected.size === 0 || !percent}>
          Aplicar a {selected.size} producto{selected.size !== 1 ? "s" : ""}
        </Button>
        {result && (
          <p className={`text-sm ${result.startsWith("Error") ? "text-red-500" : "text-green-600"}`}>{result}</p>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        {loading ? (
          <p className="p-4 text-sm text-zinc-500">Cargando...</p>
        ) : products.length === 0 ? (
          <p className="p-4 text-sm text-zinc-500">Sin productos</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left dark:border-zinc-800">
                <th className="px-4 py-3">
                  <input type="checkbox" checked={selectAll} onChange={toggleAll} className="h-4 w-4 rounded border-zinc-300" />
                </th>
                <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">Producto</th>
                <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">Categoría</th>
                <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">Precio actual</th>
                <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">Con descuento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {products.map((p) => {
                const discounted = percent ? Math.round(p.price * (1 - Number(percent) / 100) * 100) / 100 : null;
                return (
                  <tr key={p.id} className={`text-zinc-900 dark:text-white ${selected.has(p.id) ? "bg-blue-50 dark:bg-blue-950/20" : ""}`}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(p.id)}
                        onChange={() => toggle(p.id)}
                        className="h-4 w-4 rounded border-zinc-300"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-zinc-500">{p.category?.name ?? "—"}</td>
                    <td className="px-4 py-3">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3 text-green-600">
                      {selected.has(p.id) && discounted ? formatPrice(discounted) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  _count: { products: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/categories/list");
    const json = await res.json();
    if (json.success) setCategories(json.data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get("name"),
      slug: form.get("slug"),
      description: form.get("description") || null,
    };

    if (editing) {
      await fetch(`/api/admin/categories/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    setSaving(false);
    setShowForm(false);
    setEditing(null);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Categorías</h1>
        <Button onClick={() => { setEditing(null); setShowForm(!showForm); }}>
          {showForm ? "Cancelar" : "Nueva categoría"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
            {editing ? "Editar categoría" : "Nueva categoría"}
          </h2>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input id="name" name="name" label="Nombre" defaultValue={editing?.name} required />
              <Input id="slug" name="slug" label="Slug" defaultValue={editing?.slug} required placeholder="ej: camisetas-retro" />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Descripción</label>
              <textarea
                id="description" name="description" rows={3}
                defaultValue={editing?.description ?? ""}
                className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <Button type="submit" loading={saving}>{editing ? "Guardar" : "Crear"}</Button>
            <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditing(null); }}>Cancelar</Button>
          </div>
        </form>
      )}

      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        {loading ? (
          <p className="p-4 text-sm text-zinc-500">Cargando...</p>
        ) : categories.length === 0 ? (
          <p className="p-4 text-sm text-zinc-500">Sin categorías</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left dark:border-zinc-800">
                <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">Nombre</th>
                <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">Slug</th>
                <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">Productos</th>
                <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">Estado</th>
                <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {categories.map((cat) => (
                <tr key={cat.id} className="text-zinc-900 dark:text-white">
                  <td className="px-4 py-3 font-medium">{cat.name}</td>
                  <td className="px-4 py-3 text-zinc-500">{cat.slug}</td>
                  <td className="px-4 py-3">{cat._count.products}</td>
                  <td className="px-4 py-3">
                    {cat.isActive ? (
                      <span className="text-green-600">Activo</span>
                    ) : (
                      <span className="text-red-500">Inactivo</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => { setEditing(cat); setShowForm(true); }}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

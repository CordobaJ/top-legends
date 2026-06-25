"use client";

import { useState } from "react";
import { FilterClient } from "./FilterClient";
import { PRODUCT_SIZES, PRODUCT_TYPES } from "@/lib/constants";

interface FilterBarProps {
  categories: { slug: string; name: string }[];
  teams: { slug: string; name: string }[];
}

export function FilterBar({ categories, teams }: FilterBarProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="mb-3 inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
        </svg>
        Filtros
        <svg className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Categoría</h3>
              <div className="flex flex-wrap gap-1.5">
                <FilterClient type="category" slug="" label="Todas" />
                {categories.map((cat) => (
                  <FilterClient key={cat.slug} type="category" slug={cat.slug} label={cat.name} />
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Equipo</h3>
              <div className="flex flex-wrap gap-1.5">
                <FilterClient type="team" slug="" label="Todos" />
                {teams.map((team) => (
                  <FilterClient key={team.slug} type="team" slug={team.slug} label={team.name} />
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Tipo</h3>
              <div className="flex flex-wrap gap-1.5">
                <FilterClient type="type" slug="" label="Todos" />
                {Object.entries(PRODUCT_TYPES)
                  .sort(([, a], [, b]) => a.localeCompare(b))
                  .map(([value, label]) => (
                    <FilterClient key={value} type="type" slug={value} label={label} />
                  ))}
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Talla</h3>
              <div className="flex flex-wrap gap-1.5">
                <FilterClient type="size" slug="" label="Todas" />
                {PRODUCT_SIZES.map((size) => (
                  <FilterClient key={size} type="size" slug={size} label={size} />
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Precio</h3>
              <div className="flex flex-wrap gap-1.5">
                <FilterClient type="minPrice" slug="" label="Sin mínimo" />
                <FilterClient type="minPrice" slug="50000" label="Desde $50K" />
                <FilterClient type="minPrice" slug="100000" label="Desde $100K" />
                <FilterClient type="minPrice" slug="150000" label="Desde $150K" />
                <FilterClient type="maxPrice" slug="" label="Sin máximo" />
                <FilterClient type="maxPrice" slug="50000" label="Hasta $50K" />
                <FilterClient type="maxPrice" slug="100000" label="Hasta $100K" />
                <FilterClient type="maxPrice" slug="150000" label="Hasta $150K" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

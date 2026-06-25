import { prisma } from "@/lib/prisma";
import { FilterClient } from "./FilterClient";
import { PRODUCT_SIZES, PRODUCT_TYPES } from "@/lib/constants";

export async function ProductFilters() {
  const [categories, teams] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.team.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">Categorías</h3>
        <ul className="space-y-2">
          <li><FilterClient type="category" slug="" label="Todas" /></li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <FilterClient type="category" slug={cat.slug} label={cat.name} />
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">Equipos</h3>
        <ul className="space-y-2">
          <li><FilterClient type="team" slug="" label="Todos" /></li>
          {teams.map((team) => (
            <li key={team.id}>
              <FilterClient type="team" slug={team.slug} label={team.name} />
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">Tipo</h3>
        <ul className="space-y-2">
          <li><FilterClient type="type" slug="" label="Todos" /></li>
          {Object.entries(PRODUCT_TYPES)
            .sort(([, a], [, b]) => a.localeCompare(b))
            .map(([value, label]) => (
            <li key={value}>
              <FilterClient type="type" slug={value} label={label} />
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">Talla</h3>
        <ul className="space-y-2">
          <li><FilterClient type="size" slug="" label="Todas" /></li>
          {PRODUCT_SIZES.map((size) => (
            <li key={size}>
              <FilterClient type="size" slug={size} label={size} />
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">Precio</h3>
        <PriceFilter />
      </div>
    </div>
  );
}

function PriceFilter() {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Desde</p>
      <FilterClient type="minPrice" slug="" label="Sin mínimo" />
      <FilterClient type="minPrice" slug="50000" label="$50.000" />
      <FilterClient type="minPrice" slug="100000" label="$100.000" />
      <FilterClient type="minPrice" slug="150000" label="$150.000" />
      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Hasta</p>
      <FilterClient type="maxPrice" slug="" label="Sin máximo" />
      <FilterClient type="maxPrice" slug="50000" label="$50.000" />
      <FilterClient type="maxPrice" slug="100000" label="$100.000" />
      <FilterClient type="maxPrice" slug="150000" label="$150.000" />
    </div>
  );
}

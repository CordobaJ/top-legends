"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface FilterClientProps {
  type: "category" | "team" | "type" | "size" | "minPrice" | "maxPrice";
  slug: string;
  label: string;
}

export function FilterClient({ type, slug, label }: FilterClientProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get(type);

  const isActive = slug === "" ? !current : current === slug;

  const params = new URLSearchParams(searchParams.toString());
  if (!slug) {
    params.delete(type);
  } else {
    params.set(type, slug);
  }

  const href = `${pathname}?${params.toString()}`;

  return (
    <Link
      href={href}
      className={`inline-block rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        isActive
          ? "bg-blue-600 text-white"
          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
      }`}
    >
      {label}
    </Link>
  );
}

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/product/ProductGrid";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const team = await prisma.team.findUnique({ where: { slug } });

  if (!team) return { title: "Equipo no encontrado" };

  return {
    title: team.name,
    description: `Camisetas de ${team.name}`,
  };
}

export default async function TeamPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const team = await prisma.team.findUnique({ where: { slug, isActive: true } });

  if (!team) notFound();

  const sp = await searchParams;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">{team.name}</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {team.country && `${team.country} · `}{team.league ?? ""}
        </p>
      </div>
      <ProductGrid searchParams={{ ...sp, team: slug }} />
    </div>
  );
}

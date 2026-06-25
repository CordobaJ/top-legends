import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import type { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search");
    const limit = Number(url.searchParams.get("limit")) || undefined;

    const where: Prisma.ProductWhereInput = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { team: { name: { contains: search } } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: { images: true, variants: true, category: true, team: true },
      orderBy: { createdAt: "desc" },
      ...(limit ? { take: limit } : {}),
    });

    return NextResponse.json({ success: true, data: products });
  } catch {
    return NextResponse.json({ success: false, error: "Error al obtener productos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { variants, images, ...productData } = body;

    const product = await prisma.product.create({
      data: {
        ...productData,
        variants: {
          create: variants.map((v: { size: string; stock: number; priceAdj: number }) => ({
            size: v.size,
            stock: v.stock,
            priceAdj: v.priceAdj,
          })),
        },
        images: images?.length
          ? {
              create: images.map((img: { url: string; alt?: string; order?: number; isPrimary?: boolean }) => ({
                url: img.url,
                alt: img.alt,
                order: img.order ?? 0,
                isPrimary: img.isPrimary ?? false,
              })),
            }
          : undefined,
      },
      include: { images: true, variants: true },
    });

    return NextResponse.json({ success: true, data: product });
  } catch {
    return NextResponse.json({ success: false, error: "Error al crear producto" }, { status: 500 });
  }
}

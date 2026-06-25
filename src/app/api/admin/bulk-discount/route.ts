import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
  }

  try {
    const { productIds, discountPercent } = await request.json();

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ success: false, error: "Selecciona al menos un producto" }, { status: 400 });
    }

    if (typeof discountPercent !== "number" || discountPercent <= 0 || discountPercent > 100) {
      return NextResponse.json({ success: false, error: "Porcentaje inválido (1-100)" }, { status: 400 });
    }

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true },
    });

    const updates = products.map((p) =>
      prisma.product.update({
        where: { id: p.id },
        data: {
          comparePrice: p.price,
          price: Math.round(p.price * (1 - discountPercent / 100) * 100) / 100,
        },
      })
    );

    await prisma.$transaction(updates);

    return NextResponse.json({ success: true, updated: products.length });
  } catch {
    return NextResponse.json({ success: false, error: "Error al aplicar descuento" }, { status: 500 });
  }
}

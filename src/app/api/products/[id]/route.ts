import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { variants, images, ...productData } = body;

    await prisma.productVariant.deleteMany({ where: { productId: id } });
    await prisma.productImage.deleteMany({ where: { productId: id } });

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...productData,
        variants: {
          create: variants.map((v: { size: string; stock: number; priceAdj: number }) => ({
            size: v.size,
            stock: v.stock,
            priceAdj: v.priceAdj,
          })),
        },
        images: images
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
    return NextResponse.json({ success: false, error: "Error al actualizar producto" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.product.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Error al eliminar producto" }, { status: 500 });
  }
}

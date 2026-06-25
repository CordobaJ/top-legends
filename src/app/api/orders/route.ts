import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/utils";
import { sendOrderConfirmation } from "@/lib/email";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      include: { items: true, shippingAddress: true, user: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: orders });
  } catch {
    return NextResponse.json({ success: false, error: "Error al obtener pedidos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const body = await request.json();
    const orderNumber = generateOrderNumber();

    const address = await prisma.address.create({
      data: {
        fullName: body.shippingAddress.fullName,
        street: body.shippingAddress.street,
        city: body.shippingAddress.city,
        state: body.shippingAddress.state,
        zipCode: body.shippingAddress.zipCode,
        phone: body.shippingAddress.phone,
      },
    });

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session?.user?.id ?? null,
        shippingAddressId: address.id,
        subtotal: body.subtotal,
        shipping: body.shippingCost,
        total: body.total,
        items: {
          create: body.items.map((item: { productId: string; name: string; image?: string; size: string; quantity: number; price: number }) => ({
            productId: item.productId,
            productName: item.name,
            productImage: item.image,
            size: item.size,
            quantity: item.quantity,
            unitPrice: item.price,
            subtotal: item.price * item.quantity,
          })),
        },
      },
    });

    sendOrderConfirmation({
      to: body.shippingAddress.email,
      orderNumber,
      customerName: body.shippingAddress.fullName,
      items: body.items.map((item: { name: string; size: string; quantity: number; price: number }) => ({
        productName: item.name,
        size: item.size,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
      total: body.total,
      shippingAddress: {
        fullName: body.shippingAddress.fullName,
        street: body.shippingAddress.street,
        city: body.shippingAddress.city,
        state: body.shippingAddress.state,
        zipCode: body.shippingAddress.zipCode,
      },
    });

    return NextResponse.json({ success: true, orderNumber: order.orderNumber, orderId: order.id });
  } catch {
    return NextResponse.json({ success: false, error: "Error al crear pedido" }, { status: 500 });
  }
}

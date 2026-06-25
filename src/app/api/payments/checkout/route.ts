import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createPreference } from "@/lib/mercadopago";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const body = await request.json();
    const { orderId } = body;

    const origin = request.headers.get("origin") || request.headers.get("x-forwarded-host") || process.env.NEXT_PUBLIC_APP_URL || `https://${process.env.NEXT_PUBLIC_VERCEL_URL || "top-legends.vercel.app"}`;
    const baseUrl = origin.startsWith("http") ? origin : `https://${origin}`;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, user: true },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: "Pedido no encontrado" }, { status: 404 });
    }

    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      return NextResponse.json({
        success: true,
        sandbox: true,
        orderNumber: order.orderNumber,
      });
    }

    const pref = await createPreference({
      items: order.items.map((item) => ({
        title: `${item.productName} - Talla ${item.size}`,
        quantity: item.quantity,
        unit_price: item.unitPrice,
      })),
      externalReference: order.orderNumber,
      payerEmail: session?.user?.email ?? undefined,
      baseUrl,
    });

    if (!pref) {
      return NextResponse.json({ success: false, error: "Error al crear preferencia con MercadoPago" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      initPoint: pref.init_point,
      orderNumber: order.orderNumber,
      sandbox: false,
    });
  } catch (error: unknown) {
    let msg = "Error desconocido";
    if (error instanceof Error) msg = error.message;
    else if (typeof error === "object" && error !== null) {
      const obj = error as Record<string, unknown>;
      msg = (obj.message as string) || (obj.cause as string) || JSON.stringify(obj);
    } else if (typeof error === "string") msg = error;
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

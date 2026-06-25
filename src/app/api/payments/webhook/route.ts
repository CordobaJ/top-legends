import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.type === "payment") {
      const paymentId = body.data.id;
      const payment = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          },
        }
      ).then((r) => r.json());

      const orderNumber = payment.external_reference;
      const status = payment.status;

      if (status === "approved") {
        await prisma.order.update({
          where: { orderNumber },
          data: {
            paymentStatus: "APPROVED",
            paymentId: String(paymentId),
            paymentMethod: payment.payment_method_id,
            status: "CONFIRMED",
          },
        });
      } else if (status === "rejected" || status === "cancelled") {
        await prisma.order.update({
          where: { orderNumber },
          data: {
            paymentStatus: "REJECTED",
            paymentId: String(paymentId),
            status: "CANCELLED",
          },
        });
      } else if (status === "pending") {
        await prisma.order.update({
          where: { orderNumber },
          data: {
            paymentStatus: "PENDING",
            paymentId: String(paymentId),
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

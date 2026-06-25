import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOrderConfirmation(params: {
  to: string;
  orderNumber: string;
  customerName: string;
  items: { productName: string; size: string; quantity: number; unitPrice: number }[];
  total: number;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}) {
  const { to, orderNumber, customerName, items, total, shippingAddress } = params;

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${item.productName}</td>
        <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${item.size}</td>
        <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${item.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right;">$${item.unitPrice.toLocaleString("es-CO")}</td>
        <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right;">$${(item.unitPrice * item.quantity).toLocaleString("es-CO")}</td>
      </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#2563eb;padding:24px;text-align:center;">
        <h1 style="color:white;margin:0;font-size:20px;">Top Legends</h1>
      </div>
      <div style="padding:24px;border:1px solid #e5e7eb;border-top:none;">
        <h2 style="margin-top:0;">¡Pedido confirmado!</h2>
        <p>Hola <strong>${customerName}</strong>,</p>
        <p>Tu pedido <strong>${orderNumber}</strong> ha sido confirmado.</p>

        <h3 style="margin-top:24px;">Resumen del pedido</h3>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <thead>
            <tr style="background:#f9fafb;">
              <th style="padding:8px;text-align:left;">Producto</th>
              <th style="padding:8px;text-align:left;">Talla</th>
              <th style="padding:8px;text-align:left;">Cant.</th>
              <th style="padding:8px;text-align:right;">Precio</th>
              <th style="padding:8px;text-align:right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>

        <p style="text-align:right;font-size:18px;font-weight:bold;margin-top:16px;">
          Total: $${total.toLocaleString("es-CO")}
        </p>

        <h3 style="margin-top:24px;">Dirección de envío</h3>
        <p style="font-size:14px;color:#374151;">
          ${shippingAddress.fullName}<br>
          ${shippingAddress.street}<br>
          ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.zipCode}
        </p>

        <p style="margin-top:24px;font-size:14px;color:#6b7280;">
          Gracias por tu compra. Te notificaremos cuando tu pedido sea enviado.
        </p>
      </div>
    </div>
  `;

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("[EMAIL] SMTP not configured. Skipping email send.");
    console.log("[EMAIL] Would send to:", to);
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || "noreply@toplegends.co",
    to,
    subject: `Pedido ${orderNumber} confirmado - Top Legends`,
    html,
  });
}

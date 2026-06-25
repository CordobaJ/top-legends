import { MercadoPagoConfig, Preference } from "mercadopago";

const token = process.env.MERCADOPAGO_ACCESS_TOKEN;

export const mercadopagoClient = token
  ? new MercadoPagoConfig({ accessToken: token })
  : null;

export function createPreference(data: {
  items: { title: string; quantity: number; unit_price: number }[];
  externalReference: string;
  payerEmail?: string;
}) {
  if (!mercadopagoClient) return null;

  const preference = new Preference(mercadopagoClient);

  return preference.create({
    body: {
      items: data.items.map((item, i) => ({
        id: String(i + 1),
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
        currency_id: "COP",
      })),
      external_reference: data.externalReference,
      payer: data.payerEmail ? { email: data.payerEmail } : undefined,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/success?order=${data.externalReference}`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout`,
      },
      auto_return: "approved",
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/payments/webhook`,
    },
  });
}

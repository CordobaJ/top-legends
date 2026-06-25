import { MercadoPagoConfig, Preference } from "mercadopago";

const token = process.env.MERCADOPAGO_ACCESS_TOKEN;

export const mercadopagoClient = token
  ? new MercadoPagoConfig({ accessToken: token })
  : null;

export async function createPreference(data: {
  items: { title: string; quantity: number; unit_price: number }[];
  externalReference: string;
  payerEmail?: string;
}) {
  if (!mercadopagoClient) return null;

  const preference = new Preference(mercadopagoClient);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : "http://localhost:3000");

  try {
    const result = await preference.create({
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
          success: `${baseUrl}/checkout/success?order=${data.externalReference}`,
          failure: `${baseUrl}/checkout`,
          pending: `${baseUrl}/checkout`,
        },
        auto_return: "approved",
        notification_url: `${baseUrl}/api/payments/webhook`,
      },
    });
    return result;
  } catch (error: unknown) {
    let msg = "Error desconocido";
    if (error instanceof Error) msg = error.message;
    else if (typeof error === "object" && error !== null) {
      const obj = error as Record<string, unknown>;
      msg = (obj.message as string) || (obj.cause as string) || JSON.stringify(obj);
    } else if (typeof error === "string") msg = error;
    console.error("MercadoPago createPreference error:", msg, error);
    throw error;
  }
}

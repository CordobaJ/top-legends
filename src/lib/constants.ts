export const SITE_NAME = "Top Legends";
export const SITE_DESCRIPTION = "Tienda online especializada en productos de fútbol. Camisetas de clubes, selecciones, retro y uniformes completos.";
export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const SHIPPING_COST = 15000;
export const FREE_SHIPPING_MIN = 200000;

export const PRODUCT_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

export const PRODUCT_TYPES = {
  RETRO: "Retro",
  CLUB: "Club",
  SELECTION: "Selección",
  UNIFORM: "Uniforme",
} as const;

export const ORDER_STATUS: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmado",
  PROCESSING: "Procesando",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

export const PAYMENT_STATUS: Record<string, string> = {
  PENDING: "Pendiente",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
  REFUNDED: "Reembolsado",
};

export const ROLES = {
  ADMIN: "Admin",
  CUSTOMER: "Cliente",
} as const;

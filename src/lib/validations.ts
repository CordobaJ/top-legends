import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const productSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  price: z.coerce.number().positive("El precio debe ser positivo"),
  comparePrice: z.coerce.number().positive().optional(),
  cost: z.coerce.number().positive().optional(),
  sku: z.string().min(1, "El SKU es requerido"),
  categoryId: z.string().optional(),
  teamId: z.string().optional(),
  season: z.string().optional(),
  type: z.enum(["RETRO", "CLUB", "SELECTION", "UNIFORM"]),
  gender: z.string().default("unisex"),
  material: z.string().optional(),
  variants: z.array(
    z.object({
      size: z.string(),
      stock: z.coerce.number().int().min(0),
      priceAdj: z.coerce.number().default(0),
    })
  ),
});

export const checkoutSchema = z.object({
  fullName: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(1, "El teléfono es requerido"),
  street: z.string().min(1, "La dirección es requerida"),
  city: z.string().min(1, "La ciudad es requerida"),
  state: z.string().min(1, "El departamento es requerido"),
  zipCode: z.string().min(1, "El código postal es requerido"),
  notes: z.string().optional(),
});

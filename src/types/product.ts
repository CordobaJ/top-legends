export interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  order: number;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  size: string;
  stock: number;
  priceAdj: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice: number | null;
  sku: string;
  category: { id: string; name: string; slug: string } | null;
  team: { id: string; name: string; slug: string; logo: string | null } | null;
  season: string | null;
  type: string;
  gender: string;
  images: ProductImage[];
  variants: ProductVariant[];
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
}

export interface ProductFilters {
  category?: string;
  team?: string;
  type?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  season?: string;
  gender?: string;
  search?: string;
  sort?: "price_asc" | "price_desc" | "name_asc" | "name_desc" | "newest";
}

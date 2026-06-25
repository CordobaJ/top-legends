export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string | null;
  size: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Address {
  id: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string | null;
  isDefault: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  total: number;
  subtotal: number;
  shipping: number;
  discount: number;
  paymentStatus: "PENDING" | "APPROVED" | "REJECTED" | "REFUNDED";
  paymentMethod: string | null;
  items: OrderItem[];
  shippingAddress: Address | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

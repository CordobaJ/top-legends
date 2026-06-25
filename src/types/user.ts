export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  phone: string | null;
  role: "ADMIN" | "CUSTOMER";
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

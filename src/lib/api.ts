const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json() as Promise<T>;
}

export interface ApiProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  original_price?: number;
  is_new?: boolean;
  details: string[];
  image_url?: string;
}

export interface ApiAdminSummary {
  total_revenue: number;
  total_orders: number;
  total_customers: number;
  total_products: number;
  recent_orders: any[];
}

export interface ApiUser {
  id: string;
  email?: string | null;
  phone?: string | null;
  role?: string;
  name?: string | null;
  avatar_url?: string | null;
}

export interface AuthResponse {
  access_token: string;
  user: ApiUser;
}

export interface ApiOrderItem {
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  image_url?: string | null;
}

export interface ApiOrder {
  id: string;
  user_id: string | null;
  status: string;
  total: number;
  items: ApiOrderItem[];
  shipping: {
    name: string;
    phone: string;
    street: string;
    city: string;
    region: string;
  };
  created_at?: string;
}

export interface ApiAdminCustomer {
  user_id: string | null;
  name: string;
  phone?: string | null;
  email?: string | null;
  orders: number;
  total_spent: number;
  joined_at: string;
}

export const api = {
  // products
  getProducts: () => request<ApiProduct[]>("/products"),
  getProduct: (id: string) => request<ApiProduct>(`/products/${id}`),
  createProduct: (payload: Partial<ApiProduct>, token: string) =>
    request<ApiProduct>("/products", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { Authorization: `Bearer ${token}` },
    }),
  updateProduct: (id: string, payload: Partial<ApiProduct>, token: string) =>
    request<ApiProduct>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: { Authorization: `Bearer ${token}` },
    }),
  deleteProduct: (id: string, token: string) =>
    request(`/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }),

  // admin
  adminSummary: (token: string) =>
    request<ApiAdminSummary>("/admin/summary", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  adminCustomers: (token: string) =>
    request<ApiAdminCustomer[]>("/admin/customers", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  adminOrders: (token: string) =>
    request<ApiOrder[]>("/orders/admin/all", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  updateOrderStatus: (id: string, status: string, token: string) =>
    request<ApiOrder>(`/orders/admin/${id}/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    }),

  // auth
  login: (email: string, password: string) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  signup: (email: string, password: string, name: string) =>
    request<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    }),
  me: (token: string) =>
    request<ApiUser>("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    }),
  updateMe: (token: string, updates: { name?: string; avatar_url?: string }) =>
    request<{ user: ApiUser }>("/auth/me", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(updates),
    }),

  // current user orders
  getOrders: (token: string) =>
    request<ApiOrder[]>("/orders", {
      headers: { Authorization: `Bearer ${token}` },
    }),
};


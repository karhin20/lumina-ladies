const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { headers: optionHeaders, ...restOptions } = options;

  // Don't set Content-Type for FormData (let browser set it with boundary)
  const isFormData = restOptions.body instanceof FormData;
  const defaultHeaders: HeadersInit = isFormData
    ? {}
    : { "Content-Type": "application/json" };

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...restOptions,
    headers: {
      ...defaultHeaders,
      ...(optionHeaders || {}),
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("lumigh_token");
      localStorage.removeItem("lumigh_user");
      window.dispatchEvent(new Event("lumigh_unauthorized"));
    }
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
  details?: string[];
  image_url?: string | null;
  images?: string[];
  is_flash_sale?: boolean;
  sales_count?: number;
  is_featured?: boolean;
  created_at?: string;
  vendor_id?: string;
  vendor_name?: string;
  vendor_slug?: string;
  video_url?: string;
  rating?: number;
  reviews_count?: number;
}

export interface ApiVendorStat {
  vendor_id: string;
  vendor_name: string;
  total_revenue: number;
  total_sales: number;
}

export interface ApiAdminSummary {
  total_revenue: number;
  total_orders: number;
  total_customers: number;
  total_products: number;
  recent_orders: any[];
  vendor_stats?: ApiVendorStat[];
}

export interface ApiUser {
  id: string;
  email?: string | null;
  phone?: string | null;
  role?: string;
  name?: string | null;
  avatar_url?: string | null;
  favorites?: string[]; // Added favorites
  address?: {
    name: string;
    phone: string;
    street: string;
    city: string;
    region: string;
  } | null;
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

export interface ApiVendor {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logo_url?: string | null;
  banner_url?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  address?: {
    street?: string;
    city?: string;
    region?: string;
    postal_code?: string;
  } | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiVendorUpdate {
  name?: string;
  description?: string | null;
  logo_url?: string | null;
  banner_url?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  address?: {
    street?: string;
    city?: string;
    region?: string;
    postal_code?: string;
  } | null;
}


export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user_metadata?: {
    full_name: string;
    avatar_url?: string;
  };
}

export interface CreateReviewData {
  product_id: string;
  rating: number;
  comment?: string;
}

export const api = {

  // products
  getProducts: () => request<ApiProduct[]>("/products"),
  getFlashSales: () => request<ApiProduct[]>("/products/flash-sales"),
  getBestSelling: () => request<ApiProduct[]>("/products/best-selling"),
  getNewArrivals: () => request<ApiProduct[]>("/products/new-arrivals"),
  getProduct: (id: string) => request<ApiProduct>(`/products/${id}`),
  createProduct: (payload: Partial<ApiProduct>, token: string) =>
    request<ApiProduct>("/products", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
    }),
  updateProduct: (id: string, payload: Partial<ApiProduct>, token: string) =>
    request<ApiProduct>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
    }),
  deleteProduct: (id: string, token: string) =>
    request(`/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }),

  uploadImage: (productId: string, file: File, token: string) => {
    const formData = new FormData();
    formData.append("file", file);
    return request<{ image_url: string }>(`/products/${productId}/image`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
  },

  deleteImage: (filePath: string, token: string) =>
    request<{ status: string; data: any }>(`/products/storage/image?file_path=${encodeURIComponent(filePath)}`, {
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
  signup: (email: string, password: string, name: string, phone?: string) =>
    request<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, name, phone }),
    }),
  me: (token: string) =>
    request<ApiUser>("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    }),
  updateMe: (token: string, updates: { name?: string; avatar_url?: string; phone?: string; email?: string; address?: any }) =>
    request<{ user: ApiUser }>("/auth/me", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(updates),
    }),
  toggleFavorite: (token: string, productId: string) =>
    request<string[]>("/auth/favorites", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ product_id: productId }),
    }),

  // current user orders
  getOrders: (token: string) =>
    request<ApiOrder[]>("/orders", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // vendors
  getVendors: () => request<ApiVendor[]>("/vendors"),

  getVendor: (vendorId: string) =>
    request<ApiVendor>(`/vendors/${vendorId}`),

  getMyVendor: (token: string) =>
    request<ApiVendor | null>("/vendors/me", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getVendorProducts: (vendorId: string) =>
    request<ApiProduct[]>(`/vendors/${vendorId}/products`),

  updateVendor: (vendorId: string, data: ApiVendorUpdate, token: string) =>
    request<ApiVendor>(`/vendors/${vendorId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),

  // orders
  createOrder: (payload: { items: ApiOrderItem[]; total: number; shipping: any }, token: string) =>
    request<ApiOrder>("/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    }),

  // reviews
  getReviews: (productId: string) => request<Review[]>(`/reviews/${productId}`),

  createReview: (data: CreateReviewData, token: string) =>
    request<Review>("/reviews/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }),

  getGoogleAuthUrl: () => request<{ url: string }>("/auth/google-url"),

  refreshSession: (refreshToken: string) =>
    request<AuthResponse>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    }),
};



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
      // Attempt to refresh token
      const refreshToken = localStorage.getItem("kelsmall_refresh_token");
      if (refreshToken) {
        try {
          // Access endpoint directly to avoid recursion loop
          const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });

          if (refreshRes.ok) {
            const data = await refreshRes.json();
            const newAccessToken = data.access_token;

            // Validate that we actually got a new token
            if (newAccessToken) {
              localStorage.setItem("kelsmall_token", newAccessToken);
              if (data.refresh_token) {
                // Update refresh token if rotated (though our backend might not return it explicitly yet, Supabase does)
                // If backend passes it through, save it.
              }
              // Ideally update user too, but token is most critical for request success

              // Retry original request with new token
              const headers = new Headers(options.headers || {});
              headers.set("Authorization", `Bearer ${newAccessToken}`);

              const retryRes = await fetch(`${API_BASE_URL}${path}`, {
                ...restOptions,
                headers,
              });

              if (retryRes.ok) {
                return retryRes.json() as Promise<T>;
              }
            }
          }
        } catch (e) {
          console.error("Token refresh failed", e);
        }
      }

      // If we are here, refresh failed or no refresh token
      localStorage.removeItem("kelsmall_token");
      localStorage.removeItem("kelsmall_user");
      // Don't remove refresh token immediately? No, if it failed, it's garbage.
      localStorage.removeItem("kelsmall_refresh_token");
      window.dispatchEvent(new Event("kelsmall_unauthorized"));
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
  flash_sale_end_time?: string;
  sales_count?: number;
  is_featured?: boolean;
  created_at?: string;
  vendor_id?: string;
  vendor_name?: string;
  vendor_slug?: string;
  video_url?: string;
  rating?: number;
  reviews_count?: number;
  status?: string;
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
  revenue_change: number;
  orders_change: number;
  customers_change: number;
  products_change: number;
  recent_orders: any[];
  vendor_stats?: ApiVendorStat[];
  top_products?: { name: string; sales: number; revenue: number }[];
  daily_stats?: { date: string; revenue: number; orders: number }[];
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
  // products
  getProducts: (params?: { vendor_id?: string }, token?: string) => {
    const searchParams = new URLSearchParams();
    if (params?.vendor_id) searchParams.append("vendor_id", params.vendor_id);
    const queryString = searchParams.toString();
    return request<ApiProduct[]>(`/products${queryString ? `?${queryString}` : ""}`, {
      ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
    });
  },
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

  googleCodeExchange: (code: string) =>
    request<AuthResponse>("/auth/google-callback", {
      method: "POST",
      body: JSON.stringify({ code }),
    }),

  refreshSession: (refreshToken: string) =>
    request<AuthResponse>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    }),

  // subscriptions
  subscribe: (email: string) =>
    request<{ id: string; email: string; created_at: string }>("/subscriptions", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  deleteAccount: (token: string) =>
    request("/auth/me", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }),

  updateProductStatus: (id: string, status: string, token: string) =>
    request<ApiProduct>(`/products/${id}/status?status=${status}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    }),

  getAuditLogs: (token: string, resourceType?: string) => {
    let url = "/audit/logs";
    if (resourceType) url += `?resource_type=${resourceType}`;
    return request<any[]>(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};




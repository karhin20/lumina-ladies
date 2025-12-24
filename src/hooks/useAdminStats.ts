import { useQuery } from "@tanstack/react-query";
import { api, ApiAdminSummary } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

// Transform API response to match local stats shape
interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  recent_orders: any[];
  topProducts: { name: string; sales: number; revenue: number }[];
}

const defaultStats: AdminStats = {
  totalRevenue: 0,
  totalOrders: 0,
  totalCustomers: 0,
  totalProducts: 0,
  recent_orders: [],
  topProducts: [],
};

export const useAdminStats = () => {
  const { sessionToken } = useAuth();

  return useQuery({
    queryKey: ["admin-summary", sessionToken],
    queryFn: async (): Promise<AdminStats> => {
      const data = await api.adminSummary(sessionToken || "");
      return {
        totalRevenue: data.total_revenue,
        totalOrders: data.total_orders,
        totalCustomers: data.total_customers,
        totalProducts: data.total_products,
        recent_orders: data.recent_orders || [],
        topProducts: [],
      };
    },
    enabled: Boolean(sessionToken),
    placeholderData: defaultStats,
    retry: 1,
  });
};

export type { AdminStats };

import { useQuery } from "@tanstack/react-query";
import { api, ApiOrder } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export const useAdminOrders = () => {
  const { sessionToken } = useAuth();

  return useQuery<ApiOrder[]>({
    queryKey: ["admin-orders", sessionToken],
    enabled: Boolean(sessionToken),
    queryFn: () => api.adminOrders(sessionToken || ""),
    retry: 1,
  });
};









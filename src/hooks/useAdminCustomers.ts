import { useQuery } from "@tanstack/react-query";
import { api, ApiAdminCustomer } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export const useAdminCustomers = () => {
  const { sessionToken } = useAuth();

  return useQuery<ApiAdminCustomer[]>({
    queryKey: ["admin-customers", sessionToken],
    enabled: Boolean(sessionToken),
    queryFn: () => api.adminCustomers(sessionToken || ""),
    retry: 1,
  });
};










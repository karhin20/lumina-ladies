import { useQuery } from "@tanstack/react-query";
import { api, ApiAdminSummary } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";


export const useAdminStats = () => {
  const { sessionToken } = useAuth();

  return useQuery<ApiAdminSummary>({
    queryKey: ["admin-summary", sessionToken],
    queryFn: () => api.adminSummary(sessionToken || ""),
    enabled: Boolean(sessionToken),
    retry: 1,
  });
};


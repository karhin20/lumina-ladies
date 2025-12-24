import { useQuery } from "@tanstack/react-query";
import { api, ApiAdminSummary } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { mockAdminStats } from "@/data/mockData";

export const useAdminStats = () => {
  const { sessionToken } = useAuth();

  return useQuery<ApiAdminSummary>({
    queryKey: ["admin-summary", sessionToken],
    queryFn: () => api.adminSummary(sessionToken || ""),
    enabled: Boolean(sessionToken),
    placeholderData: mockAdminStats,
    retry: 1,
  });
};


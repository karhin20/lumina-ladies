import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { api, ApiVendor } from "@/lib/api";

export const useVendor = () => {
    const { user, sessionToken } = useAuth();

    const { data: vendor, isLoading, error, refetch } = useQuery<ApiVendor | null>({
        queryKey: ["vendor", user?.id],
        queryFn: async () => {
            if (!sessionToken) return null;

            // Only fetch vendor for vendor_admin users
            if (user?.role !== "vendor_admin") {
                return null;
            }

            try {
                const vendorData = await api.getMyVendor(sessionToken);
                return vendorData;
            } catch (err) {
                console.error("Failed to fetch vendor:", err);
                return null;
            }
        },
        enabled: !!sessionToken && user?.role === "vendor_admin",
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    return {
        vendor,
        isLoading,
        error,
        refetch,
        isVendorAdmin: user?.role === "vendor_admin",
        isSuperAdmin: user?.role === "super_admin" || user?.role === "admin",
    };
};

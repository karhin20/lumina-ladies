import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Vendor, VendorCreate, VendorUpdate } from "@/types/vendor";
import { ApiProduct } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const { headers: optionHeaders, ...restOptions } = options;

    const defaultHeaders: HeadersInit = { "Content-Type": "application/json" };

    const res = await fetch(`${API_BASE_URL}${path}`, {
        ...restOptions,
        headers: {
            ...defaultHeaders,
            ...(optionHeaders || {}),
        },
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
    }
    return res.json() as Promise<T>;
}

// Fetch all vendors
export function useVendors(activeOnly: boolean = true) {
    return useQuery<Vendor[]>({
        queryKey: ["vendors", { activeOnly }],
        queryFn: async () => {
            return request<Vendor[]>(`/vendors/?active_only=${activeOnly}`);
        },
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
    });
}

// Fetch single vendor
export function useVendor(vendorId: string | undefined) {
    return useQuery<Vendor>({
        queryKey: ["vendors", vendorId],
        queryFn: async () => {
            if (!vendorId) throw new Error("Vendor ID is required");
            return request<Vendor>(`/vendors/${vendorId}`);
        },
        enabled: !!vendorId,
    });
}

// Fetch vendor's products
export function useVendorProducts(vendorId: string | undefined) {
    return useQuery<ApiProduct[]>({
        queryKey: ["vendors", vendorId, "products"],
        queryFn: async () => {
            if (!vendorId) throw new Error("Vendor ID is required");
            return request<ApiProduct[]>(`/vendors/${vendorId}/products`);
        },
        enabled: !!vendorId,
    });
}

// Create vendor (super admin only)
export function useCreateVendor() {
    const queryClient = useQueryClient();
    const { sessionToken } = useAuth();

    return useMutation({
        mutationFn: async (data: VendorCreate) => {
            return request<Vendor>("/vendors/", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    Authorization: `Bearer ${sessionToken}`,
                },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vendors"] });
        },
    });
}

// Update vendor
export function useUpdateVendor(vendorId: string) {
    const queryClient = useQueryClient();
    const { sessionToken } = useAuth();

    return useMutation({
        mutationFn: async (data: VendorUpdate) => {
            return request<Vendor>(`/vendors/${vendorId}`, {
                method: "PUT",
                body: JSON.stringify(data),
                headers: {
                    Authorization: `Bearer ${sessionToken}`,
                },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vendors"] });
            queryClient.invalidateQueries({ queryKey: ["vendors", vendorId] });
        },
    });
}

// Delete/deactivate vendor (super admin only)
export function useDeleteVendor() {
    const queryClient = useQueryClient();
    const { sessionToken } = useAuth();

    return useMutation({
        mutationFn: async (vendorId: string) => {
            return request(`/vendors/${vendorId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${sessionToken}`,
                },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vendors"] });
        },
    });
}

// Assign vendor admin
export function useAssignVendorAdmin(vendorId: string) {
    const queryClient = useQueryClient();
    const { sessionToken } = useAuth();

    return useMutation({
        mutationFn: async (userId: string) => {
            return request(`/vendors/${vendorId}/admins?user_id=${userId}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${sessionToken}`,
                },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vendors", vendorId, "admins"] });
        },
    });
}

// Remove vendor admin
export function useRemoveVendorAdmin(vendorId: string) {
    const queryClient = useQueryClient();
    const { sessionToken } = useAuth();

    return useMutation({
        mutationFn: async (userId: string) => {
            return request(`/vendors/${vendorId}/admins/${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${sessionToken}`,
                },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vendors", vendorId, "admins"] });
        },
    });
}

// Fetch vendor admins
export function useVendorAdmins(vendorId: string | undefined) {
    const { sessionToken } = useAuth();

    return useQuery({
        queryKey: ["vendors", vendorId, "admins", sessionToken],
        queryFn: async () => {
            if (!vendorId) throw new Error("Vendor ID is required");
            return request(`/vendors/${vendorId}/admins`, {
                headers: {
                    Authorization: `Bearer ${sessionToken}`,
                },
            });
        },
        enabled: !!vendorId && !!sessionToken,
    });
}


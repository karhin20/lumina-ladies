import { useQuery } from "@tanstack/react-query";
import { api, ApiProduct } from "@/lib/api";
import { getValidImageUrl } from "@/lib/utils";

export const useFlashSales = () => {
    return useQuery({
        queryKey: ["flash-sales"],
        queryFn: api.getFlashSales,
        select: (data: ApiProduct[]) => data.map(p => ({
            ...p,
            image: getValidImageUrl(p.images) || p.image_url || "",
            // Provide explicit types if needed, or let inference work. 
            // Better to cast/transform to a known Product type if we have one, but partial match is fine for now
        }))
    });
};

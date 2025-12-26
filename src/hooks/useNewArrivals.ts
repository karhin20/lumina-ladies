import { useQuery } from "@tanstack/react-query";
import { api, ApiProduct } from "@/lib/api";
import { getValidImageUrl } from "@/lib/utils";

export const useNewArrivals = () => {
    return useQuery({
        queryKey: ["new-arrivals"],
        queryFn: api.getNewArrivals,
        select: (data: ApiProduct[]) => data.map(p => ({
            ...p,
            image: getValidImageUrl(p.images) || p.image_url || ""
        }))
    });
};

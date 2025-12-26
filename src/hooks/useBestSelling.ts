import { useQuery } from "@tanstack/react-query";
import { api, ApiProduct } from "@/lib/api";
import { getValidImageUrl } from "@/lib/utils";

export const useBestSelling = () => {
    return useQuery({
        queryKey: ["best-selling"],
        queryFn: api.getBestSelling,
        select: (data: ApiProduct[]) => data.map(p => ({
            ...p,
            image: getValidImageUrl(p.images) || p.image_url || ""
        }))
    });
};

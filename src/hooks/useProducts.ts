import { useQuery } from "@tanstack/react-query";
import { api, ApiProduct } from "@/lib/api";
import { allProducts, Product } from "@/data/products";

export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: api.getProducts,
    staleTime: 1000 * 60,
    retry: 1,
    select: (data: ApiProduct[]) =>
      data.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        originalPrice: p.original_price,
        image: p.image_url || "",
        category: p.category,
        isNew: p.is_new,
        description: p.description,
        details: p.details || [],
      })),
    placeholderData: allProducts,
  });
};


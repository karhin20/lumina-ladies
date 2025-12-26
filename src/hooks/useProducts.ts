import { useQuery } from "@tanstack/react-query";
import { api, ApiProduct } from "@/lib/api";
import { allProducts, Product } from "@/data/products";
import { getValidImageUrl } from "@/lib/utils";

export const useProducts = () => {
  return useQuery<ApiProduct[], Error, Product[]>({
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
        image: (p.images && p.images.length > 0 ? getValidImageUrl(p.images) : null) || p.image_url || "",
        category: p.category,
        isNew: p.is_new,
        description: p.description,
        details: p.details || [],
        images: p.images || [],
        isFlashSale: p.is_flash_sale,
        isFeatured: p.is_featured,
        salesCount: p.sales_count,
      })),
    placeholderData: allProducts,
  });
};


import { useQuery } from "@tanstack/react-query";
import { api, ApiProduct } from "@/lib/api";
import { allProducts, Product } from "@/data/products";

const transformProduct = (p: ApiProduct): Product => ({
  id: p.id,
  name: p.name,
  price: p.price,
  originalPrice: p.original_price,
  image: p.image_url || "",
  category: p.category,
  isNew: p.is_new,
  description: p.description,
  details: p.details || [],
});

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      const data = await api.getProducts();
      return data.map(transformProduct);
    },
    staleTime: 1000 * 60,
    retry: 1,
    placeholderData: allProducts,
  });
};

import { useQuery } from "@tanstack/react-query";
import { api, ApiOrder } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { mockOrders, Order } from "@/data/mockData";

const mapOrder = (order: ApiOrder): Order => ({
  id: order.id,
  date: order.created_at || new Date().toISOString(),
  status: order.status as Order["status"],
  total: order.total,
  items: order.items.map((item) => ({
    productId: item.product_id,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    image: item.image_url || "",
  })),
  shippingAddress: {
    id: "",
    name: order.shipping.name,
    phone: order.shipping.phone,
    street: order.shipping.street,
    city: order.shipping.city,
    region: order.shipping.region,
  },
});

export const useMyOrders = () => {
  const { sessionToken } = useAuth();

  return useQuery<Order[]>({
    queryKey: ["my-orders", sessionToken],
    enabled: Boolean(sessionToken),
    queryFn: () => api.getOrders(sessionToken || "").then((orders: ApiOrder[]) => orders.map(mapOrder)),
    placeholderData: mockOrders,
  });
};









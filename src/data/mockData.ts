// Mock data for customer account and admin dashboard

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  shippingAddress: Address;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  region: string;
  isDefault?: boolean;
}

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  addedAt: string;
}

// Mock orders for demo
export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    date: '2024-12-10',
    status: 'delivered',
    total: 245.00,
    items: [
      {
        productId: 'rose-essence-collection',
        name: 'Rose Essence Collection',
        quantity: 1,
        price: 125.00,
        image: '/src/assets/product-skincare.jpg'
      },
      {
        productId: 'artisan-candle-set',
        name: 'Artisan Candle Set',
        quantity: 2,
        price: 60.00,
        image: '/src/assets/product-candles.jpg'
      }
    ],
    shippingAddress: {
      id: 'addr-1',
      name: 'John Doe',
      phone: '0201234567',
      street: '123 Main Street',
      city: 'Accra',
      region: 'Greater Accra'
    }
  },
  {
    id: 'ORD-002',
    date: '2024-12-08',
    status: 'shipped',
    total: 89.00,
    items: [
      {
        productId: 'handcrafted-jewelry',
        name: 'Handcrafted Jewelry',
        quantity: 1,
        price: 89.00,
        image: '/src/assets/product-jewelry.jpg'
      }
    ],
    shippingAddress: {
      id: 'addr-1',
      name: 'John Doe',
      phone: '0201234567',
      street: '123 Main Street',
      city: 'Accra',
      region: 'Greater Accra'
    }
  },
  {
    id: 'ORD-003',
    date: '2024-12-05',
    status: 'processing',
    total: 175.00,
    items: [
      {
        productId: 'designer-lamp-1',
        name: 'Designer Lamp Collection',
        quantity: 1,
        price: 175.00,
        image: '/src/assets/product-lamp-1.jpg'
      }
    ],
    shippingAddress: {
      id: 'addr-2',
      name: 'John Doe',
      phone: '0209876543',
      street: '456 Oak Avenue',
      city: 'Kumasi',
      region: 'Ashanti'
    }
  }
];

export const mockAddresses: Address[] = [
  {
    id: 'addr-1',
    name: 'John Doe',
    phone: '0201234567',
    street: '123 Main Street',
    city: 'Accra',
    region: 'Greater Accra',
    isDefault: true
  },
  {
    id: 'addr-2',
    name: 'John Doe',
    phone: '0209876543',
    street: '456 Oak Avenue',
    city: 'Kumasi',
    region: 'Ashanti',
    isDefault: false
  }
];

export const mockWishlist: WishlistItem[] = [
  {
    id: 'wish-1',
    productId: 'rose-essence-collection',
    name: 'Rose Essence Collection',
    price: 125.00,
    image: '/src/assets/product-skincare.jpg',
    addedAt: '2024-12-09'
  },
  {
    id: 'wish-2',
    productId: 'designer-lamp-2',
    name: 'Modern Pendant Light',
    price: 195.00,
    image: '/src/assets/product-lamp-2.jpg',
    addedAt: '2024-12-07'
  }
];

// Admin dashboard mock data
export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: Order[];
  topProducts: { name: string; sales: number; revenue: number }[];
}

export const mockAdminStats: AdminStats = {
  totalRevenue: 15420.00,
  totalOrders: 156,
  totalCustomers: 89,
  totalProducts: 24,
  recentOrders: mockOrders,
  topProducts: [
    { name: 'Rose Essence Collection', sales: 42, revenue: 5250 },
    { name: 'Artisan Candle Set', sales: 38, revenue: 2280 },
    { name: 'Handcrafted Jewelry', sales: 31, revenue: 2759 },
    { name: 'Designer Lamp Collection', sales: 25, revenue: 4375 },
  ]
};

export const mockAllOrders: Order[] = [
  ...mockOrders,
  {
    id: 'ORD-004',
    date: '2024-12-11',
    status: 'pending',
    total: 320.00,
    items: [
      {
        productId: 'designer-lamp-2',
        name: 'Modern Pendant Light',
        quantity: 1,
        price: 195.00,
        image: '/src/assets/product-lamp-2.jpg'
      },
      {
        productId: 'rose-essence-collection',
        name: 'Rose Essence Collection',
        quantity: 1,
        price: 125.00,
        image: '/src/assets/product-skincare.jpg'
      }
    ],
    shippingAddress: {
      id: 'addr-3',
      name: 'Jane Smith',
      phone: '0241234567',
      street: '789 Palm Road',
      city: 'Tema',
      region: 'Greater Accra'
    }
  },
  {
    id: 'ORD-005',
    date: '2024-12-12',
    status: 'pending',
    total: 89.00,
    items: [
      {
        productId: 'handcrafted-jewelry',
        name: 'Handcrafted Jewelry',
        quantity: 1,
        price: 89.00,
        image: '/src/assets/product-jewelry.jpg'
      }
    ],
    shippingAddress: {
      id: 'addr-4',
      name: 'Kofi Mensah',
      phone: '0271234567',
      street: '321 Beach Avenue',
      city: 'Cape Coast',
      region: 'Central'
    }
  }
];

export const mockCustomers = [
  { id: 'user-1', name: 'John Doe', phone: '0201234567', email: 'john@example.com', orders: 3, totalSpent: 509.00, joinedAt: '2024-10-15' },
  { id: 'user-2', name: 'Jane Smith', phone: '0241234567', email: 'jane@example.com', orders: 5, totalSpent: 892.00, joinedAt: '2024-09-20' },
  { id: 'user-3', name: 'Kofi Mensah', phone: '0271234567', email: 'kofi@example.com', orders: 2, totalSpent: 178.00, joinedAt: '2024-11-05' },
  { id: 'user-4', name: 'Ama Owusu', phone: '0551234567', email: 'ama@example.com', orders: 8, totalSpent: 1245.00, joinedAt: '2024-08-10' },
  { id: 'user-5', name: 'Kwame Asante', phone: '0261234567', email: 'kwame@example.com', orders: 1, totalSpent: 125.00, joinedAt: '2024-12-01' },
];


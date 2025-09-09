export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  sizes: string[];
  created_at: string;
  updated_at: string;
  store_name: string;
  admin_id: string;
  discount: number;
  free_shipping: boolean;
}

export interface Admin {
  id: string;
  email: string;
  store_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  total: number;
  date: string;
  customer: string;
  customer_details: CustomerDetails;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  size?: string;
  created_at: string;
}

export interface CustomerDetails {
  name: string;
  email: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  phone?: string;
}

export type OrderStatus = 'pending' | 'shipped' | 'cancelled' | 'refunded';

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}

export interface FilterOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  search?: string;
}

export interface Analytics {
  totalSales: number;
  totalOrders: number;
  conversionRate: number;
  topProducts: Array<{
    product: Product;
    sales: number;
    orders: number;
  }>;
  recentOrders: Order[];
  statusBreakdown: {
    pending: number;
    shipped: number;
    cancelled: number;
    refunded: number;
  };
}

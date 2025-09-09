import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Package, ShoppingCart, TrendingUp, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface DashboardOverviewProps {
  adminData: any;
}

export const DashboardOverview = ({ adminData }: DashboardOverviewProps) => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    conversionRate: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (adminData?.store_name) {
      fetchDashboardData();
      
      // Set up real-time subscriptions
      const ordersChannel = supabase
        .channel('admin-orders')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders'
          },
          () => {
            fetchDashboardData();
          }
        )
        .subscribe();

      const productsChannel = supabase
        .channel('admin-products')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'products',
            filter: `store_name=eq.${adminData.store_name}`
          },
          () => {
            fetchDashboardData();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(ordersChannel);
        supabase.removeChannel(productsChannel);
      };
    }
  }, [adminData]);

  const fetchDashboardData = async () => {
    try {
      // Fetch orders for this store's products
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            products!inner (
              id,
              name,
              price,
              store_name,
              admin_id
            )
          )
        `)
        .eq("order_items.products.store_name", adminData.store_name)
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch products for this store
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("store_name", adminData.store_name);

      if (productsError) throw productsError;

      // Calculate stats
      const totalSales = orders?.reduce((sum, order) => {
        const storeOrderItems = order.order_items?.filter((item: any) => 
          item.products?.store_name === adminData.store_name
        ) || [];
        return sum + storeOrderItems.reduce((itemSum: number, item: any) => 
          itemSum + (item.price * item.quantity), 0
        );
      }, 0) || 0;

      const totalOrders = orders?.length || 0;
      const totalProducts = products?.length || 0;

      setStats({
        totalSales,
        totalOrders,
        totalProducts,
        conversionRate: totalProducts > 0 ? (totalOrders / totalProducts * 100) : 0,
      });

      // Set recent orders (limit to 5)
      setRecentOrders(orders?.slice(0, 5) || []);

      // Calculate top products by order frequency
      const productOrderCount: Record<string, any> = {};
      orders?.forEach(order => {
        order.order_items?.forEach((item: any) => {
          if (item.products?.store_name === adminData.store_name) {
            const productId = item.products.id;
            if (!productOrderCount[productId]) {
              productOrderCount[productId] = {
                ...item.products,
                orderCount: 0,
                totalRevenue: 0,
              };
            }
            productOrderCount[productId].orderCount += item.quantity;
            productOrderCount[productId].totalRevenue += item.price * item.quantity;
          }
        });
      });

      const sortedProducts = Object.values(productOrderCount)
        .sort((a: any, b: any) => b.orderCount - a.orderCount)
        .slice(0, 5);

      setTopProducts(sortedProducts);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "default";
      case "shipped": return "secondary";
      case "delivered": return "default";
      case "cancelled": return "destructive";
      default: return "default";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back to your {adminData?.store_name} dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Revenue from all orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Orders containing your products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Active products in store
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Orders per product ratio
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length === 0 ? (
                <p className="text-muted-foreground">No orders yet</p>
              ) : (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={getStatusColor(order.status) as any}>
                        {order.status}
                      </Badge>
                      <p className="text-sm font-medium">${order.total}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.length === 0 ? (
                <p className="text-muted-foreground">No sales data yet</p>
              ) : (
                topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.orderCount} sold
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${product.totalRevenue.toFixed(2)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { decryptCustomerDetails } from "@/lib/encryption";
import { useToast } from "@/hooks/use-toast";

interface OrdersManagementProps {
  adminData: any;
}

export const OrdersManagement = ({ adminData }: OrdersManagementProps) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (adminData?.store_name) {
      fetchOrders();
      
      // Set up real-time subscription for orders
      const channel = supabase
        .channel('orders-management')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders'
          },
          () => {
            fetchOrders();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [adminData]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            products!inner (
              id,
              name,
              price,
              store_name
            )
          )
        `)
        .eq("order_items.products.store_name", adminData.store_name)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: "Order status has been updated successfully",
      });

      fetchOrders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const getCustomerDetails = (encryptedDetails: string) => {
    try {
      return decryptCustomerDetails(encryptedDetails);
    } catch {
      return null;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">Manage orders for {adminData?.store_name}</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
            <p className="text-muted-foreground">Orders will appear here when customers purchase your products.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const customerDetails = getCustomerDetails(order.customer_details);
            const storeItems = order.order_items?.filter((item: any) => 
              item.products?.store_name === adminData.store_name
            ) || [];

            return (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Order #{order.id.slice(0, 8)}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Select
                      value={order.status}
                      onValueChange={(value) => updateOrderStatus(order.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Customer Information</h4>
                      {customerDetails ? (
                        <div className="text-sm space-y-1">
                          <p><strong>Name:</strong> {customerDetails.firstName} {customerDetails.lastName}</p>
                          <p><strong>Email:</strong> {customerDetails.email}</p>
                          <p><strong>Phone:</strong> {customerDetails.phone}</p>
                          <p><strong>Address:</strong> {customerDetails.address}, {customerDetails.city}, {customerDetails.state} {customerDetails.zipCode}</p>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">Customer details unavailable</p>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Order Items</h4>
                      <div className="space-y-2">
                        {storeItems.map((item: any) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.products?.name} x{item.quantity}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="border-t pt-2 font-semibold">
                          Total: ${storeItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
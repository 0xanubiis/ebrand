import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CreditCard, Package, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/Navbar";
import { useCart } from "@/hooks/useCart";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { supabase } from "@/integrations/supabase/client";
import { encrypt } from "@/lib/encryption";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const Checkout = () => {
  const { items, getTotalPrice, getTotalItems, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const shippingCost = totalPrice > 50 ? 0 : 5.99;
  const tax = totalPrice * 0.08;
  const finalTotal = totalPrice + shippingCost + tax;

  const handleInputChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return Object.values(shippingInfo).every(value => value.trim() !== "");
  };

  const createOrder = async () => {
    if (!isFormValid()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all shipping details",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);

      // Encrypt shipping information
      const encryptedShipping = encrypt(JSON.stringify(shippingInfo));

      // Group items by store for multi-store support
      const storeOrders = items.reduce((acc, item) => {
        if (!acc[item.product.store_name]) {
          acc[item.product.store_name] = [];
        }
        acc[item.product.store_name].push(item);
        return acc;
      }, {} as Record<string, typeof items>);

      // Create separate orders for each store
      const orderPromises = Object.entries(storeOrders).map(async ([storeName, storeItems]) => {
        const storeTotal = storeItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

        // Create order
        const { data: order, error: orderError } = await supabase
          .from("orders")
          .insert({
            customer: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
            customer_details: encryptedShipping,
            total: storeTotal,
            status: "pending",
          })
          .select()
          .single();

        if (orderError) throw orderError;

        // Create order items
        const orderItemsPromises = storeItems.map(item =>
          supabase.from("order_items").insert({
            order_id: order.id,
            product_id: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
            size: item.size,
          })
        );

        await Promise.all(orderItemsPromises);
        return order;
      });

      await Promise.all(orderPromises);
      return true;
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Order Failed",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <div className="marketplace-container py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">Add some items to checkout</p>
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      <div className="marketplace-container py-8">
        <div className="flex items-center mb-8">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={shippingInfo.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="marketplace-input text-black"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={shippingInfo.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="marketplace-input text-black"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={shippingInfo.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="marketplace-input text-black"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={shippingInfo.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="marketplace-input text-black"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={shippingInfo.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="marketplace-input text-black"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={shippingInfo.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className="marketplace-input text-black"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={shippingInfo.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      className="marketplace-input text-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={(e) => handleInputChange("zipCode", e.target.value)}
                      className="marketplace-input text-black"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={shippingInfo.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      className="marketplace-input text-black"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Payment */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.size}`} className="flex justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.product.store_name} {item.size && `• Size: ${item.size}`} • Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal ({totalItems} items)</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Secure payment powered by PayPal</span>
                  </div>
                  
                  <PayPalScriptProvider options={{ 
                    clientId: "sb", // Use sandbox for demo
                    currency: "USD"
                  }}>
                    <PayPalButtons
                      disabled={!isFormValid() || isProcessing}
                      createOrder={async () => {
                        const orderCreated = await createOrder();
                        if (!orderCreated) {
                          throw new Error("Failed to create order");
                        }
                        return finalTotal.toString();
                      }}
                      onApprove={async () => {
                        clearCart();
                        toast({
                          title: "Payment Successful!",
                          description: "Your order has been placed successfully.",
                        });
                        navigate("/success");
                      }}
                      onError={(err) => {
                        console.error("PayPal error:", err);
                        toast({
                          title: "Payment Failed",
                          description: "There was an error processing your payment.",
                          variant: "destructive",
                        });
                      }}
                    />
                  </PayPalScriptProvider>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
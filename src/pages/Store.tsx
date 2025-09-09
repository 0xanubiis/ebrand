import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/lib/types";

const Store = () => {
  const { storeName } = useParams<{ storeName: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [storeInfo, setStoreInfo] = useState<{
    name: string;
    totalProducts: number;
    avgRating: number;
  } | null>(null);

  useEffect(() => {
    if (storeName) {
      fetchStoreProducts();
    }
  }, [storeName]);

  const fetchStoreProducts = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("store_name", storeName)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProducts(data || []);
      
      if (data && data.length > 0) {
        setStoreInfo({
          name: storeName || "",
          totalProducts: data.length,
          avgRating: 4.5, // Mock rating for demo
        });
      }
    } catch (error) {
      console.error("Error fetching store products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <div className="marketplace-container py-16">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-muted rounded w-48 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!storeInfo || products.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <div className="marketplace-container py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Store Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The store "{storeName}" doesn't exist or has no products.
            </p>
            <Link to="/products">
              <Button>Browse All Products</Button>
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
        {/* Back Navigation */}
        <div className="mb-8">
          <Link to="/products" className="inline-flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Products
          </Link>
        </div>

        {/* Store Header */}
        <div className="mb-12">
          <Card className="marketplace-card">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-4">{storeInfo.name}</h1>
                  <div className="flex items-center space-x-6 text-muted-foreground">
                    <span>{storeInfo.totalProducts} Products</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground mb-2">Store by</div>
                  <div className="text-2xl font-bold text-white">{storeInfo.name}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">All Products</h2>
            <span className="text-muted-foreground">{products.length} products</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Store;
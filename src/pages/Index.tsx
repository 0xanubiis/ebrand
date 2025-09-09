import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Truck, Shield, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";

import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/lib/types";

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .limit(8);
        
        if (error) throw error;
        setFeaturedProducts(data || []);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();

    // Set up real-time subscription for product changes
    const channel = supabase
      .channel('homepage-products')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        () => {
          // Reload featured products when any product changes
          fetchFeaturedProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const categories = [
    { name: "T-shirts" },
    { name: "Hoodies" },
    { name: "Pants" },
    { name: "Shoes" },
    { name: "Accessories" },
    { name: "Bags" },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      {/* Hero Section */}
      <section className="marketplace-hero text-white">
        <div className="marketplace-container">
          <div className="py-24 lg:py-32">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="secondary" className="mb-6 bg-black text-white border-white">
                Multi-Brand Fashion Marketplace
              </Badge>
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                Discover Fashion
                <br />
                <span className="text-slate-500">From Every Brand</span>
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-white max-w-2xl mx-auto">
                Shop from hundreds of premium brands in one place. Find your perfect style with our curated collection.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/products">
                  <Button size="lg" className="bg-white text-black hover:bg-slate-300 rounded-xl">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/admin">
                <Button size="lg" variant="outline" className="bg-white text-black hover:bg-slate-300 roudned-xl">
                  Join Brand.ed
                </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="marketplace-section bg-slate-950">
        <div className="marketplace-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-muted-foreground">Free shipping on orders over $100</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-muted-foreground">Your payment information is safe with us</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-muted-foreground">Curated products from trusted brands</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="marketplace-section bg-slate-950 mb-16">
        <div className="marketplace-container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4">Featured Products</h2>
              <p className="text-xl text-muted-foreground">
                Handpicked favorites from our top brands
              </p>
            </div>
            <Link to="/products">
              <Button className="bg-white text-black hover:bg-slate-300" size="lg">
                View All
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="marketplace-card p-4">
                  <div className="aspect-square bg-muted rounded-lg mb-4 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                    <div className="h-6 bg-muted rounded w-1/2 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="marketplace-section mb-16">
        <div className="marketplace-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our diverse collection of fashion categories from top brands worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="group">
                <div className="marketplace-card text-center p-4 h-full hover:scale-105 transition-transform">
                  <div className="w-12 h-12 bg-white rounded-sm mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-black font-bold text-lg">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-slate-500 transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;

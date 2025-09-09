import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";

import { supabase } from "@/integrations/supabase/client";
import { Product, FilterOptions } from "@/lib/types";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterOptions>({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: 0,
    maxPrice: 1000,
    size: '',
  });

  const categories = [
    "T-shirts",
    "Hoodies", 
    "Pants",
    "Shoes",
    "Accessories",
    "Bags"
  ];

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let query = supabase.from('products').select('*');

        if (filters.search) {
          query = query.ilike('name', `%${filters.search}%`);
        }

        if (filters.category) {
          query = query.eq('category', filters.category);
        }

        if (filters.minPrice !== undefined) {
          query = query.gte('price', filters.minPrice);
        }

        if (filters.maxPrice !== undefined) {
          query = query.lte('price', filters.maxPrice);
        }

        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) throw error;
        
        let filteredProducts = data || [];
        
        // Filter by size if specified
        if (filters.size) {
          filteredProducts = filteredProducts.filter(product => 
            product.sizes.includes(filters.size!)
          );
        }
        
        setProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Set up real-time subscription for product changes
    const channel = supabase
      .channel('products-page')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        () => {
          // Reload products when any product changes
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filters]);

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    // Convert "all" values to empty strings for filtering logic
    const filterValue = value === "all" ? "" : value;
    const newFilters = { ...filters, [key]: filterValue };
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && v !== '' && v !== 'all') {
        params.set(k, v.toString());
      }
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      category: '',
      minPrice: 0,
      maxPrice: 1000,
      size: '',
    };
    setFilters(clearedFilters);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      <div className="marketplace-container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">All Products</h1>
          <p className="text-xl text-muted-foreground">
            Discover amazing products from our curated brands
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80 shrink-0">
            <div className="marketplace-card p-6 sticky top-24 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Filters</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="rounded-xl hover:bg-white">
                  Clear All
                </Button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <Label htmlFor="search" className="text-sm font-medium">Search</Label>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black h-4 w-4" />
                  <Input
                    id="search"
                    placeholder="Search products..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10 text-black"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="mb-6">
                <Label className="text-sm font-medium">Category</Label>
                <Select value={filters.category || "all"} onValueChange={(value) => handleFilterChange('category', value)}>
                  <SelectTrigger className="mt-2 text-black">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-950">
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <Label className="text-sm font-medium">
                  Price Range: ${filters.minPrice} - ${filters.maxPrice}
                </Label>
                <div className="mt-4 px-2">
                  <Slider
                    value={[filters.minPrice || 0, filters.maxPrice || 1000]}
                    onValueChange={([min, max]) => {
                      handleFilterChange('minPrice', min);
                      handleFilterChange('maxPrice', max);
                    }}
                    max={1000}
                    step={10}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Size */}
              <div className="mb-6">
                <Label className="text-sm font-medium">Size</Label>
                <Select value={filters.size || "all"} onValueChange={(value) => handleFilterChange('size', value)}>
                  <SelectTrigger className="mt-2 text-black">
                    <SelectValue placeholder="All Sizes" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-950">
                    <SelectItem value="all">All Sizes</SelectItem>
                    {sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filters & Sort */}
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  {/* Mobile filter content - same as desktop */}
                  <div className="mt-6">
                    {/* Same filter controls as desktop sidebar */}
                  </div>
                </SheetContent>
              </Sheet>

              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(12)].map((_, i) => (
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
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <div 
                    key={product.id} 
                    className="animate-fade-in" 
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
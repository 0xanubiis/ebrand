import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/lib/types";
import { useCartContext } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCartContext();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const discountPercentage = 0; // TODO: Add discount logic
  const hasDiscount = discountPercentage > 0;

  return (
    <Card className="marketplace-card group overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1">
      <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden cursor-pointer block">
        <img
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {hasDiscount && (
          <Badge 
            variant="destructive" 
            className="absolute top-3 left-3"
          >
            -{discountPercentage}%
          </Badge>
        )}
        {product.free_shipping && (
          <Badge 
            variant="secondary" 
            className="absolute top-3 right-3"
          >
            Free Shipping
          </Badge>
        )}
      </Link>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <Link 
              to={`/product/${product.id}`}
              className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors block"
            >
              {product.name}
            </Link>
          </div>
          
          <Link 
            to={`/store/${product.store_name}`}
            className="text-sm text-muted-foreground hover:text-primary transition-colors block text-left"
          >
            {product.store_name}
          </Link>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  ${(product.price * (1 + discountPercentage / 100)).toFixed(2)}
                </span>
              )}
            </div>
            
            <Button 
              size="sm" 
              onClick={handleAddToCart}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
          
          {product.sizes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.sizes.slice(0, 4).map((size) => (
                <Badge key={size} variant="outline" className="text-xs">
                  {size}
                </Badge>
              ))}
              {product.sizes.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{product.sizes.length - 4}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
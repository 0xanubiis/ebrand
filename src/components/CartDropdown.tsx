import { useState } from 'react';
import { Link } from "react-router-dom";
import { X, ShoppingBag, Trash2, ShoppingCart, Minus, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useCartContext } from '@/contexts/CartContext';
import { toast } from "@/hooks/use-toast";

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDropdown({ isOpen, onClose }: CartDropdownProps) {
  const { items, addItem, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartContext();
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({ title: "Error", description: "Your cart is empty", variant: "destructive" });
      return;
    }

    const missingSizeItem = items.find(i => (i.product.sizes?.length ?? 0) > 0 && !i.size);
    if (missingSizeItem) {
      toast({ title: "Missing size", description: `Please select a size for ${missingSizeItem.product.name}`, variant: "destructive" });
      return;
    }

    onClose();
    window.location.href = '/checkout';
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number, size?: string) => {
    if (newQuantity < 0) {
      toast({ title: "Invalid quantity", description: "Quantity cannot be negative", variant: "destructive" });
      return;
    }

    if (newQuantity === 0) {
      removeItem(productId, size);
      toast({ title: "Item removed", description: "Item removed from cart" });
    } else {
      updateQuantity(productId, newQuantity, size);
    }
  };

  const handleRemoveItem = (productId: string, size?: string) => {
    removeItem(productId, size);
    toast({ title: "Item removed", description: "Item removed from cart" });
  };

  const handleSizeChange = async (productId: string, newSize: string, currentSize?: string) => {
    const existing = items.find(i => i.product.id === productId && i.size === currentSize);
    if (!existing) return;

    await removeItem(productId, currentSize);
    await addItem(existing.product, existing.quantity, newSize);
    toast({ title: "Size updated", description: `Selected size: ${newSize}` });
  };

  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();
  const taxRate = 0.08;
  const tax = Number((subtotal * taxRate).toFixed(2));
  const finalTotal = Number((subtotal + tax).toFixed(2));

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm transition-opacity z-40"
          onClick={onClose}
        />
      )}

      {/* Cart Panel */}
      {isOpen && (
        <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-black backdrop-blur-xl shadow-card transform transition-transform duration-300 ease-in-out z-50 translate-x-0">
          <div className="h-full flex flex-col min-h-[440px]">
            {/* Header */}
            <div className="p-4 border-b border-border bg-white text-black">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})</h3>
                </div>
                <button onClick={onClose} className="text-black hover:text-slate-950">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 bg-white">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <ShoppingBag className="h-12 w-12 mb-4" />
                  <p className="text-center mb-4">Your cart is empty</p>
                  <Button onClick={onClose} asChild>
                    <Link to="/products">Continue Shopping</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.size || 'no-size'}`} className="flex items-center gap-4 rounded-lg border border-border p-3 bg-background/50">
                      <img
                        src={item.product.images?.[0] || "/public/placeholder.svg"}
                        alt={item.product.name}
                        className="h-16 w-16 object-cover rounded-lg shadow-md"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-foreground">{item.product.name}</h4>
                        {/* Size selection if product has sizes */}
                        {Array.isArray(item.product.sizes) && item.product.sizes.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {item.product.sizes.map((size) => (
                              <button
                                key={String(size)}
                                onClick={() => handleSizeChange(item.product.id, String(size), item.size)}
                                className={`px-2 py-1 text-xs rounded transition-all ${item.size === size ? 'bg-primary text-primary-foreground shadow-md' : 'border border-border text-foreground hover:bg-background-muted'}`}
                              >
                                {String(size)}
                              </button>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1, item.size)}
                              className="p-1 rounded-full text-black transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="text-foreground min-w-[20px] text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1, item.size)}
                              className="p-1 rounded-full text-black transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <p className="text-sm font-medium text-foreground">${(item.product.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.product.id, item.size)}
                        className="p-2 text-black rounded-full"
                        title="Remove Item"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Summary */}
            {items.length > 0 && (
              <div className="border-t border-border p-4 bg-background text-foreground">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">USD {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">IN Progress</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">USD {tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between items-center">
                    <span className="text-base font-semibold">Total</span>
                    <span className="text-base font-bold">USD {finalTotal.toFixed(2)}</span>
                  </div>
                  <Button variant="outline" asChild className="w-full bg-white hover:bg-slate-300">
                    <Link to="/checkout">Checkout</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export const CartTrigger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { getTotalItems, cartVersion } = useCartContext();
  const totalItems = getTotalItems();

  console.log('CartTrigger render - totalItems:', totalItems, 'cartVersion:', cartVersion);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Cart trigger clicked, current isOpen:', isOpen);
    setIsOpen(true);
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="relative rounded-xl transition-all duration-300 hover:bg-slate-300 text-black"
        onClick={handleClick}
      >
        <ShoppingCart className="h-4 w-4" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </Button>
      
      <CartDropdown isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
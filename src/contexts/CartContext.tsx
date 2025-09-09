import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addItem: (product: Product, quantity?: number, size?: string) => Promise<void>;
  removeItem: (productId: string, size?: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number, size?: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  cartVersion: number; // Force re-renders
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'marketplace-cart';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartVersion, setCartVersion] = useState(0);
  const { user } = useAuth();

  const forceUpdate = () => {
    setCartVersion(prev => prev + 1);
  };

  const loadCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
        console.log('Loaded cart from localStorage:', parsedCart);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
    setLoading(false);
  };

  const saveCartToLocalStorage = (cartItems: CartItem[]) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    console.log('Saved cart to localStorage:', cartItems);
  };

  useEffect(() => {
    if (!user) {
      loadCartFromLocalStorage();
    } else {
      setLoading(false);
    }
  }, [user]);

  const addItem = async (product: Product, quantity: number = 1, size?: string) => {
    console.log('CartContext: Adding item', product.name, quantity, 'size:', size);
    
    const newItems = (() => {
      const existingItemIndex = items.findIndex(
        item => item.product.id === product.id && item.size === size
      );
      
      if (existingItemIndex > -1) {
        const updated = [...items];
        updated[existingItemIndex].quantity += quantity;
        return updated;
      } else {
        return [...items, { product, quantity, size: size || undefined }];
      }
    })();

    setItems(newItems);
    saveCartToLocalStorage(newItems);
    forceUpdate();
    console.log('CartContext: Items updated, new count:', newItems.length);
  };

  const removeItem = async (productId: string, size?: string) => {
    const newItems = items.filter(item => 
      !(item.product.id === productId && item.size === size)
    );
    setItems(newItems);
    saveCartToLocalStorage(newItems);
    forceUpdate();
  };

  const updateQuantity = async (productId: string, quantity: number, size?: string) => {
    if (quantity <= 0) {
      await removeItem(productId, size);
      return;
    }

    const newItems = items.map(item =>
      item.product.id === productId && item.size === size
        ? { ...item, quantity }
        : item
    );
    setItems(newItems);
    saveCartToLocalStorage(newItems);
    forceUpdate();
  };

  const clearCart = async () => {
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
    forceUpdate();
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      loading,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getTotalItems,
      cartVersion
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};
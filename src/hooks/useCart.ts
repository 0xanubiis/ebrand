import { useState, useEffect } from 'react';
import { CartItem, Product } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

const CART_STORAGE_KEY = 'marketplace-cart';

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(0);
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      loadCartFromDatabase();
      
      // Set up real-time subscription for cart updates
      const channel = supabase
        .channel('cart-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'cart_items',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            // Reload cart data when changes occur
            loadCartFromDatabase();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      loadCartFromLocalStorage();
    }
  }, [user]);

  // Load cart from localStorage for non-authenticated users
  const loadCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
    setLoading(false);
  };

  // Save cart to localStorage for non-authenticated users
  const saveCartToLocalStorage = (cartItems: CartItem[]) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  };

  const loadCartFromDatabase = async () => {
    if (!user) return;
    
    try {
      // Get cart items first
      const { data: cartData, error: cartError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id);

      if (cartError) throw cartError;

      if (!cartData || cartData.length === 0) {
        setItems([]);
        return;
      }

      // Get product details for each cart item
      const productIds = cartData.map(item => item.product_id);
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds);

      if (productsError) throw productsError;

      const cartItems: CartItem[] = cartData.map(cartItem => {
        const product = products?.find(p => p.id === cartItem.product_id);
        if (!product) return null;
        
        return {
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
            images: product.images,
            store_name: product.store_name,
            free_shipping: product.free_shipping,
            sizes: product.sizes,
            category: product.category,
            description: product.description,
            admin_id: product.admin_id,
            created_at: product.created_at,
            updated_at: product.updated_at
          },
          quantity: cartItem.quantity,
          size: cartItem.size
        };
      }).filter(Boolean) as CartItem[];

      setItems(cartItems);
    } catch (error) {
      console.error('Error loading cart from database:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const addItem = async (product: Product, quantity: number = 1, size?: string) => {
    console.log('Adding item to cart:', { product: product.name, quantity, size, user: !!user });
    
    if (user) {
      // Optimistic update for instant UI feedback
      const newItems = (() => {
        const existingItemIndex = items.findIndex(
          item => item.product.id === product.id && item.size === size
        );
        
        if (existingItemIndex > -1) {
          const updated = [...items];
          updated[existingItemIndex].quantity += quantity;
          return updated;
        } else {
          return [...items, { product, quantity, size }];
        }
      })();
      
      setItems(newItems);

      // Authenticated user - save to database
      try {
        // Check if item already exists in database
        const { data: existingItem, error: checkError } = await supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', user.id)
          .eq('product_id', product.id)
          .eq('size', size || null)
          .maybeSingle();

        if (checkError) throw checkError;

        if (existingItem) {
          // Update existing item
          const { error: updateError } = await supabase
            .from('cart_items')
            .update({ quantity: existingItem.quantity + quantity })
            .eq('id', existingItem.id);

          if (updateError) throw updateError;
        } else {
          // Insert new item
          const { error: insertError } = await supabase
            .from('cart_items')
            .insert({
              user_id: user.id,
              product_id: product.id,
              quantity,
              size: size || null
            });

           if (insertError) throw insertError;
        }

        console.log('Cart item saved successfully');
      } catch (error) {
        console.error('Error adding item to cart:', error);
        // Reload from database on error to correct optimistic update
        loadCartFromDatabase();
      }
    } else {
      // Non-authenticated user - save to localStorage
      console.log('Adding item to localStorage cart');
      
      const existingItemIndex = items.findIndex(
        item => item.product.id === product.id && item.size === size
      );
      
      let newItems;
      if (existingItemIndex > -1) {
        newItems = [...items];
        newItems[existingItemIndex].quantity += quantity;
      } else {
        newItems = [...items, { product, quantity, size }];
      }
      
      console.log('Saving to localStorage:', newItems);
      console.log('Force updating cart UI...');
      saveCartToLocalStorage(newItems);
      setItems(newItems);
      setForceUpdate(prev => prev + 1);
      
      // Double-check the state was set
      setTimeout(() => {
        console.log('Current cart items after update:', newItems.length);
      }, 100);
    }
  };
  
  const removeItem = async (productId: string, size?: string) => {
    if (user) {
      // Authenticated user - remove from database
      try {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId)
          .eq('size', size || null);

         if (error) throw error;

         // Don't update state manually - real-time subscription will handle it
      } catch (error) {
        console.error('Error removing item from cart:', error);
      }
    } else {
      // Non-authenticated user - remove from localStorage
      setItems(prevItems => {
        const newItems = prevItems.filter(item => 
          !(item.product.id === productId && item.size === size)
        );
        saveCartToLocalStorage(newItems);
        return newItems;
      });
    }
  };
  
  const updateQuantity = async (productId: string, quantity: number, size?: string) => {
    if (quantity <= 0) {
      await removeItem(productId, size);
      return;
    }

    if (user) {
      // Authenticated user - update in database
      try {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('user_id', user.id)
          .eq('product_id', productId)
          .eq('size', size || null);

         if (error) throw error;

         // Don't update state manually - real-time subscription will handle it
      } catch (error) {
        console.error('Error updating cart quantity:', error);
      }
    } else {
      // Non-authenticated user - update in localStorage
      setItems(prevItems => {
        const newItems = prevItems.map(item =>
          item.product.id === productId && item.size === size
            ? { ...item, quantity }
            : item
        );
        saveCartToLocalStorage(newItems);
        return newItems;
      });
    }
  };
  
  const clearCart = async () => {
    if (user) {
      // Authenticated user - clear from database
      try {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);

        if (error) throw error;

        setItems([]);
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    } else {
      // Non-authenticated user - clear localStorage
      setItems([]);
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  };
  
  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };
  
  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };
  
  return {
    items,
    loading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };
};
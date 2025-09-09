-- Fix RLS policies for orders table to allow guest checkouts
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;

-- Create a more permissive policy for order creation
CREATE POLICY "Allow order creation" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

-- Ensure orders table allows null user_id for guest orders
ALTER TABLE public.orders 
ALTER COLUMN customer DROP NOT NULL;
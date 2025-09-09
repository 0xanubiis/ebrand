-- Enable real-time updates for cart_items table
-- Set REPLICA IDENTITY to FULL to ensure complete row data during updates
ALTER TABLE public.cart_items REPLICA IDENTITY FULL;

-- Add the cart_items table to the supabase_realtime publication
-- This enables real-time functionality for the table
ALTER PUBLICATION supabase_realtime ADD TABLE public.cart_items;
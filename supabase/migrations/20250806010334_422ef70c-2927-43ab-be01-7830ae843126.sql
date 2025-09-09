-- Enable realtime for cart_items table
ALTER TABLE public.cart_items REPLICA IDENTITY FULL;

-- Add the table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.cart_items;
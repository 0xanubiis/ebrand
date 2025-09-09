-- Enable real-time updates for products table as well
ALTER TABLE public.products REPLICA IDENTITY FULL;

-- Add the products table to the supabase_realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
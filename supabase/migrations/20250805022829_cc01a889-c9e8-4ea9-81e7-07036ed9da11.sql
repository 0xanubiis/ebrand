-- Enable real-time for cart_items table
ALTER TABLE cart_items REPLICA IDENTITY FULL;

-- Add cart_items to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE cart_items;
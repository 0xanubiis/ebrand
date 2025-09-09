-- Add discount column to products table
ALTER TABLE public.products 
ADD COLUMN discount numeric DEFAULT 0;
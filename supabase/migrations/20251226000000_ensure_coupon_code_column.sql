-- Garantir que a coluna coupon_code existe na tabela products
-- Esta migration é idempotente e pode ser executada múltiplas vezes

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'coupon_code'
  ) THEN
    ALTER TABLE public.products ADD COLUMN coupon_code TEXT DEFAULT NULL;
    COMMENT ON COLUMN public.products.coupon_code IS 'Optional discount coupon code for the product';
  END IF;
END $$;


-- Garantir que a tabela categories está corretamente configurada
-- Esta migration é idempotente e pode ser executada múltiplas vezes

-- Garantir que parent_id existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'categories' 
    AND column_name = 'parent_id'
  ) THEN
    ALTER TABLE public.categories ADD COLUMN parent_id UUID REFERENCES public.categories(id) ON DELETE CASCADE;
    CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories(parent_id);
    COMMENT ON COLUMN public.categories.parent_id IS 'Referência à categoria pai. NULL significa categoria raiz (não é subcategoria)';
  END IF;
END $$;

-- Garantir que slug é único e não nulo
DO $$ 
BEGIN
  -- Adicionar constraint de NOT NULL se não existir
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'categories' 
    AND column_name = 'slug'
    AND is_nullable = 'YES'
  ) THEN
    -- Primeiro, garantir que não há valores NULL
    UPDATE public.categories SET slug = LOWER(REPLACE(name, ' ', '-')) WHERE slug IS NULL;
    ALTER TABLE public.categories ALTER COLUMN slug SET NOT NULL;
  END IF;
END $$;

-- Garantir índice único em slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_slug_unique ON public.categories(slug);

-- Garantir que as políticas RLS estão corretas
DO $$ 
BEGIN
  -- Verificar se a política de SELECT existe
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'categories' 
    AND policyname = 'Categories are viewable by everyone'
  ) THEN
    CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
  END IF;
END $$;


/**
 * Cliente Supabase Singleton
 * 
 * Garante uma única instância do cliente Supabase em toda a aplicação.
 * Implementa padrão Singleton para evitar múltiplas conexões.
 * 
 * Configurações de segurança:
 * - Valida variáveis de ambiente antes de criar o cliente
 * - Configura persistência de sessão apenas no cliente (browser)
 * - Adiciona header de identificação do cliente
 * 
 * @throws {Error} Se as variáveis de ambiente não estiverem configuradas
 * 
 * @example
 * ```ts
 * import { supabase } from '@/services/supabase/client';
 * 
 * const { data, error } = await supabase
 *   .from('products')
 *   .select('*');
 * ```
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Variáveis de ambiente do Supabase não configuradas. Verifique VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY.'
  );
}

/**
 * Cliente Supabase singleton
 * 
 * Única instância do cliente Supabase para toda a aplicação.
 * Use este cliente para todas as operações com Supabase (auth, database, storage, realtime).
 * 
 * @type {SupabaseClient<Database>}
 */
export const supabase: SupabaseClient<Database> = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    global: {
      headers: {
        'x-client-info': 'pechintech-web',
      },
    },
  }
);


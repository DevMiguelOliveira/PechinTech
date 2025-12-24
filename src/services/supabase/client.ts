/**
 * Cliente Supabase Singleton
 * Garante uma única instância do cliente em toda a aplicação
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Validação mais robusta das variáveis de ambiente
if (!SUPABASE_URL) {
  console.error('❌ VITE_SUPABASE_URL não está configurada');
  throw new Error(
    'Variável de ambiente VITE_SUPABASE_URL não configurada. Verifique o arquivo .env'
  );
}

if (!SUPABASE_ANON_KEY) {
  console.error('❌ VITE_SUPABASE_PUBLISHABLE_KEY não está configurada');
  throw new Error(
    'Variável de ambiente VITE_SUPABASE_PUBLISHABLE_KEY não configurada. Verifique o arquivo .env'
  );
}

// Valida formato da URL
try {
  new URL(SUPABASE_URL);
} catch {
  console.error('❌ VITE_SUPABASE_URL não é uma URL válida:', SUPABASE_URL);
  throw new Error(`VITE_SUPABASE_URL não é uma URL válida: ${SUPABASE_URL}`);
}

// Log apenas em desenvolvimento para não expor informações em produção
if (import.meta.env.DEV) {
  console.log('✅ Cliente Supabase inicializado:', {
    url: SUPABASE_URL,
    hasKey: !!SUPABASE_ANON_KEY,
    keyLength: SUPABASE_ANON_KEY?.length || 0,
  });
  
  // Verifica se a URL corresponde ao project_id esperado
  const expectedProjectId = 'xphtkyghdsozrqyfpaij';
  if (SUPABASE_URL.includes(expectedProjectId)) {
    console.log('✅ URL do Supabase corresponde ao project_id configurado');
  } else {
    console.warn('⚠️ URL do Supabase pode não corresponder ao project_id esperado');
  }
}

/**
 * Cliente Supabase singleton
 * Use este cliente para todas as operações com Supabase
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
    db: {
      schema: 'public',
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// Testa conexão na inicialização (apenas em desenvolvimento)
if (import.meta.env.DEV && typeof window !== 'undefined') {
  supabase
    .from('blog_posts')
    .select('id')
    .limit(1)
    .then(({ error }) => {
      if (error) {
        console.warn('⚠️ Aviso: Não foi possível conectar ao Supabase na inicialização:', error.message);
      } else {
        console.log('✅ Conexão com Supabase verificada com sucesso');
      }
    })
    .catch((err) => {
      console.warn('⚠️ Erro ao testar conexão Supabase:', err);
    });
}


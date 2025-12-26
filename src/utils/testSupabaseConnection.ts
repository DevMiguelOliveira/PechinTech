/**
 * Utilitário para testar conexão com Supabase
 * Use para debug de problemas de conexão
 */

import { supabase } from '@/services/supabase/client';

export async function testSupabaseConnection() {
  const results = {
    clientConfigured: !!supabase,
    url: import.meta.env.VITE_SUPABASE_URL || 'NÃO CONFIGURADO',
    anonKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? 'CONFIGURADO' : 'NÃO CONFIGURADO',
    canConnect: false,
    canReadBlogPosts: false,
    blogPostsCount: 0,
    publishedPostsCount: 0,
    errors: [] as string[],
  };

  try {
    // Testa conexão básica
    const { data: testData, error: testError } = await supabase
      .from('blog_posts')
      .select('id')
      .limit(1);

    if (testError) {
      results.errors.push(`Erro de conexão: ${testError.message} (${testError.code})`);
    } else {
      results.canConnect = true;
    }

    // Testa leitura de posts
    const { data: allPosts, error: allError } = await supabase
      .from('blog_posts')
      .select('id, published')
      .limit(100);

    if (allError) {
      results.errors.push(`Erro ao ler posts: ${allError.message} (${allError.code})`);
    } else {
      results.canReadBlogPosts = true;
      results.blogPostsCount = allPosts?.length || 0;
      results.publishedPostsCount = allPosts?.filter(p => p.published === true).length || 0;
    }

    // Testa query de posts publicados
    const { data: publishedPosts, error: publishedError } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('published', true)
      .limit(100);

    if (publishedError) {
      results.errors.push(`Erro ao ler posts publicados: ${publishedError.message} (${publishedError.code})`);
    }
  } catch (err) {
    results.errors.push(`Erro inesperado: ${err instanceof Error ? err.message : String(err)}`);
  }

  return results;
}




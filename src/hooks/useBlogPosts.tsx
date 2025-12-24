import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface DbBlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  author_id: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
  image_url?: string | null;
  profiles?: {
    username: string;
  } | null;
}

export interface BlogPostFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  published: boolean;
  image_url?: string | null;
}

export function useBlogPosts() {
  return useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      // Busca posts sem join para evitar problemas de RLS
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (!data || data.length === 0) {
        return [] as DbBlogPost[];
      }

      // Busca profiles separadamente
      const authorIds = [...new Set(data.map(post => post.author_id).filter(Boolean))] as string[];
      
      if (authorIds.length > 0) {
        try {
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, username')
            .in('id', authorIds);

          if (profilesData && profilesData.length > 0) {
            const profilesMap = new Map(profilesData.map((p: any) => [p.id, p]));
            return data.map((post: any) => ({
              ...post,
              profiles: post.author_id ? profilesMap.get(post.author_id) || null : null,
            })) as DbBlogPost[];
          }
        } catch (profileError) {
          console.warn('Erro ao buscar profiles:', profileError);
        }
      }

      return data.map((post: any) => ({
        ...post,
        profiles: null,
      })) as DbBlogPost[];
    },
  });
}

export function usePublishedBlogPosts() {
  return useQuery({
    queryKey: ['published-blog-posts'],
    queryFn: async () => {
      try {
        console.log('[Blog] Iniciando busca de posts publicados...');
        
        // Verifica se o cliente Supabase está configurado
        if (!supabase) {
          throw new Error('Cliente Supabase não está configurado');
        }
        
        // Testa a conexão primeiro
        const { data: healthCheck, error: healthError } = await supabase
          .from('blog_posts')
          .select('id')
          .limit(1);
        
        if (healthError && healthError.code !== 'PGRST116') {
          console.error('[Blog] Erro de conexão com Supabase:', healthError);
          throw new Error(`Erro de conexão: ${healthError.message}`);
        }
        
        // Estratégia 1: Buscar posts publicados diretamente com RLS
        // Usa anon key para garantir acesso público
        const { data, error, count } = await supabase
          .from('blog_posts')
          .select('*', { count: 'exact' })
          .eq('published', true)
          .order('created_at', { ascending: false });

        console.log('[Blog] Query executada:', { 
          dataLength: data?.length || 0, 
          error: error?.message || null,
          count 
        });

        // Se houver erro de RLS ou permissão, tenta estratégias alternativas
        if (error) {
          console.warn('[Blog] Erro na busca inicial:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
          });
          
          // Estratégia 2: Buscar todos os posts (pode retornar vazio se RLS bloquear)
          const { data: allData, error: allError } = await supabase
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false });

          if (allError) {
            console.error('[Blog] Erro ao buscar todos os posts:', {
              message: allError.message,
              code: allError.code,
              details: allError.details
            });
            
            // Se for erro de RLS, pode ser que não haja posts ou RLS está bloqueando
            // Retorna array vazio mas loga o erro para debug
            if (allError.code === 'PGRST301' || allError.message.includes('permission') || allError.message.includes('policy')) {
              console.warn('[Blog] Erro de permissão RLS - verifique se há posts publicados e se as políticas estão corretas');
            }
            
            return [] as DbBlogPost[];
          }

          // Filtra posts publicados no cliente
          const filteredData = (allData || []).filter((post: any) => post.published === true);
          console.log(`[Blog] Encontrados ${filteredData.length} posts publicados (filtrado no cliente de ${allData?.length || 0} total)`);
          
          if (filteredData.length === 0) {
            console.warn('[Blog] Nenhum post publicado encontrado. Verifique:');
            console.warn('  1. Se há posts na tabela blog_posts');
            console.warn('  2. Se os posts têm published = true');
            console.warn('  3. Se as políticas RLS permitem leitura pública');
            return [] as DbBlogPost[];
          }
          
          // Processa os dados
          const postsData = filteredData.map((post: any) => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            content: post.content,
            excerpt: post.excerpt,
            author_id: post.author_id,
            published: post.published,
            created_at: post.created_at,
            updated_at: post.updated_at,
            image_url: post.image_url || null,
            profiles: null,
          })) as DbBlogPost[];

          // Tenta buscar profiles (não crítico)
          await enrichWithProfiles(postsData);
          
          return postsData;
        }

        // Se não houver dados, retorna array vazio
        if (!data || data.length === 0) {
          console.log('[Blog] Nenhum post publicado encontrado na query direta');
          console.log('[Blog] Verificando se há posts na tabela...');
          
          // Debug: verifica se há algum post (mesmo não publicado)
          const { data: anyPost } = await supabase
            .from('blog_posts')
            .select('id, title, published')
            .limit(1);
          
          if (anyPost && anyPost.length > 0) {
            console.warn('[Blog] Há posts na tabela, mas nenhum está publicado:', anyPost);
            console.warn('[Blog] Certifique-se de que pelo menos um post tem published = true');
          } else {
            console.warn('[Blog] Não há posts na tabela blog_posts');
            console.warn('[Blog] Crie posts através da interface admin ou script de criação');
          }
          
          return [] as DbBlogPost[];
        }

        // Garante que data seja um array válido
        const postsData = Array.isArray(data) ? data : [];
        console.log(`[Blog] Processando ${postsData.length} posts publicados`);

        // Mapeia os dados para o formato esperado
        const mappedPosts = postsData.map((post: any) => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt,
          author_id: post.author_id,
          published: post.published,
          created_at: post.created_at,
          updated_at: post.updated_at,
          image_url: post.image_url || null,
          profiles: null,
        })) as DbBlogPost[];

        // Tenta buscar profiles (não crítico)
        await enrichWithProfiles(mappedPosts);
        
        console.log(`[Blog] Retornando ${mappedPosts.length} posts publicados`);
        return mappedPosts;
      } catch (err) {
        console.error('[Blog] Erro crítico ao buscar posts:', err);
        if (err instanceof Error) {
          console.error('[Blog] Stack trace:', err.stack);
        }
        // Retorna array vazio para não quebrar a UI
        return [] as DbBlogPost[];
      }
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    retryOnMount: true,
    refetchOnWindowFocus: false,
  });
}

// Função auxiliar para enriquecer posts com profiles
async function enrichWithProfiles(posts: DbBlogPost[]): Promise<void> {
  const authorIds = [...new Set(posts.map(post => post.author_id).filter(Boolean))] as string[];
  
  if (authorIds.length === 0) {
    return;
  }
  
  try {
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, username')
      .in('id', authorIds);

    if (profilesData && profilesData.length > 0) {
      const profilesMap = new Map(profilesData.map((p: any) => [p.id, p]));
      posts.forEach(post => {
        if (post.author_id) {
          post.profiles = profilesMap.get(post.author_id) || null;
        }
      });
    }
  } catch (profileError) {
    console.warn('[Blog] Erro ao buscar profiles (não crítico):', profileError);
  }
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      if (!slug) {
        throw new Error('Slug é obrigatório');
      }

      console.log(`Buscando post com slug: ${slug}`);
      
      // Estratégia 1: Buscar com filtro published
      let { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      // Se houver erro, tenta buscar sem filtro published e filtra no cliente
      if (error) {
        console.warn('Erro na busca inicial, tentando sem filtro published:', error);
        const { data: allData, error: allError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .single();

        if (allError) {
          console.error('Erro ao buscar post:', allError);
          throw allError;
        }

        // Verifica se o post está publicado
        if (!allData || allData.published !== true) {
          throw new Error('Post não encontrado ou não publicado');
        }

        data = allData;
      }

      if (!data) {
        throw new Error('Post não encontrado');
      }

      // Busca profile separadamente (opcional)
      if (data.author_id) {
        try {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, username')
            .eq('id', data.author_id)
            .single();

          return {
            ...data,
            profiles: profileData || null,
          } as DbBlogPost;
        } catch (profileError) {
          console.warn('Erro ao buscar profile (não crítico):', profileError);
        }
      }

      return {
        ...data,
        profiles: null,
      } as DbBlogPost;
    },
    enabled: !!slug,
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
  });
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: BlogPostFormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('blog_posts')
        .insert([{ ...post, author_id: user.id, image_url: post.image_url || null }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['published-blog-posts'] });
      toast({
        title: 'Post criado com sucesso!',
        description: 'O artigo foi publicado no blog.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao criar post',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...post }: BlogPostFormData & { id: string }) => {
      const { data, error } = await supabase
        .from('blog_posts')
        .update({ ...post, image_url: post.image_url || null })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['published-blog-posts'] });
      toast({
        title: 'Post atualizado com sucesso!',
        description: 'As alterações foram salvas.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao atualizar post',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['published-blog-posts'] });
      toast({
        title: 'Post deletado com sucesso!',
        description: 'O artigo foi removido do blog.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao deletar post',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
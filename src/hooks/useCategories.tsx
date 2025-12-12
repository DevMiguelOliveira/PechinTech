import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface DbCategory {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  parent?: DbCategory | null;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  parent_id: string | null;
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select(`
          *,
          parent:parent_id (
            id,
            name,
            slug
          )
        `)
        .order('name');

      if (error) throw error;
      return data as DbCategory[];
    },
    staleTime: 0, // Sempre buscar dados atualizados
    refetchOnWindowFocus: true, // Refetch quando a janela ganha foco
  });
}

/**
 * Hook para buscar apenas categorias raiz (sem parent)
 */
export function useRootCategories() {
  return useQuery({
    queryKey: ['categories', 'root'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .is('parent_id', null)
        .order('name');

      if (error) throw error;
      return data as DbCategory[];
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: CategoryFormData) => {
      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidar e refetch imediatamente
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.refetchQueries({ queryKey: ['categories'] });
      toast({
        title: 'Categoria criada!',
        description: 'A categoria foi adicionada com sucesso e já está disponível no menu.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao criar categoria',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...category }: CategoryFormData & { id: string }) => {
      const { data, error } = await supabase
        .from('categories')
        .update(category)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.refetchQueries({ queryKey: ['categories'] });
      toast({
        title: 'Categoria atualizada!',
        description: 'As alterações foram salvas.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao atualizar categoria',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.refetchQueries({ queryKey: ['categories'] });
      toast({
        title: 'Categoria excluída!',
        description: 'A categoria foi removida.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao excluir categoria',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

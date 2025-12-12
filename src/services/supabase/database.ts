/**
 * Serviços de Database do Supabase
 * Funções reutilizáveis para operações CRUD
 */
import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from './client';

export interface QueryOptions {
  select?: string;
  filter?: {
    column: string;
    operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'in' | 'is';
    value: unknown;
  }[];
  orderBy?: {
    column: string;
    ascending?: boolean;
  };
  limit?: number;
  offset?: number;
}

export interface DatabaseResponse<T> {
  data: T | null;
  error: PostgrestError | null;
}

/**
 * Busca múltiplos registros de uma tabela
 */
export async function query<T>(
  table: string,
  options?: QueryOptions
): Promise<DatabaseResponse<T[]>> {
  try {
    let query = supabase.from(table).select(options?.select || '*');

    // Aplicar filtros
    if (options?.filter) {
      for (const filter of options.filter) {
        switch (filter.operator) {
          case 'eq':
            query = query.eq(filter.column, filter.value);
            break;
          case 'neq':
            query = query.neq(filter.column, filter.value);
            break;
          case 'gt':
            query = query.gt(filter.column, filter.value);
            break;
          case 'gte':
            query = query.gte(filter.column, filter.value);
            break;
          case 'lt':
            query = query.lt(filter.column, filter.value);
            break;
          case 'lte':
            query = query.lte(filter.column, filter.value);
            break;
          case 'like':
            query = query.like(filter.column, filter.value as string);
            break;
          case 'ilike':
            query = query.ilike(filter.column, filter.value as string);
            break;
          case 'in':
            query = query.in(filter.column, filter.value as unknown[]);
            break;
          case 'is':
            query = query.is(filter.column, filter.value);
            break;
        }
      }
    }

    // Aplicar ordenação
    if (options?.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.ascending ?? true,
      });
    }

    // Aplicar limite
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    // Aplicar offset
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;

    return { data: data as T[], error };
  } catch (error) {
    return {
      data: null,
      error: error as PostgrestError,
    };
  }
}

/**
 * Busca um único registro por ID
 */
export async function findById<T>(
  table: string,
  id: string,
  select?: string
): Promise<DatabaseResponse<T>> {
  try {
    const { data, error } = await supabase
      .from(table)
      .select(select || '*')
      .eq('id', id)
      .single();

    return { data: data as T, error };
  } catch (error) {
    return {
      data: null,
      error: error as PostgrestError,
    };
  }
}

/**
 * Cria um novo registro
 */
export async function create<T>(
  table: string,
  record: Partial<T>,
  select?: string
): Promise<DatabaseResponse<T>> {
  try {
    const { data, error } = await supabase
      .from(table)
      .insert([record])
      .select(select || '*')
      .single();

    return { data: data as T, error };
  } catch (error) {
    return {
      data: null,
      error: error as PostgrestError,
    };
  }
}

/**
 * Atualiza um registro existente
 */
export async function update<T>(
  table: string,
  id: string,
  updates: Partial<T>,
  select?: string
): Promise<DatabaseResponse<T>> {
  try {
    const { data, error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', id)
      .select(select || '*')
      .single();

    return { data: data as T, error };
  } catch (error) {
    return {
      data: null,
      error: error as PostgrestError,
    };
  }
}

/**
 * Remove um registro
 */
export async function remove(
  table: string,
  id: string
): Promise<{ error: PostgrestError | null }> {
  try {
    const { error } = await supabase.from(table).delete().eq('id', id);
    return { error };
  } catch (error) {
    return { error: error as PostgrestError };
  }
}

/**
 * Remove múltiplos registros
 */
export async function removeMany(
  table: string,
  ids: string[]
): Promise<{ error: PostgrestError | null }> {
  try {
    const { error } = await supabase.from(table).delete().in('id', ids);
    return { error };
  } catch (error) {
    return { error: error as PostgrestError };
  }
}


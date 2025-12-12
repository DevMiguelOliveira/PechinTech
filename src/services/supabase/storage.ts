/**
 * Serviços de Storage do Supabase
 * Centraliza operações com arquivos e imagens
 */
import { supabase } from './client';

export interface UploadOptions {
  upsert?: boolean;
  contentType?: string;
  cacheControl?: string;
}

export interface StorageResponse {
  path: string | null;
  error: Error | null;
}

/**
 * Faz upload de um arquivo
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File | Blob,
  options?: UploadOptions
): Promise<StorageResponse> {
  try {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      upsert: options?.upsert ?? false,
      contentType: options?.contentType,
      cacheControl: options?.cacheControl ?? '3600',
    });

    if (error) {
      return { path: null, error };
    }

    return { path: data.path, error: null };
  } catch (error) {
    return {
      path: null,
      error: error as Error,
    };
  }
}

/**
 * Obtém URL pública de um arquivo
 */
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Obtém URL assinada de um arquivo (temporária)
 */
export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresIn: number = 3600
): Promise<{ url: string | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn);

    if (error) {
      return { url: null, error };
    }

    return { url: data.signedUrl, error: null };
  } catch (error) {
    return {
      url: null,
      error: error as Error,
    };
  }
}

/**
 * Remove um arquivo
 */
export async function removeFile(
  bucket: string,
  paths: string[]
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.storage.from(bucket).remove(paths);
    return { error };
  } catch (error) {
    return { error: error as Error };
  }
}

/**
 * Lista arquivos em um bucket
 */
export async function listFiles(
  bucket: string,
  path?: string,
  options?: {
    limit?: number;
    offset?: number;
    sortBy?: { column: string; order?: 'asc' | 'desc' };
  }
): Promise<{ data: unknown[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.storage.from(bucket).list(path, options);

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error as Error,
    };
  }
}


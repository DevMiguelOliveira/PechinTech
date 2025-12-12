/**
 * Serviços de Realtime do Supabase
 * Centraliza operações de tempo real
 */
import { RealtimeChannel, REALTIME_LISTEN_TYPES } from '@supabase/supabase-js';
import { supabase } from './client';

export type RealtimeCallback<T = unknown> = (payload: T) => void;

/**
 * Inscreve-se em mudanças de uma tabela
 */
export function subscribeToTable<T = unknown>(
  table: string,
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
  callback: RealtimeCallback<T>
): RealtimeChannel {
  const channel = supabase
    .channel(`${table}-changes`)
    .on(
      REALTIME_LISTEN_TYPES.POSTGRES_CHANGES,
      {
        event: event === '*' ? '*' : event.toLowerCase(),
        schema: 'public',
        table,
      },
      (payload) => {
        callback(payload.new || payload.old as T);
      }
    )
    .subscribe();

  return channel;
}

/**
 * Remove inscrição de um canal
 */
export async function unsubscribe(channel: RealtimeChannel): Promise<void> {
  await supabase.removeChannel(channel);
}

/**
 * Inscreve-se em mudanças de presença (para colaboração)
 */
export function subscribeToPresence(
  channelName: string,
  onJoin?: (key: string, currentPresences: unknown[]) => void,
  onLeave?: (key: string, currentPresences: unknown[]) => void
): RealtimeChannel {
  const channel = supabase.channel(channelName);

  channel
    .on(REALTIME_LISTEN_TYPES.PRESENCE, { event: 'sync' }, () => {
      const state = channel.presenceState();
      // Callback para sincronização completa
    })
    .on(REALTIME_LISTEN_TYPES.PRESENCE, { event: 'join' }, ({ key, newPresences }) => {
      const state = channel.presenceState();
      if (onJoin) onJoin(key, newPresences);
    })
    .on(REALTIME_LISTEN_TYPES.PRESENCE, { event: 'leave' }, ({ key, leftPresences }) => {
      const state = channel.presenceState();
      if (onLeave) onLeave(key, leftPresences);
    })
    .subscribe();

  return channel;
}

/**
 * Atualiza presença no canal
 */
export async function trackPresence(
  channel: RealtimeChannel,
  presence: Record<string, unknown>
): Promise<void> {
  await channel.track(presence);
}


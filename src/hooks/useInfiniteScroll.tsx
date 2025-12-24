import { useEffect, useRef, useState, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number; // Distância do fim para carregar mais (em pixels)
  rootMargin?: string; // Margem do root para Intersection Observer
  enabled?: boolean; // Se o scroll infinito está habilitado
}

export function useInfiniteScroll(
  callback: () => void,
  options: UseInfiniteScrollOptions = {}
) {
  const { threshold = 200, rootMargin = '0px', enabled = true } = options;
  const [isFetching, setIsFetching] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && enabled && !isFetching) {
        setIsFetching(true);
        callback();
        // Reset após um delay para evitar múltiplas chamadas
        setTimeout(() => setIsFetching(false), 1000);
      }
    },
    [callback, enabled, isFetching]
  );

  useEffect(() => {
    if (!enabled || !sentinelRef.current) return;

    observerRef.current = new IntersectionObserver(handleIntersect, {
      rootMargin,
      threshold: 0.1,
    });

    const currentSentinel = sentinelRef.current;
    observerRef.current.observe(currentSentinel);

    return () => {
      if (observerRef.current && currentSentinel) {
        observerRef.current.unobserve(currentSentinel);
      }
    };
  }, [handleIntersect, rootMargin, enabled]);

  return { sentinelRef, isFetching };
}


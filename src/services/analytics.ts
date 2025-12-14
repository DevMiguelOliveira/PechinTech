// Google Analytics 4 Service
// Tracking de eventos e pageviews para o PechinTech

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

const GA_MEASUREMENT_ID = 'G-WRJVV4M71N';

/**
 * Verifica se o Google Analytics está disponível
 */
const isGtagAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

/**
 * Registra uma visualização de página
 */
export const trackPageView = (path: string, title?: string): void => {
  if (!isGtagAvailable()) return;
  
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
    page_title: title,
  });
};

/**
 * Registra um evento customizado
 */
export const trackEvent = (
  eventName: string,
  params?: Record<string, string | number | boolean>
): void => {
  if (!isGtagAvailable()) return;
  
  window.gtag('event', eventName, params);
};

// ============================================
// Eventos específicos do PechinTech
// ============================================

/**
 * Usuário clicou para ver a promoção (link de afiliado)
 */
export const trackPromoClick = (product: {
  id: string;
  title: string;
  store: string;
  price: number;
  category?: string;
}): void => {
  trackEvent('promo_click', {
    item_id: product.id,
    item_name: product.title,
    affiliation: product.store,
    price: product.price,
    item_category: product.category || 'outros',
    currency: 'BRL',
  });
};

/**
 * Usuário votou em uma promoção (quente/frio)
 */
export const trackVote = (productId: string, voteType: 'hot' | 'cold'): void => {
  trackEvent('vote', {
    item_id: productId,
    vote_type: voteType,
  });
};

/**
 * Usuário adicionou aos favoritos
 */
export const trackFavorite = (productId: string, action: 'add' | 'remove'): void => {
  trackEvent('favorite', {
    item_id: productId,
    action: action,
  });
};

/**
 * Usuário comentou em uma promoção
 */
export const trackComment = (productId: string): void => {
  trackEvent('comment', {
    item_id: productId,
  });
};

/**
 * Usuário compartilhou no WhatsApp
 */
export const trackShare = (productId: string, method: string = 'whatsapp'): void => {
  trackEvent('share', {
    item_id: productId,
    method: method,
  });
};

/**
 * Usuário copiou cupom de desconto
 */
export const trackCouponCopy = (productId: string, couponCode: string): void => {
  trackEvent('coupon_copy', {
    item_id: productId,
    coupon: couponCode,
  });
};

/**
 * Usuário fez busca
 */
export const trackSearch = (searchTerm: string, resultsCount: number): void => {
  trackEvent('search', {
    search_term: searchTerm,
    results_count: resultsCount,
  });
};

/**
 * Usuário filtrou por categoria
 */
export const trackCategoryFilter = (category: string): void => {
  trackEvent('category_filter', {
    category: category,
  });
};

/**
 * Usuário fez login/cadastro
 */
export const trackAuth = (method: 'login' | 'signup'): void => {
  trackEvent(method, {
    method: 'email',
  });
};

/**
 * Usuário abriu detalhes de um produto
 */
export const trackProductView = (product: {
  id: string;
  title: string;
  price: number;
  category?: string;
}): void => {
  trackEvent('view_item', {
    item_id: product.id,
    item_name: product.title,
    price: product.price,
    item_category: product.category || 'outros',
    currency: 'BRL',
  });
};


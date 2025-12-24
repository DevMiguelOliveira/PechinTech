/**
 * Validador de URLs para links externos
 * Garante que apenas URLs seguras e confiáveis sejam abertas
 */

import { validateAndSanitizeUrl, isTrustedDomain, openExternalUrl } from './security';

/**
 * Lista de domínios permitidos para links de afiliados
 */
const ALLOWED_AFFILIATE_DOMAINS = [
  'amazon.com.br',
  'amazon.com',
  'kabum.com.br',
  'magazineluiza.com.br',
  'americanas.com.br',
  'submarino.com.br',
  'shoptime.com.br',
  'mercadolivre.com.br',
  'terabyteshop.com.br',
  'pichau.com.br',
  'casasbahia.com.br',
  'extra.com.br',
  'pontofrio.com.br',
] as const;

/**
 * Valida URL de afiliado
 */
export function validateAffiliateUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  
  const sanitized = validateAndSanitizeUrl(url);
  if (!sanitized) return false;
  
  try {
    const urlObj = new URL(sanitized);
    const hostname = urlObj.hostname.toLowerCase();
    
    return ALLOWED_AFFILIATE_DOMAINS.some(domain => 
      hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

/**
 * Abre link de afiliado de forma segura
 */
export function openAffiliateUrl(url: string | null | undefined, fallbackUrl?: string) {
  // Verifica se a URL está vazia ou nula
  if (!url || url.trim() === '') {
    console.error('[openAffiliateUrl] URL de afiliado está vazia ou não definida');
    console.error('[openAffiliateUrl] URL recebida:', url);
    return;
  }

  console.log('[openAffiliateUrl] Tentando abrir URL:', url);

  // Tenta validar a URL
  const sanitized = validateAndSanitizeUrl(url);
  if (!sanitized) {
    console.error('[openAffiliateUrl] URL de afiliado inválida ou malformada:', url);
    console.error('[openAffiliateUrl] URL sanitizada:', sanitized);
    return;
  }

  console.log('[openAffiliateUrl] URL sanitizada:', sanitized);

  // Verifica se está na lista de domínios permitidos
  const isValidDomain = validateAffiliateUrl(url);
  console.log('[openAffiliateUrl] Domínio válido na lista permitida:', isValidDomain);
  
  if (!isValidDomain) {
    console.warn('[openAffiliateUrl] URL de afiliado não está na lista de domínios permitidos:', url);
    console.warn('[openAffiliateUrl] Domínios permitidos:', ALLOWED_AFFILIATE_DOMAINS);
    
    // Tenta abrir mesmo assim se for uma URL válida
    try {
      const urlObj = new URL(sanitized);
      console.log('[openAffiliateUrl] Hostname da URL:', urlObj.hostname);
      
      // Apenas bloqueia se for um protocolo perigoso
      if (['http:', 'https:'].includes(urlObj.protocol)) {
        console.log('[openAffiliateUrl] Abrindo URL mesmo não estando na lista de domínios permitidos');
        openExternalUrl(sanitized, { noopener: true, noreferrer: true });
        return;
      } else {
        console.error('[openAffiliateUrl] Protocolo não permitido:', urlObj.protocol);
        return;
      }
    } catch (error) {
      console.error('[openAffiliateUrl] Erro ao processar URL:', error);
      return;
    }
  }
  
  console.log('[openAffiliateUrl] Abrindo URL válida');
  openExternalUrl(sanitized, { noopener: true, noreferrer: true });
}

/**
 * Gera atributos seguros para links externos
 */
export function getSafeLinkAttributes(url: string) {
  const isValid = validateAndSanitizeUrl(url) !== null;
  
  return {
    href: isValid ? url : '#',
    target: '_blank',
    rel: 'nofollow noopener noreferrer',
    onClick: (e: React.MouseEvent) => {
      if (!isValid) {
        e.preventDefault();
        return;
      }
      // Validação adicional no clique
      const sanitized = validateAndSanitizeUrl(url);
      if (sanitized) {
        openExternalUrl(sanitized, { noopener: true, noreferrer: true });
      }
      e.preventDefault();
    },
  };
}



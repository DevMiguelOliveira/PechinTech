/**
 * Utilitários para moderação de conteúdo
 * Filtro de palavras ofensivas e bloqueio de links
 */

/**
 * Lista de palavras ofensivas
 * Em produção, considere usar uma API ou banco de dados externo para uma lista mais completa
 */
const PROFANITY_WORDS = [
  // Palavras ofensivas comuns em português (lista básica)
  'merda', 'porra', 'caralho', 'puta', 'puto', 'foda', 'foder', 'fodido',
  'viado', 'bicha', 'cuzão', 'cuzinho', 'buceta', 'boceta', 'piroca',
  'piranha', 'putinha', 'puta', 'prostituta', 'vagabunda', 'vagabundo',
  // Adicione mais palavras conforme necessário
  // Em produção, use uma lista mais completa ou API como https://www.purgomalum.com/
].map(word => word.toLowerCase());

/**
 * Padrões para detectar URLs/links
 */
const URL_PATTERNS = [
  /https?:\/\/[^\s]+/gi, // http:// ou https://
  /www\.[^\s]+/gi, // www.
  /[a-zA-Z0-9-]+\.[a-zA-Z]{2,}[^\s]*/gi, // domínios (ex: exemplo.com)
  /bit\.ly\/[^\s]+/gi, // bit.ly
  /t\.co\/[^\s]+/gi, // t.co (Twitter)
  /tinyurl\.com\/[^\s]+/gi, // tinyurl.com
];

/**
 * Verifica se o texto contém palavras ofensivas
 * @param text - Texto a ser verificado
 * @returns true se contém palavras ofensivas, false caso contrário
 */
export function containsProfanity(text: string): boolean {
  const normalizedText = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s]/g, ' '); // Remove caracteres especiais

  // Verifica cada palavra
  const words = normalizedText.split(/\s+/);
  
  return words.some((word) => {
    // Verifica palavra completa
    if (PROFANITY_WORDS.includes(word)) return true;
    
    // Verifica se palavra ofensiva está contida (para evitar bypasses)
    return PROFANITY_WORDS.some((profanity) => word.includes(profanity));
  });
}

/**
 * Verifica se o texto contém links/URLs
 * @param text - Texto a ser verificado
 * @returns true se contém links, false caso contrário
 */
export function containsLinks(text: string): boolean {
  // Reset regex lastIndex para evitar problemas com múltiplas chamadas
  return URL_PATTERNS.some((pattern) => {
    pattern.lastIndex = 0;
    return pattern.test(text);
  });
}

/**
 * Remove links de um texto
 * @param text - Texto a ser processado
 * @returns Texto sem links
 */
export function removeLinks(text: string): string {
  let cleanText = text;
  
  URL_PATTERNS.forEach((pattern) => {
    cleanText = cleanText.replace(pattern, '');
  });
  
  return cleanText.trim();
}

/**
 * Filtra palavras ofensivas, substituindo por asteriscos
 * @param text - Texto a ser filtrado
 * @returns Texto filtrado
 */
export function filterProfanity(text: string): string {
  const words = text.split(/(\s+)/);
  
  return words
    .map((word) => {
      const normalizedWord = word
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '');
      
      const isProfanity = PROFANITY_WORDS.some((profanity) => {
        return normalizedWord === profanity || normalizedWord.includes(profanity);
      });
      
      if (isProfanity) {
        return '*'.repeat(word.replace(/[^a-z0-9]/gi, '').length) + 
               word.replace(/[a-z0-9]/gi, '');
      }
      
      return word;
    })
    .join('');
}

/**
 * Valida conteúdo antes de ser enviado
 * @param content - Conteúdo a ser validado
 * @returns Objeto com resultado da validação e mensagem de erro (se houver)
 */
export function validateContent(content: string): {
  isValid: boolean;
  error?: string;
} {
  if (!content || content.trim().length === 0) {
    return {
      isValid: false,
      error: 'O comentário não pode estar vazio.',
    };
  }

  // Verifica se contém links
  if (containsLinks(content)) {
    return {
      isValid: false,
      error: 'Links não são permitidos nos comentários.',
    };
  }

  // Verifica se contém palavras ofensivas
  if (containsProfanity(content)) {
    return {
      isValid: false,
      error: 'O comentário contém palavras inadequadas. Por favor, revise o texto.',
    };
  }

  // Verifica tamanho máximo
  const MAX_LENGTH = 1000;
  if (content.length > MAX_LENGTH) {
    return {
      isValid: false,
      error: `O comentário deve ter no máximo ${MAX_LENGTH} caracteres.`,
    };
  }

  return {
    isValid: true,
  };
}

/**
 * Valida conteúdo de comentário antes de ser enviado
 * Alias para validateContent para manter compatibilidade
 */
export const validateCommentContent = validateContent;

/**
 * Sanitiza conteúdo removendo links e filtrando palavras ofensivas
 * @param content - Conteúdo a ser sanitizado
 * @returns Conteúdo sanitizado
 */
export function sanitizeContent(content: string): string {
  let sanitized = content;
  
  // Remove links
  sanitized = removeLinks(sanitized);
  
  // Filtra palavras ofensivas
  sanitized = filterProfanity(sanitized);
  
  return sanitized.trim();
}

/**
 * Serviço de integração com Google Gemini API
 * Gera conteúdo de blog posts baseado em produtos
 * 
 * Este serviço tenta usar o SDK oficial @google/genai primeiro.
 * Se o SDK não estiver disponível ou não funcionar no browser, usa a API REST como fallback.
 * 
 * Documentação oficial: https://ai.google.dev/gemini-api/docs
 * Modelo usado: gemini-3-flash-preview (mais recente conforme exemplo oficial)
 */

import { GoogleGenAI } from '@google/genai';

// Usando a versão mais recente da API
const GEMINI_API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
const GEMINI_MODEL = 'gemini-3-flash-preview'; // Modelo mais recente conforme documentação oficial

/**
 * Função para obter a API Key de forma mais robusta
 * Verifica em runtime para garantir que a variável de ambiente foi carregada
 * 
 * NOTA: No frontend (Vite), variáveis de ambiente precisam do prefixo VITE_
 * A documentação do Google menciona GEMINI_API_KEY, mas isso é para backend.
 * No frontend, usamos VITE_GEMINI_API_KEY.
 * 
 * Esta função tenta ambas as formas para máxima compatibilidade.
 */
export function getGeminiApiKey(): string | null {
  // Tenta primeiro VITE_GEMINI_API_KEY (padrão para frontend/Vite)
  let apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  // Se não encontrar, tenta GEMINI_API_KEY (caso alguém configure assim)
  // Nota: No Vite, variáveis sem prefixo VITE_ não são expostas,
  // mas tentamos por compatibilidade
  if (!apiKey) {
    apiKey = import.meta.env.GEMINI_API_KEY;
  }
  
  if (!apiKey) {
    console.warn('[Gemini] API Key não encontrada. Verificando:', {
      hasViteKey: !!import.meta.env.VITE_GEMINI_API_KEY,
      hasGeminiKey: !!import.meta.env.GEMINI_API_KEY,
      allEnvKeys: Object.keys(import.meta.env).filter(k => k.includes('GEMINI') || k.includes('API')),
      allViteKeys: Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')),
    });
    return null;
  }
  
  const trimmed = apiKey.trim();
  
  // Validação: deve ter pelo menos 20 caracteres (API Keys do Google geralmente têm 39)
  if (trimmed.length >= 20 && !trimmed.includes('sua_chave') && !trimmed.includes('your_api_key')) {
    return trimmed;
  }
  
  console.warn('[Gemini] API Key inválida:', {
    length: trimmed.length,
    containsPlaceholder: trimmed.includes('sua_chave') || trimmed.includes('your_api_key'),
    preview: trimmed.substring(0, 10) + '...',
  });
  return null;
}

export interface GeminiContentRequest {
  productTitle: string;
  productDescription: string;
  productPrice: number;
  productCategory: string;
  affiliateUrl: string;
}

export interface GeminiResponse {
  content: string;
  excerpt: string;
  error?: string;
}

/**
 * Gera conteúdo de blog post usando Google Gemini
 */
export async function generateBlogPostContent(
  request: GeminiContentRequest
): Promise<GeminiResponse> {
  // Verificar API Key de forma mais robusta (verificar novamente em runtime)
  const apiKey = getGeminiApiKey();
  
  console.log('[Gemini] Verificando API Key:', {
    hasKey: !!apiKey,
    keyLength: apiKey?.length || 0,
    keyPreview: apiKey ? `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}` : 'não encontrada',
    envKeys: Object.keys(import.meta.env).filter(k => k.includes('GEMINI')),
    allViteKeys: Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')),
    rawEnvValue: import.meta.env.VITE_GEMINI_API_KEY ? 'presente' : 'ausente',
  });
  
  if (!apiKey) {
    const errorMsg = 'VITE_GEMINI_API_KEY não está configurada ou é inválida. Configure a variável de ambiente no arquivo .env e REINICIE o servidor de desenvolvimento.';
    console.error('[Gemini]', errorMsg, {
      rawEnvValue: import.meta.env.VITE_GEMINI_API_KEY,
      allEnvKeys: Object.keys(import.meta.env),
    });
    throw new Error(errorMsg);
  }

  const prompt = `Crie um artigo de blog completo e profissional em português brasileiro sobre o produto "${request.productTitle}".

INSTRUÇÕES:
- O artigo deve ter entre 800 e 1200 palavras
- Use formatação Markdown (títulos com #, listas, negrito, etc.)
- Seja informativo, útil e otimizado para SEO
- Inclua seções como: introdução, características principais, benefícios, comparações, dicas de uso
- Use linguagem natural e envolvente
- No final, adicione uma chamada para ação incentivando a compra
- NÃO inclua o link de afiliado no conteúdo (será adicionado separadamente)
- Seja específico sobre o produto e suas características

PRODUTO:
- Título: ${request.productTitle}
- Descrição: ${request.productDescription}
- Preço: R$ ${request.productPrice.toFixed(2)}
- Categoria: ${request.productCategory}

Gere o conteúdo completo do artigo em Markdown, sendo detalhado e informativo.`;

  try {
    // Tentar usar o SDK oficial primeiro
    try {
      const client = new GoogleGenAI({ apiKey });
      
      console.log('[Gemini] Usando SDK oficial, modelo:', GEMINI_MODEL);
      
      const interaction = await client.interactions.create({
        model: GEMINI_MODEL,
        input: prompt,
      });
      
      const lastOutput = interaction.outputs[interaction.outputs.length - 1];
      const fullContent = typeof lastOutput === 'string' 
        ? lastOutput 
        : (lastOutput as any)?.text || (lastOutput as any)?.content || '';
      
      if (!fullContent || typeof fullContent !== 'string') {
        throw new Error('Resposta vazia ou inválida do SDK');
      }
      
      // Gerar excerpt (primeiras 2-3 frases ou até 200 caracteres)
      const excerpt = generateExcerpt(fullContent, request.productTitle);

      // Adicionar link de afiliado no final
      const contentWithAffiliate = `${fullContent}

---

## 🛒 Onde Comprar

Encontre este produto com o melhor preço e condições:

**👉 [Ver Oferta do ${request.productTitle}](${request.affiliateUrl})**

*Link afiliado - Ao comprar através deste link, você ajuda a manter o PechinTech funcionando sem custo adicional para você.*

---

*Artigo criado pelo PechinTech - As melhores promoções de tecnologia do Brasil.*`;

      return {
        content: contentWithAffiliate,
        excerpt,
      };
    } catch (sdkError) {
      // Se o SDK falhar (pode não funcionar no browser), usar API REST como fallback
      console.warn('[Gemini] SDK falhou, usando API REST como fallback:', sdkError);
      
      // Continuar com implementação REST abaixo
    }
    
    // Fallback: Usando a API REST oficial do Google Gemini
    // Formato: https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}
    const apiUrl = `${GEMINI_API_BASE_URL}/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
    
    console.log('[Gemini] Usando API REST, modelo:', GEMINI_MODEL);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `Erro na API Gemini: ${response.status} ${response.statusText}`;
      console.error('[Gemini] Erro na resposta da API:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        model: GEMINI_MODEL,
      });
      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Resposta inválida da API Gemini');
    }

    const fullContent = data.candidates[0].content.parts[0].text;

    // Gerar excerpt (primeiras 2-3 frases ou até 200 caracteres)
    const excerpt = generateExcerpt(fullContent, request.productTitle);

    // Adicionar link de afiliado no final
    const contentWithAffiliate = `${fullContent}

---

## 🛒 Onde Comprar

Encontre este produto com o melhor preço e condições:

**👉 [Ver Oferta do ${request.productTitle}](${request.affiliateUrl})**

*Link afiliado - Ao comprar através deste link, você ajuda a manter o PechinTech funcionando sem custo adicional para você.*

---

*Artigo criado pelo PechinTech - As melhores promoções de tecnologia do Brasil.*

---

*Artigo criado pelo PechinTech - As melhores promoções de tecnologia do Brasil.*`;

    return {
      content: contentWithAffiliate,
      excerpt,
    };
  } catch (error) {
    console.error('[Gemini] Erro ao gerar conteúdo:', error);
    
    let errorMessage = 'Erro desconhecido ao gerar conteúdo com Gemini';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Tratamento específico para erros comuns
      if (error.message.includes('API key not valid') || error.message.includes('invalid API key')) {
        errorMessage = 'API Key inválida. Verifique se a chave está correta no arquivo .env e reinicie o servidor';
      } else if (error.message.includes('quota') || error.message.includes('Quota')) {
        errorMessage = 'Quota da API excedida. Verifique seu limite no Google AI Studio';
      } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
        errorMessage = 'Acesso negado. Verifique se a API Key tem permissões adequadas';
      } else if (error.message.includes('429') || error.message.includes('Too Many Requests')) {
        errorMessage = 'Muitas requisições. Aguarde alguns instantes e tente novamente';
      } else if (error.message.includes('network') || error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente';
      }
    }
    
    return {
      content: '',
      excerpt: '',
      error: errorMessage,
    };
  }
}

/**
 * Interface para geração de conteúdo genérico de blog
 */
export interface GeminiGenericBlogRequest {
  title: string;
  topic?: string;
  description?: string;
  keywords?: string[];
  wordCount?: number; // Padrão: 1000
}

/**
 * Gera conteúdo genérico de blog post usando Google Gemini
 */
export async function generateGenericBlogContent(
  request: GeminiGenericBlogRequest
): Promise<GeminiResponse> {
  // Verificar API Key de forma mais robusta (verificar novamente em runtime)
  const apiKey = getGeminiApiKey();
  
  console.log('[Gemini] Verificando API Key para conteúdo genérico:', {
    hasKey: !!apiKey,
    keyLength: apiKey?.length || 0,
    keyPreview: apiKey ? `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}` : 'não encontrada',
  });
  
  if (!apiKey) {
    const errorMsg = 'VITE_GEMINI_API_KEY não está configurada ou é inválida. Configure a variável de ambiente no arquivo .env e REINICIE o servidor de desenvolvimento.';
    console.error('[Gemini]', errorMsg, {
      rawEnvValue: import.meta.env.VITE_GEMINI_API_KEY,
    });
    throw new Error(errorMsg);
  }

  const wordCount = request.wordCount || 1000;
  const keywordsText = request.keywords && request.keywords.length > 0 
    ? `\n- Palavras-chave: ${request.keywords.join(', ')}`
    : '';

  const prompt = `Crie um artigo de blog completo e profissional em português brasileiro sobre "${request.title}".

${request.topic ? `TEMA/ASSUNTO: ${request.topic}\n` : ''}
${request.description ? `DESCRIÇÃO: ${request.description}\n` : ''}

INSTRUÇÕES:
- O artigo deve ter aproximadamente ${wordCount} palavras
- Use formatação Markdown (títulos com #, listas, negrito, itálico, etc.)
- Seja informativo, útil e otimizado para SEO
- Inclua seções como: introdução, desenvolvimento do tema, exemplos práticos, conclusão
- Use linguagem natural, envolvente e acessível
- Seja específico e detalhado sobre o assunto
- Use parágrafos bem estruturados
- Inclua listas quando apropriado
${keywordsText}

Gere o conteúdo completo do artigo em Markdown, sendo detalhado, informativo e bem estruturado.`;

  try {
    // Tentar usar o SDK oficial primeiro
    try {
      const client = new GoogleGenAI({ apiKey });
      
      console.log('[Gemini] Usando SDK oficial para conteúdo genérico, modelo:', GEMINI_MODEL);
      
      const interaction = await client.interactions.create({
        model: GEMINI_MODEL,
        input: prompt,
      });
      
      const lastOutput = interaction.outputs[interaction.outputs.length - 1];
      const fullContent = typeof lastOutput === 'string' 
        ? lastOutput 
        : (lastOutput as any)?.text || (lastOutput as any)?.content || '';
      
      if (!fullContent || typeof fullContent !== 'string') {
        throw new Error('Resposta vazia ou inválida do SDK');
      }
      
      // Gerar excerpt (primeiras 2-3 frases ou até 200 caracteres)
      const excerpt = generateGenericExcerpt(fullContent, request.title);

      return {
        content: fullContent,
        excerpt,
      };
    } catch (sdkError) {
      // Se o SDK falhar (pode não funcionar no browser), usar API REST como fallback
      console.warn('[Gemini] SDK falhou, usando API REST como fallback:', sdkError);
      
      // Continuar com implementação REST abaixo
    }
    
    // Fallback: Usando a API REST oficial do Google Gemini
    const apiUrl = `${GEMINI_API_BASE_URL}/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
    
    console.log('[Gemini] Usando API REST para conteúdo genérico, modelo:', GEMINI_MODEL);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: Math.min(wordCount * 2, 4096), // Aproximadamente 2 tokens por palavra
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `Erro na API Gemini: ${response.status} ${response.statusText}`;
      console.error('[Gemini] Erro na resposta da API:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });
      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Resposta inválida da API Gemini');
    }

    const fullContent = data.candidates[0].content.parts[0].text;

    // Gerar excerpt (primeiras 2-3 frases ou até 200 caracteres)
    const excerpt = generateGenericExcerpt(fullContent, request.title);

    return {
      content: fullContent,
      excerpt,
    };
  } catch (error) {
    console.error('[Gemini] Erro ao gerar conteúdo genérico:', error);
    
    let errorMessage = 'Erro desconhecido ao gerar conteúdo com Gemini';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Tratamento específico para erros comuns
      if (error.message.includes('API key not valid') || error.message.includes('invalid API key')) {
        errorMessage = 'API Key inválida. Verifique se a chave está correta no arquivo .env e reinicie o servidor';
      } else if (error.message.includes('quota') || error.message.includes('Quota')) {
        errorMessage = 'Quota da API excedida. Verifique seu limite no Google AI Studio';
      } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
        errorMessage = 'Acesso negado. Verifique se a API Key tem permissões adequadas';
      } else if (error.message.includes('429') || error.message.includes('Too Many Requests')) {
        errorMessage = 'Muitas requisições. Aguarde alguns instantes e tente novamente';
      } else if (error.message.includes('network') || error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente';
      }
    }
    
    return {
      content: '',
      excerpt: '',
      error: errorMessage,
    };
  }
}

/**
 * Gera um excerpt a partir do conteúdo
 */
function generateExcerpt(content: string, productTitle: string): string {
  // Remove markdown headers e formatação
  const plainText = content
    .replace(/^#+\s+/gm, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .trim();

  // Pega o primeiro parágrafo ou primeiras 200 caracteres
  const firstParagraph = plainText.split('\n\n')[0] || plainText.substring(0, 200);

  // Limita a 200 caracteres
  if (firstParagraph.length > 200) {
    return firstParagraph.substring(0, 197) + '...';
  }

  // Se o excerpt for muito curto, adiciona contexto
  if (firstParagraph.length < 50) {
    return `Descubra tudo sobre ${productTitle}. ${firstParagraph}`;
  }

  return firstParagraph;
}

/**
 * Gera um excerpt genérico a partir do conteúdo
 */
function generateGenericExcerpt(content: string, title: string): string {
  // Remove markdown headers e formatação
  const plainText = content
    .replace(/^#+\s+/gm, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .trim();

  // Pega o primeiro parágrafo ou primeiras 200 caracteres
  const firstParagraph = plainText.split('\n\n')[0] || plainText.substring(0, 200);

  // Limita a 200 caracteres
  if (firstParagraph.length > 200) {
    return firstParagraph.substring(0, 197) + '...';
  }

  // Se o excerpt for muito curto, adiciona contexto
  if (firstParagraph.length < 50) {
    return `Leia mais sobre ${title}. ${firstParagraph}`;
  }

  return firstParagraph;
}


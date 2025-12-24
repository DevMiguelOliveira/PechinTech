/**
 * Serviço de integração com Google Gemini API
 * Gera conteúdo de blog posts baseado em produtos
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

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
  console.log('[Gemini] Verificando API Key:', {
    hasKey: !!GEMINI_API_KEY,
    keyLength: GEMINI_API_KEY?.length || 0,
    keyPreview: GEMINI_API_KEY ? `${GEMINI_API_KEY.substring(0, 10)}...` : 'não encontrada',
  });
  
  if (!GEMINI_API_KEY) {
    throw new Error('VITE_GEMINI_API_KEY não está configurada. Configure a variável de ambiente.');
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

PRODUTO:
- Título: ${request.productTitle}
- Descrição: ${request.productDescription}
- Preço: R$ ${request.productPrice.toFixed(2)}
- Categoria: ${request.productCategory}

Gere o conteúdo completo do artigo em Markdown.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
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
      throw new Error(
        errorData.error?.message || `Erro na API Gemini: ${response.status} ${response.statusText}`
      );
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
    console.error('Erro ao gerar conteúdo com Gemini:', error);
    return {
      content: '',
      excerpt: '',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
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


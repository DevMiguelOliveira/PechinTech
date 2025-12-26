/**
 * Serviço centralizado para chamadas de API
 * 
 * Este serviço faz chamadas apenas para endpoints internos do próprio projeto.
 * Nunca chama APIs externas diretamente do frontend.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface GerarPostRequest {
  tema: string;
  descricao?: string;
  palavrasChave?: string[];
}

export interface GerarPostResponse {
  content: string;
  error?: string;
}

/**
 * Gera conteúdo de post de blog usando IA
 * 
 * Esta função chama apenas o endpoint interno /api/gerar-post,
 * que por sua vez chama a API do Gemini no backend.
 * 
 * @param request - Dados para geração do post
 * @returns Conteúdo gerado ou erro
 */
export async function gerarPostComIA(
  request: GerarPostRequest
): Promise<GerarPostResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/gerar-post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tema: request.tema.trim(),
        descricao: request.descricao?.trim(),
        palavrasChave: request.palavrasChave,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        content: '',
        error: data.error || `Erro ${response.status}: ${response.statusText}`,
      };
    }

    if (!data.content || typeof data.content !== 'string') {
      return {
        content: '',
        error: 'Resposta inválida do servidor',
      };
    }

    return {
      content: data.content,
    };
  } catch (error) {
    console.error('[API] Erro ao chamar endpoint de geração:', error);
    
    return {
      content: '',
      error: error instanceof Error 
        ? error.message 
        : 'Erro de conexão. Verifique sua internet e tente novamente.',
    };
  }
}



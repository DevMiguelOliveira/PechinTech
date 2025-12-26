// Link Preview API Service
// Extrai automaticamente título, descrição e imagem de URLs

const LINK_PREVIEW_API_KEY = '4c11ed0c8afbeca20345e98639b25036';
const LINK_PREVIEW_API_URL = 'https://api.linkpreview.net';

export interface LinkPreviewData {
  title: string;
  description: string;
  image: string;
  url: string;
  siteName?: string;
}

export interface LinkPreviewResponse {
  success: boolean;
  data?: LinkPreviewData;
  error?: string;
}

/**
 * Extrai informações de uma URL usando a API LinkPreview
 * @param url - URL do produto/página a ser analisada
 * @returns Dados extraídos (título, descrição, imagem) ou erro
 */
export async function fetchLinkPreview(url: string): Promise<LinkPreviewResponse> {
  if (!url || !url.trim()) {
    return {
      success: false,
      error: 'URL não fornecida',
    };
  }

  // Valida se é uma URL válida
  try {
    new URL(url);
  } catch {
    return {
      success: false,
      error: 'URL inválida',
    };
  }

  try {
    const response = await fetch(LINK_PREVIEW_API_URL, {
      method: 'POST',
      headers: {
        'X-Linkpreview-Api-Key': LINK_PREVIEW_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: url }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return {
          success: false,
          error: 'Limite de requisições atingido. Tente novamente em alguns minutos.',
        };
      }
      return {
        success: false,
        error: `Erro na API: ${response.status}`,
      };
    }

    const data = await response.json();

    // Verifica se a resposta contém os dados esperados
    if (!data || (!data.title && !data.description && !data.image)) {
      return {
        success: false,
        error: 'Não foi possível extrair informações desta URL',
      };
    }

    return {
      success: true,
      data: {
        title: data.title || '',
        description: data.description || '',
        image: data.image || '',
        url: data.url || url,
        siteName: extractStoreName(data.url || url),
      },
    };
  } catch (error) {
    console.error('Erro ao buscar link preview:', error);
    return {
      success: false,
      error: 'Erro de conexão. Verifique sua internet.',
    };
  }
}

/**
 * Extrai o nome da loja a partir da URL
 */
function extractStoreName(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    
    // Mapeamento de domínios conhecidos para nomes de lojas
    const storeMap: Record<string, string> = {
      'kabum.com.br': 'Kabum',
      'www.kabum.com.br': 'Kabum',
      'pichau.com.br': 'Pichau',
      'www.pichau.com.br': 'Pichau',
      'terabyteshop.com.br': 'Terabyte',
      'www.terabyteshop.com.br': 'Terabyte',
      'amazon.com.br': 'Amazon',
      'www.amazon.com.br': 'Amazon',
      'mercadolivre.com.br': 'Mercado Livre',
      'www.mercadolivre.com.br': 'Mercado Livre',
      'magazineluiza.com.br': 'Magazine Luiza',
      'www.magazineluiza.com.br': 'Magazine Luiza',
      'casasbahia.com.br': 'Casas Bahia',
      'www.casasbahia.com.br': 'Casas Bahia',
      'americanas.com.br': 'Americanas',
      'www.americanas.com.br': 'Americanas',
      'shopee.com.br': 'Shopee',
      'www.shopee.com.br': 'Shopee',
      'aliexpress.com': 'AliExpress',
      'pt.aliexpress.com': 'AliExpress',
      'chipart.com.br': 'Chipart',
      'www.chipart.com.br': 'Chipart',
    };

    // Retorna o nome mapeado ou formata o hostname
    if (storeMap[hostname]) {
      return storeMap[hostname];
    }

    // Formata o hostname removendo www e .com.br/.com
    let storeName = hostname
      .replace(/^www\./, '')
      .replace(/\.com\.br$/, '')
      .replace(/\.com$/, '');
    
    // Capitaliza a primeira letra
    return storeName.charAt(0).toUpperCase() + storeName.slice(1);
  } catch {
    return '';
  }
}


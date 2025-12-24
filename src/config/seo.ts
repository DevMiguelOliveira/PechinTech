/**
 * Configurações de SEO para o PechinTech
 * Centraliza todas as configurações de SEO para facilitar manutenção
 */

export const SEO_CONFIG = {
  siteName: 'PechinTech',
  siteUrl: import.meta.env.VITE_SITE_URL || 'https://www.pechintech.com.br',
  defaultTitle: 'PechinTech | Site Oficial - Promoções de Tecnologia no Brasil',
  defaultDescription: 'PechinTech é o site oficial de promoções de tecnologia do Brasil. Encontre as melhores ofertas de hardware, games, smartphones e periféricos. Compare preços e economize com cupons exclusivos PechinTech.',
  defaultKeywords: 'pechintech, pechintech.com.br, www.pechintech.com.br, promoções tecnologia, ofertas hardware, descontos games, promoções smartphones, notebooks baratos, placa de vídeo promoção, processador barato, memória RAM oferta, SSD promoção, monitor gamer, teclado mecânico, mouse gamer, headset promoção, PC gamer barato, pechinchas tecnologia, cupom desconto tecnologia',
  defaultImage: 'https://storage.googleapis.com/gpt-engineer-file-uploads/uGvIu746MfU4oUgKOxjO2PRbF313/social-images/social-1765503088493-Logo PechinTech.png',
  logo: '/web-app-manifest-512x512.png',
  locale: 'pt_BR',
  localeAlternate: 'pt_PT',
  twitterHandle: '@pechintech',
  socialLinks: {
    facebook: 'https://www.facebook.com/pechintech',
    twitter: 'https://www.twitter.com/pechintech',
    instagram: 'https://www.instagram.com/pechintech',
  },
  organization: {
    name: 'PechinTech',
    legalName: 'PechinTech',
    alternateName: 'Pechin Tech',
    url: 'https://www.pechintech.com.br',
    logo: 'https://www.pechintech.com.br/web-app-manifest-512x512.png',
    description: 'PechinTech é o site oficial de promoções de tecnologia do Brasil',
    contactPoint: {
      contactType: 'customer service',
      availableLanguage: 'Portuguese',
    },
  },
} as const;

/**
 * Gera structured data padrão para Organization
 */
export function getOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SEO_CONFIG.organization.name,
    url: SEO_CONFIG.organization.url,
    logo: SEO_CONFIG.organization.logo,
    description: SEO_CONFIG.organization.description,
    sameAs: Object.values(SEO_CONFIG.socialLinks),
    contactPoint: {
      '@type': 'ContactPoint',
      ...SEO_CONFIG.organization.contactPoint,
    },
  };
}

/**
 * Gera structured data para WebSite
 */
export function getWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SEO_CONFIG.siteName,
    url: SEO_CONFIG.siteUrl,
    description: SEO_CONFIG.defaultDescription,
    publisher: {
      '@type': 'Organization',
      name: SEO_CONFIG.organization.name,
      logo: {
        '@type': 'ImageObject',
        url: SEO_CONFIG.organization.logo,
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SEO_CONFIG.siteUrl}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: SEO_CONFIG.locale,
  };
}

/**
 * Gera structured data para Product
 */
export function getProductStructuredData(product: {
  id: string;
  title: string;
  description: string;
  image_url: string;
  current_price: number;
  original_price: number;
  affiliate_url: string;
  category: string;
  store?: string;
  hot_votes: number;
  cold_votes: number;
  coupon_code?: string | null;
}) {
  const ratingCount = product.hot_votes + product.cold_votes;
  const ratingValue = ratingCount > 0 
    ? ((product.hot_votes / ratingCount) * 5).toFixed(1)
    : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${SEO_CONFIG.siteUrl}/product/${product.id}`,
    name: product.title,
    description: product.description.substring(0, 160),
    image: product.image_url,
    category: product.category,
    brand: {
      '@type': 'Brand',
      name: product.store || 'Loja Parceira',
    },
    offers: {
      '@type': 'Offer',
      price: product.current_price,
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      url: product.affiliate_url,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      seller: {
        '@type': 'Organization',
        name: product.store || 'Loja Parceira',
      },
      ...(product.coupon_code && {
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: product.current_price,
          priceCurrency: 'BRL',
        },
      }),
    },
    ...(ratingValue && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue,
        reviewCount: ratingCount,
        bestRating: '5',
        worstRating: '1',
      },
    }),
  };
}

/**
 * Gera structured data para Article/BlogPost
 */
export function getArticleStructuredData(post: {
  title: string;
  excerpt?: string;
  content: string;
  slug: string;
  created_at: string;
  updated_at?: string;
  image_url?: string;
  author?: string;
}) {
  const siteUrl = SEO_CONFIG.siteUrl;
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const publishedDate = new Date(post.created_at).toISOString();
  const modifiedDate = post.updated_at 
    ? new Date(post.updated_at).toISOString() 
    : publishedDate;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': postUrl,
    headline: post.title,
    description: post.excerpt || post.title,
    image: post.image_url || SEO_CONFIG.defaultImage,
    datePublished: publishedDate,
    dateModified: modifiedDate,
    author: {
      '@type': 'Person',
      name: post.author || SEO_CONFIG.siteName,
    },
    publisher: {
      '@type': 'Organization',
      name: SEO_CONFIG.organization.name,
      url: SEO_CONFIG.organization.url,
      logo: {
        '@type': 'ImageObject',
        url: SEO_CONFIG.organization.logo,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    articleSection: 'Tecnologia',
  };
}

/**
 * Gera structured data para BreadcrumbList
 */
export function getBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url.startsWith('http') ? crumb.url : `${SEO_CONFIG.siteUrl}${crumb.url}`,
    })),
  };
}


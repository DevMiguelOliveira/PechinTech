/**
 * Componente SEO para metadados dinâmicos por página
 * 
 * Gerencia metadados HTML, Open Graph, Twitter Cards e dados estruturados
 * para otimização de SEO e compartilhamento em redes sociais.
 * 
 * @example
 * ```tsx
 * <SEO
 *   title="Produto Específico"
 *   description="Descrição detalhada do produto"
 *   url="/produto/123"
 *   type="product"
 * />
 * ```
 */
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  noindex?: boolean;
  structuredData?: Record<string, unknown>;
}

const defaultTitle = "PechinTech - Promoções de Tecnologia | Ofertas de Hardware, Games e Periféricos";
const defaultDescription = "Encontre as melhores promoções de tecnologia. Hardware, periféricos, games e smartphones com os menores preços. Vote nas ofertas e compartilhe com a comunidade!";
const defaultImage = "https://storage.googleapis.com/gpt-engineer-file-uploads/uGvIu746MfU4oUgKOxjO2PRbF313/social-images/social-1765503088493-Logo PechinTech.png";
const baseUrl = "https://pechintech.com";

export function SEO({
  title,
  description = defaultDescription,
  keywords,
  image = defaultImage,
  url,
  type = "website",
  noindex = false,
  structuredData,
}: SEOProps) {
  const fullTitle = title ? `${title} | PechinTech` : defaultTitle;
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const defaultKeywords = "promoções, tecnologia, hardware, games, periféricos, ofertas, descontos, PC gamer, notebooks, smartphones, placa de vídeo, processador, memória RAM, SSD, monitor, teclado, mouse, headset, webcam";
  const metaKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={metaKeywords} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Canonical */}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={fullTitle} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            ...structuredData,
          })}
        </script>
      )}
    </Helmet>
  );
}


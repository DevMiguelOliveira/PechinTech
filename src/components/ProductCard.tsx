import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Store, Copy, Check, Share2, Sparkles, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Thermometer } from '@/components/Thermometer';
import { BuyButton } from '@/components/BuyButton';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { trackPromoClick, trackCouponCopy, trackShare, trackProductView } from '@/services/analytics';
import { shareProduct, generateProductSlug } from '@/utils/share';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  onToggleFavorite: (productId: string) => void;
  onVoteHot: (productId: string) => void;
  onVoteCold: (productId: string) => void;
  isFavorite?: boolean;
}

export function ProductCard({
  product,
  onOpenDetails,
  onToggleFavorite,
  onVoteHot,
  onVoteCold,
  isFavorite = false,
}: ProductCardProps) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  
  const discount = Math.round(
    ((product.original_price - product.current_price) / product.original_price) * 100
  );

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleCopyCoupon = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.coupon_code) {
      try {
        await navigator.clipboard.writeText(product.coupon_code);
        setCopied(true);
        toast({
          title: 'Cupom copiado!',
          description: `Código "${product.coupon_code}" copiado para a área de transferência.`,
        });
        // Analytics: tracking de cópia de cupom
        trackCouponCopy(product.id, product.coupon_code);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast({
          title: 'Erro ao copiar',
          description: 'Não foi possível copiar o cupom.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Analytics: tracking de compartilhamento
    trackShare(product.id, 'share');
    
    await shareProduct(product, (method) => {
      trackShare(product.id, method);
    });
  };
  const handleCardClick = () => {
    // Analytics: tracking de visualização de produto
    trackProductView({
      id: product.id,
      title: product.title,
      price: product.current_price,
      category: product.category,
    });
    // Navegar para página individual do produto (SEO friendly)
    const productSlug = generateProductSlug(product);
    navigate(`/produto/${productSlug}`);
  };
  
  const handlePromoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Analytics: tracking de clique no link de afiliado
    trackPromoClick({
      id: product.id,
      title: product.title,
      store: product.store,
      price: product.current_price,
      category: product.category,
    });
    window.open(product.affiliate_url, '_blank', 'noopener,noreferrer');
  };

  const isHotDeal = discount >= 30 || product.temperature > 70;
  const savings = product.original_price - product.current_price;

  return (
    <article
      className={cn(
        'group relative flex flex-row rounded-2xl bg-gradient-to-br from-card to-card/50 overflow-hidden',
        'border-2 transition-all duration-500 ease-out',
        'hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20',
        'hover:-translate-y-1 hover:scale-[1.01]',
        isHotDeal ? 'border-primary/30 shadow-lg shadow-primary/10' : 'border-border/50',
        'min-h-[200px] sm:min-h-[240px] backdrop-blur-sm',
        'flex-col sm:flex-row' // Vertical no mobile, horizontal no desktop
      )}
      onClick={handleCardClick}
    >
      {/* Gradient Overlay for Hot Deals */}
      {isHotDeal && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none z-0" />
      )}

      {/* Animated Background Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />

      {/* Discount Badge - Enhanced */}
      {discount > 0 && (
        <div className="absolute top-3 left-3 z-20">
          <Badge
            className={cn(
              'font-black shadow-2xl text-xs sm:text-sm px-3 py-1.5',
              'bg-gradient-to-r from-red-500 to-orange-500 text-white',
              'border-2 border-white/20 backdrop-blur-sm',
              'animate-pulse hover:animate-none',
              discount >= 50 && 'from-red-600 to-pink-600 scale-110'
            )}
          >
            <Sparkles className="h-3 w-3 mr-1 inline" />
            -{discount}% OFF
          </Badge>
        </div>
      )}

      {/* Favorite Button - Enhanced */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'absolute top-3 right-3 z-20 rounded-full',
          'bg-background/90 backdrop-blur-md border border-border/50',
          'hover:bg-primary hover:text-primary-foreground hover:scale-110',
          'hover:border-primary transition-all duration-300',
          'h-9 w-9 shadow-lg'
        )}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(product.id);
        }}
        aria-label={isFavorite ? `Remover ${product.title} dos favoritos` : `Adicionar ${product.title} aos favoritos`}
      >
        <Heart className={cn('h-4 w-4 transition-all', isFavorite && 'fill-current scale-110')} aria-hidden="true" />
      </Button>

      {/* Product Image - Horizontal Layout */}
      <div className="relative w-full sm:w-[280px] md:w-[320px] lg:w-[360px] flex-shrink-0 h-[200px] sm:h-auto overflow-hidden bg-gradient-to-br from-muted/20 to-muted/5 group/image">
        <img
          src={product.image_url}
          alt={product.title}
          loading="lazy"
          className={cn(
            'w-full h-full object-contain p-4 sm:p-6 transition-all duration-500',
            'group-hover:scale-110 group-hover:brightness-110'
          )}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
        
        {/* Image Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content - Horizontal Layout */}
      <div className="flex flex-col flex-1 p-4 sm:p-5 lg:p-6 gap-3 sm:gap-4 relative z-10 min-w-0">
        {/* Header Section - Store, Category, Title */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge 
              variant="outline" 
              className="text-xs font-semibold px-2.5 py-1 bg-background/80 backdrop-blur-sm border-primary/30"
            >
              <Store className="h-3 w-3 mr-1.5" />
              {product.store}
            </Badge>
            <Badge 
              variant="secondary" 
              className="text-xs font-semibold px-2.5 py-1 capitalize bg-primary/10 text-primary border-primary/20"
            >
              {product.category}
            </Badge>
          </div>

          {/* Title - SEO Optimized H3 */}
          <h3 className="font-bold text-base sm:text-lg lg:text-xl line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-300">
            {product.title}
          </h3>
          
          {/* Description - Visible in horizontal layout */}
          <p className="text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3">
            {product.description}
          </p>
        </div>

        {/* Price & Actions Section - Side by side on desktop */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-auto">
          {/* Price Section */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-sm sm:text-base text-muted-foreground line-through font-medium">
                {formatPrice(product.original_price)}
              </span>
              {savings > 0 && (
                <Badge variant="outline" className="text-xs px-2 py-0.5 bg-green-500/10 text-green-600 border-green-500/30">
                  Economize {formatPrice(savings)}
                </Badge>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-primary leading-none">
                {formatPrice(product.current_price)}
              </span>
            </div>
          </div>

          {/* Thermometer - Compact */}
          <div className="flex-shrink-0">
            <Thermometer
              temperature={product.temperature}
              hotVotes={product.hot_votes}
              coldVotes={product.cold_votes}
              onVoteHot={() => onVoteHot(product.id)}
              onVoteCold={() => onVoteCold(product.id)}
              size="sm"
            />
          </div>
        </div>

        {/* Bottom Section - Coupon, CTA, Actions */}
        <div className="space-y-3 pt-2 border-t border-border/50">
          {/* Coupon Code & CTA Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Coupon Code */}
            {product.coupon_code && (
              <button
                onClick={handleCopyCoupon}
                className={cn(
                  "flex-1 sm:flex-initial sm:min-w-[200px] flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl",
                  "bg-gradient-to-r from-primary/20 to-primary/10 border-2 border-primary/30",
                  "hover:from-primary/30 hover:to-primary/20 hover:border-primary/50",
                  "transition-all duration-300 hover:scale-[1.02]",
                  "text-sm font-semibold group/coupon"
                )}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Cupom:</span>
                </div>
                <span className="font-mono font-black text-primary text-base uppercase tracking-wider">
                  {product.coupon_code}
                </span>
                {copied ? (
                  <Check className="h-5 w-5 text-green-500 shrink-0 animate-in zoom-in" />
                ) : (
                  <Copy className="h-4 w-4 text-muted-foreground shrink-0 group-hover/coupon:text-primary transition-colors" />
                )}
              </button>
            )}

            {/* Main CTA Button */}
            <div className={cn("flex-1", product.coupon_code && "sm:flex-1")}>
              <BuyButton
                discount={discount}
                onClick={handlePromoClick}
                size="lg"
                variant="card"
                className="w-full h-12 sm:h-14"
              />
            </div>
          </div>

          {/* Footer - Trust Badge, Social Proof, Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Trust Badge & Social Proof */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80 px-2 py-1 bg-muted/30 rounded-lg border border-border/30">
                <Shield className="h-3 w-3 shrink-0" />
                <span className="hidden sm:inline">Link afiliado • Ganhamos comissão sem custo extra</span>
                <span className="sm:hidden">Link afiliado</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-3 w-3 text-primary" />
                <span className="font-semibold">{product.hot_votes + product.cold_votes} avaliações</span>
                {discount >= 30 && (
                  <Badge variant="outline" className="text-[10px] px-2 py-0.5 bg-red-500/10 text-red-600 border-red-500/30 animate-pulse">
                    ⚡ Oferta limitada
                  </Badge>
                )}
              </div>
            </div>

            {/* Secondary Actions */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span className="text-xs font-medium">{product.comments_count}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-xs hover:bg-green-500/10 hover:text-green-600 hover:border-green-500/30 border border-transparent hover:border transition-all"
                onClick={handleShare}
                aria-label={`Compartilhar ${product.title}`}
              >
                <Share2 className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                <span className="hidden sm:inline">Compartilhar</span>
              </Button>
              <p className="text-[10px] text-muted-foreground/70 hidden lg:inline">
                {formatDate(product.created_at)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

import { Heart, MessageCircle, ExternalLink, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Thermometer } from '@/components/Thermometer';
import { Product } from '@/types';
import { cn } from '@/lib/utils';

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
  const discount = Math.round(
    ((product.original_price - product.current_price) / product.original_price) * 100
  );

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <article
      className={cn(
        'group relative flex flex-col rounded-xl bg-card overflow-hidden',
        'border border-border/50 transition-all duration-300',
        'hover:border-primary/30 hover:shadow-xl hover:-translate-y-1',
        'card-glow'
      )}
    >
      {/* Discount Badge */}
      {discount > 0 && (
        <Badge
          className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground font-bold shadow-lg"
        >
          -{discount}%
        </Badge>
      )}

      {/* Favorite Button */}
      <Button
        variant="ghost"
        size="icon-sm"
        className={cn(
          'absolute top-3 right-3 z-10 rounded-full bg-background/80 backdrop-blur-sm',
          'hover:bg-background hover:scale-110 transition-all',
          isFavorite && 'text-primary'
        )}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(product.id);
        }}
      >
        <Heart className={cn('h-4 w-4', isFavorite && 'fill-current')} />
      </Button>

      {/* Product Image */}
      <div
        className="relative aspect-[4/3] overflow-hidden cursor-pointer"
        onClick={() => onOpenDetails(product)}
      >
        <img
          src={product.image_url}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Store Badge */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-normal">
            <Store className="h-3 w-3 mr-1" />
            {product.store}
          </Badge>
          <Badge variant="secondary" className="text-xs font-normal capitalize">
            {product.category}
          </Badge>
        </div>

        {/* Title */}
        <h3
          className="font-semibold text-sm line-clamp-2 cursor-pointer hover:text-primary transition-colors"
          onClick={() => onOpenDetails(product)}
        >
          {product.title}
        </h3>

        {/* Price */}
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground line-through">
            {formatPrice(product.original_price)}
          </span>
          <span className="text-xl font-bold text-primary">
            {formatPrice(product.current_price)}
          </span>
        </div>

        {/* Thermometer */}
        <Thermometer
          temperature={product.temperature}
          hotVotes={product.hot_votes}
          coldVotes={product.cold_votes}
          onVoteHot={() => onVoteHot(product.id)}
          onVoteCold={() => onVoteCold(product.id)}
          size="sm"
        />

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto pt-2">
          <Button
            variant="neon"
            className="flex-1"
            onClick={() => window.open(product.affiliate_url, '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
            Pegar Promoção
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={() => onOpenDetails(product)}
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground">
            {product.comments_count}
          </span>
        </div>
      </div>
    </article>
  );
}

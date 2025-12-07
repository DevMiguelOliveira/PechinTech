import { useState } from 'react';
import { Search, Heart, User, Menu, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onOpenAuth: () => void;
  onOpenFavorites: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Header({ onOpenAuth, onOpenFavorites, searchQuery, onSearchChange }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 glow-orange">
            <Zap className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold tracking-wider hidden sm:block">
            <span className="text-foreground">PECHIN</span>
            <span className="text-primary">TECH</span>
          </span>
        </a>

        {/* Search Bar - Desktop */}
        <div className="flex-1 max-w-xl hidden md:flex">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Buscar promoções de tech..."
              className="pl-10 bg-surface-elevated border-border/50 focus:border-primary/50 focus:ring-primary/20 h-10"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Favorites Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenFavorites}
            className="relative hover:text-primary"
          >
            <Heart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              3
            </span>
          </Button>

          {/* User Menu - Desktop */}
          <div className="hidden sm:flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onOpenAuth}>
              Entrar
            </Button>
            <Button variant="neon" size="sm" onClick={onOpenAuth}>
              Cadastrar
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Search & Menu */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300',
          isMobileMenuOpen ? 'max-h-48 border-t border-border/50' : 'max-h-0'
        )}
      >
        <div className="container py-4 space-y-4">
          {/* Mobile Search */}
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar promoções..."
              className="pl-10 bg-surface-elevated border-border/50"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Mobile Auth Buttons */}
          <div className="flex gap-2 sm:hidden">
            <Button variant="outline" className="flex-1" onClick={onOpenAuth}>
              Entrar
            </Button>
            <Button variant="neon" className="flex-1" onClick={onOpenAuth}>
              Cadastrar
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

import { useState } from 'react';
import { Filter, Cpu, Mouse, Smartphone, Gamepad2, Monitor, Laptop, Flame, Clock, MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Category, SortOption } from '@/types';
import { cn } from '@/lib/utils';

const categoryIcons: Record<string, React.ElementType> = {
  hardware: Cpu,
  peripherals: Mouse,
  smartphones: Smartphone,
  games: Gamepad2,
  monitors: Monitor,
  notebooks: Laptop,
};

const categories = [
  { id: 'hardware', name: 'Hardware' },
  { id: 'peripherals', name: 'Periféricos' },
  { id: 'smartphones', name: 'Smartphones' },
  { id: 'games', name: 'Games' },
  { id: 'monitors', name: 'Monitores' },
  { id: 'notebooks', name: 'Notebooks' },
] as const;

const sortOptions = [
  { id: 'hottest', name: 'Mais Quentes', icon: Flame },
  { id: 'newest', name: 'Mais Recentes', icon: Clock },
  { id: 'commented', name: 'Mais Comentados', icon: MessageCircle },
] as const;

interface MobileFiltersProps {
  selectedCategory: Category | null;
  onSelectCategory: (category: Category | null) => void;
  selectedSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
}

export function MobileFilters({
  selectedCategory,
  onSelectCategory,
  selectedSort,
  onSelectSort,
}: MobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeFiltersCount = (selectedCategory ? 1 : 0) + (selectedSort !== 'hottest' ? 1 : 0);

  return (
    <div className="lg:hidden sticky top-16 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 py-3">
      <div className="container">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pb-1">
          {/* Filter Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="shrink-0">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[70vh] rounded-t-2xl">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Sort Options */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                    Ordenar por
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {sortOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <Button
                          key={option.id}
                          variant={selectedSort === option.id ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            onSelectSort(option.id);
                            setIsOpen(false);
                          }}
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {option.name}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                {/* Categories */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                    Categorias
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedCategory === null ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        onSelectCategory(null);
                        setIsOpen(false);
                      }}
                    >
                      Todas
                    </Button>
                    {categories.map((category) => {
                      const Icon = categoryIcons[category.id];
                      return (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            onSelectCategory(category.id as Category);
                            setIsOpen(false);
                          }}
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {category.name}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Quick Category Pills */}
          {categories.slice(0, 4).map((category) => {
            const Icon = categoryIcons[category.id];
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                className="shrink-0"
                onClick={() =>
                  onSelectCategory(
                    selectedCategory === category.id ? null : (category.id as Category)
                  )
                }
              >
                <Icon className="h-4 w-4 mr-1" />
                {category.name}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

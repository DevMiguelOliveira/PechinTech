import { Cpu, Mouse, Smartphone, Gamepad2, Monitor, Laptop, Flame, Clock, MessageCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
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

interface SidebarProps {
  selectedCategory: Category | null;
  onSelectCategory: (category: Category | null) => void;
  selectedSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
  className?: string;
}

export function Sidebar({
  selectedCategory,
  onSelectCategory,
  selectedSort,
  onSelectSort,
  className,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        'w-64 shrink-0 border-r border-border/50 bg-sidebar hidden lg:block',
        className
      )}
    >
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="p-4 space-y-6">
          {/* Sort Section */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-3">
              <Filter className="h-4 w-4" />
              Ordenar por
            </h3>
            <div className="space-y-1">
              {sortOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Button
                    key={option.id}
                    variant="ghost"
                    className={cn(
                      'w-full justify-start gap-3 font-normal',
                      selectedSort === option.id && 'bg-primary/10 text-primary'
                    )}
                    onClick={() => onSelectSort(option.id)}
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4',
                        selectedSort === option.id && 'text-primary'
                      )}
                    />
                    {option.name}
                  </Button>
                );
              })}
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Categories Section */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-3">
              <Cpu className="h-4 w-4" />
              Categorias
            </h3>
            <div className="space-y-1">
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start gap-3 font-normal',
                  selectedCategory === null && 'bg-primary/10 text-primary'
                )}
                onClick={() => onSelectCategory(null)}
              >
                Todas as categorias
              </Button>
              {categories.map((category) => {
                const Icon = categoryIcons[category.id];
                return (
                  <Button
                    key={category.id}
                    variant="ghost"
                    className={cn(
                      'w-full justify-start gap-3 font-normal',
                      selectedCategory === category.id && 'bg-primary/10 text-primary'
                    )}
                    onClick={() => onSelectCategory(category.id as Category)}
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4',
                        selectedCategory === category.id && 'text-primary'
                      )}
                    />
                    {category.name}
                  </Button>
                );
              })}
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Stats */}
          <div className="rounded-lg bg-surface-elevated p-4 space-y-3">
            <h4 className="text-sm font-semibold">Estatísticas do Dia</h4>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-md bg-background p-2">
                <div className="text-lg font-bold text-primary">127</div>
                <div className="text-[10px] text-muted-foreground">Promoções</div>
              </div>
              <div className="rounded-md bg-background p-2">
                <div className="text-lg font-bold text-cyber-blue">2.4K</div>
                <div className="text-[10px] text-muted-foreground">Votos</div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}

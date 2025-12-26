import { FolderTree, Flame, Clock, MessageCircle, Filter, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Category, SortOption } from '@/types';
import { cn } from '@/lib/utils';
import { useCategories, DbCategory } from '@/hooks/useCategories';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

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

// Organiza categorias em hierarquia (categorias raiz com subcategorias)
function organizeCategoriesHierarchy(categories: DbCategory[]) {
  // Filtrar categorias raiz (sem parent_id) e ordenar por nome
  const rootCategories = categories
    .filter((cat) => !cat.parent_id)
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  
  const subcategoriesMap = new Map<string, DbCategory[]>();

  // Agrupar subcategorias por parent_id e ordenar por nome
  categories.forEach((cat) => {
    if (cat.parent_id) {
      if (!subcategoriesMap.has(cat.parent_id)) {
        subcategoriesMap.set(cat.parent_id, []);
      }
      subcategoriesMap.get(cat.parent_id)!.push(cat);
    }
  });

  // Ordenar subcategorias por nome
  subcategoriesMap.forEach((subcats, parentId) => {
    subcategoriesMap.set(
      parentId,
      subcats.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
    );
  });

  return { rootCategories, subcategoriesMap };
}

export function Sidebar({
  selectedCategory,
  onSelectCategory,
  selectedSort,
  onSelectSort,
  className,
}: SidebarProps) {
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // #region agent log
  if (categoriesError) {
    fetch('http://127.0.0.1:7242/ingest/93008681-2cd6-434f-a333-e54b0eca1ade',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/Sidebar.tsx:50',message:'Categories error in Sidebar',data:{errorMessage:categoriesError?.message,errorStack:categoriesError?.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'A'})}).catch(()=>{});
  }
  // #endregion

  const { rootCategories, subcategoriesMap } = organizeCategoriesHierarchy(
    categories || []
  );

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <aside
      className={cn(
        'w-64 shrink-0 border-r border-border/50 bg-sidebar/95 backdrop-blur-sm hidden lg:block',
        'fixed top-16 left-0 z-30 h-[calc(100vh-4rem)]',
        'transition-all duration-200',
        className
      )}
    >
      <ScrollArea className="h-full">
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
                      'focus:ring-2 focus:ring-primary focus:ring-offset-2',
                      selectedSort === option.id && 'bg-primary/10 text-primary'
                    )}
                    onClick={() => onSelectSort(option.id)}
                    aria-pressed={selectedSort === option.id}
                    aria-label={`Ordenar por ${option.name}`}
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4',
                        selectedSort === option.id && 'text-primary'
                      )}
                      aria-hidden="true"
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
              <FolderTree className="h-4 w-4" />
              Categorias
            </h3>
            <div className="space-y-1">
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start gap-3 font-normal transition-all',
                  'hover:bg-primary/5 hover:text-primary',
                  'focus:ring-2 focus:ring-primary focus:ring-offset-2',
                  selectedCategory === null && 'bg-primary/10 text-primary font-medium'
                )}
                onClick={() => onSelectCategory(null)}
                aria-pressed={selectedCategory === null}
                aria-label="Filtrar todas as categorias"
              >
                <span className="flex items-center gap-2">
                  <span>🏠</span>
                  <span>Todas as categorias</span>
                </span>
              </Button>
              {categoriesLoading ? (
                <div className="space-y-1">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-9 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {rootCategories.map((category) => {
                    const isSelected = selectedCategory === category.slug;
                    const hasSubcategories = subcategoriesMap.has(category.id);
                    const isExpanded = expandedCategories.has(category.id);
                    const subcategories = subcategoriesMap.get(category.id) || [];

                    return (
                      <div key={category.id} className="space-y-1">
                        <div className="flex items-center gap-1 group">
                          {hasSubcategories && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className={cn(
                                'h-7 w-7 p-0 transition-all',
                                'hover:bg-primary/10 hover:text-primary',
                                isExpanded && 'text-primary'
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCategory(category.id);
                              }}
                              aria-label={isExpanded ? 'Recolher subcategorias' : 'Expandir subcategorias'}
                            >
                              <ChevronRight
                                className={cn(
                                  'h-4 w-4 transition-transform duration-200',
                                  isExpanded && 'rotate-90'
                                )}
                                aria-hidden="true"
                              />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            className={cn(
                              'flex-1 justify-start gap-2 font-normal transition-all',
                              'hover:bg-primary/5 hover:text-primary',
                              'focus:ring-2 focus:ring-primary focus:ring-offset-2',
                              isSelected && 'bg-primary/10 text-primary font-medium shadow-sm'
                            )}
                            onClick={() => onSelectCategory(category.slug as Category)}
                            aria-pressed={isSelected}
                            aria-label={`Filtrar por categoria ${category.name}`}
                          >
                            <span className="truncate flex items-center gap-2">
                              {isSelected && <span className="text-primary">●</span>}
                              <span>{category.name}</span>
                            </span>
                          </Button>
                        </div>
                        {hasSubcategories && isExpanded && (
                          <div className="ml-7 space-y-1 border-l-2 border-primary/20 pl-3 py-1 animate-in slide-in-from-top-2 duration-200">
                            {subcategories.map((subcategory) => {
                              const isSubSelected = selectedCategory === subcategory.slug;
                              return (
                                <Button
                                  key={subcategory.id}
                                  variant="ghost"
                                  className={cn(
                                    'w-full justify-start gap-2 font-normal text-sm transition-all',
                                    'hover:bg-primary/5 hover:text-primary hover:translate-x-1',
                                    'focus:ring-2 focus:ring-primary focus:ring-offset-2',
                                    isSubSelected && 'bg-primary/10 text-primary font-medium shadow-sm'
                                  )}
                                  onClick={() => onSelectCategory(subcategory.slug as Category)}
                                  aria-pressed={isSubSelected}
                                  aria-label={`Filtrar por subcategoria ${subcategory.name}`}
                                >
                                  <span className="flex items-center gap-2">
                                    <span className={cn(
                                      'text-muted-foreground transition-colors',
                                      isSubSelected && 'text-primary'
                                    )}>└─</span>
                                    {isSubSelected && <span className="text-primary text-xs">●</span>}
                                    <span className="truncate">{subcategory.name}</span>
                                  </span>
                                </Button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </ScrollArea>
    </aside>
  );
}
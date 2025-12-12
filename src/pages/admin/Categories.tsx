import { useState } from 'react';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  DbCategory,
  CategoryFormData,
} from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
} from 'lucide-react';
import { SEO } from '@/components/SEO';

const emptyForm: CategoryFormData = {
  name: '',
  slug: '',
  parent_id: null,
};

const CategoryForm = ({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
  excludeCategoryId,
}: {
  initialData: CategoryFormData;
  onSubmit: (data: CategoryFormData) => void;
  isLoading: boolean;
  onCancel: () => void;
  excludeCategoryId?: string; // Para evitar que uma categoria seja pai de si mesma
}) => {
  const [form, setForm] = useState(initialData);
  const { data: allCategories } = useCategories();

  // Filtrar categorias disponíveis para serem pais (excluir a própria categoria se estiver editando)
  const availableParentCategories = allCategories?.filter(
    (cat) => cat.id !== excludeCategoryId
  ) || [];

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setForm({ ...form, name, slug });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome *</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Ex: Processadores"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug (URL) *</Label>
        <Input
          id="slug"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          placeholder="Ex: processadores"
          required
        />
        <p className="text-xs text-muted-foreground">
          URL amigável para a categoria (ex: processadores, placas-de-video)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="parent_id">Categoria Pai (Opcional)</Label>
        <Select
          value={form.parent_id || ''}
          onValueChange={(value) => setForm({ ...form, parent_id: value || null })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma categoria pai para criar subcategoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Nenhuma (Categoria Principal)</SelectItem>
            {availableParentCategories
              .filter((cat) => !cat.parent_id) // Apenas categorias raiz podem ser pais
              .map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Deixe em branco para criar uma categoria principal. Selecione uma categoria para criar uma subcategoria.
        </p>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Salvar
        </Button>
      </div>
    </form>
  );
};

const Categories = () => {
  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DbCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<DbCategory | null>(null);

  const handleCreate = (data: CategoryFormData) => {
    createCategory.mutate(data, {
      onSuccess: () => {
        setIsCreateOpen(false);
        // Forçar refetch para garantir que aparece imediatamente
      },
    });
  };

  const handleUpdate = (data: CategoryFormData) => {
    if (!editingCategory) return;
    updateCategory.mutate(
      { id: editingCategory.id, ...data },
      { onSuccess: () => setEditingCategory(null) }
    );
  };

  const handleDelete = () => {
    if (!deletingCategory) return;
    deleteCategory.mutate(deletingCategory.id, {
      onSuccess: () => setDeletingCategory(null),
    });
  };

  return (
    <div className="space-y-6">
      <SEO
        title="Painel Administrativo - Categorias"
        description="Gerencie categorias de produtos no painel administrativo do PechinTech"
        url="/admin/categories"
        noindex
      />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Categorias</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as categorias de produtos
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Categoria</DialogTitle>
            </DialogHeader>
            <CategoryForm
              initialData={emptyForm}
              onSubmit={handleCreate}
              isLoading={createCategory.isPending}
              onCancel={() => setIsCreateOpen(false)}
              excludeCategoryId={undefined}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : categories?.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">
              Nenhuma categoria encontrada.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead className="hidden sm:table-cell">Slug</TableHead>
                    <TableHead className="hidden md:table-cell">Categoria Pai</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories?.map((category) => {
                    const isSubcategory = !!category.parent_id;
                    return (
                      <TableRow key={category.id} className={isSubcategory ? 'bg-muted/30' : ''}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {isSubcategory && (
                              <span className="text-xs text-muted-foreground">└─</span>
                            )}
                            <span>{category.name}</span>
                            {isSubcategory && (
                              <span className="text-xs text-muted-foreground bg-primary/10 text-primary px-2 py-0.5 rounded">
                                Subcategoria
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">
                          {category.slug}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {category.parent?.name || (
                            <span className="text-muted-foreground/50">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingCategory(category)}
                              aria-label={`Editar categoria ${category.name}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeletingCategory(category)}
                              aria-label={`Excluir categoria ${category.name}`}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Categoria</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <CategoryForm
              initialData={{
                name: editingCategory.name,
                slug: editingCategory.slug,
                parent_id: editingCategory.parent_id || null,
              }}
              onSubmit={handleUpdate}
              isLoading={updateCategory.isPending}
              onCancel={() => setEditingCategory(null)}
              excludeCategoryId={editingCategory.id}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingCategory} onOpenChange={() => setDeletingCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A categoria "{deletingCategory?.name}" será
              removida. Produtos vinculados ficarão sem categoria.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteCategory.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Categories;


import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ProductFilter } from '@/components/products/ProductFilter';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductTable } from '@/components/products/ProductTable';
import { ProductForm } from '@/components/products/ProductForm';
import { mockProducts, searchProducts } from '@/components/products/ProductData';
import { Product } from '@/types/product';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, List } from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [displayMode, setDisplayMode] = useState<'grid' | 'table'>('grid');
  const [formOpen, setFormOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSearch = (query: string) => {
    setProducts(searchProducts(query));
  };

  const handleAddNew = () => {
    setCurrentProduct(undefined);
    setFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      const productName = products.find(p => p.id === productToDelete)?.name;
      setProducts(products.filter(p => p.id !== productToDelete));
      toast({
        title: "تم حذف المنتج",
        description: `تم حذف المنتج "${productName}" بنجاح`,
      });
      setProductToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleSubmitForm = (data: Partial<Product>) => {
    if (data.id) {
      // تحديث منتج موجود
      setProducts(products.map(p => p.id === data.id ? { ...p, ...data } : p));
    } else {
      // إضافة منتج جديد
      const newProduct: Product = {
        id: Math.random().toString(36).substring(2, 9),
        name: data.name || '',
        sku: data.sku || '',
        description: data.description || '',
        price: data.price || 0,
        cost: data.cost || 0,
        stock: data.stock || 0,
        categoryId: '1', // قيمة افتراضية
        imageUrl: data.imageUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProducts([newProduct, ...products]);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">إدارة المنتجات</h1>
        <p className="text-muted-foreground mt-1">
          إدارة مخزون المنتجات وإضافة منتجات جديدة
        </p>
      </div>

      <ProductFilter 
        onSearch={handleSearch} 
        onAddNew={handleAddNew} 
        onOpenFilter={() => {}}
      />

      <div className="mb-4">
        <Tabs defaultValue={displayMode} onValueChange={(v) => setDisplayMode(v as 'grid' | 'table')}>
          <div className="flex justify-end">
            <TabsList>
              <TabsTrigger value="grid">
                <LayoutGrid className="h-4 w-4 ml-2" />
                شبكة
              </TabsTrigger>
              <TabsTrigger value="table">
                <List className="h-4 w-4 ml-2" />
                جدول
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="grid">
            <ProductGrid 
              products={products} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          </TabsContent>
          <TabsContent value="table">
            <ProductTable 
              products={products} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          </TabsContent>
        </Tabs>
      </div>

      <ProductForm 
        open={formOpen} 
        onOpenChange={setFormOpen} 
        initialData={currentProduct} 
        onSubmit={handleSubmitForm} 
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذا المنتج؟</AlertDialogTitle>
            <AlertDialogDescription>
              لا يمكن التراجع عن هذا الإجراء. سيتم حذف المنتج نهائياً من قاعدة البيانات.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              نعم، احذف المنتج
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

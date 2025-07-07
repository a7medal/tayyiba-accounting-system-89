
import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ProductFilter } from '@/components/products/ProductFilter';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductTable } from '@/components/products/ProductTable';
import { ProductForm } from '@/components/products/ProductForm';
// import { mockProducts, searchProducts } from '@/components/products/ProductData'; // إزالة البيانات الوهمية
import ProductDBService from '@/services/ProductDBService'; // استيراد خدمة IndexedDB
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
import { LayoutGrid, List, Loader2 } from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayMode, setDisplayMode] = useState<'grid' | 'table'>('grid');
  const [formOpen, setFormOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedProducts = await ProductDBService.getAllProducts();
      setProducts(fetchedProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())); // ترتيب الأحدث أولاً
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast({
        title: "خطأ في جلب المنتجات",
        description: "لم نتمكن من تحميل قائمة المنتجات من قاعدة البيانات.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      const searchedProducts = await ProductDBService.searchProducts(query);
      setProducts(searchedProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error("Failed to search products:", error);
      toast({
        title: "خطأ في البحث",
        description: "حدث خطأ أثناء البحث عن المنتجات.",
        variant: "destructive",
      });
      setProducts([]); // مسح المنتجات في حالة الخطأ
    } finally {
      setIsLoading(false);
    }
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

  const confirmDelete = async () => {
    if (productToDelete) {
      const productName = products.find(p => p.id === productToDelete)?.name || 'المنتج';
      try {
        await ProductDBService.deleteProduct(productToDelete);
        toast({
          title: "تم حذف المنتج",
          description: `تم حذف المنتج "${productName}" بنجاح.`,
        });
        setProductToDelete(null);
        fetchProducts(); // إعادة جلب المنتجات لتحديث القائمة
      } catch (error) {
        console.error("Failed to delete product:", error);
        toast({
          title: "خطأ في حذف المنتج",
          description: `لم نتمكن من حذف المنتج "${productName}".`,
          variant: "destructive",
        });
      }
    }
    setDeleteDialogOpen(false);
  };

  const handleSubmitForm = async (data: Partial<Product>) => {
    try {
      if (data.id) { // تحديث منتج موجود
        const productToUpdate = products.find(p => p.id === data.id);
        if (!productToUpdate) {
          toast({ title: "خطأ", description: "لم يتم العثور على المنتج للتحديث.", variant: "destructive" });
          return;
        }
        const updatedProductData: Product = {
          ...productToUpdate,
          ...data,
          price: Number(data.price),
          cost: Number(data.cost),
          stock: Number(data.stock),
          updatedAt: new Date().toISOString(),
        };
        await ProductDBService.updateProduct(updatedProductData);
        // toast message is handled by ProductForm
      } else { // إضافة منتج جديد
        const newProduct: Product = {
          id: Math.random().toString(36).substring(2, 11), // معرف أطول قليلاً
          name: data.name || '',
          sku: data.sku || '',
          description: data.description || '',
          price: Number(data.price) || 0,
          cost: Number(data.cost) || 0,
          stock: Number(data.stock) || 0,
          categoryId: data.categoryId || 'default-cat', // قيمة افتراضية أو من النموذج
          imageUrl: data.imageUrl,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          currency: data.currency || 'MRU',
        };
        await ProductDBService.addProduct(newProduct);
        // toast message is handled by ProductForm
      }
      fetchProducts(); // إعادة جلب المنتجات لتحديث القائمة
    } catch (error: any) {
      console.error("Failed to save product:", error);
      const isSkuError = error && error.name === 'ConstraintError' && error.message.toLowerCase().includes('sku');
      toast({
        title: "خطأ في حفظ المنتج",
        description: isSkuError ? "رمز المنتج (SKU) موجود بالفعل. يرجى استخدام رمز آخر." : "لم نتمكن من حفظ المنتج. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

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

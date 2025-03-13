
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Product } from '@/types/product';
import { useToast } from '@/hooks/use-toast';

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Product;
  onSubmit: (data: Partial<Product>) => void;
}

export function ProductForm({ 
  open, 
  onOpenChange, 
  initialData, 
  onSubmit 
}: ProductFormProps) {
  const isEditing = !!initialData;
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: {
      name: initialData?.name || '',
      sku: initialData?.sku || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      cost: initialData?.cost || 0,
      stock: initialData?.stock || 0,
      imageUrl: initialData?.imageUrl || '',
      currency: initialData?.currency || 'MRU',
    },
  });

  const handleSubmit = (values: any) => {
    const data = {
      ...values,
      id: initialData?.id,
      price: Number(values.price),
      cost: Number(values.cost),
      stock: Number(values.stock),
    };

    onSubmit(data);
    toast({
      title: isEditing ? "تم تحديث المنتج" : "تم إضافة المنتج",
      description: isEditing 
        ? `تم تحديث المنتج "${values.name}" بنجاح` 
        : `تم إضافة المنتج "${values.name}" بنجاح`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'تعديل المنتج' : 'إضافة منتج جديد'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم المنتج</FormLabel>
                    <FormControl>
                      <Input placeholder="اسم المنتج" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رمز المنتج (SKU)</FormLabel>
                    <FormControl>
                      <Input placeholder="PRD-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>وصف المنتج</FormLabel>
                  <FormControl>
                    <Textarea placeholder="وصف المنتج..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>سعر البيع</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>التكلفة</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المخزون</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العملة</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر العملة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MRU">أوقية جديدة (MRU)</SelectItem>
                        <SelectItem value="MRO">أوقية قديمة (MRO)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رابط الصورة</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">إلغاء</Button>
              </DialogClose>
              <Button type="submit">{isEditing ? 'تحديث المنتج' : 'إضافة المنتج'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

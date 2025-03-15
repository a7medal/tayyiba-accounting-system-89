
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Product, formatCurrency } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted/50">
            <span className="text-muted-foreground">لا توجد صورة</span>
          </div>
        )}
      </div>
      <CardHeader className="p-4">
        <CardTitle className="line-clamp-1 text-xl">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">رمز المنتج:</span>
            <span className="font-medium">{product.sku}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">السعر:</span>
            <span className="font-medium">{formatCurrency(product.price)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">المخزون:</span>
            <span className={`font-medium ${product.stock <= 5 ? 'text-destructive' : ''}`}>
              {product.stock} وحدة
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <Button variant="outline" size="sm" onClick={() => onEdit(product)}>
          <Edit className="h-4 w-4 ml-1" />
          تعديل
        </Button>
        <Button variant="outline" size="sm" onClick={() => onDelete(product.id)}>
          <Trash2 className="h-4 w-4 ml-1" />
          حذف
        </Button>
      </CardFooter>
    </Card>
  );
}

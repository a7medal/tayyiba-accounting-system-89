
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Product, formatCurrency } from '@/types/product';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg text-muted-foreground mb-4">لا توجد منتجات متاحة</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>اسم المنتج</TableHead>
            <TableHead>رمز المنتج</TableHead>
            <TableHead>السعر</TableHead>
            <TableHead>التكلفة</TableHead>
            <TableHead>المخزون</TableHead>
            <TableHead>العملة</TableHead>
            <TableHead>الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.sku}</TableCell>
              <TableCell>{formatCurrency(product.price, product.currency)}</TableCell>
              <TableCell>{formatCurrency(product.cost, product.currency)}</TableCell>
              <TableCell className={product.stock <= 5 ? 'text-destructive' : ''}>
                {product.stock} وحدة
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded-md">
                  {product.currency}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(product)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(product.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}


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
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";
import { Purchase, getPaymentStatusLabel } from '@/types/purchase';
import { formatCurrency } from '@/types/product';
import { format } from 'date-fns';

interface PurchaseTableProps {
  purchases: Purchase[];
  onEdit: (purchase: Purchase) => void;
  onDelete: (id: string) => void;
  onView: (purchase: Purchase) => void;
}

export function PurchaseTable({ purchases, onEdit, onDelete, onView }: PurchaseTableProps) {
  if (purchases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg text-muted-foreground mb-4">لا توجد مشتريات متطابقة مع البحث</p>
      </div>
    );
  }

  const getPaymentStatusClass = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500 hover:bg-green-600';
      case 'pending':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'partial':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'cancelled':
        return 'bg-destructive hover:bg-destructive/90';
      default:
        return 'bg-muted hover:bg-muted/90';
    }
  };

  return (
    <div className="rounded-md border card-glass">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>رقم المرجع</TableHead>
            <TableHead>المورد</TableHead>
            <TableHead>التاريخ</TableHead>
            <TableHead>إجمالي المبلغ</TableHead>
            <TableHead>المبلغ المدفوع</TableHead>
            <TableHead>حالة الدفع</TableHead>
            <TableHead>الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.map((purchase) => (
            <TableRow key={purchase.id}>
              <TableCell className="font-medium">{purchase.reference}</TableCell>
              <TableCell>{purchase.supplierName}</TableCell>
              <TableCell>{format(new Date(purchase.date), 'yyyy/MM/dd')}</TableCell>
              <TableCell>
                {formatCurrency(purchase.totalAmount)}
              </TableCell>
              <TableCell>
                {formatCurrency(purchase.paidAmount)}
              </TableCell>
              <TableCell>
                <Badge className={getPaymentStatusClass(purchase.paymentStatus)}>
                  {getPaymentStatusLabel(purchase.paymentStatus)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2 gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onView(purchase)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onEdit(purchase)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onDelete(purchase.id)}
                  >
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

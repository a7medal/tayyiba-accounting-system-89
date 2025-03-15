
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Purchase, getPaymentStatusLabel } from '@/types/purchase';
import { formatCurrency } from '@/types/product';
import { format } from 'date-fns';

interface PurchaseDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchase: Purchase | null;
}

export function PurchaseDetails({ 
  open, 
  onOpenChange, 
  purchase 
}: PurchaseDetailsProps) {
  if (!purchase) return null;
  
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>تفاصيل المشتريات: {purchase.reference}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">معلومات الفاتورة</h3>
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">رقم المرجع:</span>
                  <span className="font-medium">{purchase.reference}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">التاريخ:</span>
                  <span className="font-medium">{format(new Date(purchase.date), 'yyyy/MM/dd')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">حالة الدفع:</span>
                  <Badge className={getPaymentStatusClass(purchase.paymentStatus)}>
                    {getPaymentStatusLabel(purchase.paymentStatus)}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">معلومات المورد</h3>
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">اسم المورد:</span>
                  <span className="font-medium">{purchase.supplierName}</span>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">العناصر المشتراة</h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المنتج</TableHead>
                    <TableHead className="text-left">الكمية</TableHead>
                    <TableHead className="text-left">سعر الوحدة</TableHead>
                    <TableHead className="text-left">الإجمالي</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchase.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell className="text-left">{item.quantity}</TableCell>
                      <TableCell className="text-left">{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell className="text-left">{formatCurrency(item.totalPrice)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 bg-muted/20 p-4 rounded-md">
            <div className="flex items-center justify-between text-sm">
              <span>إجمالي المبلغ:</span>
              <span className="font-bold">{formatCurrency(purchase.totalAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>المبلغ المدفوع:</span>
              <span className="font-bold">{formatCurrency(purchase.paidAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>المبلغ المتبقي:</span>
              <span className="font-bold text-destructive">
                {formatCurrency(purchase.totalAmount - purchase.paidAmount)}
              </span>
            </div>
          </div>
          
          {purchase.notes && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">ملاحظات</h3>
              <p className="text-sm bg-muted/20 p-3 rounded-md">{purchase.notes}</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button">إغلاق</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

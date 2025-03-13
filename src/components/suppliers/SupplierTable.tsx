
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
import { Edit, Trash2, Phone, Mail } from "lucide-react";
import { Supplier } from '@/types/supplier';
import { format } from 'date-fns';

interface SupplierTableProps {
  suppliers: Supplier[];
  onEdit: (supplier: Supplier) => void;
  onDelete: (id: string) => void;
}

export function SupplierTable({ suppliers, onEdit, onDelete }: SupplierTableProps) {
  if (suppliers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg text-muted-foreground mb-4">لا يوجد موردين متطابقين مع البحث</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border card-glass">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>اسم المورد</TableHead>
            <TableHead>جهة الاتصال</TableHead>
            <TableHead>معلومات الاتصال</TableHead>
            <TableHead>العنوان</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>تاريخ الإضافة</TableHead>
            <TableHead>الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map((supplier) => (
            <TableRow key={supplier.id}>
              <TableCell className="font-medium">{supplier.name}</TableCell>
              <TableCell>{supplier.contactName}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1 text-sm">
                    <Phone className="h-3 w-3" />
                    <span>{supplier.phone}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Mail className="h-3 w-3" />
                    <span>{supplier.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>{supplier.address}</TableCell>
              <TableCell>
                {supplier.isActive ? (
                  <Badge className="bg-green-500 hover:bg-green-600">نشط</Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">غير نشط</Badge>
                )}
              </TableCell>
              <TableCell>{format(new Date(supplier.createdAt), 'yyyy/MM/dd')}</TableCell>
              <TableCell>
                <div className="flex space-x-2 gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(supplier)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onDelete(supplier.id)}
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

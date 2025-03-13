
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
import { Edit, Trash2, UserCog } from "lucide-react";
import { User, rolePermissions } from '@/types/user';
import { format } from 'date-fns';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

export function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  const getRoleLabel = (role: string) => {
    return rolePermissions[role as keyof typeof rolePermissions]?.label || role;
  };

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg text-muted-foreground mb-4">لا يوجد مستخدمين متطابقين مع البحث</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border card-glass">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الاسم</TableHead>
            <TableHead>البريد الإلكتروني</TableHead>
            <TableHead>الدور</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>تاريخ الإنشاء</TableHead>
            <TableHead>آخر تسجيل دخول</TableHead>
            <TableHead>الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {getRoleLabel(user.role)}
                </Badge>
              </TableCell>
              <TableCell>
                {user.isActive ? (
                  <Badge className="bg-green-500 hover:bg-green-600">نشط</Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">غير نشط</Badge>
                )}
              </TableCell>
              <TableCell>{format(new Date(user.createdAt), 'yyyy/MM/dd')}</TableCell>
              <TableCell>
                {user.lastLogin 
                  ? format(new Date(user.lastLogin), 'yyyy/MM/dd HH:mm') 
                  : 'لم يسجل الدخول بعد'}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2 gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(user)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onDelete(user.id)}
                    disabled={user.role === 'admin'}
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

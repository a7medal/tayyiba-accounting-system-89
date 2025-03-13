
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X, Filter } from "lucide-react";
import { User, rolePermissions, Permission } from '@/types/user';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

interface UserPermissionsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

// تجميع الصلاحيات حسب النوع
const permissionGroups = {
  management: [
    'إدارة المستخدمين', 
    'إدارة المنتجات', 
    'إدارة الفواتير', 
    'إدارة العملاء', 
    'إدارة التقارير', 
    'إدارة الإعدادات',
    'إدارة الموردين',
    'إدارة المشتريات'
  ],
  view: [
    'عرض المنتجات',
    'عرض الفواتير',
    'عرض العملاء',
    'عرض التقارير',
    'عرض المعاملات',
    'عرض الموردين',
    'عرض المشتريات'
  ]
};

export function UserPermissions({ 
  open, 
  onOpenChange, 
  user 
}: UserPermissionsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  if (!user) return null;
  
  const userRolePermissions = rolePermissions[user.role as keyof typeof rolePermissions];
  
  // الحصول على جميع الصلاحيات المتاحة في النظام
  const allPermissions = Array.from(
    new Set(
      Object.values(rolePermissions).flatMap(role => role.permissions)
    )
  ).sort();
  
  // تصفية الصلاحيات حسب البحث
  const filteredPermissions = allPermissions.filter(permission => 
    permission.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // الحصول على الصلاحيات المناسبة حسب التبويب النشط
  let displayedPermissions: Permission[] = [];
  
  if (activeTab === 'all') {
    displayedPermissions = filteredPermissions;
  } else if (activeTab === 'management') {
    displayedPermissions = filteredPermissions.filter(p => permissionGroups.management.includes(p));
  } else if (activeTab === 'view') {
    displayedPermissions = filteredPermissions.filter(p => permissionGroups.view.includes(p));
  } else if (activeTab === 'granted') {
    displayedPermissions = filteredPermissions.filter(p => userRolePermissions?.permissions.includes(p));
  } else if (activeTab === 'denied') {
    displayedPermissions = filteredPermissions.filter(p => !userRolePermissions?.permissions.includes(p));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>صلاحيات المستخدم: {user.name}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="font-medium">الدور:</div>
            <div className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
              {userRolePermissions?.label || user.role}
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Filter className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="بحث عن صلاحية..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-4">
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="all">الكل</TabsTrigger>
              <TabsTrigger value="management">الإدارة</TabsTrigger>
              <TabsTrigger value="view">العرض</TabsTrigger>
              <TabsTrigger value="granted">مسموح</TabsTrigger>
              <TabsTrigger value="denied">غير مسموح</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="border rounded-md">
            <div className="grid grid-cols-2 text-sm border-b font-medium">
              <div className="p-3 border-l">الصلاحية</div>
              <div className="p-3">الحالة</div>
            </div>
            
            {displayedPermissions.length > 0 ? (
              displayedPermissions.map((permission) => {
                const hasPermission = userRolePermissions?.permissions.includes(permission);
                return (
                  <div key={permission} className="grid grid-cols-2 text-sm border-b last:border-0">
                    <div className="p-3 border-l">{permission}</div>
                    <div className="p-3">
                      {hasPermission ? (
                        <div className="flex items-center text-green-500">
                          <Check className="h-4 w-4 mr-1" />
                          <span>مسموح</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-destructive">
                          <X className="h-4 w-4 mr-1" />
                          <span>غير مسموح</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                لا توجد صلاحيات مطابقة للبحث
              </div>
            )}
          </div>
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

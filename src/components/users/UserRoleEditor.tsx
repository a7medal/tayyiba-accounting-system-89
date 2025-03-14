
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { User, rolePermissions, Permission } from '@/types/user';
import { useToast } from '@/hooks/use-toast';

interface UserRoleEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSave: (userId: string, permissions: Permission[]) => void;
}

export function UserRoleEditor({ 
  open, 
  onOpenChange, 
  user,
  onSave
}: UserRoleEditorProps) {
  const { toast } = useToast();
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);
  
  React.useEffect(() => {
    if (user && open) {
      // استخدام قائمة الصلاحيات من نوع المستخدم
      const userRolePermissions = rolePermissions[user.role as keyof typeof rolePermissions]?.permissions || [];
      setSelectedPermissions(userRolePermissions);
    }
  }, [user, open]);
  
  if (!user) return null;
  
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
  
  // الحصول على جميع الصلاحيات المتاحة في النظام
  const allPermissions = Array.from(
    new Set(
      Object.values(rolePermissions).flatMap(role => role.permissions)
    )
  ).sort();
  
  const handleTogglePermission = (permission: Permission) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permission)) {
        return prev.filter(p => p !== permission);
      } else {
        return [...prev, permission];
      }
    });
  };
  
  const handleSelectAllManagement = () => {
    setSelectedPermissions(prev => {
      const withoutManagement = prev.filter(p => !permissionGroups.management.includes(p));
      return [...withoutManagement, ...permissionGroups.management];
    });
  };
  
  const handleSelectAllView = () => {
    setSelectedPermissions(prev => {
      const withoutView = prev.filter(p => !permissionGroups.view.includes(p));
      return [...withoutView, ...permissionGroups.view];
    });
  };
  
  const handleSavePermissions = () => {
    if (user) {
      onSave(user.id, selectedPermissions);
      toast({
        title: "تم تحديث الصلاحيات",
        description: `تم تحديث صلاحيات ${user.name} بنجاح`,
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>تعديل صلاحيات المستخدم: {user.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSelectAllManagement}
              className="text-xs"
            >
              تحديد كل صلاحيات الإدارة
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSelectAllView}
              className="text-xs"
            >
              تحديد كل صلاحيات العرض
            </Button>
          </div>
          
          <div className="border rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {allPermissions.map((permission) => (
                <div key={permission} className="flex items-start space-x-2 space-x-reverse">
                  <Checkbox
                    id={`permission-${permission}`}
                    checked={selectedPermissions.includes(permission)}
                    onCheckedChange={() => handleTogglePermission(permission)}
                  />
                  <Label
                    htmlFor={`permission-${permission}`}
                    className="cursor-pointer text-sm flex-1"
                  >
                    {permission}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">إلغاء</Button>
          </DialogClose>
          <Button onClick={handleSavePermissions}>حفظ الصلاحيات</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

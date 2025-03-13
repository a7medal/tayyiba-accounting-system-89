
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
import { Check, X } from "lucide-react";
import { User, rolePermissions } from '@/types/user';

interface UserPermissionsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

export function UserPermissions({ 
  open, 
  onOpenChange, 
  user 
}: UserPermissionsProps) {
  if (!user) return null;
  
  const userRolePermissions = rolePermissions[user.role as keyof typeof rolePermissions];
  const allPermissions = Array.from(
    new Set(
      Object.values(rolePermissions).flatMap(role => role.permissions)
    )
  ).sort();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
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
          
          <div className="border rounded-md">
            <div className="grid grid-cols-2 text-sm border-b font-medium">
              <div className="p-3 border-l">الصلاحية</div>
              <div className="p-3">الحالة</div>
            </div>
            
            {allPermissions.map((permission) => {
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
            })}
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

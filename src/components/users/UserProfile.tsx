
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { rolePermissions } from '@/types/user';

export function UserProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  
  const userRole = user?.role ? rolePermissions[user.role]?.label || user.role : '';
  
  const handleSaveProfile = () => {
    toast({
      title: "تم حفظ الملف الشخصي",
      description: "تم تحديث بياناتك الشخصية بنجاح",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col items-center space-y-3">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/placeholder.svg" alt={user?.name} />
            <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <Button variant="outline" size="sm">تغيير الصورة</Button>
          </div>
        </div>
        
        <div className="flex-1 space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">الاسم الكامل</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="role">الدور</Label>
              <Input 
                id="role" 
                value={userRole}
                disabled
                className="opacity-70 cursor-not-allowed"
              />
            </div>
          </div>
          
          <Button onClick={handleSaveProfile}>حفظ التغييرات</Button>
        </div>
      </div>
    </div>
  );
}

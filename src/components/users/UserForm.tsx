
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { User, rolePermissions } from '@/types/user';

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: User | null;
  onSubmit: (data: Partial<User>) => void;
}

export function UserForm({ 
  open, 
  onOpenChange, 
  initialData, 
  onSubmit 
}: UserFormProps) {
  const isEditing = !!initialData;
  
  const form = useForm({
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      role: initialData?.role || 'viewer',
      isActive: initialData?.isActive ?? true,
    },
  });

  React.useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        email: initialData.email,
        role: initialData.role,
        isActive: initialData.isActive,
      });
    } else {
      form.reset({
        name: '',
        email: '',
        role: 'viewer',
        isActive: true,
      });
    }
  }, [initialData, form]);

  const handleSubmit = (values: any) => {
    const data = {
      ...values,
      id: initialData?.id,
    };

    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم المستخدم</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل اسم المستخدم" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input placeholder="example@domain.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الدور</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر دور المستخدم" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(rolePermissions).map(([value, { label }]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">حالة المستخدم</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {field.value ? 'المستخدم نشط ويمكنه تسجيل الدخول' : 'المستخدم غير نشط ولا يمكنه تسجيل الدخول'}
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">إلغاء</Button>
              </DialogClose>
              <Button type="submit">{isEditing ? 'تحديث المستخدم' : 'إضافة المستخدم'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


import React, { useState } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Wallet, 
  Plus, 
  CreditCard, 
  Building, 
  Edit, 
  Trash2 
} from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// نموذج للحساب
interface Account {
  id: string;
  name: string;
  type: 'bank' | 'cash' | 'credit';
  balance: number;
  currency: string;
  description?: string;
}

// أنواع الحسابات
const accountTypes = [
  { value: 'bank', label: 'حساب بنكي', icon: Building },
  { value: 'cash', label: 'صندوق نقدي', icon: Wallet },
  { value: 'credit', label: 'بطاقة ائتمانية', icon: CreditCard },
];

// بيانات تجريبية للحسابات
const initialAccounts: Account[] = [
  { id: '1', name: 'الصندوق الرئيسي', type: 'cash', balance: 50000, currency: 'أوقية' },
  { id: '2', name: 'بنك المصرف', type: 'bank', balance: 120000, currency: 'أوقية' },
  { id: '3', name: 'بطاقة شركة', type: 'credit', balance: 30000, currency: 'أوقية' },
];

// مخطط التحقق للنموذج
const accountFormSchema = z.object({
  name: z.string().min(2, { message: "يجب أن يحتوي اسم الحساب على حرفين على الأقل" }),
  type: z.enum(['bank', 'cash', 'credit'], { required_error: "يرجى اختيار نوع الحساب" }),
  balance: z.coerce.number({ required_error: "يرجى إدخال الرصيد الافتتاحي" }),
  currency: z.string().default('أوقية'),
  description: z.string().optional(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

const Accounts = () => {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [isCreating, setIsCreating] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  // نموذج إضافة/تعديل الحساب
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: '',
      type: 'bank',
      balance: 0,
      currency: 'أوقية',
      description: '',
    },
  });

  // تقديم النموذج
  const onSubmit = (values: AccountFormValues) => {
    if (editingAccount) {
      // تحديث حساب موجود
      setAccounts(prevAccounts => 
        prevAccounts.map(account => 
          account.id === editingAccount.id 
            ? { ...account, ...values } 
            : account
        )
      );
      toast.success('تم تحديث الحساب بنجاح');
    } else {
      // إضافة حساب جديد
      const newAccount: Account = {
        id: Date.now().toString(),
        ...values
      };
      setAccounts(prev => [...prev, newAccount]);
      toast.success('تم إضافة الحساب بنجاح');
    }
    
    // إعادة تعيين النموذج وإغلاق الحوار
    form.reset();
    setIsCreating(false);
    setEditingAccount(null);
  };

  // فتح نموذج تعديل الحساب
  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    form.reset({
      name: account.name,
      type: account.type,
      balance: account.balance,
      currency: account.currency,
      description: account.description || '',
    });
    setIsCreating(true);
  };

  // حذف حساب
  const handleDelete = (id: string) => {
    setAccounts(accounts.filter(account => account.id !== id));
    toast.success('تم حذف الحساب بنجاح');
  };

  // إغلاق نموذج الإنشاء/التعديل
  const handleDialogClose = () => {
    form.reset();
    setEditingAccount(null);
  };

  // حساب إجمالي الرصيد
  const getTotalBalance = () => {
    return accounts.reduce((sum, account) => sum + account.balance, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">إدارة الحسابات</h1>
        <Dialog open={isCreating} onOpenChange={(open) => {
          setIsCreating(open);
          if (!open) handleDialogClose();
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="mr-2 h-4 w-4" />
              إضافة حساب جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingAccount ? 'تعديل الحساب' : 'إضافة حساب جديد'}</DialogTitle>
              <DialogDescription>
                {editingAccount ? 'قم بتعديل تفاصيل الحساب أدناه' : 'قم بإدخال تفاصيل الحساب الجديد أدناه'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم الحساب</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل اسم الحساب" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نوع الحساب</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر نوع الحساب" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {accountTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center">
                                {React.createElement(type.icon, { className: "mr-2 h-4 w-4" })}
                                <span>{type.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="balance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الرصيد الافتتاحي</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field} 
                          />
                          <span className="mr-2">أوقية</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الوصف (اختياري)</FormLabel>
                      <FormControl>
                        <Input placeholder="وصف الحساب" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit">
                    {editingAccount ? 'تحديث الحساب' : 'إضافة الحساب'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الرصيد</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalBalance().toLocaleString()} أوقية</div>
            <p className="text-xs text-muted-foreground">
              مجموع أرصدة {accounts.length} حساب
            </p>
          </CardContent>
        </Card>
        
        {accountTypes.map(type => {
          const typeAccounts = accounts.filter(a => a.type === type.value);
          const typeTotal = typeAccounts.reduce((sum, account) => sum + account.balance, 0);
          
          return (
            <Card key={type.value}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{type.label}</CardTitle>
                {React.createElement(type.icon, { className: "h-4 w-4 text-muted-foreground" })}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{typeTotal.toLocaleString()} أوقية</div>
                <p className="text-xs text-muted-foreground">
                  {typeAccounts.length} حساب
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">جميع الحسابات</TabsTrigger>
          {accountTypes.map(type => (
            <TabsTrigger key={type.value} value={type.value}>
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>جميع الحسابات</CardTitle>
              <CardDescription>
                عرض جميع الحسابات المسجلة في النظام
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الاسم</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead className="text-left">الرصيد</TableHead>
                    <TableHead className="text-left">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map(account => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">{account.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {React.createElement(
                            accountTypes.find(t => t.value === account.type)?.icon || Wallet, 
                            { className: "mr-2 h-4 w-4" }
                          )}
                          <span>{accountTypes.find(t => t.value === account.type)?.label}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-left">
                        {account.balance.toLocaleString()} {account.currency}
                      </TableCell>
                      <TableCell className="text-left">
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEdit(account)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(account.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {accountTypes.map(type => (
          <TabsContent key={type.value} value={type.value}>
            <Card>
              <CardHeader>
                <CardTitle>{type.label}</CardTitle>
                <CardDescription>
                  عرض حسابات {type.label}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الاسم</TableHead>
                      <TableHead className="text-left">الرصيد</TableHead>
                      <TableHead className="text-left">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accounts
                      .filter(account => account.type === type.value)
                      .map(account => (
                        <TableRow key={account.id}>
                          <TableCell className="font-medium">{account.name}</TableCell>
                          <TableCell className="text-left">
                            {account.balance.toLocaleString()} {account.currency}
                          </TableCell>
                          <TableCell className="text-left">
                            <div className="flex space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleEdit(account)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDelete(account.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Accounts;


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
import { Textarea } from "@/components/ui/textarea";
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
  Trash2,
  ArrowDownToLine,
  ArrowUpToLine,
  ArrowLeftRight,
  ChevronsUpDown
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
import { DatePicker } from "@/components/ui/date-picker";
import { Badge } from "@/components/ui/badge";

// نموذج للحساب
interface Account {
  id: string;
  name: string;
  type: 'bank' | 'cash' | 'credit';
  balance: number;
  currency: string;
  description?: string;
}

// نموذج للمعاملة
interface AccountTransaction {
  id: string;
  accountId: string;
  type: 'withdrawal' | 'deposit' | 'transfer';
  amount: number;
  date: string;
  notes?: string;
  status: 'completed' | 'pending' | 'failed';
  targetAccountId?: string; // في حالة التحويل
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

// بيانات تجريبية للمعاملات
const initialTransactions: AccountTransaction[] = [
  { 
    id: '1', 
    accountId: '1', 
    type: 'deposit', 
    amount: 10000, 
    date: '2025-03-15', 
    notes: 'إيداع مدفوعات العملاء', 
    status: 'completed' 
  },
  { 
    id: '2', 
    accountId: '1', 
    type: 'withdrawal', 
    amount: 5000, 
    date: '2025-03-14', 
    notes: 'سحب مصاريف تشغيلية', 
    status: 'completed' 
  },
  { 
    id: '3', 
    accountId: '1', 
    type: 'transfer', 
    amount: 20000, 
    date: '2025-03-13', 
    notes: 'تحويل إلى الحساب البنكي', 
    status: 'completed',
    targetAccountId: '2'
  },
];

// مخطط التحقق للنموذج
const accountFormSchema = z.object({
  name: z.string().min(2, { message: "يجب أن يحتوي اسم الحساب على حرفين على الأقل" }),
  type: z.enum(['bank', 'cash', 'credit'], { required_error: "يرجى اختيار نوع الحساب" }),
  balance: z.coerce.number({ required_error: "يرجى إدخال الرصيد الافتتاحي" }),
  currency: z.string().default('أوقية'),
  description: z.string().optional(),
});

// مخطط التحقق لنموذج المعاملة
const transactionFormSchema = z.object({
  accountId: z.string({ required_error: "يرجى اختيار الحساب" }),
  type: z.enum(['withdrawal', 'deposit', 'transfer'], { required_error: "يرجى اختيار نوع المعاملة" }),
  amount: z.coerce.number().min(1, { message: "يجب أن يكون المبلغ أكبر من صفر" }),
  date: z.date({ required_error: "يرجى اختيار التاريخ" }),
  notes: z.string().optional(),
  targetAccountId: z.string().optional(),
  status: z.enum(['completed', 'pending', 'failed']).default('completed'),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;
type TransactionFormValues = z.infer<typeof transactionFormSchema>;

const Accounts = () => {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [transactions, setTransactions] = useState<AccountTransaction[]>(initialTransactions);
  const [isCreating, setIsCreating] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

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

  // نموذج إضافة معاملة
  const transactionForm = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      type: 'deposit',
      amount: 0,
      date: new Date(),
      status: 'completed',
    },
  });

  // تقديم نموذج الحساب
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
      // إضافة حساب جديد - نتأكد أن جميع الحقول المطلوبة موجودة
      const newAccount: Account = {
        id: Date.now().toString(),
        name: values.name,
        type: values.type,
        balance: values.balance,
        currency: values.currency || 'أوقية',
        description: values.description
      };
      setAccounts(prev => [...prev, newAccount]);
      toast.success('تم إضافة الحساب بنجاح');
    }
    
    // إعادة تعيين النموذج وإغلاق الحوار
    form.reset();
    setIsCreating(false);
    setEditingAccount(null);
  };

  // تقديم نموذج المعاملة
  const onTransactionSubmit = (values: TransactionFormValues) => {
    const newTransaction: AccountTransaction = {
      id: Date.now().toString(),
      accountId: values.accountId,
      type: values.type,
      amount: values.amount,
      date: values.date.toISOString().split('T')[0],
      notes: values.notes,
      status: values.status,
      targetAccountId: values.type === 'transfer' ? values.targetAccountId : undefined
    };

    // إضافة المعاملة الجديدة
    setTransactions(prev => [...prev, newTransaction]);

    // تحديث أرصدة الحسابات
    updateAccountBalances(newTransaction);

    // إغلاق النموذج وإعادة تعيينه
    toast.success('تمت إضافة المعاملة بنجاح');
    transactionForm.reset();
    setIsTransactionDialogOpen(false);
  };

  // تحديث أرصدة الحسابات بناءً على المعاملة
  const updateAccountBalances = (transaction: AccountTransaction) => {
    setAccounts(prevAccounts => {
      return prevAccounts.map(account => {
        // الحساب المصدر
        if (account.id === transaction.accountId) {
          let newBalance = account.balance;
          
          if (transaction.type === 'deposit') {
            newBalance += transaction.amount;
          } else if (transaction.type === 'withdrawal') {
            newBalance -= transaction.amount;
          } else if (transaction.type === 'transfer') {
            newBalance -= transaction.amount;
          }
          
          return { ...account, balance: newBalance };
        }
        
        // الحساب الهدف في حالة التحويل
        if (transaction.type === 'transfer' && account.id === transaction.targetAccountId) {
          return { ...account, balance: account.balance + transaction.amount };
        }
        
        return account;
      });
    });
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

  // تهيئة نموذج المعاملة
  const handleAddTransaction = (accountId: string) => {
    transactionForm.reset({
      accountId,
      type: 'deposit',
      amount: 0,
      date: new Date(),
      status: 'completed'
    });
    setSelectedAccountId(accountId);
    setIsTransactionDialogOpen(true);
  };

  // الحصول على معاملات حساب معين
  const getAccountTransactions = (accountId: string) => {
    return transactions.filter(t => t.accountId === accountId || t.targetAccountId === accountId);
  };

  // الحصول على اسم الحساب من معرفه
  const getAccountName = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    return account ? account.name : 'حساب غير معروف';
  };

  // الحصول على لون حالة المعاملة
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  // الحصول على لون نوع المعاملة
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownToLine className="h-4 w-4 text-green-600" />;
      case 'withdrawal':
        return <ArrowUpToLine className="h-4 w-4 text-red-600" />;
      case 'transfer':
        return <ArrowLeftRight className="h-4 w-4 text-blue-600" />;
      default:
        return <ChevronsUpDown className="h-4 w-4" />;
    }
  };

  // التعامل مع تغيير نوع المعاملة
  const handleTransactionTypeChange = (type: string) => {
    if (type === 'transfer') {
      transactionForm.setValue('targetAccountId', '');
    } else {
      transactionForm.unregister('targetAccountId');
    }
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
                            onClick={() => handleAddTransaction(account.id)}
                            title="إضافة معاملة"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
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
                                onClick={() => handleAddTransaction(account.id)}
                                title="إضافة معاملة"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
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

      {accounts.map(account => (
        <Card key={account.id} className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              {React.createElement(
                accountTypes.find(t => t.value === account.type)?.icon || Wallet, 
                { className: "mr-2 h-5 w-5" }
              )}
              <span>{account.name}</span>
              <span className="text-sm text-muted-foreground mr-2">
                ({account.balance.toLocaleString()} أوقية)
              </span>
            </CardTitle>
            <div className="flex justify-between items-center">
              <CardDescription>
                سجل المعاملات
              </CardDescription>
              <Button 
                size="sm" 
                onClick={() => handleAddTransaction(account.id)}
              >
                <Plus className="h-4 w-4 ml-2" />
                معاملة جديدة
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>ملاحظات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getAccountTransactions(account.id).length > 0 ? (
                  getAccountTransactions(account.id).map(transaction => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getTransactionIcon(transaction.type)}
                          <span className="mr-2">
                            {transaction.type === 'deposit' && 'إيداع'}
                            {transaction.type === 'withdrawal' && 'سحب'}
                            {transaction.type === 'transfer' && (
                              transaction.accountId === account.id 
                                ? `تحويل إلى ${getAccountName(transaction.targetAccountId || '')}`
                                : `تحويل من ${getAccountName(transaction.accountId)}`
                            )}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className={
                        transaction.type === 'deposit' || (transaction.type === 'transfer' && transaction.targetAccountId === account.id)
                          ? 'text-green-600'
                          : 'text-red-600'
                      }>
                        {(transaction.type === 'deposit' || (transaction.type === 'transfer' && transaction.targetAccountId === account.id)) 
                          ? `+ ${transaction.amount.toLocaleString()}`
                          : `- ${transaction.amount.toLocaleString()}`} أوقية
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(transaction.status)}`}>
                          {transaction.status === 'completed' && 'مكتملة'}
                          {transaction.status === 'pending' && 'قيد الانتظار'}
                          {transaction.status === 'failed' && 'فاشلة'}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.notes || '-'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      لا توجد معاملات لهذا الحساب
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}

      {/* مربع حوار إضافة معاملة جديدة */}
      <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>إضافة معاملة جديدة</DialogTitle>
            <DialogDescription>
              قم بإدخال تفاصيل المعاملة أدناه
            </DialogDescription>
          </DialogHeader>
          <Form {...transactionForm}>
            <form onSubmit={transactionForm.handleSubmit(onTransactionSubmit)} className="space-y-4">
              <FormField
                control={transactionForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع المعاملة</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleTransactionTypeChange(value);
                      }} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع المعاملة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="deposit">
                          <div className="flex items-center">
                            <ArrowDownToLine className="ml-2 h-4 w-4 text-green-600" />
                            <span>إيداع</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="withdrawal">
                          <div className="flex items-center">
                            <ArrowUpToLine className="ml-2 h-4 w-4 text-red-600" />
                            <span>سحب</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="transfer">
                          <div className="flex items-center">
                            <ArrowLeftRight className="ml-2 h-4 w-4 text-blue-600" />
                            <span>تحويل</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={transactionForm.control}
                name="accountId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الحساب</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={selectedAccountId || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الحساب" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {transactionForm.watch('type') === 'transfer' && (
                <FormField
                  control={transactionForm.control}
                  name="targetAccountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الحساب المستلم</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الحساب المستلم" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {accounts
                            .filter(account => account.id !== transactionForm.watch('accountId'))
                            .map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={transactionForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المبلغ</FormLabel>
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
                control={transactionForm.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>التاريخ</FormLabel>
                    <DatePicker 
                      date={field.value} 
                      setDate={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={transactionForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ملاحظات (اختياري)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="أدخل ملاحظات حول المعاملة" 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={transactionForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الحالة</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر حالة المعاملة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="completed">مكتملة</SelectItem>
                        <SelectItem value="pending">قيد الانتظار</SelectItem>
                        <SelectItem value="failed">فاشلة</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit">
                  إضافة المعاملة
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Accounts;

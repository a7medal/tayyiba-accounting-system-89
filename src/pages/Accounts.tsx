import React, { useState, useEffect, useCallback } from 'react';
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
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  ChevronsUpDown,
  Loader2,
  Search,
  AlertTriangle
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
import AccountDBService, { Account, AccountTransaction } from '@/services/AccountDBService';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// أنواع الحسابات
const accountIconMap: Record<Account['type'], React.ElementType> = {
  bank: Building,
  cash: Wallet,
  credit: CreditCard,
};

const accountTypes: { value: Account['type']; label: string; icon: React.ElementType }[] = [
  { value: 'bank', label: 'حساب بنكي', icon: accountIconMap.bank },
  { value: 'cash', label: 'صندوق نقدي', icon: accountIconMap.cash },
  { value: 'credit', label: 'بطاقة ائتمانية', icon: accountIconMap.credit },
];
const accountTypeValues = accountTypes.map(at => at.value) as [Account['type'], ...Account['type'][]];


// مخطط التحقق لنموذج الحساب
const accountFormSchema = z.object({
  name: z.string().min(2, { message: "يجب أن يحتوي اسم الحساب على حرفين على الأقل." }),
  type: z.enum(accountTypeValues, { required_error: "يرجى اختيار نوع الحساب." }),
  accountNumber: z.string().optional().refine(val => !val || val.length > 3, {message: "رقم الحساب يجب أن يكون أكثر من 3 أرقام إذا تم إدخاله"}),
  balance: z.coerce.number({ invalid_type_error: "الرصيد يجب أن يكون رقمًا.", required_error: "يرجى إدخال الرصيد الافتتاحي." }),
  currency: z.string().min(2, { message: "يرجى إدخال العملة." }).default('MRU'),
  description: z.string().optional(),
  bankName: z.string().optional(),
  branchName: z.string().optional(),
  isActive: z.boolean().default(true),
});

// مخطط التحقق لنموذج المعاملة
const transactionTypeValues = ['withdrawal', 'deposit', 'transfer', 'fee', 'interest'] as const;
const transactionStatusValues = ['completed', 'pending', 'failed', 'cancelled'] as const;

const transactionFormSchema = z.object({
  accountId: z.string({ required_error: "يرجى اختيار الحساب." }),
  type: z.enum(transactionTypeValues, { required_error: "يرجى اختيار نوع المعاملة." }),
  amount: z.coerce.number().positive({ message: "يجب أن يكون المبلغ أكبر من صفر." }),
  date: z.date({ required_error: "يرجى اختيار التاريخ." }),
  description: z.string().optional(),
  targetAccountId: z.string().optional(),
  status: z.enum(transactionStatusValues).default('completed'),
  category: z.string().optional(),
  referenceNumber: z.string().optional(),
}).refine(data => data.type !== 'transfer' || (data.type === 'transfer' && !!data.targetAccountId && data.targetAccountId.length > 0), {
  message: "الحساب المستلم مطلوب لمعاملات التحويل.",
  path: ["targetAccountId"],
}).refine(data => data.type !== 'transfer' || data.accountId !== data.targetAccountId, {
  message: "لا يمكن التحويل إلى نفس الحساب.",
  path: ["targetAccountId"],
});

type AccountFormValues = z.infer<typeof accountFormSchema>;
type TransactionFormValues = z.infer<typeof transactionFormSchema>;

const AccountsPage = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<AccountTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccountFormOpen, setIsAccountFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  const [selectedAccountIdForTx, setSelectedAccountIdForTx] = useState<string | null>(null);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');

  const accountForm = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: '', type: 'bank', balance: 0, currency: 'MRU', isActive: true,
      accountNumber: '', bankName: '', branchName: '', description: ''
    },
  });

  const transactionForm = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      type: 'deposit', amount: 0, date: new Date(), status: 'completed',
      description: '', category: '', referenceNumber: ''
    },
  });

  const fetchAllData = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const [fetchedAccounts, fetchedTransactions] = await Promise.all([
        AccountDBService.getAllAccounts(),
        AccountDBService.getAllTransactions()
      ]);
      setAccounts(fetchedAccounts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setTransactions(fetchedTransactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime() || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("فشل تحميل البيانات من قاعدة البيانات.");
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleAccountSubmit = async (values: AccountFormValues) => {
    try {
      if (editingAccount) {
        const accountToUpdate: Account = {
          ...editingAccount, ...values, updatedAt: new Date().toISOString(),
        };
        await AccountDBService.updateAccount(accountToUpdate);
        toast.success(`تم تحديث حساب "${values.name}" بنجاح.`);
      } else {
        const newAccountData: Omit<Account, 'id' | 'createdAt' | 'updatedAt'> = values;
        const newAccount: Account = {
          id: crypto.randomUUID(),
          ...newAccountData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await AccountDBService.addAccount(newAccount);
        toast.success(`تم إضافة حساب "${values.name}" بنجاح.`);
      }
      await fetchAllData(false); //  تحديث البيانات بدون إظهار مؤشر التحميل العام
      setIsAccountFormOpen(false);
      setEditingAccount(null);
      accountForm.reset({ name: '', type: 'bank', balance: 0, currency: 'MRU', isActive: true, accountNumber: '', bankName: '', branchName: '', description: '' });
    } catch (error: any) {
      console.error("Failed to save account:", error);
      if (error?.name === 'ConstraintError' && error?.message?.toLowerCase().includes('accountnumber_idx')) {
        accountForm.setError("accountNumber", { type: "manual", message: "رقم الحساب هذا موجود بالفعل." });
        toast.error("رقم الحساب هذا موجود بالفعل. يرجى إدخال رقم آخر.");
      } else {
        toast.error(`فشل حفظ الحساب: ${error.message}`);
      }
    }
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    accountForm.reset(account);
    setIsAccountFormOpen(true);
  };

  const confirmDeleteAccount = async () => {
    if (accountToDelete) {
      try {
        await AccountDBService.deleteAccount(accountToDelete.id);
        toast.success(`تم حذف حساب "${accountToDelete.name}" وجميع معاملاته بنجاح.`);
        await fetchAllData(false);
      } catch (error) {
        console.error("Failed to delete account:", error);
        toast.error("فشل حذف الحساب.");
      } finally {
        setAccountToDelete(null);
      }
    }
  };

  const handleTransactionSubmit = async (values: TransactionFormValues) => {
    try {
      const newTransactionData: Omit<AccountTransaction, 'id' | 'createdAt' | 'updatedAt'> = {
        ...values,
        date: values.date.toISOString().split('T')[0], // حفظ التاريخ كـ YYYY-MM-DD
        targetAccountId: values.type === 'transfer' ? values.targetAccountId : undefined,
      };
      const newTransaction: AccountTransaction = {
        id: crypto.randomUUID(),
        ...newTransactionData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await AccountDBService.addTransaction(newTransaction);
      
      const sourceAccount = await AccountDBService.getAccountById(newTransaction.accountId);
      if (!sourceAccount) throw new Error("لم يتم العثور على الحساب المصدر لتحديث الرصيد.");

      let newSourceBalance = sourceAccount.balance;
      if (newTransaction.type === 'deposit' || newTransaction.type === 'interest') newSourceBalance += newTransaction.amount;
      else if (newTransaction.type === 'withdrawal' || newTransaction.type === 'fee' || newTransaction.type === 'transfer') newSourceBalance -= newTransaction.amount;
      
      await AccountDBService.updateAccount({ ...sourceAccount, balance: newSourceBalance, updatedAt: new Date().toISOString() });

      if (newTransaction.type === 'transfer' && newTransaction.targetAccountId) {
        const targetAccount = await AccountDBService.getAccountById(newTransaction.targetAccountId);
        if (!targetAccount) throw new Error("لم يتم العثور على الحساب الهدف لتحديث الرصيد.");
        const newTargetBalance = targetAccount.balance + newTransaction.amount;
        await AccountDBService.updateAccount({ ...targetAccount, balance: newTargetBalance, updatedAt: new Date().toISOString() });
      }
      
      toast.success('تمت إضافة المعاملة وتحديث الأرصدة بنجاح.');
      await fetchAllData(false);
      setIsTransactionFormOpen(false);
      transactionForm.reset({ type: 'deposit', amount: 0, date: new Date(), status: 'completed', description: '', category: '', referenceNumber: '' });
    } catch (error: any) {
      console.error("Failed to add transaction or update balance:", error);
      toast.error(`فشل إضافة المعاملة: ${error.message}`);
    }
  };
  
  const openTransactionDialog = (accountId: string) => {
    setSelectedAccountIdForTx(accountId);
    const account = accounts.find(a => a.id === accountId);
    transactionForm.reset({
      accountId: accountId,
      type: 'deposit',
      amount: 0,
      date: new Date(),
      status: 'completed',
      description: '',
      category: '',
      referenceNumber: '',
    });
    setIsTransactionFormOpen(true);
  };

  const getAccountNameById = useCallback((id: string): string => {
    return accounts.find(acc => acc.id === id)?.name || 'حساب غير معروف';
  }, [accounts]);

  const getFilteredTransactionsForAccount = useCallback((accountId: string): AccountTransaction[] => {
    return transactions
      .filter(tx => tx.accountId === accountId || (tx.type === 'transfer' && tx.targetAccountId === accountId))
      .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime() || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [transactions]);
  
  const getTotalBalance = () => accounts.reduce((sum, acc) => sum + (acc.isActive ? acc.balance : 0), 0);

  const filteredAccounts = accounts.filter(account => {
    const normalizedQuery = searchQuery.toLowerCase().trim();
    const matchesSearch = normalizedQuery === '' || 
                          account.name.toLowerCase().includes(normalizedQuery) ||
                          (account.accountNumber && account.accountNumber.toLowerCase().includes(normalizedQuery));
    const matchesTab = activeTab === 'all' || account.type === activeTab;
    return matchesSearch && matchesTab;
  });
  
  const getTransactionTypeDisplay = (tx: AccountTransaction, currentAccountId: string) => {
    if (tx.type === 'deposit') return 'إيداع';
    if (tx.type === 'withdrawal') return 'سحب';
    if (tx.type === 'fee') return 'رسوم';
    if (tx.type === 'interest') return 'فائدة';
    if (tx.type === 'transfer') {
      return tx.accountId === currentAccountId
        ? `تحويل إلى ${getAccountNameById(tx.targetAccountId || '')}`
        : `تحويل من ${getAccountNameById(tx.accountId)}`;
    }
    return tx.type;
  };

  const getTransactionAmountDisplay = (tx: AccountTransaction, currentAccountId: string) => {
    const accountCurrency = accounts.find(a => a.id === tx.accountId)?.currency || 'MRU';
    const isCredit = tx.type === 'deposit' || tx.type === 'interest' || (tx.type === 'transfer' && tx.targetAccountId === currentAccountId);
    const amountPrefix = isCredit ? '+' : '-';
    const amountColor = isCredit ? 'text-green-600' : 'text-red-600';
    return (
      <span className={amountColor}>
        {amountPrefix} {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {accountCurrency}
      </span>
    );
  };
  
  const getStatusBadge = (status: AccountTransaction['status']) => {
    const colorMap: Record<AccountTransaction['status'], string> = {
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    const textMap: Record<AccountTransaction['status'], string> = {
      completed: 'مكتملة', pending: 'معلقة', failed: 'فاشلة', cancelled: 'ملغاة',
    };
    return <Badge className={colorMap[status] || colorMap.pending}>{textMap[status] || status}</Badge>;
  };

  const getTransactionTypeIcon = (type: AccountTransaction['type']) => {
    const iconMap: Record<AccountTransaction['type'], React.ElementType> = {
      deposit: ArrowDownToLine, withdrawal: ArrowUpToLine, transfer: ArrowLeftRight,
      fee: Wallet, interest: DollarSign, // أمثلة، يمكن تغييرها
    };
    const colorMap: Record<AccountTransaction['type'], string> = {
      deposit: "text-green-600", withdrawal: "text-red-600", transfer: "text-blue-600",
      fee: "text-orange-600", interest: "text-purple-600"
    }
    const IconComponent = iconMap[type] || ChevronsUpDown;
    return <IconComponent className={`h-4 w-4 ${colorMap[type] || ''}`} />;
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-150px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">جاري تحميل بيانات الحسابات...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">إدارة الحسابات</h1>
        <Dialog open={isAccountFormOpen} onOpenChange={(open) => {
          setIsAccountFormOpen(open);
          if (!open) { accountForm.reset({ name: '', type: 'bank', balance: 0, currency: 'MRU', isActive: true, accountNumber: '', bankName: '', branchName: '', description: '' }); setEditingAccount(null); }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingAccount(null); accountForm.reset({ name: '', type: 'bank', balance: 0, currency: 'MRU', isActive: true, accountNumber: '', bankName: '', branchName: '', description: '' }); setIsAccountFormOpen(true); }}>
              <Plus className="ml-2 h-4 w-4" /> إضافة حساب جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>{editingAccount ? 'تعديل الحساب' : 'إضافة حساب جديد'}</DialogTitle>
              <DialogDescription>{editingAccount ? `تعديل تفاصيل حساب "${editingAccount.name}"` : 'أدخل تفاصيل الحساب الجديد أدناه.'}</DialogDescription>
            </DialogHeader>
            <Form {...accountForm}>
              <form onSubmit={accountForm.handleSubmit(handleAccountSubmit)} className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={accountForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>اسم الحساب</FormLabel><FormControl><Input placeholder="مثال: الصندوق الرئيسي" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={accountForm.control} name="type" render={({ field }) => (<FormItem><FormLabel>نوع الحساب</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر نوع الحساب" /></SelectTrigger></FormControl><SelectContent>{accountTypes.map((type) => (<SelectItem key={type.value} value={type.value}><div className="flex items-center">{React.createElement(type.icon, { className: "ml-2 h-4 w-4" })}<span>{type.label}</span></div></SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                </div>
                {accountForm.watch('type') === 'bank' && (<>
                  <FormField control={accountForm.control} name="accountNumber" render={({ field }) => (<FormItem><FormLabel>رقم الحساب</FormLabel><FormControl><Input placeholder="أدخل رقم الحساب" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={accountForm.control} name="bankName" render={({ field }) => (<FormItem><FormLabel>اسم البنك</FormLabel><FormControl><Input placeholder="اسم البنك" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={accountForm.control} name="branchName" render={({ field }) => (<FormItem><FormLabel>اسم الفرع</FormLabel><FormControl><Input placeholder="اسم الفرع" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div></>)}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={accountForm.control} name="balance" render={({ field }) => (<FormItem><FormLabel>الرصيد الافتتاحي</FormLabel><FormControl><div className="relative"><Input type="number" placeholder="0.00" {...field} className="pr-12" step="any" /><span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{accountForm.getValues('currency')}</span></div></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={accountForm.control} name="currency" render={({ field }) => (<FormItem><FormLabel>العملة</FormLabel><FormControl><Input placeholder="MRU" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                <FormField control={accountForm.control} name="description" render={({ field }) => (<FormItem><FormLabel>الوصف (اختياري)</FormLabel><FormControl><Textarea placeholder="أدخل وصفًا للحساب..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={accountForm.control} name="isActive" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>الحساب نشط</FormLabel><DialogDescription className="text-xs">الحسابات غير النشطة لا تظهر في بعض القوائم ولا يمكن إجراء معاملات عليها.</DialogDescription></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                <DialogFooter className="pt-4">
                  <DialogClose asChild><Button type="button" variant="outline">إلغاء</Button></DialogClose>
                  <Button type="submit" disabled={accountForm.formState.isSubmitting}>{accountForm.formState.isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}{editingAccount ? 'تحديث الحساب' : 'إضافة الحساب'}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">إجمالي الأرصدة (النشطة)</CardTitle><Wallet className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{getTotalBalance().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {accounts[0]?.currency || 'MRU'}</div><p className="text-xs text-muted-foreground">مجموع أرصدة {accounts.filter(a=>a.isActive).length} حساب نشط</p></CardContent></Card>
        {accountTypes.map(typeInfo => {
          const typeAccounts = accounts.filter(a => a.type === typeInfo.value && a.isActive);
          const typeTotal = typeAccounts.reduce((sum, account) => sum + account.balance, 0);
          return (<Card key={typeInfo.value}><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{typeInfo.label}</CardTitle>{React.createElement(typeInfo.icon, { className: "h-4 w-4 text-muted-foreground" })}</CardHeader><CardContent><div className="text-2xl font-bold">{typeTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {accounts[0]?.currency || 'MRU'}</div><p className="text-xs text-muted-foreground">{typeAccounts.length} حساب نشط</p></CardContent></Card>);
        })}
      </div>
      
      <div className="flex items-center mb-4"><div className="relative w-full max-w-sm"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="ابحث باسم الحساب أو رقمه..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" /></div></div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 grid w-full grid-cols-2 sm:grid-cols-4"><TabsTrigger value="all">جميع الحسابات</TabsTrigger>{accountTypes.map(type => (<TabsTrigger key={type.value} value={type.value}>{type.label}</TabsTrigger>))}</TabsList>
        <TabsContent value={activeTab} className="mt-0">
           <Card><CardHeader><CardTitle>{activeTab === 'all' ? 'جميع الحسابات' : accountTypes.find(t => t.value === activeTab)?.label}</CardTitle><CardDescription>عرض الحسابات {activeTab === 'all' ? 'المسجلة' : `من نوع ${accountTypes.find(t => t.value === activeTab)?.label}`}{searchQuery && ` (مطابقة للبحث "${searchQuery}")`}</CardDescription></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>الاسم</TableHead><TableHead className="hidden md:table-cell">النوع</TableHead><TableHead className="hidden sm:table-cell">الرقم</TableHead><TableHead className="text-left">الرصيد</TableHead><TableHead className="hidden md:table-cell text-center">الحالة</TableHead><TableHead className="text-left">الإجراءات</TableHead></TableRow></TableHeader><TableBody>
                  {filteredAccounts.length > 0 ? filteredAccounts.map(account => (<TableRow key={account.id} className={!account.isActive ? "opacity-60 hover:opacity-100" : ""}><TableCell className="font-medium"><div className="flex items-center">{React.createElement(accountIconMap[account.type] || Wallet, { className: "ml-2 h-4 w-4 text-muted-foreground" })}{account.name}</div>{!account.isActive && <Badge variant="outline" className="text-xs mt-1">غير نشط</Badge>}</TableCell><TableCell className="hidden md:table-cell">{accountTypes.find(t => t.value === account.type)?.label}</TableCell><TableCell className="hidden sm:table-cell">{account.accountNumber || '-'}</TableCell><TableCell className="text-left">{account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {account.currency}</TableCell><TableCell className="hidden md:table-cell text-center"><Badge variant={account.isActive ? "default" : "outline"} className={account.isActive ? "bg-green-500 hover:bg-green-600" : ""}>{account.isActive ? "نشط" : "غير نشط"}</Badge></TableCell><TableCell className="text-left"><div className="flex items-center space-x-0 md:space-x-1"><Button variant="ghost" size="icon" onClick={() => openTransactionDialog(account.id)} title="إضافة معاملة" disabled={!account.isActive}><Plus className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => handleEditAccount(account)} title="تعديل الحساب"><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => setAccountToDelete(account)} title="حذف الحساب"><Trash2 className="h-4 w-4 text-destructive" /></Button></div></TableCell></TableRow>)) : (
                    <TableRow><TableCell colSpan={6} className="h-24 text-center text-muted-foreground">{(searchQuery || activeTab !== 'all') ? 'لا توجد حسابات تطابق المعايير الحالية.' : 'لا توجد حسابات حتى الآن. قم بإضافة حساب جديد للبدء.'}</TableCell></TableRow>)}
            </TableBody></Table></CardContent></Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 space-y-6"><h2 className="text-2xl font-bold">سجلات المعاملات</h2>
        {accounts.filter(acc => acc.isActive).length > 0 ? (accounts.filter(acc => acc.isActive).map(account => (
          <Card key={`tx-card-${account.id}`}><CardHeader><CardTitle className="flex items-center">{React.createElement(accountIconMap[account.type] || Wallet, { className: "ml-2 h-5 w-5" })}<span>{account.name}</span><span className="text-sm text-muted-foreground mr-2 whitespace-nowrap">(الرصيد: {account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {account.currency})</span></CardTitle><div className="flex justify-between items-center"><CardDescription>آخر المعاملات لهذا الحساب.</CardDescription><Button size="sm" onClick={() => openTransactionDialog(account.id)}><Plus className="h-4 w-4 ml-2" /> معاملة جديدة</Button></div></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead className="w-[100px]">التاريخ</TableHead><TableHead>النوع/الوصف</TableHead><TableHead className="hidden sm:table-cell">الفئة</TableHead><TableHead className="text-right">المبلغ</TableHead><TableHead className="hidden sm:table-cell text-center">الحالة</TableHead></TableRow></TableHeader><TableBody>
                  {getFilteredTransactionsForAccount(account.id).length > 0 ? (getFilteredTransactionsForAccount(account.id).slice(0, 5).map(transaction => (<TableRow key={transaction.id}><TableCell>{new Date(transaction.date).toLocaleDateString('ar-EG')}</TableCell><TableCell><div className="font-medium flex items-center">{getTransactionTypeIcon(transaction.type)} <span className="mr-1">{getTransactionTypeDisplay(transaction, account.id)}</span></div>{transaction.description && <div className="text-xs text-muted-foreground max-w-[200px] truncate">{transaction.description}</div>}{transaction.referenceNumber && <div className="text-xs text-muted-foreground">مرجع: {transaction.referenceNumber}</div>}</TableCell><TableCell className="hidden sm:table-cell">{transaction.category || '-'}</TableCell><TableCell className="text-right font-mono">{getTransactionAmountDisplay(transaction, account.id)}</TableCell><TableCell className="hidden sm:table-cell text-center">{getStatusBadge(transaction.status)}</TableCell></TableRow>))) : (
                    <TableRow><TableCell colSpan={5} className="text-center py-4 text-muted-foreground">لا توجد معاملات لهذا الحساب.</TableCell></TableRow>)}
            </TableBody></Table>{getFilteredTransactionsForAccount(account.id).length > 5 && (<div className="text-center mt-4"><Button variant="link" size="sm">عرض كل المعاملات لـ {account.name}</Button></div>)}</CardContent></Card>))) : 
            (<div className="text-center py-8"><AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground/50" /><p className="mt-4 text-muted-foreground">لا توجد حسابات نشطة لعرض معاملاتها. قم بإضافة وتفعيل حساب أولاً.</p></div>)}
      </div>
      
      <Dialog open={isTransactionFormOpen} onOpenChange={(open) => { setIsTransactionFormOpen(open); if (!open) transactionForm.reset({ type: 'deposit', amount: 0, date: new Date(), status: 'completed', description: '', category: '', referenceNumber: '' }); }}>
        <DialogContent className="sm:max-w-lg"><DialogHeader><DialogTitle>إضافة معاملة جديدة</DialogTitle><DialogDescription>{selectedAccountIdForTx ? `إضافة معاملة لحساب "${getAccountNameById(selectedAccountIdForTx)}"` : 'أدخل تفاصيل المعاملة أدناه.'}</DialogDescription></DialogHeader>
          <Form {...transactionForm}>
            <form onSubmit={transactionForm.handleSubmit(handleTransactionSubmit)} className="space-y-4 mt-4">
              <FormField control={transactionForm.control} name="accountId" render={({ field }) => (<FormItem><FormLabel>من/إلى حساب</FormLabel><Select onValueChange={field.onChange} value={field.value || selectedAccountIdForTx || ""}><FormControl><SelectTrigger><SelectValue placeholder="اختر الحساب" /></SelectTrigger></FormControl><SelectContent>{accounts.filter(a => a.isActive).map((account) => (<SelectItem key={account.id} value={account.id}>{account.name} ({account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {account.currency})</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
              <FormField control={transactionForm.control} name="type" render={({ field }) => (<FormItem><FormLabel>نوع المعاملة</FormLabel><Select onValueChange={(value) => { field.onChange(value as TransactionFormValues['type']); if (value !== 'transfer') transactionForm.setValue('targetAccountId', undefined); }} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر نوع المعاملة" /></SelectTrigger></FormControl><SelectContent>{transactionTypeValues.map(typeVal => (<SelectItem key={typeVal} value={typeVal}><div className="flex items-center">{getTransactionTypeIcon(typeVal)}<span className="mr-2">{typeVal === 'deposit' ? 'إيداع' : typeVal === 'withdrawal' ? 'سحب' : typeVal === 'transfer' ? 'تحويل' : typeVal === 'fee' ? 'رسوم' : 'فائدة'}</span></div></SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
              {transactionForm.watch('type') === 'transfer' && (<FormField control={transactionForm.control} name="targetAccountId" render={({ field }) => (<FormItem><FormLabel>الحساب المستلم</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر الحساب المستلم" /></SelectTrigger></FormControl><SelectContent>{accounts.filter(account => account.isActive && account.id !== transactionForm.watch('accountId')).map((account) => (<SelectItem key={account.id} value={account.id}>{account.name} ({account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {account.currency})</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />)}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={transactionForm.control} name="amount" render={({ field }) => (<FormItem><FormLabel>المبلغ</FormLabel><FormControl><Input type="number" placeholder="0.00" {...field} step="any" /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={transactionForm.control} name="date" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>التاريخ</FormLabel><DatePicker date={field.value} setDate={field.onChange} /><FormMessage /></FormItem>)} />
              </div>
              <FormField control={transactionForm.control} name="description" render={({ field }) => (<FormItem><FormLabel>الوصف/البيان (اختياري)</FormLabel><FormControl><Textarea placeholder="أدخل وصفًا للمعاملة..." {...field} /></FormControl><FormMessage /></FormItem>)} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={transactionForm.control} name="category" render={({ field }) => (<FormItem><FormLabel>الفئة (اختياري)</FormLabel><FormControl><Input placeholder="مثال: فواتير، رواتب" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={transactionForm.control} name="referenceNumber" render={({ field }) => (<FormItem><FormLabel>الرقم المرجعي (اختياري)</FormLabel><FormControl><Input placeholder="رقم فاتورة، إلخ." {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <FormField control={transactionForm.control} name="status" render={({ field }) => (<FormItem><FormLabel>الحالة</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر حالة المعاملة" /></SelectTrigger></FormControl><SelectContent>{transactionStatusValues.map(statusVal => (<SelectItem key={statusVal} value={statusVal}>{statusVal === 'completed' ? 'مكتملة' : statusVal === 'pending' ? 'قيد الانتظار' : statusVal === 'failed' ? 'فاشلة' : 'ملغاة'}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
              <DialogFooter className="pt-4">
                <DialogClose asChild><Button type="button" variant="outline">إلغاء</Button></DialogClose>
                <Button type="submit" disabled={transactionForm.formState.isSubmitting}>{transactionForm.formState.isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}إضافة المعاملة</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!accountToDelete} onOpenChange={(open) => !open && setAccountToDelete(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>هل أنت متأكد من حذف هذا الحساب؟</AlertDialogTitle><AlertDialogDescription>سيتم حذف حساب "{accountToDelete?.name}" وجميع معاملاته المرتبطة به بشكل نهائي. لا يمكن التراجع عن هذا الإجراء.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel onClick={() => setAccountToDelete(null)}>إلغاء</AlertDialogCancel><AlertDialogAction onClick={confirmDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">نعم، احذف الحساب</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AccountsPage;

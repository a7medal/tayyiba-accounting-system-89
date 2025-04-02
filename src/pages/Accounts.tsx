
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarIcon, Search, Plus, ArrowUpCircle, ArrowDownCircle, RefreshCw, Wallet, FileText, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Account, AccountTransaction, TransactionType } from "@/components/gazatelecom/models/MessageModel";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DatabaseService } from "@/components/gazatelecom/services/DatabaseService";
import { cn } from "@/lib/utils";

export default function Accounts() {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<AccountTransaction[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [transactionType, setTransactionType] = useState<TransactionType>('deposit');
  const [dateFilter, setDateFilter] = useState<'today' | 'yesterday' | 'custom'>('today');
  const [customDate, setCustomDate] = useState<Date | undefined>(new Date());
  const [filteredTransactions, setFilteredTransactions] = useState<AccountTransaction[]>([]);
  
  // نموذج الحساب الجديد
  const [newAccount, setNewAccount] = useState<Omit<Account, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    balance: 0,
    type: 'cash',
    description: ''
  });
  
  // نموذج المعاملة الجديدة
  const [newTransaction, setNewTransaction] = useState<Omit<AccountTransaction, 'id' | 'timestamp'>>({
    accountId: '',
    transactionType: 'deposit',
    amount: 0,
    description: '',
    toAccountId: '',
    reference: ''
  });
  
  // تحميل البيانات عند بدء الصفحة
  useEffect(() => {
    loadAccounts();
    loadTransactions();
  }, []);
  
  // تصفية المعاملات حسب التاريخ
  useEffect(() => {
    filterTransactionsByDate();
  }, [dateFilter, customDate, transactions]);
  
  // تحميل الحسابات من قاعدة البيانات
  const loadAccounts = async () => {
    try {
      const data = await DatabaseService.getAccounts();
      setAccounts(data);
    } catch (error) {
      console.error('خطأ في تحميل الحسابات:', error);
      toast({
        title: 'خطأ في تحميل البيانات',
        description: 'تعذر تحميل الحسابات، يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      });
    }
  };
  
  // تحميل المعاملات من قاعدة البيانات
  const loadTransactions = async () => {
    try {
      const data = await DatabaseService.getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('خطأ في تحميل المعاملات:', error);
      toast({
        title: 'خطأ في تحميل البيانات',
        description: 'تعذر تحميل المعاملات، يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      });
    }
  };
  
  // تصفية المعاملات حسب التاريخ
  const filterTransactionsByDate = () => {
    if (!transactions.length) return;
    
    let dateToFilter = new Date();
    let endDate = new Date();
    
    if (dateFilter === 'yesterday') {
      dateToFilter.setDate(dateToFilter.getDate() - 1);
      endDate.setDate(endDate.getDate() - 1);
    } else if (dateFilter === 'custom' && customDate) {
      dateToFilter = new Date(customDate);
      endDate = new Date(customDate);
    }
    
    dateToFilter.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    
    const filtered = transactions.filter(transaction => {
      const transDate = new Date(transaction.timestamp);
      return transDate >= dateToFilter && transDate <= endDate;
    });
    
    setFilteredTransactions(filtered);
  };
  
  // إضافة حساب جديد
  const handleAddAccount = async () => {
    if (!newAccount.name.trim()) {
      toast({
        title: 'خطأ في الإدخال',
        description: 'يرجى إدخال اسم الحساب',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const account: Account = {
        ...newAccount,
        id: `acc_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await DatabaseService.saveAccount(account);
      setAccounts([...accounts, account]);
      setNewAccount({
        name: '',
        balance: 0,
        type: 'cash',
        description: ''
      });
      setShowAddAccount(false);
      
      toast({
        title: 'تمت الإضافة',
        description: `تم إضافة حساب "${account.name}" بنجاح`,
      });
    } catch (error) {
      console.error('خطأ في إضافة الحساب:', error);
      toast({
        title: 'خطأ في الإضافة',
        description: 'تعذر إضافة الحساب، يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      });
    }
  };
  
  // إضافة معاملة جديدة
  const handleAddTransaction = async () => {
    if (!newTransaction.accountId) {
      toast({
        title: 'خطأ في الإدخال',
        description: 'يرجى اختيار الحساب',
        variant: 'destructive',
      });
      return;
    }
    
    if (newTransaction.amount <= 0) {
      toast({
        title: 'خطأ في الإدخال',
        description: 'يجب أن يكون المبلغ أكبر من الصفر',
        variant: 'destructive',
      });
      return;
    }
    
    if (newTransaction.transactionType === 'transfer' && !newTransaction.toAccountId) {
      toast({
        title: 'خطأ في الإدخال',
        description: 'يرجى اختيار الحساب المستلم للتحويل',
        variant: 'destructive',
      });
      return;
    }
    
    if (newTransaction.transactionType === 'transfer' && newTransaction.toAccountId === newTransaction.accountId) {
      toast({
        title: 'خطأ في الإدخال',
        description: 'لا يمكن التحويل إلى نفس الحساب',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // تحديث الحسابات وفقًا لنوع المعاملة
      const sourceAccount = accounts.find(acc => acc.id === newTransaction.accountId);
      
      if (!sourceAccount) {
        toast({
          title: 'خطأ في المعاملة',
          description: 'الحساب غير موجود',
          variant: 'destructive',
        });
        return;
      }
      
      // التحقق من رصيد السحب أو التحويل
      if ((newTransaction.transactionType === 'withdraw' || newTransaction.transactionType === 'transfer') && 
          sourceAccount.balance < newTransaction.amount) {
        toast({
          title: 'خطأ في المعاملة',
          description: 'الرصيد غير كافي للسحب أو التحويل',
          variant: 'destructive',
        });
        return;
      }
      
      // إنشاء المعاملة
      const transaction: AccountTransaction = {
        ...newTransaction,
        id: `trans_${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
      
      // حفظ المعاملة
      await DatabaseService.saveTransaction(transaction);
      setTransactions([...transactions, transaction]);
      
      // تحديث رصيد الحساب المصدر
      let updatedSourceAccount = { ...sourceAccount };
      
      if (transaction.transactionType === 'deposit') {
        updatedSourceAccount.balance += transaction.amount;
      } else if (transaction.transactionType === 'withdraw') {
        updatedSourceAccount.balance -= transaction.amount;
      } else if (transaction.transactionType === 'transfer') {
        updatedSourceAccount.balance -= transaction.amount;
        
        // تحديث رصيد الحساب المستلم
        if (transaction.toAccountId) {
          const targetAccount = accounts.find(acc => acc.id === transaction.toAccountId);
          if (targetAccount) {
            const updatedTargetAccount = {
              ...targetAccount,
              balance: targetAccount.balance + transaction.amount,
              updatedAt: new Date().toISOString()
            };
            await DatabaseService.saveAccount(updatedTargetAccount);
            
            // تحديث قائمة الحسابات في الواجهة
            setAccounts(accounts.map(acc => 
              acc.id === updatedTargetAccount.id ? updatedTargetAccount : acc
            ));
          }
        }
      }
      
      updatedSourceAccount.updatedAt = new Date().toISOString();
      await DatabaseService.saveAccount(updatedSourceAccount);
      
      // تحديث قائمة الحسابات في الواجهة
      setAccounts(accounts.map(acc => 
        acc.id === updatedSourceAccount.id ? updatedSourceAccount : acc
      ));
      
      // إعادة تعيين نموذج المعاملة
      setNewTransaction({
        accountId: '',
        transactionType: 'deposit',
        amount: 0,
        description: '',
        toAccountId: '',
        reference: ''
      });
      
      setShowAddTransaction(false);
      
      toast({
        title: 'تمت الإضافة',
        description: `تم إضافة المعاملة بنجاح`,
      });
    } catch (error) {
      console.error('خطأ في إضافة المعاملة:', error);
      toast({
        title: 'خطأ في الإضافة',
        description: 'تعذر إضافة المعاملة، يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      });
    }
  };
  
  // الحصول على اسم الحساب من المعرف
  const getAccountName = (accountId: string): string => {
    const account = accounts.find(acc => acc.id === accountId);
    return account ? account.name : 'غير معروف';
  };
  
  // الحصول على لون بطاقة الحساب
  const getAccountColor = (type: string): string => {
    switch (type) {
      case 'cash':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'bank':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
      case 'card':
        return 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800';
      default:
        return 'bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800';
    }
  };
  
  // الحصول على نص نوع الحساب
  const getAccountTypeText = (type: string): string => {
    switch (type) {
      case 'cash':
        return 'نقدي';
      case 'bank':
        return 'حساب بنكي';
      case 'card':
        return 'بطاقة ائتمان';
      default:
        return type;
    }
  };
  
  // الحصول على نص نوع المعاملة
  const getTransactionTypeText = (type: TransactionType): string => {
    switch (type) {
      case 'deposit':
        return 'إيداع';
      case 'withdraw':
        return 'سحب';
      case 'transfer':
        return 'تحويل';
      default:
        return type;
    }
  };
  
  // الحصول على لون بطاقة نوع المعاملة
  const getTransactionColor = (type: TransactionType): string => {
    switch (type) {
      case 'deposit':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'withdraw':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'transfer':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };
  
  // تصفية الحسابات حسب البحث
  const filteredAccounts = accounts.filter(account => 
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // حساب إجمالي الرصيد
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">إدارة الحسابات</h1>
        <div className="flex gap-2">
          <Dialog open={showAddAccount} onOpenChange={setShowAddAccount}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                حساب جديد
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إضافة حساب جديد</DialogTitle>
                <DialogDescription>
                  أدخل بيانات الحساب الجديد
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">اسم الحساب</Label>
                  <Input
                    id="name"
                    placeholder="أدخل اسم الحساب"
                    value={newAccount.name}
                    onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="balance">الرصيد الافتتاحي</Label>
                  <Input
                    id="balance"
                    type="number"
                    placeholder="أدخل الرصيد الافتتاحي"
                    value={newAccount.balance}
                    onChange={(e) => setNewAccount({ ...newAccount, balance: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">نوع الحساب</Label>
                  <Select
                    value={newAccount.type}
                    onValueChange={(value) => setNewAccount({ ...newAccount, type: value })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="اختر نوع الحساب" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">نقدي</SelectItem>
                      <SelectItem value="bank">حساب بنكي</SelectItem>
                      <SelectItem value="card">بطاقة ائتمان</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">وصف الحساب</Label>
                  <Input
                    id="description"
                    placeholder="وصف اختياري للحساب"
                    value={newAccount.description || ''}
                    onChange={(e) => setNewAccount({ ...newAccount, description: e.target.value })}
                  />
                </div>
                <Button className="w-full" onClick={handleAddAccount}>
                  إضافة الحساب
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showAddTransaction} onOpenChange={setShowAddTransaction}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                معاملة جديدة
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إضافة معاملة جديدة</DialogTitle>
                <DialogDescription>
                  أدخل بيانات المعاملة الجديدة
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Tabs 
                  value={newTransaction.transactionType} 
                  onValueChange={(value) => setNewTransaction({ 
                    ...newTransaction, 
                    transactionType: value as TransactionType
                  })}
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="deposit">إيداع</TabsTrigger>
                    <TabsTrigger value="withdraw">سحب</TabsTrigger>
                    <TabsTrigger value="transfer">تحويل</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="space-y-2">
                  <Label htmlFor="account">
                    {newTransaction.transactionType === 'transfer' ? 'الحساب المصدر' : 'الحساب'}
                  </Label>
                  <Select
                    value={newTransaction.accountId}
                    onValueChange={(value) => setNewTransaction({ ...newTransaction, accountId: value })}
                  >
                    <SelectTrigger id="account">
                      <SelectValue placeholder="اختر الحساب" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name} ({account.balance.toLocaleString()} أوقية)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {newTransaction.transactionType === 'transfer' && (
                  <div className="space-y-2">
                    <Label htmlFor="toAccount">الحساب المستلم</Label>
                    <Select
                      value={newTransaction.toAccountId || ''}
                      onValueChange={(value) => setNewTransaction({ ...newTransaction, toAccountId: value })}
                    >
                      <SelectTrigger id="toAccount">
                        <SelectValue placeholder="اختر الحساب المستلم" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts
                          .filter(account => account.id !== newTransaction.accountId)
                          .map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.name} ({account.balance.toLocaleString()} أوقية)
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="amount">المبلغ</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="أدخل مبلغ المعاملة"
                    value={newTransaction.amount || ''}
                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">الوصف</Label>
                  <Input
                    id="description"
                    placeholder="وصف المعاملة"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reference">المرجع (اختياري)</Label>
                  <Input
                    id="reference"
                    placeholder="رقم مرجعي للمعاملة"
                    value={newTransaction.reference || ''}
                    onChange={(e) => setNewTransaction({ ...newTransaction, reference: e.target.value })}
                  />
                </div>
                
                <Button className="w-full" onClick={handleAddTransaction}>
                  إضافة المعاملة
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">الرصيد الإجمالي</CardTitle>
            <CardDescription>
              إجمالي رصيد جميع الحسابات
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalBalance.toLocaleString()} أوقية</div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">المعاملات الأخيرة</CardTitle>
            <CardDescription>
              آخر المعاملات المالية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Select value={dateFilter} onValueChange={(value) => setDateFilter(value as any)}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="اختر الفترة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">اليوم</SelectItem>
                    <SelectItem value="yesterday">أمس</SelectItem>
                    <SelectItem value="custom">تاريخ محدد</SelectItem>
                  </SelectContent>
                </Select>
                
                {dateFilter === 'custom' && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1 h-10">
                        <CalendarIcon className="h-4 w-4" />
                        {customDate ? format(customDate, 'yyyy/MM/dd') : 'اختر تاريخ'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={customDate}
                        onSelect={setCustomDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
            
            {filteredTransactions.length > 0 ? (
              <div className="space-y-3">
                {filteredTransactions.slice(0, 3).map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      {transaction.transactionType === 'deposit' && <ArrowUpCircle className="h-8 w-8 text-green-500" />}
                      {transaction.transactionType === 'withdraw' && <ArrowDownCircle className="h-8 w-8 text-red-500" />}
                      {transaction.transactionType === 'transfer' && <RefreshCw className="h-8 w-8 text-blue-500" />}
                      
                      <div>
                        <div className="font-medium">
                          {transaction.description || getTransactionTypeText(transaction.transactionType)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {getAccountName(transaction.accountId)}
                          {transaction.transactionType === 'transfer' && transaction.toAccountId && 
                            ` → ${getAccountName(transaction.toAccountId)}`
                          }
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className={cn(
                        "font-medium",
                        transaction.transactionType === 'deposit' ? "text-green-600" : 
                        transaction.transactionType === 'withdraw' ? "text-red-600" : ""
                      )}>
                        {transaction.transactionType === 'deposit' ? '+' : 
                         transaction.transactionType === 'withdraw' ? '-' : ''}
                        {transaction.amount.toLocaleString()} أوقية
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(transaction.timestamp), 'yyyy/MM/dd HH:mm')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-4">
                لا توجد معاملات في هذه الفترة
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">الحسابات</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="بحث..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 max-w-[150px]"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map((account) => (
                  <div
                    key={account.id}
                    className={cn(
                      "p-3 border rounded-md cursor-pointer hover:bg-accent/50",
                      getAccountColor(account.type),
                      selectedAccount?.id === account.id && "ring-2 ring-primary"
                    )}
                    onClick={() => setSelectedAccount(account)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{account.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {getAccountTypeText(account.type)}
                        </div>
                      </div>
                      <div className="text-lg font-bold">
                        {account.balance.toLocaleString()} أوقية
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  لا توجد حسابات مطابقة للبحث
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">سجل المعاملات</CardTitle>
              <div className="flex items-center gap-2">
                <Select value={dateFilter} onValueChange={(value) => setDateFilter(value as any)}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="اختر الفترة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">اليوم</SelectItem>
                    <SelectItem value="yesterday">أمس</SelectItem>
                    <SelectItem value="custom">تاريخ محدد</SelectItem>
                  </SelectContent>
                </Select>
                
                {dateFilter === 'custom' && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1 h-10">
                        <CalendarIcon className="h-4 w-4" />
                        {customDate ? format(customDate, 'yyyy/MM/dd') : 'اختر تاريخ'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={customDate}
                        onSelect={setCustomDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>النوع</TableHead>
                  <TableHead>الحساب</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>الوصف</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <Badge className={getTransactionColor(transaction.transactionType)}>
                          {getTransactionTypeText(transaction.transactionType)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getAccountName(transaction.accountId)}
                        {transaction.transactionType === 'transfer' && transaction.toAccountId && (
                          <span> → {getAccountName(transaction.toAccountId)}</span>
                        )}
                      </TableCell>
                      <TableCell className={cn(
                        transaction.transactionType === 'deposit' ? "text-green-600" : 
                        transaction.transactionType === 'withdraw' ? "text-red-600" : ""
                      )}>
                        {transaction.amount.toLocaleString()} أوقية
                      </TableCell>
                      <TableCell>{format(new Date(transaction.timestamp), 'yyyy/MM/dd HH:mm')}</TableCell>
                      <TableCell>{transaction.description || '-'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      لا توجد معاملات في هذه الفترة
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

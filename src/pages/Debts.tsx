
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, Calendar as CalendarIcon, DollarSign, ArrowDownUp, Wallet, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Debt, DebtPayment } from "@/components/gazatelecom/models/MessageModel";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AppDatabase } from "@/services/DatabaseService";
import { cn } from "@/lib/utils";

export default function Debts() {
  const { toast } = useToast();
  const [debts, setDebts] = useState<Debt[]>([]);
  const [payments, setPayments] = useState<DebtPayment[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'client' | 'supplier'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingDebt, setIsAddingDebt] = useState(false);
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);
  
  // إحصائيات الديون
  const [debtStats, setDebtStats] = useState({
    totalReceivable: 0, // إجمالي المستحق (المدين)
    totalPayable: 0,    // إجمالي المدان
    balance: 0          // الفرق بين المدين والمدان
  });
  
  // نموذج الدين الجديد
  const [newDebt, setNewDebt] = useState<Partial<Debt>>({
    entityId: '',
    entityName: '',
    entityType: 'client',
    amount: 0,
    remainingAmount: 0,
    dueDate: new Date().toISOString().split('T')[0],
    description: '',
    reference: '',
    status: 'active'
  });
  
  // نموذج الدفعة الجديدة
  const [newPayment, setNewPayment] = useState<Partial<DebtPayment>>({
    debtId: '',
    amount: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    method: 'cash',
    reference: '',
    note: ''
  });
  
  // تحميل الديون والدفعات عند بدء الصفحة
  useEffect(() => {
    loadDebts();
  }, []);
  
  // حساب إحصائيات الديون عند تغيير الديون
  useEffect(() => {
    calculateDebtStats();
  }, [debts]);
  
  // تحميل الديون من قاعدة البيانات
  const loadDebts = async () => {
    try {
      if (AppDatabase.isConnected()) {
        const debtsData = await AppDatabase.getDebts();
        setDebts(debtsData);
      } else {
        toast({
          title: 'خطأ في الاتصال',
          description: 'قاعدة البيانات غير متصلة',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('خطأ في تحميل الديون:', error);
      toast({
        title: 'خطأ في تحميل البيانات',
        description: 'تعذر تحميل الديون، يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      });
    }
  };
  
  // حساب إحصائيات الديون
  const calculateDebtStats = () => {
    const receivable = debts
      .filter(debt => debt.entityType === 'client')
      .reduce((sum, debt) => sum + debt.remainingAmount, 0);
    
    const payable = debts
      .filter(debt => debt.entityType === 'supplier')
      .reduce((sum, debt) => sum + debt.remainingAmount, 0);
    
    setDebtStats({
      totalReceivable: receivable,
      totalPayable: payable,
      balance: receivable - payable
    });
  };
  
  // إضافة دين جديد
  const handleAddDebt = async () => {
    if (!newDebt.entityName?.trim()) {
      toast({
        title: 'خطأ في الإدخال',
        description: 'يرجى إدخال اسم العميل/المورد',
        variant: 'destructive',
      });
      return;
    }
    
    if (!newDebt.amount || newDebt.amount <= 0) {
      toast({
        title: 'خطأ في الإدخال',
        description: 'يرجى إدخال مبلغ صحيح للدين',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const debt: Debt = {
        id: `debt_${Date.now()}`,
        entityId: newDebt.entityId || `entity_${Date.now()}`,
        entityName: newDebt.entityName,
        entityType: newDebt.entityType as 'client' | 'supplier',
        amount: Number(newDebt.amount),
        remainingAmount: Number(newDebt.amount),
        dueDate: newDebt.dueDate || new Date().toISOString().split('T')[0],
        description: newDebt.description || '',
        reference: newDebt.reference || '',
        createdAt: new Date().toISOString(),
        status: 'active'
      };
      
      if (AppDatabase.isConnected()) {
        const savedDebt = await AppDatabase.saveDebt(debt);
        setDebts([...debts, savedDebt]);
        
        setNewDebt({
          entityId: '',
          entityName: '',
          entityType: 'client',
          amount: 0,
          remainingAmount: 0,
          dueDate: new Date().toISOString().split('T')[0],
          description: '',
          reference: '',
          status: 'active'
        });
        
        setIsAddingDebt(false);
        
        toast({
          title: 'تمت الإضافة',
          description: `تم إضافة الدين بنجاح`,
        });
      } else {
        toast({
          title: 'خطأ في الاتصال',
          description: 'قاعدة البيانات غير متصلة',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('خطأ في إضافة الدين:', error);
      toast({
        title: 'خطأ في الإضافة',
        description: 'تعذر إضافة الدين، يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      });
    }
  };
  
  // إضافة دفعة جديدة
  const handleAddPayment = async () => {
    if (!selectedDebt) {
      toast({
        title: 'خطأ في الإدخال',
        description: 'يرجى اختيار الدين',
        variant: 'destructive',
      });
      return;
    }
    
    if (!newPayment.amount || newPayment.amount <= 0) {
      toast({
        title: 'خطأ في الإدخال',
        description: 'يرجى إدخال مبلغ صحيح للدفعة',
        variant: 'destructive',
      });
      return;
    }
    
    if (newPayment.amount > selectedDebt.remainingAmount) {
      toast({
        title: 'خطأ في الإدخال',
        description: 'مبلغ الدفعة يتجاوز المبلغ المتبقي من الدين',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const payment: DebtPayment = {
        id: `payment_${Date.now()}`,
        debtId: selectedDebt.id,
        amount: Number(newPayment.amount),
        paymentDate: newPayment.paymentDate || new Date().toISOString().split('T')[0],
        method: newPayment.method || 'cash',
        reference: newPayment.reference || '',
        note: newPayment.note || ''
      };
      
      // تحديث الدين
      const updatedDebt = { ...selectedDebt };
      updatedDebt.remainingAmount -= payment.amount;
      
      if (updatedDebt.remainingAmount <= 0) {
        updatedDebt.status = 'paid';
      } else {
        updatedDebt.status = 'partial';
      }
      
      if (AppDatabase.isConnected()) {
        // حفظ الدين المحدث
        await AppDatabase.saveDebt(updatedDebt);
        
        // تحديث القائمة
        setDebts(debts.map(debt => debt.id === updatedDebt.id ? updatedDebt : debt));
        
        // حفظ الدفعة في قاعدة البيانات
        // ملاحظة: في المثال الحالي، نحتاج لإضافة وظيفة saveDebtPayment
        // لنفترض أنه متاح ويمكننا استخدامه
        
        setNewPayment({
          debtId: '',
          amount: 0,
          paymentDate: new Date().toISOString().split('T')[0],
          method: 'cash',
          reference: '',
          note: ''
        });
        
        setIsAddingPayment(false);
        setSelectedDebt(null);
        
        toast({
          title: 'تمت الإضافة',
          description: `تم إضافة الدفعة بنجاح`,
        });
      } else {
        toast({
          title: 'خطأ في الاتصال',
          description: 'قاعدة البيانات غير متصلة',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('خطأ في إضافة الدفعة:', error);
      toast({
        title: 'خطأ في الإضافة',
        description: 'تعذر إضافة الدفعة، يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      });
    }
  };
  
  // حذف دين
  const handleDeleteDebt = async (debtId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الدين؟')) {
      try {
        if (AppDatabase.isConnected()) {
          const success = await AppDatabase.deleteDebt(debtId);
          
          if (success) {
            setDebts(debts.filter(debt => debt.id !== debtId));
            
            toast({
              title: 'تم الحذف',
              description: 'تم حذف الدين بنجاح',
            });
          } else {
            toast({
              title: 'خطأ في الحذف',
              description: 'تعذر حذف الدين، يرجى المحاولة مرة أخرى',
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: 'خطأ في الاتصال',
            description: 'قاعدة البيانات غير متصلة',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('خطأ في حذف الدين:', error);
        toast({
          title: 'خطأ في الحذف',
          description: 'تعذر حذف الدين، يرجى المحاولة مرة أخرى',
          variant: 'destructive',
        });
      }
    }
  };
  
  // التعامل مع تسديد دين
  const handlePayDebt = (debt: Debt) => {
    setSelectedDebt(debt);
    setNewPayment({
      ...newPayment,
      debtId: debt.id,
      amount: debt.remainingAmount
    });
    setIsAddingPayment(true);
  };
  
  // الحصول على نص نوع الكيان
  const getEntityTypeText = (type: 'client' | 'supplier'): string => {
    return type === 'client' ? 'عميل' : 'مورد';
  };
  
  // الحصول على نص حالة الدين
  const getDebtStatusText = (status: 'active' | 'partial' | 'paid'): string => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'partial':
        return 'مدفوع جزئيا';
      case 'paid':
        return 'مدفوع بالكامل';
      default:
        return status;
    }
  };
  
  // الحصول على لون بطاقة حالة الدين
  const getDebtStatusColor = (status: 'active' | 'partial' | 'paid'): string => {
    switch (status) {
      case 'active':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'partial':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };
  
  // تصفية الديون حسب علامة التبويب
  const getFilteredDebts = () => {
    let filtered = [...debts];
    
    // تصفية حسب علامة التبويب
    if (activeTab === 'client') {
      filtered = filtered.filter(debt => debt.entityType === 'client');
    } else if (activeTab === 'supplier') {
      filtered = filtered.filter(debt => debt.entityType === 'supplier');
    }
    
    // تصفية حسب البحث
    if (searchTerm) {
      filtered = filtered.filter(debt => 
        debt.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        debt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        debt.reference?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };
  
  const filteredDebts = getFilteredDebts();
  
  // معالجة طباعة صفحة الديون
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">إدارة الديون</h1>
        <div className="flex gap-2">
          <Dialog open={isAddingDebt} onOpenChange={setIsAddingDebt}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                دين جديد
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إضافة دين جديد</DialogTitle>
                <DialogDescription>
                  أدخل بيانات الدين الجديد
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="entityType">نوع الكيان</Label>
                  <Select
                    value={newDebt.entityType}
                    onValueChange={(value) => setNewDebt({ ...newDebt, entityType: value as 'client' | 'supplier' })}
                  >
                    <SelectTrigger id="entityType">
                      <SelectValue placeholder="اختر نوع الكيان" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">عميل</SelectItem>
                      <SelectItem value="supplier">مورد</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="entityName">اسم {newDebt.entityType === 'client' ? 'العميل' : 'المورد'}</Label>
                  <Input
                    id="entityName"
                    placeholder={`أدخل اسم ${newDebt.entityType === 'client' ? 'العميل' : 'المورد'}`}
                    value={newDebt.entityName || ''}
                    onChange={(e) => setNewDebt({ ...newDebt, entityName: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="amount">المبلغ</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="أدخل مبلغ الدين"
                    value={newDebt.amount || ''}
                    onChange={(e) => setNewDebt({ ...newDebt, amount: Number(e.target.value), remainingAmount: Number(e.target.value) })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dueDate">تاريخ الاستحقاق</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        id="dueDate"
                      >
                        <CalendarIcon className="ml-2 h-4 w-4" />
                        {newDebt.dueDate ? format(new Date(newDebt.dueDate), 'yyyy/MM/dd') : 'اختر تاريخ الاستحقاق'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={newDebt.dueDate ? new Date(newDebt.dueDate) : undefined}
                        onSelect={(date) => setNewDebt({ ...newDebt, dueDate: date?.toISOString().split('T')[0] })}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">الوصف</Label>
                  <Input
                    id="description"
                    placeholder="وصف الدين"
                    value={newDebt.description || ''}
                    onChange={(e) => setNewDebt({ ...newDebt, description: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reference">المرجع (اختياري)</Label>
                  <Input
                    id="reference"
                    placeholder="رقم الفاتورة أو أي مرجع آخر"
                    value={newDebt.reference || ''}
                    onChange={(e) => setNewDebt({ ...newDebt, reference: e.target.value })}
                  />
                </div>
                
                <Button className="w-full" onClick={handleAddDebt}>
                  إضافة الدين
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isAddingPayment} onOpenChange={setIsAddingPayment}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إضافة دفعة</DialogTitle>
                <DialogDescription>
                  أدخل بيانات الدفعة الجديدة
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {selectedDebt && (
                  <div className="bg-accent/50 p-3 rounded-md mb-4">
                    <div className="font-medium">{selectedDebt.entityName}</div>
                    <div className="text-sm text-muted-foreground">
                      المبلغ المتبقي: {selectedDebt.remainingAmount.toLocaleString()} أوقية
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="amount">مبلغ الدفعة</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="أدخل مبلغ الدفعة"
                    value={newPayment.amount || ''}
                    onChange={(e) => setNewPayment({ ...newPayment, amount: Number(e.target.value) })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paymentDate">تاريخ الدفع</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        id="paymentDate"
                      >
                        <CalendarIcon className="ml-2 h-4 w-4" />
                        {newPayment.paymentDate ? format(new Date(newPayment.paymentDate), 'yyyy/MM/dd') : 'اختر تاريخ الدفع'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={newPayment.paymentDate ? new Date(newPayment.paymentDate) : undefined}
                        onSelect={(date) => setNewPayment({ ...newPayment, paymentDate: date?.toISOString().split('T')[0] })}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="method">طريقة الدفع</Label>
                  <Select
                    value={newPayment.method || 'cash'}
                    onValueChange={(value) => setNewPayment({ ...newPayment, method: value })}
                  >
                    <SelectTrigger id="method">
                      <SelectValue placeholder="اختر طريقة الدفع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">نقدي</SelectItem>
                      <SelectItem value="bank">تحويل بنكي</SelectItem>
                      <SelectItem value="card">بطاقة ائتمان</SelectItem>
                      <SelectItem value="other">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reference">المرجع (اختياري)</Label>
                  <Input
                    id="reference"
                    placeholder="رقم الإيصال أو المرجع"
                    value={newPayment.reference || ''}
                    onChange={(e) => setNewPayment({ ...newPayment, reference: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="note">ملاحظات (اختياري)</Label>
                  <Input
                    id="note"
                    placeholder="ملاحظات إضافية"
                    value={newPayment.note || ''}
                    onChange={(e) => setNewPayment({ ...newPayment, note: e.target.value })}
                  />
                </div>
                
                <Button className="w-full" onClick={handleAddPayment}>
                  إضافة الدفعة
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" className="flex items-center gap-2" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
            طباعة
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400 ml-2" />
              المبالغ المستحقة لنا (المدين)
            </CardTitle>
            <CardDescription>
              إجمالي المبالغ المستحقة من العملاء
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {debtStats.totalReceivable.toLocaleString()} أوقية
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <DollarSign className="h-5 w-5 text-red-600 dark:text-red-400 ml-2" />
              المبالغ المستحقة علينا (المدان)
            </CardTitle>
            <CardDescription>
              إجمالي المبالغ المستحقة للموردين
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {debtStats.totalPayable.toLocaleString()} أوقية
            </div>
          </CardContent>
        </Card>
        
        <Card className={cn(
          debtStats.balance >= 0 
            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" 
            : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
        )}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <ArrowDownUp className={cn(
                "h-5 w-5 ml-2",
                debtStats.balance >= 0 ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400"
              )} />
              الفرق (المدين - المدان)
            </CardTitle>
            <CardDescription>
              الفرق بين المستحق لنا والمستحق علينا
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-bold",
              debtStats.balance >= 0 ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400"
            )}>
              {debtStats.balance.toLocaleString()} أوقية
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">سجل الديون</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="بحث..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 max-w-[200px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | 'client' | 'supplier')}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">الكل</TabsTrigger>
              <TabsTrigger value="client">المستحق لنا</TabsTrigger>
              <TabsTrigger value="supplier">المستحق علينا</TabsTrigger>
            </TabsList>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>المبلغ الكلي</TableHead>
                  <TableHead>المبلغ المتبقي</TableHead>
                  <TableHead>تاريخ الاستحقاق</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDebts.length > 0 ? (
                  filteredDebts.map((debt) => (
                    <TableRow key={debt.id}>
                      <TableCell className="font-medium">{debt.entityName}</TableCell>
                      <TableCell>{getEntityTypeText(debt.entityType)}</TableCell>
                      <TableCell>{debt.amount.toLocaleString()} أوقية</TableCell>
                      <TableCell>{debt.remainingAmount.toLocaleString()} أوقية</TableCell>
                      <TableCell>{format(new Date(debt.dueDate), 'yyyy/MM/dd')}</TableCell>
                      <TableCell>
                        <Badge className={getDebtStatusColor(debt.status)}>
                          {getDebtStatusText(debt.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {debt.status !== 'paid' && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handlePayDebt(debt)}
                              className="h-8"
                            >
                              <Wallet className="h-3 w-3 ml-1" />
                              تسديد
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteDebt(debt.id)}
                            className="h-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                          >
                            حذف
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      لا توجد ديون مطابقة للبحث
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

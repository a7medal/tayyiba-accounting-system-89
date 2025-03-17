
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter,
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { AppDatabase } from '@/services/DatabaseService';
import { DatabaseSettings } from '@/components/shared/DatabaseSettings';
import { Debt } from '@/components/gazatelecom/models/MessageModel';
import { Search, Download, FileText, Plus, Calendar, Eye, CreditCard } from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DatePicker } from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export default function Debts() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [selectedTab, setSelectedTab] = useState<'receivable' | 'payable'>('receivable');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showEntityStatementDialog, setShowEntityStatementDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDebts();
  }, []);

  const loadDebts = async () => {
    try {
      if (AppDatabase.isConnected()) {
        const data = await AppDatabase.getDebts();
        setDebts(data || []);
      }
    } catch (error) {
      console.error("خطأ في تحميل الديون:", error);
      toast({
        title: "خطأ في تحميل البيانات",
        description: "تعذر تحميل بيانات الديون، تأكد من اتصال قاعدة البيانات",
        variant: "destructive",
      });
    }
  };

  const filteredDebts = debts.filter(debt => {
    const matchesType = selectedTab === 'receivable' ? debt.entityType === 'client' : debt.entityType === 'supplier';
    const matchesSearch = debt.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         debt.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const form = useForm({
    defaultValues: {
      entityType: 'client',
      entityId: '',
      entityName: '',
      amount: '',
      dueDate: new Date().toISOString(),
      referenceType: 'other',
      referenceId: '',
      notes: ''
    }
  });

  const paymentForm = useForm({
    defaultValues: {
      amount: '',
      paymentDate: new Date().toISOString(),
      notes: ''
    }
  });

  const handleAddDebt = async (data: any) => {
    try {
      const newDebt: Debt = {
        id: Date.now().toString(),
        entityId: data.entityId,
        entityType: data.entityType,
        entityName: data.entityName,
        amount: Number(data.amount),
        remainingAmount: Number(data.amount),
        dueDate: data.dueDate,
        creationDate: new Date().toISOString(),
        referenceId: data.referenceId,
        referenceType: data.referenceType,
        status: 'active',
        notes: data.notes
      };

      if (AppDatabase.isConnected()) {
        await AppDatabase.saveDebt(newDebt);
        await loadDebts();
        toast({
          title: "تمت الإضافة",
          description: "تم إضافة الدين بنجاح",
        });
        form.reset();
      }
    } catch (error) {
      console.error("خطأ في إضافة الدين:", error);
      toast({
        title: "خطأ في الإضافة",
        description: "تعذر إضافة الدين، حاول مرة أخرى",
        variant: "destructive",
      });
    }
  };

  const handleProcessPayment = async (data: any) => {
    if (!selectedDebt) return;
    
    try {
      const paymentAmount = Number(data.amount);
      
      if (paymentAmount > selectedDebt.remainingAmount) {
        toast({
          title: "خطأ في الدفع",
          description: "مبلغ الدفع أكبر من المبلغ المتبقي",
          variant: "destructive",
        });
        return;
      }

      const remainingAmount = selectedDebt.remainingAmount - paymentAmount;
      const status = remainingAmount <= 0 ? 'paid' : (remainingAmount < selectedDebt.amount ? 'partial' : 'active');
      
      const updatedDebt: Debt = {
        ...selectedDebt,
        remainingAmount,
        status,
        lastPaymentDate: data.paymentDate
      };

      if (AppDatabase.isConnected()) {
        await AppDatabase.saveDebt(updatedDebt);
        await loadDebts();
        toast({
          title: "تم الدفع",
          description: "تم تسجيل الدفعة بنجاح",
        });
        setShowPaymentDialog(false);
        paymentForm.reset();
      }
    } catch (error) {
      console.error("خطأ في معالجة الدفعة:", error);
      toast({
        title: "خطأ في الدفع",
        description: "تعذر معالجة الدفعة، حاول مرة أخرى",
        variant: "destructive",
      });
    }
  };

  const getEntityStatement = (entityId: string, entityType: 'client' | 'supplier') => {
    setSelectedDebt(debts.find(d => d.entityId === entityId && d.entityType === entityType) || null);
    setShowEntityStatementDialog(true);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-amber-100 text-amber-800';
      case 'active':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'مدفوع';
      case 'partial':
        return 'مدفوع جزئياً';
      case 'active':
        return 'نشط';
      default:
        return status;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة الديون</h1>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                إضافة دين جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>إضافة دين جديد</DialogTitle>
                <DialogDescription>
                  أدخل بيانات الدين الجديد سواء كان دين لك أو عليك
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddDebt)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="entityType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نوع الكيان</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر نوع الكيان" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="client">عميل (دين لك)</SelectItem>
                            <SelectItem value="supplier">مورد (دين عليك)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="entityName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الاسم</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="اسم العميل أو المورد" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="entityId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>المعرف</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="معرف العميل أو المورد" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>المبلغ</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" placeholder="0.00" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>تاريخ الاستحقاق</FormLabel>
                          <DatePicker
                            date={field.value ? new Date(field.value) : undefined}
                            setDate={(date) => field.onChange(date?.toISOString())}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="referenceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>نوع المرجع</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر نوع المرجع" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="invoice">فاتورة مبيعات</SelectItem>
                              <SelectItem value="purchase">فاتورة مشتريات</SelectItem>
                              <SelectItem value="other">أخرى</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="referenceId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رقم المرجع</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="مثال: INV-2023-001" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ملاحظات</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="أي ملاحظات إضافية"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="submit">إضافة الدين</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Button 
            variant={showSettings ? "default" : "outline"}
            onClick={() => setShowSettings(!showSettings)}
          >
            إعدادات قاعدة البيانات
          </Button>
        </div>
      </div>

      {showSettings ? (
        <div className="mb-6">
          <DatabaseSettings />
        </div>
      ) : (
        <>
          <div className="mb-6 card-glass rounded-xl p-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="البحث عن ديون..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as 'receivable' | 'payable')}>
                <TabsList>
                  <TabsTrigger value="receivable">ديون لك</TabsTrigger>
                  <TabsTrigger value="payable">ديون عليك</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="card-glass rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{selectedTab === 'receivable' ? 'العميل' : 'المورد'}</TableHead>
                  <TableHead>المبلغ الأصلي</TableHead>
                  <TableHead>المبلغ المتبقي</TableHead>
                  <TableHead>تاريخ الاستحقاق</TableHead>
                  <TableHead>المرجع</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDebts.length > 0 ? (
                  filteredDebts.map((debt) => (
                    <TableRow key={debt.id}>
                      <TableCell className="font-medium">{debt.entityName}</TableCell>
                      <TableCell>{debt.amount.toLocaleString()} أوقية</TableCell>
                      <TableCell>{debt.remainingAmount.toLocaleString()} أوقية</TableCell>
                      <TableCell>{new Date(debt.dueDate).toLocaleDateString('ar-SA')}</TableCell>
                      <TableCell>
                        {debt.referenceType === 'invoice' ? 'فاتورة مبيعات' : 
                         debt.referenceType === 'purchase' ? 'فاتورة مشتريات' : 'أخرى'} 
                        {debt.referenceId ? ` - ${debt.referenceId}` : ''}
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          getStatusBadgeClass(debt.status)
                        )}>
                          {getStatusText(debt.status)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          {debt.status !== 'paid' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedDebt(debt);
                                setShowPaymentDialog(true);
                              }}
                            >
                              <CreditCard className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => getEntityStatement(debt.entityId, debt.entityType)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      لا توجد ديون {selectedTab === 'receivable' ? 'لك' : 'عليك'} بالمعايير المحددة
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {/* حوار إضافة دفعة */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>إضافة دفعة</DialogTitle>
            <DialogDescription>
              إضافة دفعة {selectedTab === 'receivable' ? 'من العميل' : 'للمورد'}: {selectedDebt?.entityName}
            </DialogDescription>
          </DialogHeader>
          <Form {...paymentForm}>
            <form onSubmit={paymentForm.handleSubmit(handleProcessPayment)} className="space-y-4">
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">المبلغ الأصلي:</span>
                  <span>{selectedDebt?.amount.toLocaleString()} أوقية</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">المبلغ المتبقي:</span>
                  <span>{selectedDebt?.remainingAmount.toLocaleString()} أوقية</span>
                </div>
              </div>
              
              <FormField
                control={paymentForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>مبلغ الدفعة</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="0.00" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={paymentForm.control}
                name="paymentDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>تاريخ الدفع</FormLabel>
                    <DatePicker
                      date={field.value ? new Date(field.value) : undefined}
                      setDate={(date) => field.onChange(date?.toISOString())}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={paymentForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ملاحظات</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="أي ملاحظات إضافية"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">تسجيل الدفعة</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* حوار كشف حساب */}
      <Dialog open={showEntityStatementDialog} onOpenChange={setShowEntityStatementDialog}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>كشف حساب</DialogTitle>
            <DialogDescription>
              كشف حساب {selectedDebt?.entityType === 'client' ? 'العميل' : 'المورد'}: {selectedDebt?.entityName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">التفاصيل</h3>
                <p className="text-sm text-muted-foreground">كافة المعاملات والأرصدة</p>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                تصدير PDF
              </Button>
            </div>
            
            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">المبلغ الإجمالي:</span>
                <span>{selectedDebt?.amount.toLocaleString()} أوقية</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">المبلغ المدفوع:</span>
                <span>{selectedDebt ? (selectedDebt.amount - selectedDebt.remainingAmount).toLocaleString() : 0} أوقية</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">المبلغ المتبقي:</span>
                <span className="font-semibold">{selectedDebt?.remainingAmount.toLocaleString()} أوقية</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">تاريخ الاستحقاق:</span>
                <span>{selectedDebt?.dueDate ? new Date(selectedDebt.dueDate).toLocaleDateString('ar-SA') : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">آخر دفعة:</span>
                <span>{selectedDebt?.lastPaymentDate ? new Date(selectedDebt.lastPaymentDate).toLocaleDateString('ar-SA') : 'لا توجد'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">الحالة:</span>
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  getStatusBadgeClass(selectedDebt?.status || '')
                )}>
                  {getStatusText(selectedDebt?.status || '')}
                </span>
              </div>
            </div>
            
            {/* يمكن إضافة جدول المدفوعات هنا */}
            <div className="mt-4">
              <h3 className="font-semibold mb-2">المعاملات</h3>
              <p className="text-sm text-muted-foreground mb-2">سجل المدفوعات والمعاملات</p>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>النوع</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>الملاحظات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        لا توجد معاملات متاحة
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

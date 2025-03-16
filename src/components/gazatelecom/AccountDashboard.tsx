
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowUpToLine,
  ArrowDownToLine,
  Calendar,
  Edit,
  Trash2,
  Eye,
  Plus,
  MessageCircle,
  Filter,
  Wallet,
} from 'lucide-react';
import { format } from 'date-fns';
import { useGazaTelecom } from './GazaTelecomContext';
import { ar } from 'date-fns/locale';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageForm } from './MessageForm';
import { Message } from './models/MessageModel';

export function AccountDashboard() {
  const { 
    getMainAccountSummary, 
    getBrinaAccountSummary, 
    calculateMainAccountFinals,
    calculateBrinaAccountFinals,
    selectedDate,
    setSelectedDate,
    dailyBalance,
    setDailyBalance,
    previousDayBalance,
    getMessagesByDate,
    deleteMessage,
    addDailyBalanceRecord,
    messages,
  } = useGazaTelecom();
  
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [filterType, setFilterType] = useState<'today' | 'yesterday' | 'custom'>('today');
  const [isAddingBalance, setIsAddingBalance] = useState(false);
  const [newBalanceAmount, setNewBalanceAmount] = useState<string>('');
  const [viewingMessage, setViewingMessage] = useState<Message | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddMessageOpen, setIsAddMessageOpen] = useState(false);
  const [accountFilter, setAccountFilter] = useState<'all' | 'main' | 'brina'>('all');
  const [messageTypeFilter, setMessageTypeFilter] = useState<'all' | 'incoming' | 'outgoing'>('all');

  // تحديث المعلومات عند تغيير التاريخ
  useEffect(() => {
    if (date) {
      const dateString = date.toISOString().split('T')[0];
      setSelectedDate(dateString);
    }
  }, [date, setSelectedDate]);

  // تعيين التاريخ بناءً على نوع الفلتر
  useEffect(() => {
    const today = new Date();
    if (filterType === 'today') {
      setDate(today);
    } else if (filterType === 'yesterday') {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      setDate(yesterday);
    }
    // لا نفعل شيئاً في حالة 'custom' لأن المستخدم سيختار التاريخ بنفسه
  }, [filterType]);

  // الحصول على ملخص الحساب الرئيسي وحساب برينة
  const mainAccountSummary = getMainAccountSummary(selectedDate);
  const brinaAccountSummary = getBrinaAccountSummary(selectedDate);
  
  // حساب النهائيات
  const mainFinals = calculateMainAccountFinals(selectedDate);
  const brinaFinals = calculateBrinaAccountFinals(selectedDate);

  // الحصول على الرسائل للتاريخ المحدد
  const filteredMessages = getMessagesByDate(selectedDate).filter(message => {
    const matchesAccount = accountFilter === 'all' || message.accountType === accountFilter;
    const matchesType = messageTypeFilter === 'all' || message.messageType === messageTypeFilter;
    return matchesAccount && matchesType;
  });

  // تحديث الرصيد اليومي
  const handleUpdateBalance = () => {
    if (newBalanceAmount && !isNaN(Number(newBalanceAmount))) {
      const amount = Number(newBalanceAmount);
      addDailyBalanceRecord({ amount });
      setIsAddingBalance(false);
      setNewBalanceAmount('');
      toast({
        title: "تم تحديث الرصيد",
        description: `تم تحديث رصيد اليوم إلى ${amount} أوقية`,
      });
    } else {
      toast({
        title: "خطأ في الإدخال",
        description: "يرجى إدخال قيمة رقمية صحيحة",
        variant: "destructive",
      });
    }
  };

  // حذف رسالة
  const handleDeleteMessage = (messageId: string) => {
    deleteMessage(messageId);
    toast({
      title: "تم حذف الرسالة",
      description: "تم حذف الرسالة بنجاح",
    });
  };

  // عرض تفاصيل الرسالة
  const handleViewMessage = (message: Message) => {
    setViewingMessage(message);
    setIsDialogOpen(true);
  };

  // تحديث عرض التاريخ في الواجهة
  const displayDate = date 
    ? format(date, 'PPP', { locale: ar })
    : format(new Date(), 'PPP', { locale: ar });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Select value={filterType} onValueChange={(value) => setFilterType(value as any)}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="اختر التاريخ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">اليوم</SelectItem>
              <SelectItem value="yesterday">الأمس</SelectItem>
              <SelectItem value="custom">تاريخ محدد</SelectItem>
            </SelectContent>
          </Select>
          
          {filterType === 'custom' && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  {displayDate}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  locale={ar}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          )}
          
          {filterType !== 'custom' && (
            <div className="px-3 py-2 rounded-md bg-muted text-sm font-medium">
              {displayDate}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setIsAddingBalance(true)} 
            variant="outline" 
            className="gap-2"
          >
            <Wallet className="h-4 w-4" />
            تحديث الرصيد
          </Button>
          
          <Button 
            onClick={() => setIsAddMessageOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            إضافة رسالة
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* بطاقة الحساب الرئيسي */}
        <Card>
          <CardHeader>
            <CardTitle>الحساب الرئيسي</CardTitle>
            <CardDescription>
              ملخص الحركات المالية للحساب الرئيسي
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">الوارد</div>
                  <div className="text-2xl font-bold">{mainAccountSummary.incomingTotal.toLocaleString()} أوقية</div>
                  <div className="text-sm text-muted-foreground">
                    عدد العمليات: {mainAccountSummary.incomingCount}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    إجمالي الفائدة: {mainAccountSummary.incomingInterestTotal.toLocaleString()} أوقية
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">الصادر</div>
                  <div className="text-2xl font-bold">{mainAccountSummary.outgoingTotal.toLocaleString()} أوقية</div>
                  <div className="text-sm text-muted-foreground">
                    عدد العمليات: {mainAccountSummary.outgoingCount}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    إجمالي الفائدة: {mainAccountSummary.outgoingInterestTotal.toLocaleString()} أوقية
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">النهائي 1</div>
                    <div className="text-lg font-semibold">{mainFinals.final1.toLocaleString()} أوقية</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">النهائي 2</div>
                    <div className="text-lg font-semibold">{mainFinals.final2.toLocaleString()} أوقية</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">إجمالي الفائدة</div>
                    <div className="text-lg font-semibold">{mainFinals.totalInterest.toLocaleString()} أوقية</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* بطاقة حساب برينة */}
        <Card>
          <CardHeader>
            <CardTitle>حساب برينة</CardTitle>
            <CardDescription>
              ملخص الحركات المالية لحساب برينة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">الوارد</div>
                  <div className="text-2xl font-bold">{brinaAccountSummary.incomingTotal.toLocaleString()} أوقية</div>
                  <div className="text-sm text-muted-foreground">
                    عدد العمليات: {brinaAccountSummary.incomingCount}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    إجمالي الفائدة: {brinaAccountSummary.incomingInterestTotal.toLocaleString()} أوقية
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">الصادر</div>
                  <div className="text-2xl font-bold">{brinaAccountSummary.outgoingTotal.toLocaleString()} أوقية</div>
                  <div className="text-sm text-muted-foreground">
                    عدد العمليات: {brinaAccountSummary.outgoingCount}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    إجمالي الفائدة: {brinaAccountSummary.outgoingInterestTotal.toLocaleString()} أوقية
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">الرصيد السابق</div>
                    <div className="text-lg font-semibold">{previousDayBalance.toLocaleString()} أوقية</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">الرصيد الحالي</div>
                    <div className="text-lg font-semibold">{dailyBalance.toLocaleString()} أوقية</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">الفرق</div>
                    <div className={`text-lg font-semibold ${brinaFinals.balanceDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {brinaFinals.balanceDifference.toLocaleString()} أوقية
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* قسم سجل الرسائل */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            سجل الرسائل
          </CardTitle>
          <CardDescription>
            عرض الرسائل الصادرة والواردة للتاريخ المحدد
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mb-4">
            <Select
              value={accountFilter}
              onValueChange={(value) => setAccountFilter(value as any)}
            >
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="الحساب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحسابات</SelectItem>
                <SelectItem value="main">الحساب الرئيسي</SelectItem>
                <SelectItem value="brina">حساب برينة</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={messageTypeFilter}
              onValueChange={(value) => setMessageTypeFilter(value as any)}
            >
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="نوع الرسالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="outgoing">صادر</SelectItem>
                <SelectItem value="incoming">وارد</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableCaption>
                {filteredMessages.length 
                  ? `إجمالي عدد الرسائل: ${filteredMessages.length}` 
                  : "لا توجد رسائل في هذا التاريخ"}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>الوقت</TableHead>
                  <TableHead>الحساب</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>الرقم التسلسلي</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>الفائدة</TableHead>
                  <TableHead>ملاحظات</TableHead>
                  <TableHead className="text-center">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.length > 0 ? (
                  filteredMessages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell className="font-medium">
                        {format(new Date(message.timestamp), 'HH:mm')}
                      </TableCell>
                      <TableCell>
                        {message.accountType === 'main' ? 'الحساب الرئيسي' : 'حساب برينة'}
                      </TableCell>
                      <TableCell>
                        {message.messageType === 'outgoing' ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            <ArrowUpToLine className="h-3 w-3 mr-1" />
                            صادر
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                            <ArrowDownToLine className="h-3 w-3 mr-1" />
                            وارد
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{message.serialNumber}</TableCell>
                      <TableCell>{message.amount.toLocaleString()} أوقية</TableCell>
                      <TableCell>{message.interest.toLocaleString()} أوقية</TableCell>
                      <TableCell className="max-w-[150px] truncate">
                        {message.note || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleViewMessage(message)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>هل أنت متأكد من حذف هذه الرسالة؟</AlertDialogTitle>
                                <AlertDialogDescription>
                                  هذا الإجراء لا يمكن التراجع عنه، وسيتم حذف الرسالة نهائياً من النظام.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteMessage(message.id)} className="bg-red-500 hover:bg-red-600">
                                  حذف
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6">
                      لا توجد رسائل لعرضها في هذا التاريخ
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* نافذة إضافة الرصيد اليومي */}
      <Dialog open={isAddingBalance} onOpenChange={setIsAddingBalance}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تحديث الرصيد اليومي</DialogTitle>
            <DialogDescription>
              أدخل رصيد اليوم الحالي لتحديثه في النظام.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="balance">الرصيد</Label>
              <Input
                id="balance"
                type="number"
                placeholder="أدخل الرصيد الحالي"
                value={newBalanceAmount}
                onChange={(e) => setNewBalanceAmount(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsAddingBalance(false)}>
              إلغاء
            </Button>
            <Button onClick={handleUpdateBalance}>
              تحديث الرصيد
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* نافذة عرض تفاصيل الرسالة */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تفاصيل الرسالة</DialogTitle>
            <DialogDescription>
              عرض تفاصيل كاملة للرسالة المحددة
            </DialogDescription>
          </DialogHeader>
          {viewingMessage && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">الحساب</Label>
                  <p className="font-medium mt-1">
                    {viewingMessage.accountType === 'main' ? 'الحساب الرئيسي' : 'حساب برينة'}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">النوع</Label>
                  <p className="font-medium mt-1">
                    {viewingMessage.messageType === 'outgoing' ? 'صادر' : 'وارد'}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">الرقم التسلسلي</Label>
                  <p className="font-medium mt-1">{viewingMessage.serialNumber}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">التاريخ والوقت</Label>
                  <p className="font-medium mt-1">
                    {format(new Date(viewingMessage.timestamp), 'yyyy/MM/dd HH:mm:ss')}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">المبلغ</Label>
                  <p className="font-medium mt-1">{viewingMessage.amount.toLocaleString()} أوقية</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">الفائدة</Label>
                  <p className="font-medium mt-1">{viewingMessage.interest.toLocaleString()} أوقية</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">ملاحظات</Label>
                  <p className="font-medium mt-1">{viewingMessage.note || 'لا توجد ملاحظات'}</p>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              إغلاق
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* نافذة إضافة رسالة جديدة */}
      <Dialog open={isAddMessageOpen} onOpenChange={setIsAddMessageOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>إضافة رسالة جديدة</DialogTitle>
            <DialogDescription>
              أدخل تفاصيل الرسالة الجديدة التي تريد إضافتها
            </DialogDescription>
          </DialogHeader>
          <MessageForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}

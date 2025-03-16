
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowUpToLine, 
  ArrowDownToLine, 
  CalendarDays, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  Edit,
  Trash2,
  Eye,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGazaTelecom } from './GazaTelecomContext';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { format } from 'date-fns';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { MessageDialog } from './MessageDialog';
import { Message, AccountType } from './models/MessageModel';
import { isSameDay, formatDate, getPreviousDay } from './utils/ChartUtils';

export function AccountDashboard() {
  const { toast } = useToast();
  const { 
    messages, 
    getMainAccountSummary, 
    getBrinaAccountSummary, 
    calculateMainAccountFinals,
    calculateBrinaAccountFinals,
    dailyBalanceHistory,
    getMessagesByDate,
    selectedDate,
    setSelectedDate,
    addMessage,
    updateMessage,
    deleteMessage,
    getBalanceForDate,
    addDailyBalanceRecord
  } = useGazaTelecom();
  
  const [dateFilter, setDateFilter] = useState<'today' | 'yesterday' | 'custom'>('today');
  const [displayDate, setDisplayDate] = useState(new Date());
  const [selectedAccount, setSelectedAccount] = useState<AccountType>('main');
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  
  // الحصول على الرصيد الحالي للتاريخ المحدد
  const currentBalance = getBalanceForDate(selectedDate);
  const [dailyBalanceInput, setDailyBalanceInput] = useState(currentBalance.toString());

  // الحصول على رصيد اليوم السابق للتاريخ المحدد
  const previousDate = getPreviousDay(selectedDate);
  const previousDayBalance = getBalanceForDate(previousDate);
  
  // تحديث التاريخ المحدد بناءً على عامل التصفية
  useEffect(() => {
    let date = new Date();
    
    if (dateFilter === 'yesterday') {
      date = new Date();
      date.setDate(date.getDate() - 1);
    } else if (dateFilter === 'today') {
      date = new Date();
    }
    
    setDisplayDate(date);
    setSelectedDate(date.toISOString().split('T')[0]);
  }, [dateFilter, setSelectedDate]);
  
  // تحديث مدخل الرصيد اليومي عندما يتغير التاريخ المحدد
  useEffect(() => {
    const balance = getBalanceForDate(selectedDate);
    setDailyBalanceInput(balance.toString());
  }, [selectedDate, getBalanceForDate]);
  
  // الانتقال إلى اليوم السابق
  const goToPreviousDay = () => {
    const prevDay = new Date(displayDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setDisplayDate(prevDay);
    setSelectedDate(prevDay.toISOString().split('T')[0]);
    setDateFilter('custom');
  };
  
  // الانتقال إلى اليوم التالي
  const goToNextDay = () => {
    const nextDay = new Date(displayDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setDisplayDate(nextDay);
    setSelectedDate(nextDay.toISOString().split('T')[0]);
    setDateFilter('custom');
  };
  
  // حفظ الرصيد اليومي
  const saveDailyBalance = () => {
    const balance = Number(dailyBalanceInput);
    if (isNaN(balance)) {
      toast({
        title: "خطأ في الإدخال",
        description: "الرجاء إدخال رقم صحيح للرصيد اليومي",
        variant: "destructive",
      });
      return;
    }
    
    addDailyBalanceRecord({
      amount: balance,
      date: selectedDate
    });
    
    toast({
      title: "تم الحفظ",
      description: `تم حفظ الرصيد اليومي لتاريخ ${formatDate(selectedDate)} بنجاح`,
    });
  };
  
  // الحصول على الرسائل المصفاة للتاريخ والحساب الحاليين
  const filteredMessages = getMessagesByDate(selectedDate, selectedAccount);
  
  // حساب ملخصات الحساب بناءً على التاريخ المحدد
  const mainSummary = getMainAccountSummary(selectedDate);
  const brinaSummary = getBrinaAccountSummary(selectedDate);
  
  // حساب النهائيات بناءً على التاريخ المحدد
  const mainFinals = calculateMainAccountFinals(selectedDate);
  const brinaFinals = calculateBrinaAccountFinals(selectedDate);
  
  // التعامل مع حذف الرسالة
  const handleDeleteMessage = (messageId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
      deleteMessage(messageId);
      toast({
        title: "تم الحذف",
        description: "تم حذف الرسالة بنجاح",
      });
    }
  };
  
  // التعامل مع تعديل الرسالة
  const handleEditMessage = (message: Message) => {
    setEditingMessage(message);
    setIsMessageDialogOpen(true);
  };
  
  // التعامل مع إضافة رسالة جديدة
  const handleAddMessage = () => {
    setEditingMessage(null);
    setIsMessageDialogOpen(true);
  };
  
  // التعامل مع حفظ الرسالة من مربع الحوار
  const handleSaveMessage = (messageData: Partial<Message>) => {
    if (editingMessage) {
      // تحديث الرسالة الموجودة
      updateMessage({
        ...editingMessage,
        ...messageData
      } as Message);
      toast({
        title: "تم التعديل",
        description: "تم تعديل الرسالة بنجاح",
      });
    } else {
      // إضافة رسالة جديدة
      addMessage({
        accountType: selectedAccount,
        messageType: messageData.messageType!,
        serialNumber: messageData.serialNumber!,
        amount: messageData.amount!,
        interest: messageData.interest!,
        note: messageData.note,
        customDate: selectedDate // استخدام التاريخ المحدد عند إضافة رسالة جديدة
      });
      toast({
        title: "تمت الإضافة",
        description: "تم إضافة الرسالة بنجاح",
      });
    }
    setIsMessageDialogOpen(false);
  };
  
  // تحديث الرصيد اليومي تلقائيًا بناءً على القيم المتوقعة
  const updateDailyBalanceToExpected = () => {
    if (selectedAccount === 'brina') {
      const expectedBalance = brinaFinals.expectedBalance;
      setDailyBalanceInput(expectedBalance.toString());
      
      // حفظ القيمة تلقائيًا
      addDailyBalanceRecord({
        amount: expectedBalance,
        date: selectedDate
      });
      
      toast({
        title: "تم التحديث",
        description: `تم تحديث الرصيد اليومي لتاريخ ${formatDate(selectedDate)} إلى القيمة المتوقعة`,
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-wrap">
        <Tabs 
          value={selectedAccount} 
          onValueChange={(value) => setSelectedAccount(value as AccountType)}
          className="w-full md:w-auto"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="main">الحساب الرئيسي</TabsTrigger>
            <TabsTrigger value="brina">حساب برينة</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex flex-wrap gap-2 items-center">
          <Select value={dateFilter} onValueChange={(value) => setDateFilter(value as any)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="اختر التاريخ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">اليوم</SelectItem>
              <SelectItem value="yesterday">الأمس</SelectItem>
              <SelectItem value="custom">تاريخ محدد</SelectItem>
            </SelectContent>
          </Select>
          
          {dateFilter === 'custom' && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Calendar className="h-4 w-4" />
                  {format(displayDate, 'yyyy/MM/dd')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  mode="single"
                  selected={displayDate}
                  onSelect={(date) => {
                    if (date) {
                      setDisplayDate(date);
                      setSelectedDate(date.toISOString().split('T')[0]);
                    }
                  }}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          )}
          
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={goToPreviousDay}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToNextDay}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <ArrowUpToLine className="h-5 w-5 text-green-600 dark:text-green-400 ml-2" />
              الرسائل الصادرة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <div className="text-sm text-muted-foreground">المبلغ الإجمالي</div>
                <div className="text-2xl font-bold">
                  {selectedAccount === 'main' 
                    ? mainSummary.outgoingTotal.toLocaleString() 
                    : brinaSummary.outgoingTotal.toLocaleString()} أوقية
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">الفوائد</div>
                <div className="text-lg">
                  {selectedAccount === 'main' 
                    ? mainSummary.outgoingInterestTotal.toLocaleString() 
                    : brinaSummary.outgoingInterestTotal.toLocaleString()} أوقية
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">العدد</div>
                <div className="text-lg">
                  {selectedAccount === 'main' 
                    ? mainSummary.outgoingCount 
                    : brinaSummary.outgoingCount}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <ArrowDownToLine className="h-5 w-5 text-red-600 dark:text-red-400 ml-2" />
              الرسائل الواردة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <div className="text-sm text-muted-foreground">المبلغ الإجمالي</div>
                <div className="text-2xl font-bold">
                  {selectedAccount === 'main' 
                    ? mainSummary.incomingTotal.toLocaleString() 
                    : brinaSummary.incomingTotal.toLocaleString()} أوقية
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">الفوائد</div>
                <div className="text-lg">
                  {selectedAccount === 'main' 
                    ? mainSummary.incomingInterestTotal.toLocaleString() 
                    : brinaSummary.incomingInterestTotal.toLocaleString()} أوقية
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">العدد</div>
                <div className="text-lg">
                  {selectedAccount === 'main' 
                    ? mainSummary.incomingCount 
                    : brinaSummary.incomingCount}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {selectedAccount === 'main' ? (
          <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">الحسابات النهائية</CardTitle>
              <CardDescription>
                {formatDate(selectedDate)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">النهائي 1:</span>
                  <span className="font-bold">{mainFinals.final1.toLocaleString()} أوقية</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">النهائي 2:</span>
                  <span className="font-bold">{mainFinals.final2.toLocaleString()} أوقية</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الفوائد:</span>
                  <span className="font-bold">{mainFinals.totalInterest.toLocaleString()} أوقية</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">الحساب النهائي</CardTitle>
              <CardDescription>
                {formatDate(selectedDate)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="text-sm text-muted-foreground ml-2">الرصيد اليومي:</div>
                  <div className="flex-1">
                    <Input
                      value={dailyBalanceInput}
                      onChange={(e) => setDailyBalanceInput(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button size="sm" className="mr-2" onClick={saveDailyBalance}>
                    حفظ
                  </Button>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">رصيد الأمس:</span>
                  <span className="font-bold">{previousDayBalance.toLocaleString()} أوقية</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الحساب المتوقع:</span>
                  <span className="font-bold">{brinaFinals.expectedBalance.toLocaleString()} أوقية</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">فرق الحساب:</span>
                  <span className={`font-bold ${brinaFinals.balanceDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {brinaFinals.balanceDifference.toLocaleString()} أوقية
                  </span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-2" 
                  onClick={updateDailyBalanceToExpected}
                >
                  استخدام الرصيد المتوقع
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">سجل الرسائل - {selectedAccount === 'main' ? 'الحساب الرئيسي' : 'حساب برينة'}</CardTitle>
          <Button size="sm" onClick={handleAddMessage}>
            <Plus className="h-4 w-4 ml-2" />
            إضافة رسالة
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-auto">
            <Table>
              <TableCaption>
                تاريخ {formatDate(selectedDate)} - {filteredMessages.length > 0 
                  ? `عدد الرسائل: ${filteredMessages.length}` 
                  : 'لا توجد رسائل لهذا اليوم'}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>الوقت</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>الرقم التسلسلي</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>الفائدة</TableHead>
                  <TableHead>ملاحظات</TableHead>
                  <TableHead>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.length > 0 ? (
                  filteredMessages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell>
                        {format(new Date(message.timestamp), 'HH:mm')}
                      </TableCell>
                      <TableCell>
                        {message.messageType === 'outgoing' ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            <ArrowUpToLine className="h-3 w-3 ml-1" />
                            صادر
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                            <ArrowDownToLine className="h-3 w-3 ml-1" />
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
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEditMessage(message)}
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteMessage(message.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      لا توجد رسائل لهذا اليوم
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <MessageDialog 
        open={isMessageDialogOpen} 
        onOpenChange={setIsMessageDialogOpen}
        onSave={handleSaveMessage}
        message={editingMessage}
        accountType={selectedAccount}
        selectedDate={selectedDate}
      />
    </div>
  );
}

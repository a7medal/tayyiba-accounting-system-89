
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpToLine, 
  ArrowDownToLine, 
  Calculator, 
  Calendar, 
  Edit, 
  Trash, 
  Eye, 
  Plus,
  FileText,
  CalendarDays
} from 'lucide-react';
import { useGazaTelecom } from './GazaTelecomContext';
import { format, subDays } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MessageForm } from './MessageForm';
import { Message } from './models/MessageModel';

export function AccountDashboard() {
  const [activeTab, setActiveTab] = useState<'main' | 'brina'>('main');
  const [dailyBalanceInput, setDailyBalanceInput] = useState('');
  const [previousBalanceInput, setPreviousBalanceInput] = useState('');
  const [dateFilter, setDateFilter] = useState<'today' | 'yesterday' | 'custom'>('today');
  const [isAddMessageDialogOpen, setIsAddMessageDialogOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [viewingMessage, setViewingMessage] = useState<Message | null>(null);
  const { toast } = useToast();
  
  const { 
    getMainAccountSummary, 
    getBrinaAccountSummary, 
    calculateMainAccountFinals,
    calculateBrinaAccountFinals,
    dailyBalance,
    setDailyBalance,
    previousDayBalance,
    setPreviousDayBalance,
    getMessagesByDate,
    updateMessage,
    deleteMessage,
    selectedDate,
    setSelectedDate
  } = useGazaTelecom();

  // Update selected date when date filter changes
  useEffect(() => {
    const today = new Date();
    
    if (dateFilter === 'today') {
      setSelectedDate(format(today, 'yyyy-MM-dd'));
    } else if (dateFilter === 'yesterday') {
      setSelectedDate(format(subDays(today, 1), 'yyyy-MM-dd'));
    }
  }, [dateFilter, setSelectedDate]);
  
  const mainAccountSummary = getMainAccountSummary(selectedDate);
  const brinaAccountSummary = getBrinaAccountSummary(selectedDate);
  const mainAccountFinals = calculateMainAccountFinals(selectedDate);
  const brinaAccountFinals = calculateBrinaAccountFinals(selectedDate);
  
  const handleDailyBalanceUpdate = () => {
    setDailyBalance(Number(dailyBalanceInput));
    toast({
      title: "تم تحديث الرصيد",
      description: `تم تحديث رصيد اليوم إلى ${dailyBalanceInput} أوقية`,
    });
  };
  
  const handlePreviousBalanceUpdate = () => {
    setPreviousDayBalance(Number(previousBalanceInput));
    toast({
      title: "تم تحديث الرصيد",
      description: `تم تحديث رصيد الأمس إلى ${previousBalanceInput} أوقية`,
    });
  };
  
  const handleEditMessage = (message: Message) => {
    setEditingMessage({...message});
  };
  
  const handleViewMessage = (message: Message) => {
    setViewingMessage({...message});
  };
  
  const handleDeleteMessage = (messageId: string) => {
    deleteMessage(messageId);
    toast({
      title: "تم حذف الرسالة",
      description: "تم حذف الرسالة بنجاح",
    });
  };
  
  const handleUpdateMessage = (updatedMessage: Message) => {
    updateMessage(updatedMessage);
    setEditingMessage(null);
    toast({
      title: "تم تحديث الرسالة",
      description: "تم تحديث بيانات الرسالة بنجاح",
    });
  };
  
  const mainMessages = getMessagesByDate(selectedDate, 'main');
  const brinaMessages = getMessagesByDate(selectedDate, 'brina');
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <Tabs defaultValue="main" value={activeTab} onValueChange={(value) => setActiveTab(value as 'main' | 'brina')} className="w-full max-w-md">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="main">الحساب الرئيسي</TabsTrigger>
            <TabsTrigger value="brina">حساب برينة</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2">
          <Button 
            variant={dateFilter === 'today' ? 'default' : 'outline'} 
            className="gap-1"
            onClick={() => setDateFilter('today')}
          >
            <Calendar className="h-4 w-4" />
            اليوم
          </Button>
          <Button 
            variant={dateFilter === 'yesterday' ? 'default' : 'outline'} 
            className="gap-1"
            onClick={() => setDateFilter('yesterday')}
          >
            <CalendarDays className="h-4 w-4" />
            الأمس
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant={dateFilter === 'custom' ? 'default' : 'outline'} 
                className="gap-1"
              >
                <Calendar className="h-4 w-4" />
                تاريخ محدد
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="single"
                selected={new Date(selectedDate)}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(format(date, 'yyyy-MM-dd'));
                    setDateFilter('custom');
                  }
                }}
                locale={ar}
              />
            </PopoverContent>
          </Popover>
          
          <Dialog open={isAddMessageDialogOpen} onOpenChange={setIsAddMessageDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1">
                <Plus className="h-4 w-4" />
                إضافة رسالة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>إضافة رسالة جديدة</DialogTitle>
                <DialogDescription>
                  قم بتعبئة بيانات الرسالة الجديدة
                </DialogDescription>
              </DialogHeader>
              <MessageForm 
                initialAccountType={activeTab} 
                onSuccess={() => {
                  setIsAddMessageDialogOpen(false);
                  toast({
                    title: "تمت الإضافة",
                    description: "تمت إضافة الرسالة بنجاح",
                  });
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <TabsContent value="main" className="mt-0 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* بطاقة الرسائل الصادرة */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <ArrowUpToLine className="mr-2 h-5 w-5 text-green-500" />
                الرسائل الصادرة
              </CardTitle>
              <CardDescription>إجمالي الرسائل الصادرة من الحساب الرئيسي</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">المجموع:</span>
                  <span className="text-xl font-bold">{mainAccountSummary.outgoingTotal.toLocaleString()} أوقية</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">الفوائد:</span>
                  <span className="text-lg">{mainAccountSummary.outgoingInterestTotal.toLocaleString()} أوقية</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">العدد:</span>
                  <span>{mainAccountSummary.outgoingCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* بطاقة الرسائل الواردة */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <ArrowDownToLine className="mr-2 h-5 w-5 text-red-500" />
                الرسائل الواردة
              </CardTitle>
              <CardDescription>إجمالي الرسائل الواردة إلى الحساب الرئيسي</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">المجموع:</span>
                  <span className="text-xl font-bold">{mainAccountSummary.incomingTotal.toLocaleString()} أوقية</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">الفوائد:</span>
                  <span className="text-lg">{mainAccountSummary.incomingInterestTotal.toLocaleString()} أوقية</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">العدد:</span>
                  <span>{mainAccountSummary.incomingCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* بطاقة الحسابات النهائية */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Calculator className="mr-2 h-5 w-5 text-blue-500" />
                الحسابات النهائية
              </CardTitle>
              <CardDescription>الحسابات الختامية للحساب الرئيسي</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">النهائي 1:</span>
                  <span className="text-xl font-bold">{mainAccountFinals.final1.toLocaleString()} أوقية</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">النهائي 2:</span>
                  <span className="text-lg">{mainAccountFinals.final2.toLocaleString()} أوقية</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">الفوائد:</span>
                  <span>{mainAccountFinals.totalInterest.toLocaleString()} أوقية</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>ملخص الحساب الرئيسي</CardTitle>
            <CardDescription>
              {dateFilter === 'today' ? 'اليوم: ' : dateFilter === 'yesterday' ? 'الأمس: ' : 'التاريخ: '}
              {format(new Date(selectedDate), 'yyyy/MM/dd')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>حالة الحساب:</strong> الصادر ({mainAccountSummary.outgoingTotal.toLocaleString()} أوقية) - الوارد ({mainAccountSummary.incomingTotal.toLocaleString()} أوقية) = النهائي ({mainAccountFinals.final1.toLocaleString()} أوقية)
              </p>
              <p>
                <strong>إجمالي الفوائد:</strong> {mainAccountFinals.totalInterest.toLocaleString()} أوقية (صادر: {mainAccountSummary.outgoingInterestTotal.toLocaleString()} + وارد: {mainAccountSummary.incomingInterestTotal.toLocaleString()})
              </p>
              <p>
                <strong>عدد الرسائل:</strong> {mainAccountSummary.outgoingCount + mainAccountSummary.incomingCount} (صادر: {mainAccountSummary.outgoingCount} + وارد: {mainAccountSummary.incomingCount})
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                سجل رسائل الحساب الرئيسي
              </CardTitle>
              <CardDescription>
                {format(new Date(selectedDate), 'yyyy/MM/dd')}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableCaption>
                  {mainMessages.length 
                    ? `إجمالي عدد الرسائل: ${mainMessages.length}` 
                    : "لا توجد رسائل لهذا اليوم"}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>الوقت</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>الرقم التسلسلي</TableHead>
                    <TableHead>المبلغ</TableHead>
                    <TableHead>الفائدة</TableHead>
                    <TableHead>ملاحظات</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mainMessages.length > 0 ? (
                    mainMessages.map((message) => (
                      <TableRow key={message.id}>
                        <TableCell>
                          {format(new Date(message.timestamp), 'HH:mm')}
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
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewMessage(message)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditMessage(message)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                  <DialogTitle>تعديل الرسالة</DialogTitle>
                                  <DialogDescription>
                                    قم بتعديل بيانات الرسالة
                                  </DialogDescription>
                                </DialogHeader>
                                {editingMessage && (
                                  <MessageForm 
                                    initialAccountType={editingMessage.accountType} 
                                    initialMessageType={editingMessage.messageType}
                                    initialValues={editingMessage}
                                    isEdit={true}
                                    onSuccess={(message) => {
                                      handleUpdateMessage(message as Message);
                                    }}
                                  />
                                )}
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    هل أنت متأكد من رغبتك في حذف هذه الرسالة؟ لا يمكن التراجع عن هذا الإجراء.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteMessage(message.id)}>
                                    تأكيد الحذف
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
                      <TableCell colSpan={7} className="h-24 text-center">
                        لا توجد رسائل لهذا اليوم
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="brina" className="mt-0 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* بطاقة الرسائل الصادرة */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <ArrowUpToLine className="mr-2 h-5 w-5 text-green-500" />
                الرسائل الصادرة
              </CardTitle>
              <CardDescription>إجمالي الرسائل الصادرة من حساب برينة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">المجموع:</span>
                  <span className="text-xl font-bold">{brinaAccountSummary.outgoingTotal.toLocaleString()} أوقية</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">الفوائد:</span>
                  <span className="text-lg">{brinaAccountSummary.outgoingInterestTotal.toLocaleString()} أوقية</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">العدد:</span>
                  <span>{brinaAccountSummary.outgoingCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* بطاقة الرسائل الواردة */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <ArrowDownToLine className="mr-2 h-5 w-5 text-red-500" />
                الرسائل الواردة
              </CardTitle>
              <CardDescription>إجمالي الرسائل الواردة إلى حساب برينة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">المجموع:</span>
                  <span className="text-xl font-bold">{brinaAccountSummary.incomingTotal.toLocaleString()} أوقية</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">الفوائد:</span>
                  <span className="text-lg">{brinaAccountSummary.incomingInterestTotal.toLocaleString()} أوقية</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">العدد:</span>
                  <span>{brinaAccountSummary.incomingCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* بطاقة الحساب النهائي */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Calculator className="mr-2 h-5 w-5 text-blue-500" />
                الحساب النهائي
              </CardTitle>
              <CardDescription>الحساب الختامي لحساب برينة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-muted-foreground">رصيد اليوم:</span>
                    <Input
                      type="number"
                      value={dailyBalanceInput}
                      onChange={(e) => setDailyBalanceInput(e.target.value)}
                      placeholder="أدخل رصيد اليوم"
                      className="w-32 h-8 text-left"
                    />
                    <Button size="sm" onClick={handleDailyBalanceUpdate}>تحديث</Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    القيمة الحالية: {dailyBalance.toLocaleString()} أوقية
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-muted-foreground">رصيد الأمس:</span>
                    <Input
                      type="number"
                      value={previousBalanceInput}
                      onChange={(e) => setPreviousBalanceInput(e.target.value)}
                      placeholder="أدخل رصيد الأمس"
                      className="w-32 h-8 text-left"
                    />
                    <Button size="sm" onClick={handlePreviousBalanceUpdate}>تحديث</Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    القيمة الحالية: {previousDayBalance.toLocaleString()} أوقية
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span>الحساب المتوقع:</span>
                    <span className="font-bold">{brinaAccountFinals.expectedBalance.toLocaleString()} أوقية</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>فرق الحساب:</span>
                    <span className={`font-bold ${brinaAccountFinals.balanceDifference < 0 ? 'text-red-500' : brinaAccountFinals.balanceDifference > 0 ? 'text-green-500' : ''}`}>
                      {brinaAccountFinals.balanceDifference.toLocaleString()} أوقية
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>ملخص حساب برينة</CardTitle>
            <CardDescription>
              {dateFilter === 'today' ? 'اليوم: ' : dateFilter === 'yesterday' ? 'الأمس: ' : 'التاريخ: '}
              {format(new Date(selectedDate), 'yyyy/MM/dd')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>الصادر:</strong> {brinaAccountSummary.outgoingTotal.toLocaleString()} أوقية (عدد الرسائل: {brinaAccountSummary.outgoingCount})
              </p>
              <p>
                <strong>الوارد:</strong> {brinaAccountSummary.incomingTotal.toLocaleString()} أوقية (عدد الرسائل: {brinaAccountSummary.incomingCount})
              </p>
              <p>
                <strong>رصيد الأمس:</strong> {previousDayBalance.toLocaleString()} أوقية
              </p>
              <p>
                <strong>الحساب المتوقع:</strong> {brinaAccountFinals.expectedBalance.toLocaleString()} أوقية
              </p>
              <p>
                <strong>رصيد اليوم الفعلي:</strong> {dailyBalance.toLocaleString()} أوقية
              </p>
              <p>
                <strong>فرق الحساب:</strong> <span className={brinaAccountFinals.balanceDifference < 0 ? 'text-red-500' : brinaAccountFinals.balanceDifference > 0 ? 'text-green-500' : ''}>
                  {brinaAccountFinals.balanceDifference.toLocaleString()} أوقية
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                سجل رسائل حساب برينة
              </CardTitle>
              <CardDescription>
                {format(new Date(selectedDate), 'yyyy/MM/dd')}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableCaption>
                  {brinaMessages.length 
                    ? `إجمالي عدد الرسائل: ${brinaMessages.length}` 
                    : "لا توجد رسائل لهذا اليوم"}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>الوقت</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>الرقم التسلسلي</TableHead>
                    <TableHead>المبلغ</TableHead>
                    <TableHead>الفائدة</TableHead>
                    <TableHead>ملاحظات</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {brinaMessages.length > 0 ? (
                    brinaMessages.map((message) => (
                      <TableRow key={message.id}>
                        <TableCell>
                          {format(new Date(message.timestamp), 'HH:mm')}
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
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewMessage(message)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditMessage(message)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                  <DialogTitle>تعديل الرسالة</DialogTitle>
                                  <DialogDescription>
                                    قم بتعديل بيانات الرسالة
                                  </DialogDescription>
                                </DialogHeader>
                                {editingMessage && (
                                  <MessageForm 
                                    initialAccountType={editingMessage.accountType} 
                                    initialMessageType={editingMessage.messageType}
                                    initialValues={editingMessage}
                                    isEdit={true}
                                    onSuccess={(message) => {
                                      handleUpdateMessage(message as Message);
                                    }}
                                  />
                                )}
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    هل أنت متأكد من رغبتك في حذف هذه الرسالة؟ لا يمكن التراجع عن هذا الإجراء.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteMessage(message.id)}>
                                    تأكيد الحذف
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
                      <TableCell colSpan={7} className="h-24 text-center">
                        لا توجد رسائل لهذا اليوم
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Dialog for viewing message details */}
      <Dialog open={!!viewingMessage} onOpenChange={(open) => !open && setViewingMessage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تفاصيل الرسالة</DialogTitle>
            <DialogDescription>
              {viewingMessage && format(new Date(viewingMessage.timestamp), 'yyyy/MM/dd HH:mm')}
            </DialogDescription>
          </DialogHeader>
          
          {viewingMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">الحساب</h3>
                  <p>{viewingMessage.accountType === 'main' ? 'الحساب الرئيسي' : 'حساب برينة'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">النوع</h3>
                  <p>{viewingMessage.messageType === 'outgoing' ? 'صادر' : 'وارد'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">الرقم التسلسلي</h3>
                  <p>{viewingMessage.serialNumber}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">المبلغ</h3>
                  <p className="font-bold">{viewingMessage.amount.toLocaleString()} أوقية</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">الفائدة</h3>
                  <p>{viewingMessage.interest.toLocaleString()} أوقية</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">التاريخ والوقت</h3>
                  <p>{format(new Date(viewingMessage.timestamp), 'yyyy/MM/dd HH:mm:ss')}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">ملاحظات</h3>
                <p className="p-3 bg-muted rounded-md">{viewingMessage.note || 'لا توجد ملاحظات'}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setViewingMessage(null)}>إغلاق</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

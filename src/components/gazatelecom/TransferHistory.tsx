
import React, { useState } from 'react';
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ArrowUpToLine,
  ArrowDownToLine,
  Download,
  Calendar,
  FileText,
  FilterX,
  Wallet,
  Ban,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useGazaTelecom, AccountType, MessageType } from './GazaTelecomContext';
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
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { ar } from 'date-fns/locale';
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
import { useToast } from "@/components/ui/use-toast";

export function TransferHistory() {
  const { messages, updateMessage } = useGazaTelecom();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [accountFilter, setAccountFilter] = useState<AccountType | 'all'>('all');
  const [messageTypeFilter, setMessageTypeFilter] = useState<MessageType | 'all'>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [messageToRetract, setMessageToRetract] = useState<string | null>(null);
  const [showRetracted, setShowRetracted] = useState(true);
  
  // استخراج الرسائل المفلترة
  const filteredMessages = messages.filter(message => {
    // فلترة بالبحث
    if (
      searchTerm && 
      !message.serialNumber.includes(searchTerm) && 
      !message.note?.includes(searchTerm)
    ) {
      return false;
    }
    
    // فلترة بنوع الحساب
    if (accountFilter !== 'all' && message.accountType !== accountFilter) {
      return false;
    }
    
    // فلترة بنوع الرسالة
    if (messageTypeFilter !== 'all' && message.messageType !== messageTypeFilter) {
      return false;
    }
    
    // إخفاء الرسائل المسحوبة إذا تم اختيار ذلك
    if (!showRetracted && message.retracted) {
      return false;
    }
    
    // فلترة بالتاريخ
    if (dateRange?.from) {
      const messageDate = new Date(message.timestamp);
      const from = new Date(dateRange.from);
      from.setHours(0, 0, 0, 0);
      
      if (dateRange.to) {
        const to = new Date(dateRange.to);
        to.setHours(23, 59, 59, 999);
        return messageDate >= from && messageDate <= to;
      } else {
        // استخدام نفس اليوم إذا لم يتم تحديد تاريخ الانتهاء
        const fromEnd = new Date(dateRange.from);
        fromEnd.setHours(23, 59, 59, 999);
        return messageDate >= from && messageDate <= fromEnd;
      }
    }
    
    return true;
  });
  
  // ترتيب الرسائل بالتاريخ (الأحدث أولاً)
  const sortedMessages = [...filteredMessages].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // استخراج إجماليات للرسائل المفلترة
  const totals = sortedMessages.reduce((acc, message) => {
    // تخطي الرسائل المسحوبة عند حساب الإجماليات
    if (message.retracted) return acc;

    if (message.messageType === 'outgoing') {
      acc.outgoingAmount += message.amount;
      acc.outgoingInterest += message.interest;
      acc.outgoingCount += 1;
    } else {
      acc.incomingAmount += message.amount;
      acc.incomingInterest += message.interest;
      acc.incomingCount += 1;
    }
    return acc;
  }, {
    outgoingAmount: 0,
    outgoingInterest: 0,
    outgoingCount: 0,
    incomingAmount: 0,
    incomingInterest: 0,
    incomingCount: 0
  });
  
  // إعادة تعيين الفلاتر
  const resetFilters = () => {
    setSearchTerm('');
    setAccountFilter('all');
    setMessageTypeFilter('all');
    setDateRange(undefined);
    setShowRetracted(true);
  };
  
  // سحب رسالة
  const retractMessage = (messageId: string) => {
    setMessageToRetract(messageId);
  };
  
  // تأكيد سحب الرسالة
  const confirmRetractMessage = () => {
    if (!messageToRetract) return;
    
    const message = messages.find(m => m.id === messageToRetract);
    if (!message) return;
    
    // تحديث الرسالة مع معلومات السحب
    updateMessage({
      ...message,
      retracted: true,
      retractionDate: new Date().toISOString()
    });
    
    toast({
      title: "تم سحب الرسالة",
      description: `تم سحب الرسالة ${message.serialNumber} بنجاح`,
    });
    
    setMessageToRetract(null);
  };
  
  // إلغاء عملية سحب الرسالة
  const cancelRetractMessage = () => {
    setMessageToRetract(null);
  };
  
  const exportToCSV = () => {
  if (sortedMessages.length === 0) return; // التحقق من وجود رسائل للتحميل
  
  // تجهيز بيانات CSV
  const headers = ['التاريخ', 'الوقت', 'الحساب', 'النوع', 'الرقم التسلسلي', 'المبلغ', 'الفائدة', 'ملاحظات', 'حالة السحب', 'تاريخ السحب'];
  
  const csvData = sortedMessages.map(message => {
    const date = new Date(message.timestamp); // تحويل التاريخ إلى كائن تاريخ
    let retractionInfo = message.retracted ? 'تم سحبها' : 'فعالة';
    let retractionDate = message.retracted && message.retractionDate 
      ? `"${format(new Date(message.retractionDate), 'yyyy/MM/dd HH:mm')}"` 
      : '""';
      
    return [
      `"${format(date, 'yyyy/MM/dd')}"`, // تنسيق التاريخ مع اقتباس مزدوج
      `"${format(date, 'HH:mm:ss')}"`, // تنسيق الوقت مع اقتباس مزدوج
      `"${message.accountType === 'main' ? 'الحساب الرئيسي' : 'حساب برينة'}"`, // نوع الحساب مع اقتباس مزدوج
      `"${message.messageType === 'outgoing' ? 'صادر' : 'وارد'}"`, // نوع الرسالة مع اقتباس مزدوج
      `"${message.serialNumber}"`, // الرقم التسلسلي مع اقتباس مزدوج
      `"${message.amount.toString()}"`, // المبلغ مع اقتباس مزدوج
      `"${message.interest.toString()}"`, // الفائدة مع اقتباس مزدوج
      `"${message.note || ''}"`, // الملاحظات مع اقتباس مزدوج (في حالة كانت موجودة)
      `"${retractionInfo}"`, // حالة السحب
      retractionDate // تاريخ السحب
    ].join(','); // دمج البيانات بفواصل
  });
  
  const csv = [headers.join(','), ...csvData].join('\n'); // دمج العناوين مع البيانات

  // إنشاء ملف للتنزيل
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob); // إنشاء رابط لتحميل الملف
  const link = document.createElement('a'); // إنشاء عنصر رابط
  link.setAttribute('href', url);
  link.setAttribute('download', `تقرير_الرسائل_${format(new Date(), 'yyyy-MM-dd')}.csv`); // تحديد اسم الملف
  link.style.visibility = 'hidden'; // جعل الرابط غير مرئي
  document.body.appendChild(link);
  link.click(); // محاكاة النقر لتحميل الملف
  document.body.removeChild(link); // إزالة الرابط بعد التحميل
};
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          سجل الرسائل
        </CardTitle>
        <CardDescription>
          عرض وتصفية سجل جميع الرسائل الصادرة والواردة
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث في الرسائل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-9"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select
              value={accountFilter}
              onValueChange={(value) => setAccountFilter(value as AccountType | 'all')}
            >
              <SelectTrigger className="w-[140px]">
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
              onValueChange={(value) => setMessageTypeFilter(value as MessageType | 'all')}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="نوع الرسالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="outgoing">صادر</SelectItem>
                <SelectItem value="incoming">وارد</SelectItem>
              </SelectContent>
            </Select>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[160px] gap-2 flex justify-between items-center">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {dateRange?.from ? (
                      dateRange.to ? (
                        `${format(dateRange.from, 'P')} - ${format(dateRange.to, 'P')}`
                      ) : (
                        format(dateRange.from, 'P')
                      )
                    ) : (
                      'تاريخ البداية - النهاية'
                    )}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  locale={ar}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            
            <Button 
              variant={showRetracted ? "outline" : "secondary"} 
              onClick={() => setShowRetracted(!showRetracted)}
              className="gap-1"
            >
              <Ban className="h-4 w-4" />
              {showRetracted ? "إخفاء المسحوبة" : "إظهار المسحوبة"}
            </Button>
            
            <Button variant="ghost" onClick={resetFilters} className="gap-1">
              <FilterX className="h-4 w-4" />
              إعادة تعيين
            </Button>
            
            <Button variant="secondary" onClick={exportToCSV} className="gap-1">
              <Download className="h-4 w-4" />
              تصدير
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <ArrowUpToLine className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <h3 className="font-medium">الرسائل الصادرة</h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">المبلغ</div>
                  <div className="text-xl font-bold">{totals.outgoingAmount.toLocaleString()} أوقية</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">الفائدة</div>
                  <div className="text-lg">{totals.outgoingInterest.toLocaleString()} أوقية</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">العدد</div>
                  <div>{totals.outgoingCount}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <ArrowDownToLine className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                <h3 className="font-medium">الرسائل الواردة</h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">المبلغ</div>
                  <div className="text-xl font-bold">{totals.incomingAmount.toLocaleString()} أوقية</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">الفائدة</div>
                  <div className="text-lg">{totals.incomingInterest.toLocaleString()} أوقية</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">العدد</div>
                  <div>{totals.incomingCount}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableCaption>
              {sortedMessages.length 
                ? `إجمالي عدد الرسائل المعروضة: ${sortedMessages.length}` 
                : "لا توجد رسائل مطابقة للبحث"}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>التاريخ</TableHead>
                <TableHead>الحساب</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>الرقم التسلسلي</TableHead>
                <TableHead>المبلغ</TableHead>
                <TableHead>الفائدة</TableHead>
                <TableHead>ملاحظات</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedMessages.map((message) => (
                <TableRow key={message.id} className={message.retracted ? "opacity-70" : ""}>
                  <TableCell className="font-medium">
                    {format(new Date(message.timestamp), 'yyyy/MM/dd HH:mm')}
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
                    {message.retracted ? (
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="bg-gray-100 text-gray-800">
                          <Ban className="h-3 w-3 mr-1" />
                          مسحوبة
                        </Badge>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-2">
                            <p className="text-sm">
                              تم السحب في: {message.retractionDate ? format(new Date(message.retractionDate), 'yyyy/MM/dd HH:mm') : 'غير معروف'}
                            </p>
                          </PopoverContent>
                        </Popover>
                      </div>
                    ) : (
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        فعالة
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {message.messageType === 'incoming' && !message.retracted && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 h-7"
                        onClick={() => retractMessage(message.id)}
                      >
                        <Ban className="h-4 w-4 mr-1" />
                        سحب
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* مربع حوار تأكيد سحب الرسالة */}
      <AlertDialog open={!!messageToRetract} onOpenChange={(open) => !open && setMessageToRetract(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد سحب الرسالة</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من أنك تريد سحب هذه الرسالة؟ سيتم تسجيل هذا الإجراء مع التاريخ والوقت.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelRetractMessage}>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRetractMessage} className="bg-red-600 hover:bg-red-700">
              تأكيد السحب
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

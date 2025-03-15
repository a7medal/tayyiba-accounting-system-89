
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

export function TransferHistory() {
  const { messages } = useGazaTelecom();

  const [searchTerm, setSearchTerm] = useState('');
  const [accountFilter, setAccountFilter] = useState<AccountType | 'all'>('all');
  const [messageTypeFilter, setMessageTypeFilter] = useState<MessageType | 'all'>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
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
  };
  
  // تصدير البيانات كملف CSV
  const exportToCSV = () => {
    if (sortedMessages.length === 0) return;
    
    // تجهيز بيانات CSV
    const headers = ['التاريخ', 'الوقت', 'الحساب', 'النوع', 'الرقم التسلسلي', 'المبلغ', 'الفائدة', 'ملاحظات'];
    
    const csvData = sortedMessages.map(message => {
      const date = new Date(message.timestamp);
      return [
        format(date, 'yyyy/MM/dd'),
        format(date, 'HH:mm:ss'),
        message.accountType === 'main' ? 'الحساب الرئيسي' : 'حساب برينة',
        message.messageType === 'outgoing' ? 'صادر' : 'وارد',
        message.serialNumber,
        message.amount.toString(),
        message.interest.toString(),
        message.note || ''
      ].join(',');
    });
    
    const csv = [headers.join(','), ...csvData].join('\n');
    
    // إنشاء ملف للتنزيل
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `تقرير_الرسائل_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedMessages.map((message) => (
                <TableRow key={message.id}>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

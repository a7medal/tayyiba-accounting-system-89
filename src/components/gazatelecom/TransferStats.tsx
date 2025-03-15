import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  ArrowUpToLine, 
  ArrowDownToLine, 
  ArrowLeft,
  ArrowRight,
  Download,
  FileDown,
  Printer,
  Calendar
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGazaTelecom, AccountType } from './GazaTelecomContext';
import { format, subDays, startOfDay, endOfDay, eachDayOfInterval, isWithinInterval } from 'date-fns';

// ألوان الرسم البياني
const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

export function TransferStats() {
  const [timePeriod, setTimePeriod] = useState<'7days' | '30days' | '90days'>('7days');
  const [accountType, setAccountType] = useState<AccountType | 'all'>('all');
  const { messages } = useGazaTelecom();
  
  // تحديد نطاق التاريخ بناءً على الفترة المحددة
  const getDateRange = () => {
    const endDate = new Date();
    let startDate;
    
    switch (timePeriod) {
      case '7days':
        startDate = subDays(endDate, 6);
        break;
      case '30days':
        startDate = subDays(endDate, 29);
        break;
      case '90days':
        startDate = subDays(endDate, 89);
        break;
    }
    
    return {
      start: startOfDay(startDate),
      end: endOfDay(endDate)
    };
  };
  
  // تصفية الرسائل بناءً على نطاق التاريخ ونوع الحساب
  const getFilteredMessages = () => {
    const dateRange = getDateRange();
    
    return messages.filter(message => {
      const messageDate = new Date(message.timestamp);
      const isInDateRange = isWithinInterval(messageDate, {
        start: dateRange.start,
        end: dateRange.end
      });
      
      if (!isInDateRange) return false;
      if (accountType !== 'all' && message.accountType !== accountType) return false;
      
      return true;
    });
  };
  
  const filteredMessages = getFilteredMessages();
  
  // إنشاء بيانات المخطط الزمني
  const getChartData = () => {
    const dateRange = getDateRange();
    const days = eachDayOfInterval({
      start: dateRange.start,
      end: dateRange.end
    });
    
    return days.map(day => {
      const dayStart = startOfDay(day);
      const dayEnd = endOfDay(day);
      
      // تصفية الرسائل لهذا اليوم
      const dayMessages = filteredMessages.filter(message => {
        const messageDate = new Date(message.timestamp);
        return isWithinInterval(messageDate, { start: dayStart, end: dayEnd });
      });
      
      // حساب المجاميع
      const outgoing = dayMessages
        .filter(msg => msg.messageType === 'outgoing')
        .reduce((sum, msg) => sum + msg.amount, 0);
        
      const incoming = dayMessages
        .filter(msg => msg.messageType === 'incoming')
        .reduce((sum, msg) => sum + msg.amount, 0);
      
      return {
        name: format(day, 'MM/dd'),
        date: format(day, 'yyyy/MM/dd'),
        outgoing,
        incoming,
        balance: outgoing - incoming
      };
    });
  };
  
  const chartData = getChartData();
  
  // إنشاء بيانات المخطط الدائري لنوع الرسائل
  const getPieChartData = () => {
    const outgoing = filteredMessages
      .filter(msg => msg.messageType === 'outgoing')
      .reduce((sum, msg) => sum + msg.amount, 0);
      
    const incoming = filteredMessages
      .filter(msg => msg.messageType === 'incoming')
      .reduce((sum, msg) => sum + msg.amount, 0);
    
    return [
      { name: 'صادر', value: outgoing, color: '#3b82f6' },
      { name: 'وارد', value: incoming, color: '#ef4444' }
    ];
  };
  
  // إنشاء بيانات المخطط الدائري للحسابات
  const getAccountsPieChartData = () => {
    const main = filteredMessages
      .filter(msg => msg.accountType === 'main')
      .reduce((sum, msg) => sum + msg.amount, 0);
      
    const brina = filteredMessages
      .filter(msg => msg.accountType === 'brina')
      .reduce((sum, msg) => sum + msg.amount, 0);
    
    return [
      { name: 'الحساب الرئيسي', value: main, color: '#8b5cf6' },
      { name: 'حساب برينة', value: brina, color: '#10b981' }
    ];
  };
  
  // حساب الإحصائيات الإجمالية
  const calculateStats = () => {
    const outgoing = filteredMessages
      .filter(msg => msg.messageType === 'outgoing');
      
    const incoming = filteredMessages
      .filter(msg => msg.messageType === 'incoming');
    
    return {
      totalOutgoing: outgoing.reduce((sum, msg) => sum + msg.amount, 0),
      totalIncoming: incoming.reduce((sum, msg) => sum + msg.amount, 0),
      totalOutgoingCount: outgoing.length,
      totalIncomingCount: incoming.length,
      totalOutgoingInterest: outgoing.reduce((sum, msg) => sum + msg.interest, 0),
      totalIncomingInterest: incoming.reduce((sum, msg) => sum + msg.interest, 0),
    };
  };
  
  const stats = calculateStats();
  
  // طباعة التقرير
  const printReport = () => {
    window.print();
  };
  
  // Function to determine bar color based on value - returns a static string for each bar
  const getBarColor = (value: number): string => {
    return value >= 0 ? '#10b981' : '#ef4444';
  };
  
  return (
    <div className="space-y-6 print-section">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 print:hidden">
        <div className="flex gap-2">
          <Select
            value={timePeriod}
            onValueChange={(value) => setTimePeriod(value as '7days' | '30days' | '90days')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="اختر الفترة الزمنية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">آخر 7 أيام</SelectItem>
              <SelectItem value="30days">آخر 30 يوم</SelectItem>
              <SelectItem value="90days">آخر 90 يوم</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={accountType}
            onValueChange={(value) => setAccountType(value as AccountType | 'all')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="اختر الحساب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحسابات</SelectItem>
              <SelectItem value="main">الحساب الرئيسي</SelectItem>
              <SelectItem value="brina">حساب برينة</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={printReport} variant="outline" className="gap-2">
          <Printer className="h-4 w-4" />
          طباعة التقرير
        </Button>
      </div>
      
      <div className="print:block print:mb-8 hidden">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-2xl font-bold">طيبة المدينة تلكوم</h1>
          <p>رقم الهاتف: 27101138 / 41101138</p>
          <p>البريد الإلكتروني: taybaelmedinatelecom@gmail.com</p>
          <div className="border-t border-b py-2 my-4">
            <h2 className="text-xl font-bold">تقرير الحسابات</h2>
            <p className="text-muted-foreground mt-1">
              {accountType === 'all' ? 'جميع الحسابات' : 
              accountType === 'main' ? 'الحساب الرئيسي' : 'حساب برينة'} - 
              {timePeriod === '7days' ? ' آخر 7 أيام' : 
              timePeriod === '30days' ? ' آخر 30 يوم' : ' آخر 90 يوم'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              تاريخ التقرير: {format(new Date(), 'yyyy/MM/dd')}
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <ArrowUpToLine className="h-5 w-5 text-green-500 mr-2" />
              الرسائل الصادرة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">المبلغ الإجمالي</div>
                  <div className="text-2xl font-bold">{stats.totalOutgoing.toLocaleString()} أوقية</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">عدد الرسائل</div>
                  <div className="text-2xl font-bold">{stats.totalOutgoingCount}</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">إجمالي الفوائد</div>
                <div className="text-xl">{stats.totalOutgoingInterest.toLocaleString()} أوقية</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <ArrowDownToLine className="h-5 w-5 text-red-500 mr-2" />
              الرسائل الواردة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">المبلغ الإجمالي</div>
                  <div className="text-2xl font-bold">{stats.totalIncoming.toLocaleString()} أوقية</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">عدد الرسائل</div>
                  <div className="text-2xl font-bold">{stats.totalIncomingCount}</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">إجمالي الفوائد</div>
                <div className="text-xl">{stats.totalIncomingInterest.toLocaleString()} أوقية</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>مخطط التدفقات النقدية</CardTitle>
          <CardDescription>
            عرض التدفقات النقدية للفترة الزمنية المحددة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOutgoing" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorIncoming" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  labelFormatter={(label) => `التاريخ: ${chartData.find(item => item.name === label)?.date}`}
                  formatter={(value: number) => [`${value.toLocaleString()} أوقية`, undefined]}
                />
                <Area 
                  type="monotone" 
                  dataKey="outgoing" 
                  name="صادر"
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorOutgoing)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="incoming" 
                  name="وارد"
                  stroke="#ef4444" 
                  fillOpacity={1} 
                  fill="url(#colorIncoming)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>توزيع الرسائل حسب النوع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getPieChartData()}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => 
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {getPieChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value.toLocaleString()} أوقية`, undefined]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {getPieChartData().map((entry, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span>
                    {entry.name}: {entry.value.toLocaleString()} أوقية
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>ميزان الرسائل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(label) => `التاريخ: ${chartData.find(item => item.name === label)?.date}`}
                    formatter={(value: number) => [`${value.toLocaleString()} أوقية`, undefined]}
                  />
                  <Bar 
                    dataKey="balance" 
                    name="الميزان"
                    fill={(data) => getBarColor(data.balance)}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="print:mt-4">
        <CardHeader>
          <CardTitle>ملخص الحسابات</CardTitle>
          <CardDescription>
            إحصائيات ملخصة للفترة المحددة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">إجماليات الفترة</h3>
                <div className="space-y-2">
                  <div className="flex justify-between border-b pb-1">
                    <span>إجمالي الصادر:</span>
                    <span className="font-bold">{stats.totalOutgoing.toLocaleString()} أوقية</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span>إجمالي الوارد:</span>
                    <span className="font-bold">{stats.totalIncoming.toLocaleString()} أوقية</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span>صافي الحركة:</span>
                    <span className={`font-bold ${stats.totalOutgoing - stats.totalIncoming >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {(stats.totalOutgoing - stats.totalIncoming).toLocaleString()} أوقية
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>إجمالي الفوائد:</span>
                    <span className="font-bold">{(stats.totalOutgoingInterest + stats.totalIncomingInterest).toLocaleString()} أوقية</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">معلومات الرسائل</h3>
                <div className="space-y-2">
                  <div className="flex justify-between border-b pb-1">
                    <span>عدد الرسائل الصادرة:</span>
                    <span className="font-bold">{stats.totalOutgoingCount}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span>عدد الرسائل الواردة:</span>
                    <span className="font-bold">{stats.totalIncomingCount}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span>إجمالي عدد الرسائل:</span>
                    <span className="font-bold">{stats.totalOutgoingCount + stats.totalIncomingCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>متوسط قيمة الرسالة:</span>
                    <span className="font-bold">
                      {stats.totalOutgoingCount + stats.totalIncomingCount > 0 
                        ? Math.round((stats.totalOutgoing + stats.totalIncoming) / (stats.totalOutgoingCount + stats.totalIncomingCount)).toLocaleString() 
                        : 0} أوقية
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { TransferForm } from '@/components/gazatelecom/TransferForm';
import { TransferHistory } from '@/components/gazatelecom/TransferHistory';
import { TransferStats } from '@/components/gazatelecom/TransferStats';
import { MessageForm } from '@/components/gazatelecom/MessageForm';
import { AccountDashboard } from '@/components/gazatelecom/AccountDashboard';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, Printer, FileText, Calendar, Settings } from 'lucide-react';
import { GazaTelecomProvider, useGazaTelecom } from '@/components/gazatelecom/GazaTelecomContext';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { useToast } from '@/components/ui/use-toast';
import { DatabaseService } from '@/components/gazatelecom/services/DatabaseService';
import { Letterhead, PrintHeader } from '@/components/ui/letterhead';
import { formatDate } from '@/components/gazatelecom/utils/ChartUtils';
import { DatabaseSettings } from '@/components/gazatelecom/DatabaseSettings';

const PrintContent = () => {
  const { 
    selectedDate,
    getMainAccountSummary,
    getBrinaAccountSummary,
    calculateMainAccountFinals,
    calculateBrinaAccountFinals,
    getMessagesByDate,
    getBalanceForDate
  } = useGazaTelecom();

  // الحصول على البيانات للتاريخ المحدد
  const mainSummary = getMainAccountSummary(selectedDate);
  const brinaSummary = getBrinaAccountSummary(selectedDate);
  const mainFinals = calculateMainAccountFinals(selectedDate);
  const brinaFinals = calculateBrinaAccountFinals(selectedDate);
  const allMessages = getMessagesByDate(selectedDate);
  const currentBalance = getBalanceForDate(selectedDate);
  const previousDate = new Date(selectedDate);
  previousDate.setDate(previousDate.getDate() - 1);
  const previousDateStr = previousDate.toISOString().split('T')[0];
  const previousBalance = getBalanceForDate(previousDateStr);

  // ملء بيانات الطباعة عند تحميل المكون
  useEffect(() => {
    // بيانات الحساب الرئيسي
    document.getElementById('print-main-incoming')!.textContent = mainSummary.incomingTotal.toLocaleString();
    document.getElementById('print-main-outgoing')!.textContent = mainSummary.outgoingTotal.toLocaleString();
    document.getElementById('print-main-final1')!.textContent = mainFinals.final1.toLocaleString();
    document.getElementById('print-main-final2')!.textContent = mainFinals.final2.toLocaleString();
    document.getElementById('print-main-interest')!.textContent = mainFinals.totalInterest.toLocaleString();
    
    // بيانات حساب برينة
    document.getElementById('print-brina-incoming')!.textContent = brinaSummary.incomingTotal.toLocaleString();
    document.getElementById('print-brina-outgoing')!.textContent = brinaSummary.outgoingTotal.toLocaleString();
    document.getElementById('print-brina-prev-balance')!.textContent = previousBalance.toLocaleString();
    document.getElementById('print-brina-current-balance')!.textContent = currentBalance.toLocaleString();
    document.getElementById('print-brina-diff')!.textContent = brinaFinals.balanceDifference.toLocaleString();
    
    // نموذج A5
    document.getElementById('print-a5-main-incoming')!.textContent = mainSummary.incomingTotal.toLocaleString();
    document.getElementById('print-a5-main-outgoing')!.textContent = mainSummary.outgoingTotal.toLocaleString();
    document.getElementById('print-a5-main-final1')!.textContent = mainFinals.final1.toLocaleString();
    document.getElementById('print-a5-main-final2')!.textContent = mainFinals.final2.toLocaleString();
    document.getElementById('print-a5-brina-incoming')!.textContent = brinaSummary.incomingTotal.toLocaleString();
    document.getElementById('print-a5-brina-outgoing')!.textContent = brinaSummary.outgoingTotal.toLocaleString();
    document.getElementById('print-a5-brina-balance')!.textContent = currentBalance.toLocaleString();
    document.getElementById('print-a5-brina-diff')!.textContent = brinaFinals.balanceDifference.toLocaleString();
    
    // جدول الرسائل
    const messagesBody = document.getElementById('print-messages-body');
    if (messagesBody) {
      messagesBody.innerHTML = '';
      
      allMessages.forEach(message => {
        const row = document.createElement('tr');
        
        const timeCell = document.createElement('td');
        timeCell.className = 'border p-2 text-right';
        timeCell.textContent = new Date(message.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
        
        const accountCell = document.createElement('td');
        accountCell.className = 'border p-2 text-right';
        accountCell.textContent = message.accountType === 'main' ? 'الرئيسي' : 'برينة';
        
        const typeCell = document.createElement('td');
        typeCell.className = 'border p-2 text-right';
        typeCell.textContent = message.messageType === 'outgoing' ? 'صادر' : 'وارد';
        
        const serialCell = document.createElement('td');
        serialCell.className = 'border p-2 text-right';
        serialCell.textContent = message.serialNumber;
        
        const amountCell = document.createElement('td');
        amountCell.className = 'border p-2 text-right';
        amountCell.textContent = message.amount.toLocaleString();
        
        const interestCell = document.createElement('td');
        interestCell.className = 'border p-2 text-right';
        interestCell.textContent = message.interest.toLocaleString();
        
        const noteCell = document.createElement('td');
        noteCell.className = 'border p-2 text-right';
        noteCell.textContent = message.note || '-';
        
        row.appendChild(timeCell);
        row.appendChild(accountCell);
        row.appendChild(typeCell);
        row.appendChild(serialCell);
        row.appendChild(amountCell);
        row.appendChild(interestCell);
        row.appendChild(noteCell);
        
        messagesBody.appendChild(row);
      });
    }
    
    // تاريخ التقرير
    const reportDateElements = document.querySelectorAll('.print-report-date');
    reportDateElements.forEach(element => {
      element.textContent = formatDate(selectedDate);
    });
  }, [selectedDate, mainSummary, brinaSummary, mainFinals, brinaFinals, allMessages, currentBalance, previousBalance]);
  
  return null;
};

const GazaTelecom = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();

  const handlePrint = () => {
    window.print();
  };
  
  return (
    <GazaTelecomProvider>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/e5554b5c-e82d-452f-9a5d-884565624233.png" 
              alt="طيبة المدينة تلكوم"
              className="h-12 w-auto" 
            />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">غزة تليكوم</h1>
              <p className="text-muted-foreground mt-2">
                نظام إدارة الحسابات والرسائل المتكامل
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline"
              className="gap-2" 
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4" />
              طباعة التقرير
            </Button>
            
            <Button 
              variant={showSettings ? "default" : "outline"}
              className="gap-2" 
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4" />
              الإعدادات
            </Button>
          </div>
        </div>
        <Separator />
        
        {showSettings ? (
          <div className="my-6">
            <DatabaseSettings />
          </div>
        ) : (
          <>
            <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <InfoIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <AlertTitle className="text-blue-800 dark:text-blue-300">طيبة المدينة تلكوم</AlertTitle>
              <AlertDescription className="text-blue-700 dark:text-blue-400">
                رقم الهاتف: 22371138 / 41101138 | البريد الإلكتروني: taybaelmedintelecom@gmail.com
              </AlertDescription>
            </Alert>
            
            <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-5 gap-1">
                <TabsTrigger value="dashboard">لوحة المعلومات</TabsTrigger>
                <TabsTrigger value="message">إدخال رسالة</TabsTrigger>
                <TabsTrigger value="history">سجل الرسائل</TabsTrigger>
                <TabsTrigger value="transfers">التحويلات</TabsTrigger>
                <TabsTrigger value="stats">التقارير</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard" className="mt-6">
                <AccountDashboard />
              </TabsContent>
              
              <TabsContent value="message" className="mt-6">
                <MessageForm />
              </TabsContent>
              
              <TabsContent value="history" className="mt-6">
                <TransferHistory />
              </TabsContent>
              
              <TabsContent value="transfers" className="mt-6">
                <TransferForm />
              </TabsContent>
              
              <TabsContent value="stats" className="mt-6">
                <TransferStats />
              </TabsContent>
            </Tabs>
          </>
        )}
        
        {/* PrintContent لملء عناصر الطباعة */}
        <PrintContent />
        
        {/* قسم للطباعة A4 - سيكون مرئيًا فقط عند الطباعة */}
        <div className="print-section print-a4 hidden">
          <PrintHeader title="تقرير العمليات المالية - غزة تيليكوم" />
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">تقرير يوم: <span className="print-report-date"></span></h2>
            <img 
              src="/lovable-uploads/e5554b5c-e82d-452f-9a5d-884565624233.png" 
              alt="طيبة المدينة تلكوم"
              className="h-12 w-auto" 
            />
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-2">ملخص الحساب الرئيسي</h3>
            <table className="w-full border-collapse mb-4">
              <thead>
                <tr>
                  <th className="border p-2 text-right">الوارد</th>
                  <th className="border p-2 text-right">الصادر</th>
                  <th className="border p-2 text-right">النهائي 1</th>
                  <th className="border p-2 text-right">النهائي 2</th>
                  <th className="border p-2 text-right">إجمالي الفائدة</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 text-right" id="print-main-incoming">-</td>
                  <td className="border p-2 text-right" id="print-main-outgoing">-</td>
                  <td className="border p-2 text-right" id="print-main-final1">-</td>
                  <td className="border p-2 text-right" id="print-main-final2">-</td>
                  <td className="border p-2 text-right" id="print-main-interest">-</td>
                </tr>
              </tbody>
            </table>
            
            <h3 className="text-lg font-bold mb-2">ملخص حساب برينة</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 text-right">الوارد</th>
                  <th className="border p-2 text-right">الصادر</th>
                  <th className="border p-2 text-right">الرصيد السابق</th>
                  <th className="border p-2 text-right">الرصيد الحالي</th>
                  <th className="border p-2 text-right">الفرق</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 text-right" id="print-brina-incoming">-</td>
                  <td className="border p-2 text-right" id="print-brina-outgoing">-</td>
                  <td className="border p-2 text-right" id="print-brina-prev-balance">-</td>
                  <td className="border p-2 text-right" id="print-brina-current-balance">-</td>
                  <td className="border p-2 text-right" id="print-brina-diff">-</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <h3 className="text-lg font-bold mb-2">سجل الرسائل</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2 text-right">الوقت</th>
                <th className="border p-2 text-right">الحساب</th>
                <th className="border p-2 text-right">النوع</th>
                <th className="border p-2 text-right">الرقم التسلسلي</th>
                <th className="border p-2 text-right">المبلغ</th>
                <th className="border p-2 text-right">الفائدة</th>
                <th className="border p-2 text-right">ملاحظات</th>
              </tr>
            </thead>
            <tbody id="print-messages-body">
              {/* سيتم ملء هذا الجزء ديناميكيًا عند الطباعة */}
            </tbody>
          </table>
          
          <div className="mt-10 pt-10 border-t">
            <div className="flex justify-between">
              <div className="text-sm">
                <p>تاريخ الطباعة: {new Date().toLocaleDateString('ar-EG')}</p>
                <p>وقت الطباعة: {new Date().toLocaleTimeString('ar-EG')}</p>
              </div>
              <div className="text-sm text-left">
                <p>توقيع المسؤول: ________________</p>
                <p>الختم الرسمي</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* نموذج الطباعة A5 */}
        <div className="print-section print-a5 hidden">
          <PrintHeader title="تقرير العمليات المالية - غزة تيليكوم" size="a5" />
          
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-base font-bold">تقرير يوم: <span className="print-report-date"></span></h2>
            <img 
              src="/lovable-uploads/e5554b5c-e82d-452f-9a5d-884565624233.png" 
              alt="طيبة المدينة تلكوم"
              className="h-8 w-auto" 
            />
          </div>
          
          <div className="mb-4">
            <h3 className="text-base font-bold mb-1">ملخص الحساب الرئيسي</h3>
            <table className="w-full border-collapse mb-3 text-sm">
              <thead>
                <tr>
                  <th className="border p-1 text-right">الوارد</th>
                  <th className="border p-1 text-right">الصادر</th>
                  <th className="border p-1 text-right">النهائي 1</th>
                  <th className="border p-1 text-right">النهائي 2</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-1 text-right" id="print-a5-main-incoming">-</td>
                  <td className="border p-1 text-right" id="print-a5-main-outgoing">-</td>
                  <td className="border p-1 text-right" id="print-a5-main-final1">-</td>
                  <td className="border p-1 text-right" id="print-a5-main-final2">-</td>
                </tr>
              </tbody>
            </table>
            
            <h3 className="text-base font-bold mb-1">ملخص حساب برينة</h3>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border p-1 text-right">الوارد</th>
                  <th className="border p-1 text-right">الصادر</th>
                  <th className="border p-1 text-right">الرصيد</th>
                  <th className="border p-1 text-right">الفرق</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-1 text-right" id="print-a5-brina-incoming">-</td>
                  <td className="border p-1 text-right" id="print-a5-brina-outgoing">-</td>
                  <td className="border p-1 text-right" id="print-a5-brina-balance">-</td>
                  <td className="border p-1 text-right" id="print-a5-brina-diff">-</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 pt-4 border-t text-xs">
            <div className="flex justify-between">
              <div>
                <p>تاريخ: {new Date().toLocaleDateString('ar-EG')}</p>
                <p>طيبة المدينة تلكوم</p>
                <p>22371138 / 41101138</p>
              </div>
              <div>
                <p>توقيع المسؤول: _______</p>
                <p>الختم الرسمي</p>
              </div>
            </div>
          </div>
        </div>
        
        <Toaster position="top-right" />
      </div>
    </GazaTelecomProvider>
  );
};

export default GazaTelecom;


import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { TransferForm } from '@/components/gazatelecom/TransferForm';
import { TransferHistory } from '@/components/gazatelecom/TransferHistory';
import { TransferStats } from '@/components/gazatelecom/TransferStats';
import { MessageForm } from '@/components/gazatelecom/MessageForm';
import { AccountDashboard } from '@/components/gazatelecom/AccountDashboard';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, Database, Printer, FileText } from 'lucide-react';
import { GazaTelecomProvider } from '@/components/gazatelecom/GazaTelecomContext';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { useToast } from '@/components/ui/use-toast';
import { DatabaseService } from '@/components/gazatelecom/services/DatabaseService';
import { Letterhead } from '@/components/ui/letterhead';

const GazaTelecom = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  // التحقق من اتصال قاعدة البيانات
  useEffect(() => {
    const checkConnection = () => {
      const connectionState = DatabaseService.isConnected();
      setIsConnected(connectionState);
    };
    
    checkConnection();
    
    // إعادة التحقق من حالة الاتصال كل 30 ثانية
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleConnectDatabase = async () => {
    // محاولة الاتصال بقاعدة البيانات
    setIsConnecting(true);
    
    try {
      const success = await DatabaseService.connect();
      setIsConnected(success);
      
      if (success) {
        toast({
          title: "تم الاتصال بقاعدة البيانات",
          description: "تم إنشاء اتصال مع قاعدة البيانات بنجاح",
        });
      } else {
        toast({
          title: "فشل الاتصال",
          description: "تعذر الاتصال بقاعدة البيانات، يرجى المحاولة مرة أخرى",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error connecting to database:", error);
      toast({
        title: "خطأ في الاتصال",
        description: "حدث خطأ أثناء محاولة الاتصال بقاعدة البيانات",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleDisconnectDatabase = () => {
    DatabaseService.disconnect();
    setIsConnected(false);
    toast({
      title: "تم قطع الاتصال",
      description: "تم قطع الاتصال بقاعدة البيانات بنجاح",
    });
  };
  
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
          
          <div className="flex gap-2">
            <Button 
              variant="outline"
              className="gap-2" 
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4" />
              طباعة التقرير
            </Button>
            
            {isConnected ? (
              <Button 
                variant="secondary"
                className="gap-2" 
                onClick={handleDisconnectDatabase}
              >
                <Database className="h-4 w-4" />
                قطع الاتصال بقاعدة البيانات
              </Button>
            ) : (
              <Button 
                variant="default"
                className="gap-2" 
                onClick={handleConnectDatabase}
                disabled={isConnecting}
              >
                <Database className="h-4 w-4" />
                {isConnecting ? "جاري الاتصال..." : "الاتصال بقاعدة البيانات"}
              </Button>
            )}
          </div>
        </div>
        <Separator />
        
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
        
        {/* قسم للطباعة - سيكون مرئيًا فقط عند الطباعة */}
        <div className="print-section print-a4 hidden">
          <Letterhead />
          <h2 className="text-xl font-bold mt-4 mb-6 text-center">تقرير العمليات المالية - غزة تيليكوم</h2>
          
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
        
        <Toaster position="top-right" />
      </div>
    </GazaTelecomProvider>
  );
};

export default GazaTelecom;

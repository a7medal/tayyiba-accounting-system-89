
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { TransferForm } from '@/components/gazatelecom/TransferForm';
import { TransferHistory } from '@/components/gazatelecom/TransferHistory';
import { TransferStats } from '@/components/gazatelecom/TransferStats';
import { MessageForm } from '@/components/gazatelecom/MessageForm';
import { AccountDashboard } from '@/components/gazatelecom/AccountDashboard';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, Database } from 'lucide-react';
import { GazaTelecomProvider } from '@/components/gazatelecom/GazaTelecomContext';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { useToast } from '@/components/ui/use-toast';

const GazaTelecom = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  // التحقق من اتصال قاعدة البيانات
  useEffect(() => {
    // محاكاة الاتصال بقاعدة البيانات
    const checkConnection = () => {
      const connectionState = localStorage.getItem('dbConnectionState');
      setIsConnected(connectionState === 'connected');
    };
    
    checkConnection();
    
    // في المستقبل، يمكن استبدال هذا بالاتصال الفعلي بقاعدة البيانات
  }, []);
  
  const handleConnectDatabase = () => {
    // محاكاة الاتصال بقاعدة البيانات
    localStorage.setItem('dbConnectionState', 'connected');
    setIsConnected(true);
    
    toast({
      title: "تم الاتصال بقاعدة البيانات",
      description: "تم إنشاء اتصال مع قاعدة البيانات بنجاح",
    });
  };
  
  return (
    <GazaTelecomProvider>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">غزة تليكوم</h1>
            <p className="text-muted-foreground mt-2">
              نظام إدارة الحسابات والرسائل المتكامل
            </p>
          </div>
          
          <Button 
            variant={isConnected ? "secondary" : "default"}
            className="gap-2" 
            onClick={handleConnectDatabase}
            disabled={isConnected}
          >
            <Database className="h-4 w-4" />
            {isConnected ? "متصل بقاعدة البيانات" : "الاتصال بقاعدة البيانات"}
          </Button>
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
        
        <Toaster position="top-right" />
      </div>
    </GazaTelecomProvider>
  );
};

export default GazaTelecom;

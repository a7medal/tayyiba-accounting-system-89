
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { TransferForm } from '@/components/gazatelecom/TransferForm';
import { TransferHistory } from '@/components/gazatelecom/TransferHistory';
import { TransferStats } from '@/components/gazatelecom/TransferStats';
import { MessageForm } from '@/components/gazatelecom/MessageForm';
import { AccountDashboard } from '@/components/gazatelecom/AccountDashboard';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from 'lucide-react';
import { GazaTelecomProvider } from '@/components/gazatelecom/GazaTelecomContext';

const GazaTelecom = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <GazaTelecomProvider>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">غزة تليكوم</h1>
          <p className="text-muted-foreground mt-2">
            نظام إدارة الحسابات والرسائل المتكامل
          </p>
        </div>
        <Separator />
        
        <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <InfoIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <AlertTitle className="text-blue-800 dark:text-blue-300">طيبة المدينة تلكوم</AlertTitle>
          <AlertDescription className="text-blue-700 dark:text-blue-400">
            رقم الهاتف: 27101138 / 41101138 | البريد الإلكتروني: taybaelmedinatelecom@gmail.com
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
      </div>
    </GazaTelecomProvider>
  );
};

export default GazaTelecom;

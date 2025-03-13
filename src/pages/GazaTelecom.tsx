
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { TransferForm } from '@/components/gazatelecom/TransferForm';
import { TransferHistory } from '@/components/gazatelecom/TransferHistory';
import { TransferStats } from '@/components/gazatelecom/TransferStats';
import { TransferMap } from '@/components/gazatelecom/TransferMap';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from 'lucide-react';

const GazaTelecom = () => {
  const [activeTab, setActiveTab] = useState("transfers");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">غزة تليكوم</h1>
        <p className="text-muted-foreground mt-2">
          نظام إدارة وتحويل الأموال المتكامل
        </p>
      </div>
      <Separator />
      
      <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <InfoIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <AlertTitle className="text-blue-800 dark:text-blue-300">تحويلات آمنة وسريعة</AlertTitle>
        <AlertDescription className="text-blue-700 dark:text-blue-400">
          يمكنك الآن إجراء عمليات تحويل الأموال بشكل آمن وسريع عبر نظامنا المتكامل.
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="transfers" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4 gap-1">
          <TabsTrigger value="transfers">التحويلات الجديدة</TabsTrigger>
          <TabsTrigger value="history">سجل التحويلات</TabsTrigger>
          <TabsTrigger value="stats">إحصائيات</TabsTrigger>
          <TabsTrigger value="map">خريطة التحويلات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transfers" className="mt-6">
          <TransferForm />
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <TransferHistory />
        </TabsContent>
        
        <TabsContent value="stats" className="mt-6">
          <TransferStats />
        </TabsContent>
        
        <TabsContent value="map" className="mt-6">
          <TransferMap />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GazaTelecom;


import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpToLine, ArrowDownToLine, Calculator, DollarSign, Coins, Hash } from 'lucide-react';
import { useGazaTelecom } from './GazaTelecomContext';
import { format } from 'date-fns';

export function AccountDashboard() {
  const [activeTab, setActiveTab] = useState<'main' | 'brina'>('main');
  const [dailyBalanceInput, setDailyBalanceInput] = useState('');
  const [previousBalanceInput, setPreviousBalanceInput] = useState('');
  
  const { 
    getMainAccountSummary, 
    getBrinaAccountSummary, 
    calculateMainAccountFinals,
    calculateBrinaAccountFinals,
    dailyBalance,
    setDailyBalance,
    previousDayBalance,
    setPreviousDayBalance
  } = useGazaTelecom();
  
  const mainAccountSummary = getMainAccountSummary();
  const brinaAccountSummary = getBrinaAccountSummary();
  const mainAccountFinals = calculateMainAccountFinals();
  const brinaAccountFinals = calculateBrinaAccountFinals();
  
  const handleDailyBalanceUpdate = () => {
    setDailyBalance(Number(dailyBalanceInput));
  };
  
  const handlePreviousBalanceUpdate = () => {
    setPreviousDayBalance(Number(previousBalanceInput));
  };
  
  return (
    <div>
      <Tabs defaultValue="main" value={activeTab} onValueChange={(value) => setActiveTab(value as 'main' | 'brina')} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="main">الحساب الرئيسي</TabsTrigger>
          <TabsTrigger value="brina">حساب برينة</TabsTrigger>
        </TabsList>
        
        <TabsContent value="main" className="space-y-4">
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
                تاريخ التحديث: {format(new Date(), 'yyyy/MM/dd')}
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
        </TabsContent>
        
        <TabsContent value="brina" className="space-y-4">
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
                تاريخ التحديث: {format(new Date(), 'yyyy/MM/dd')}
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
        </TabsContent>
      </Tabs>
    </div>
  );
}

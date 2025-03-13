
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReportFilter } from '@/components/reports/ReportFilter';
import { FinancialTab } from '@/components/reports/FinancialTab';
import { SalesTab } from '@/components/reports/SalesTab';
import { ClientsTab } from '@/components/reports/ClientsTab';
import { 
  salesData, 
  expensesData, 
  profitData, 
  revenueByCategory,
  topClients
} from '@/components/reports/ReportData';

export default function Reports() {
  const [reportPeriod, setReportPeriod] = useState('6months');

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">التقارير</h1>
        <ReportFilter 
          reportPeriod={reportPeriod}
          setReportPeriod={setReportPeriod}
        />
      </div>

      <Tabs defaultValue="financial" className="mb-6">
        <TabsList>
          <TabsTrigger value="financial">التقارير المالية</TabsTrigger>
          <TabsTrigger value="sales">تقارير المبيعات</TabsTrigger>
          <TabsTrigger value="clients">تقارير العملاء</TabsTrigger>
        </TabsList>
        
        <TabsContent value="financial" className="mt-4">
          <FinancialTab 
            salesData={salesData}
            expensesData={expensesData}
            profitData={profitData}
          />
        </TabsContent>
        
        <TabsContent value="sales" className="mt-4">
          <SalesTab revenueByCategory={revenueByCategory} />
        </TabsContent>
        
        <TabsContent value="clients" className="mt-4">
          <ClientsTab topClients={topClients} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

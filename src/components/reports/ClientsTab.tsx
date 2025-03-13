
import React from 'react';
import { Button } from '@/components/ui/button';

interface ClientRowProps {
  name: string;
  value: number;
  percentage: number;
  index: number;
}

function ClientRow({ name, value, percentage, index }: ClientRowProps) {
  return (
    <div className="flex items-center">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
        <span className="font-medium text-primary">{index + 1}</span>
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="font-medium">{name}</span>
          <span>{value.toLocaleString()} ريال</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}

function InfoRow({ label, value, valueClassName = "font-medium" }: InfoRowProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="text-muted-foreground">{label}</div>
      <div className={valueClassName}>{value}</div>
    </div>
  );
}

interface ClientCategoryRowProps {
  label: string;
  value: string;
  color: string;
}

function ClientCategoryRow({ label, value, color }: ClientCategoryRowProps) {
  return (
    <div className="flex items-center">
      <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: color }}></div>
      <div className="flex-1">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

interface ClientsTabProps {
  topClients: Array<{ name: string; value: number; percentage: number }>;
}

export function ClientsTab({ topClients }: ClientsTabProps) {
  return (
    <div className="space-y-6">
      <div className="card-glass rounded-xl p-6">
        <h2 className="text-xl font-medium mb-4">أفضل العملاء</h2>
        
        <div className="space-y-4">
          {topClients.map((client, index) => (
            <ClientRow 
              key={client.name} 
              name={client.name}
              value={client.value}
              percentage={client.percentage}
              index={index}
            />
          ))}
        </div>
        
        <div className="mt-6">
          <Button variant="outline" className="w-full">عرض كل العملاء</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-glass rounded-xl p-6">
          <h2 className="text-xl font-medium mb-4">العملاء الجدد</h2>
          
          <div className="space-y-4">
            <InfoRow label="هذا الشهر" value="8 عملاء" />
            <InfoRow label="هذه السنة" value="32 عميل" />
            <InfoRow label="نسبة النمو" value="+15.3%" valueClassName="font-medium text-green-600" />
          </div>
          
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-medium mb-3">أحدث العملاء</h3>
            <div className="space-y-3">
              <InfoRow label="شركة المستقبل" value={<span className="text-sm text-muted-foreground">منذ 3 أيام</span>} />
              <InfoRow label="مؤسسة الإبداع" value={<span className="text-sm text-muted-foreground">منذ 5 أيام</span>} />
              <InfoRow label="شركة الإنجاز" value={<span className="text-sm text-muted-foreground">منذ أسبوع</span>} />
            </div>
          </div>
        </div>
        
        <div className="card-glass rounded-xl p-6">
          <h2 className="text-xl font-medium mb-4">تصنيف العملاء</h2>
          
          <div className="space-y-4">
            <ClientCategoryRow label="عملاء منتظمون" value="65%" color="#10B981" />
            <ClientCategoryRow label="عملاء نشطون" value="20%" color="#3B82F6" />
            <ClientCategoryRow label="عملاء غير نشطين" value="10%" color="#F59E0B" />
            <ClientCategoryRow label="عملاء متوقفون" value="5%" color="#EF4444" />
          </div>
          
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-medium mb-3">تحليل سلوك العملاء</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• متوسط عدد الفواتير لكل عميل: 4.2</p>
              <p>• متوسط قيمة الفاتورة: 2,850 ريال</p>
              <p>• معدل الاحتفاظ بالعملاء: 85%</p>
              <p>• نسبة العملاء المتكررين: 68%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

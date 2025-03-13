
import React from 'react';
import { PieChart } from '@/components/ui/chart';
import { ChartConfig } from '@/components/ui/chart';

interface CategoryRowProps {
  name: string;
  value: number;
  color: string;
  totalRevenue: number;
}

function CategoryRow({ name, value, color, totalRevenue }: CategoryRowProps) {
  const revenue = (value * totalRevenue / 100);
  
  return (
    <div className="flex items-center">
      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }}></div>
      <div className="flex-1">{name}</div>
      <div className="font-medium">{value}%</div>
      <div className="text-muted-foreground text-sm ml-4">{revenue.toLocaleString()} ريال</div>
    </div>
  );
}

interface PeriodBoxProps {
  title: string;
  value: string;
  change: string;
}

function PeriodBox({ title, value, change }: PeriodBoxProps) {
  return (
    <div className="p-4 border rounded-lg bg-background">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-green-600">{change}</p>
    </div>
  );
}

interface SalesTableRowProps {
  period: string;
  sales: string;
  invoiceCount: number;
  average: string;
  growth: string;
  isPositive: boolean;
}

function SalesTableRow({ period, sales, invoiceCount, average, growth, isPositive }: SalesTableRowProps) {
  return (
    <tr className="border-b">
      <td className="py-3 px-4">{period}</td>
      <td className="py-3 px-4">{sales}</td>
      <td className="py-3 px-4">{invoiceCount}</td>
      <td className="py-3 px-4">{average}</td>
      <td className={`py-3 px-4 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>{growth}</td>
    </tr>
  );
}

interface SalesTabProps {
  revenueByCategory: Array<{ name: string; value: number; color: string }>;
}

export function SalesTab({ revenueByCategory }: SalesTabProps) {
  const totalRevenue = 113000; // Example total revenue number
  
  const pieChartConfig: ChartConfig = {
    data: revenueByCategory,
    width: 300,
    height: 300,
    innerRadius: 60,
    outerRadius: 100,
    paddingAngle: 5,
    dataKey: "value",
    nameKey: "name",
    colorKey: "color",
  };
  
  return (
    <div className="space-y-6">
      <div className="card-glass rounded-xl p-6">
        <h2 className="text-xl font-medium mb-4">الإيرادات حسب الفئة</h2>
        
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-1/3">
            <PieChart {...pieChartConfig} />
          </div>
          
          <div className="w-full md:w-2/3 mt-6 md:mt-0 space-y-4">
            <h3 className="text-lg font-medium mb-2">تفاصيل الإيرادات</h3>
            {revenueByCategory.map((category) => (
              <CategoryRow 
                key={category.name} 
                name={category.name} 
                value={category.value} 
                color={category.color}
                totalRevenue={totalRevenue}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="card-glass rounded-xl p-6">
        <h2 className="text-xl font-medium mb-4">أداء المبيعات حسب الفترة</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <PeriodBox 
            title="اليوم"
            value="2,500 ريال"
            change="+5.2% من أمس"
          />
          <PeriodBox 
            title="هذا الأسبوع"
            value="18,300 ريال"
            change="+12.8% من الأسبوع الماضي"
          />
          <PeriodBox 
            title="هذا الشهر"
            value="62,500 ريال"
            change="+8.5% من الشهر الماضي"
          />
          <PeriodBox 
            title="هذه السنة"
            value="387,200 ريال"
            change="+24.3% من السنة الماضية"
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-right py-3 px-4 font-medium">الفترة</th>
                <th className="text-right py-3 px-4 font-medium">المبيعات</th>
                <th className="text-right py-3 px-4 font-medium">عدد الفواتير</th>
                <th className="text-right py-3 px-4 font-medium">متوسط قيمة الفاتورة</th>
                <th className="text-right py-3 px-4 font-medium">النمو</th>
              </tr>
            </thead>
            <tbody>
              <SalesTableRow 
                period="يناير"
                sales="52,300 ريال"
                invoiceCount={18}
                average="2,905 ريال"
                growth="+12.5%"
                isPositive={true}
              />
              <SalesTableRow 
                period="فبراير"
                sales="48,150 ريال"
                invoiceCount={16}
                average="3,009 ريال"
                growth="-8.2%"
                isPositive={false}
              />
              <SalesTableRow 
                period="مارس"
                sales="61,750 ريال"
                invoiceCount={20}
                average="3,087 ريال"
                growth="+28.2%"
                isPositive={true}
              />
              <SalesTableRow 
                period="أبريل"
                sales="58,400 ريال"
                invoiceCount={19}
                average="3,073 ريال"
                growth="-5.4%"
                isPositive={false}
              />
              <SalesTableRow 
                period="مايو"
                sales="67,200 ريال"
                invoiceCount={23}
                average="2,921 ريال"
                growth="+15.1%"
                isPositive={true}
              />
              <SalesTableRow 
                period="يونيو"
                sales="62,500 ريال"
                invoiceCount={21}
                average="2,976 ريال"
                growth="-7.0%"
                isPositive={false}
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

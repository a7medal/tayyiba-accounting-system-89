
import { useState } from 'react';
import { LineChart, BarChart, PieChart } from '@/components/ui/chart';
import { ChartConfig } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowDownToLine, Filter } from 'lucide-react';
import { format, subMonths } from 'date-fns';
import { ar } from 'date-fns/locale';

// بيانات نموذجية للرسوم البيانية
const currentMonth = new Date();
const last6Months = Array.from({ length: 6 }, (_, i) => {
  const date = subMonths(currentMonth, 5 - i);
  return format(date, 'MMM', { locale: ar });
});

const salesData = [
  { name: last6Months[0], value: 12500 },
  { name: last6Months[1], value: 18200 },
  { name: last6Months[2], value: 15800 },
  { name: last6Months[3], value: 22000 },
  { name: last6Months[4], value: 19500 },
  { name: last6Months[5], value: 25000 },
];

const expensesData = [
  { name: last6Months[0], value: 8200 },
  { name: last6Months[1], value: 9500 },
  { name: last6Months[2], value: 7800 },
  { name: last6Months[3], value: 10200 },
  { name: last6Months[4], value: 11000 },
  { name: last6Months[5], value: 12500 },
];

const profitData = salesData.map((item, index) => ({
  name: item.name,
  value: item.value - expensesData[index].value
}));

const revenueByCategory = [
  { name: 'خدمات', value: 45, color: '#10B981' },
  { name: 'منتجات', value: 30, color: '#3B82F6' },
  { name: 'استشارات', value: 15, color: '#8B5CF6' },
  { name: 'أخرى', value: 10, color: '#F59E0B' },
];

const topClients = [
  { name: 'شركة النور', value: 15200, percentage: 22 },
  { name: 'مؤسسة السلام', value: 12800, percentage: 18 },
  { name: 'شركة الأمل', value: 10500, percentage: 15 },
  { name: 'مؤسسة الفجر', value: 8300, percentage: 12 },
  { name: 'شركة المستقبل', value: 7200, percentage: 10 },
];

export default function Reports() {
  const [reportPeriod, setReportPeriod] = useState('6months');

  const salesChartConfig: ChartConfig = {
    data: salesData,
    width: 700,
    height: 300,
    margin: { top: 10, right: 30, left: 30, bottom: 30 },
    xAxisDataKey: "name",
    yAxisWidth: 80,
    lineDataKey: "value",
    lineColor: "#3B82F6",
    areaColor: "#93C5FD",
    showGrid: true,
    tooltip: true,
  };

  const expensesChartConfig: ChartConfig = {
    data: expensesData,
    width: 700,
    height: 300,
    margin: { top: 10, right: 30, left: 30, bottom: 30 },
    xAxisDataKey: "name",
    yAxisWidth: 80,
    lineDataKey: "value",
    lineColor: "#F59E0B",
    areaColor: "#FCD34D",
    showGrid: true,
    tooltip: true,
  };

  const profitChartConfig: ChartConfig = {
    data: profitData,
    width: 700,
    height: 300,
    margin: { top: 10, right: 30, left: 30, bottom: 30 },
    xAxisDataKey: "name",
    yAxisWidth: 80,
    barDataKey: "value",
    barColor: "#10B981",
    showGrid: true,
    tooltip: true,
  };

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
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">التقارير</h1>
        <div className="flex items-center gap-2">
          <select 
            value={reportPeriod}
            onChange={(e) => setReportPeriod(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
          >
            <option value="month">الشهر الحالي</option>
            <option value="3months">آخر 3 أشهر</option>
            <option value="6months">آخر 6 أشهر</option>
            <option value="year">السنة الحالية</option>
          </select>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            تصفية
          </Button>
          <Button size="sm" className="flex items-center gap-1">
            <ArrowDownToLine className="h-4 w-4" />
            تصدير
          </Button>
        </div>
      </div>

      <Tabs defaultValue="financial" className="mb-6">
        <TabsList>
          <TabsTrigger value="financial">التقارير المالية</TabsTrigger>
          <TabsTrigger value="sales">تقارير المبيعات</TabsTrigger>
          <TabsTrigger value="clients">تقارير العملاء</TabsTrigger>
        </TabsList>
        
        <TabsContent value="financial" className="mt-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card-glass rounded-xl p-4">
              <h3 className="text-lg font-medium mb-2">إجمالي المبيعات</h3>
              <div className="flex items-end">
                <p className="text-3xl font-bold">{salesData.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()} ريال</p>
                <span className="text-green-600 text-sm mr-2">+12.5%</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">مقارنة بالفترة السابقة</p>
            </div>
            <div className="card-glass rounded-xl p-4">
              <h3 className="text-lg font-medium mb-2">إجمالي المصروفات</h3>
              <div className="flex items-end">
                <p className="text-3xl font-bold">{expensesData.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()} ريال</p>
                <span className="text-red-600 text-sm mr-2">+8.2%</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">مقارنة بالفترة السابقة</p>
            </div>
            <div className="card-glass rounded-xl p-4">
              <h3 className="text-lg font-medium mb-2">صافي الأرباح</h3>
              <div className="flex items-end">
                <p className="text-3xl font-bold">{profitData.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()} ريال</p>
                <span className="text-green-600 text-sm mr-2">+15.3%</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">مقارنة بالفترة السابقة</p>
            </div>
          </div>
          
          <div className="card-glass rounded-xl p-6">
            <h2 className="text-xl font-medium mb-4">تقرير المبيعات والمصروفات</h2>
            <div className="mt-4 overflow-x-auto">
              <LineChart {...salesChartConfig} />
            </div>
          </div>
          
          <div className="card-glass rounded-xl p-6">
            <h2 className="text-xl font-medium mb-4">تقرير المصروفات</h2>
            <div className="mt-4 overflow-x-auto">
              <LineChart {...expensesChartConfig} />
            </div>
          </div>
          
          <div className="card-glass rounded-xl p-6">
            <h2 className="text-xl font-medium mb-4">تقرير الأرباح</h2>
            <div className="mt-4 overflow-x-auto">
              <BarChart {...profitChartConfig} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="sales" className="mt-4 space-y-6">
          <div className="card-glass rounded-xl p-6">
            <h2 className="text-xl font-medium mb-4">الإيرادات حسب الفئة</h2>
            
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="w-full md:w-1/3">
                <PieChart {...pieChartConfig} />
              </div>
              
              <div className="w-full md:w-2/3 mt-6 md:mt-0 space-y-4">
                <h3 className="text-lg font-medium mb-2">تفاصيل الإيرادات</h3>
                {revenueByCategory.map((category) => (
                  <div key={category.name} className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
                    <div className="flex-1">{category.name}</div>
                    <div className="font-medium">{category.value}%</div>
                    <div className="text-muted-foreground text-sm ml-4">{(category.value * 113000 / 100).toLocaleString()} ريال</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="card-glass rounded-xl p-6">
            <h2 className="text-xl font-medium mb-4">أداء المبيعات حسب الفترة</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 border rounded-lg bg-background">
                <p className="text-sm text-muted-foreground">اليوم</p>
                <p className="text-2xl font-bold">2,500 ريال</p>
                <p className="text-xs text-green-600">+5.2% من أمس</p>
              </div>
              <div className="p-4 border rounded-lg bg-background">
                <p className="text-sm text-muted-foreground">هذا الأسبوع</p>
                <p className="text-2xl font-bold">18,300 ريال</p>
                <p className="text-xs text-green-600">+12.8% من الأسبوع الماضي</p>
              </div>
              <div className="p-4 border rounded-lg bg-background">
                <p className="text-sm text-muted-foreground">هذا الشهر</p>
                <p className="text-2xl font-bold">62,500 ريال</p>
                <p className="text-xs text-green-600">+8.5% من الشهر الماضي</p>
              </div>
              <div className="p-4 border rounded-lg bg-background">
                <p className="text-sm text-muted-foreground">هذه السنة</p>
                <p className="text-2xl font-bold">387,200 ريال</p>
                <p className="text-xs text-green-600">+24.3% من السنة الماضية</p>
              </div>
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
                  <tr className="border-b">
                    <td className="py-3 px-4">يناير</td>
                    <td className="py-3 px-4">52,300 ريال</td>
                    <td className="py-3 px-4">18</td>
                    <td className="py-3 px-4">2,905 ريال</td>
                    <td className="py-3 px-4 text-green-600">+12.5%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">فبراير</td>
                    <td className="py-3 px-4">48,150 ريال</td>
                    <td className="py-3 px-4">16</td>
                    <td className="py-3 px-4">3,009 ريال</td>
                    <td className="py-3 px-4 text-red-600">-8.2%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">مارس</td>
                    <td className="py-3 px-4">61,750 ريال</td>
                    <td className="py-3 px-4">20</td>
                    <td className="py-3 px-4">3,087 ريال</td>
                    <td className="py-3 px-4 text-green-600">+28.2%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">أبريل</td>
                    <td className="py-3 px-4">58,400 ريال</td>
                    <td className="py-3 px-4">19</td>
                    <td className="py-3 px-4">3,073 ريال</td>
                    <td className="py-3 px-4 text-red-600">-5.4%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">مايو</td>
                    <td className="py-3 px-4">67,200 ريال</td>
                    <td className="py-3 px-4">23</td>
                    <td className="py-3 px-4">2,921 ريال</td>
                    <td className="py-3 px-4 text-green-600">+15.1%</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">يونيو</td>
                    <td className="py-3 px-4">62,500 ريال</td>
                    <td className="py-3 px-4">21</td>
                    <td className="py-3 px-4">2,976 ريال</td>
                    <td className="py-3 px-4 text-red-600">-7.0%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="clients" className="mt-4 space-y-6">
          <div className="card-glass rounded-xl p-6">
            <h2 className="text-xl font-medium mb-4">أفضل العملاء</h2>
            
            <div className="space-y-4">
              {topClients.map((client, index) => (
                <div key={client.name} className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <span className="font-medium text-primary">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{client.name}</span>
                      <span>{client.value.toLocaleString()} ريال</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${client.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
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
                <div className="flex justify-between items-center">
                  <div className="text-muted-foreground">هذا الشهر</div>
                  <div className="font-medium">8 عملاء</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-muted-foreground">هذه السنة</div>
                  <div className="font-medium">32 عميل</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-muted-foreground">نسبة النمو</div>
                  <div className="font-medium text-green-600">+15.3%</div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium mb-3">أحدث العملاء</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>شركة المستقبل</div>
                    <div className="text-sm text-muted-foreground">منذ 3 أيام</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>مؤسسة الإبداع</div>
                    <div className="text-sm text-muted-foreground">منذ 5 أيام</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>شركة الإنجاز</div>
                    <div className="text-sm text-muted-foreground">منذ أسبوع</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card-glass rounded-xl p-6">
              <h2 className="text-xl font-medium mb-4">تصنيف العملاء</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <div className="flex-1">عملاء منتظمون</div>
                  <div className="font-medium">65%</div>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <div className="flex-1">عملاء نشطون</div>
                  <div className="font-medium">20%</div>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                  <div className="flex-1">عملاء غير نشطين</div>
                  <div className="font-medium">10%</div>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <div className="flex-1">عملاء متوقفون</div>
                  <div className="font-medium">5%</div>
                </div>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}


import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  ArrowUpRight,
  ArrowDownRight,
  Wallet
} from "lucide-react";

// بيانات المخطط الزمني
const timeData = [
  { name: 'يناير', amount: 1200 },
  { name: 'فبراير', amount: 1900 },
  { name: 'مارس', amount: 1500 },
  { name: 'أبريل', amount: 2100 },
  { name: 'مايو', amount: 1800 },
  { name: 'يونيو', amount: 2300 },
  { name: 'يوليو', amount: 2500 },
];

// بيانات الرسم البياني الشريطي
const categoryData = [
  { name: 'مساعدات', value: 35 },
  { name: 'عائلي', value: 25 },
  { name: 'تجاري', value: 20 },
  { name: 'تعليم', value: 15 },
  { name: 'أخرى', value: 5 },
];

// ألوان الرسم البياني الدائري
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// مكون لإحصائية فردية
interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend: "up" | "down" | "neutral";
  trendValue?: string;
}

function StatCard({ title, value, description, icon, trend, trendValue }: StatCardProps) {
  return (
    <Card className="hover-scale">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="p-2 bg-primary/10 rounded-full">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground">
          {trend === "up" && (
            <div className="text-green-600 dark:text-green-400 flex items-center mr-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              {trendValue}
            </div>
          )}
          {trend === "down" && (
            <div className="text-red-600 dark:text-red-400 flex items-center mr-1">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              {trendValue}
            </div>
          )}
          <span>{description}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function TransferStats() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="إجمالي التحويلات"
          value="$12,500"
          description="مقارنة بالشهر الماضي"
          icon={<DollarSign className="h-4 w-4 text-primary" />}
          trend="up"
          trendValue="18%"
        />
        <StatCard
          title="عدد العمليات"
          value="124"
          description="مقارنة بالشهر الماضي"
          icon={<TrendingUp className="h-4 w-4 text-primary" />}
          trend="up"
          trendValue="12%"
        />
        <StatCard
          title="المستلمين"
          value="85"
          description="مقارنة بالشهر الماضي"
          icon={<Users className="h-4 w-4 text-primary" />}
          trend="up"
          trendValue="7%"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">تحويلات على مدار الأشهر</CardTitle>
            <CardDescription>
              إجمالي التحويلات الشهرية (بالدولار الأمريكي)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={timeData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorAmount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">التحويلات حسب الفئة</CardTitle>
            <CardDescription>
              توزيع التحويلات على الفئات المختلفة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex flex-col md:flex-row items-center justify-center">
              <ResponsiveContainer width="60%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col space-y-2 mt-4 md:mt-0">
                {categoryData.map((entry, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span>{entry.name}: {entry.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">المبالغ المحولة لكل فئة</CardTitle>
          <CardDescription>
            مقارنة المبالغ المحولة بين الفئات المختلفة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'مساعدات', amount: 4000 },
                  { name: 'عائلي', amount: 3000 },
                  { name: 'تجاري', amount: 2000 },
                  { name: 'تعليم', amount: 2780 },
                  { name: 'أخرى', amount: 1890 },
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#3b82f6" label={{ position: 'top' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

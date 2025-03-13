
import { useState, useEffect } from 'react';
import { BarChart4, Wallet, CreditCard, DollarSign, BadgePlus, BadgeMinus } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { InvoiceStatus } from '@/components/dashboard/InvoiceStatus';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">لوحة التحكم</h1>
        <div className="flex gap-3 w-full md:w-auto">
          <select className="flex h-9 w-full md:w-[160px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <option value="this-month">هذا الشهر</option>
            <option value="last-month">الشهر الماضي</option>
            <option value="this-year">هذه السنة</option>
          </select>
          <button className="h-9 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            تصدير
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="إجمالي الإيرادات"
          value="45,200 ريال"
          description="خلال هذا الشهر"
          icon={<DollarSign className="h-5 w-5" />}
          trend={{ value: 12.5, positive: true }}
        />
        <StatCard
          title="إجمالي المصروفات"
          value="24,800 ريال"
          description="خلال هذا الشهر"
          icon={<Wallet className="h-5 w-5" />}
          trend={{ value: 3.2, positive: false }}
        />
        <StatCard
          title="الفواتير"
          value="28"
          description="15 مدفوعة، 13 معلقة"
          icon={<CreditCard className="h-5 w-5" />}
          trend={{ value: 8.1, positive: true }}
        />
        <StatCard
          title="صافي الربح"
          value="20,400 ريال"
          description="خلال هذا الشهر"
          icon={<BarChart4 className="h-5 w-5" />}
          trend={{ value: 18.3, positive: true }}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <InvoiceStatus />
        <RecentTransactions />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="card-glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">الإيرادات والمصروفات</h3>
            <select className="text-xs border border-input bg-background px-2 py-1 rounded">
              <option value="this-year">هذه السنة</option>
              <option value="last-year">السنة الماضية</option>
            </select>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BadgePlus className="h-4 w-4 text-green-600" />
                <span className="text-sm">الإيرادات</span>
              </div>
              <span className="text-sm font-medium">252,300 ريال</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-[85%]" />
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-2">
                <BadgeMinus className="h-4 w-4 text-red-600" />
                <span className="text-sm">المصروفات</span>
              </div>
              <span className="text-sm font-medium">187,650 ريال</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-red-500 w-[65%]" />
            </div>
          </div>
        </div>
        
        <div className="card-glass rounded-xl p-5">
          <h3 className="font-medium mb-4">المهام القادمة</h3>
          <div className="space-y-3">
            <div className="p-3 bg-accent rounded-lg">
              <div className="flex items-center gap-3">
                <input type="checkbox" className="h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">دفع فاتورة الكهرباء</p>
                  <p className="text-xs text-muted-foreground">خلال 2 أيام</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-accent rounded-lg">
              <div className="flex items-center gap-3">
                <input type="checkbox" className="h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">مراجعة ميزانية الربع الثاني</p>
                  <p className="text-xs text-muted-foreground">الأسبوع القادم</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-accent rounded-lg">
              <div className="flex items-center gap-3">
                <input type="checkbox" className="h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">اجتماع مع العملاء الجدد</p>
                  <p className="text-xs text-muted-foreground">15 مايو، 2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

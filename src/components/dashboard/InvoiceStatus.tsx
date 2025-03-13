
import { ChartConfig, PieChart } from '@/components/ui/chart';
import { cn } from '@/lib/utils';

const data = [
  { name: 'مدفوعة', value: 65, color: '#10B981' },
  { name: 'معلقة', value: 25, color: '#F59E0B' },
  { name: 'متأخرة', value: 10, color: '#EF4444' }
];

const invoices = [
  { id: 1, number: 'INV-001', client: 'شركة النور', date: '15-05-2023', amount: '2,500 ريال', status: 'paid' },
  { id: 2, number: 'INV-002', client: 'مؤسسة الفجر', date: '12-05-2023', amount: '1,800 ريال', status: 'pending' },
  { id: 3, number: 'INV-003', client: 'شركة السلام', date: '10-05-2023', amount: '3,200 ريال', status: 'paid' },
  { id: 4, number: 'INV-004', client: 'شركة الأمل', date: '05-05-2023', amount: '1,200 ريال', status: 'overdue' }
];

const chartConfig: ChartConfig = {
  data,
  width: 150,
  height: 150,
  innerRadius: 40,
  outerRadius: 70,
  paddingAngle: 5,
  dataKey: "value",
  nameKey: "name",
  colorKey: "color",
};

export function InvoiceStatus() {
  return (
    <div className="card-glass rounded-xl">
      <div className="p-5 border-b border-border">
        <h3 className="font-medium">حالة الفواتير</h3>
      </div>
      
      <div className="p-5 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-shrink-0 flex flex-col items-center">
          <PieChart {...chartConfig} />
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {data.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-muted-foreground">{item.name}</span>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="w-full border-t md:border-t-0 md:border-r border-border pt-5 md:pt-0 md:pr-5">
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex justify-between items-center p-2 hover:bg-accent/30 rounded-md transition-colors">
                <div>
                  <p className="text-sm font-medium">{invoice.number}</p>
                  <p className="text-xs text-muted-foreground">{invoice.client}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{invoice.amount}</p>
                  <p className={cn(
                    "text-xs mt-1 px-2 py-0.5 rounded-full inline-block",
                    invoice.status === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : invoice.status === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  )}>
                    {invoice.status === 'paid' 
                      ? 'مدفوعة' 
                      : invoice.status === 'pending'
                      ? 'معلقة'
                      : 'متأخرة'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-3 border-t border-border bg-card">
        <button className="w-full text-center text-sm text-primary py-1.5 hover:bg-accent rounded-md transition-colors duration-200">
          إنشاء فاتورة جديدة
        </button>
      </div>
    </div>
  );
}

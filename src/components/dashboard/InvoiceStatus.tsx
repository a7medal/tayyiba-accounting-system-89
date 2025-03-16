
import { ChartConfig, PieChart } from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import { Letterhead, PrintHeader } from '@/components/ui/letterhead';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

const data = [
  { name: 'مدفوعة', value: 65, color: '#10B981' },
  { name: 'معلقة', value: 25, color: '#F59E0B' },
  { name: 'متأخرة', value: 10, color: '#EF4444' }
];

const invoices = [
  { id: 1, number: 'INV-001', client: 'شركة النور', date: '15-05-2023', amount: '2,500 MRU', status: 'paid' },
  { id: 2, number: 'INV-002', client: 'مؤسسة الفجر', date: '12-05-2023', amount: '1,800 MRU', status: 'pending' },
  { id: 3, number: 'INV-003', client: 'شركة السلام', date: '10-05-2023', amount: '3,200 MRU', status: 'paid' },
  { id: 4, number: 'INV-004', client: 'شركة الأمل', date: '05-05-2023', amount: '1,200 MRU', status: 'overdue' }
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
  const handlePrintInvoice = (invoiceId: number) => {
    // تحضير محتوى الطباعة
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;
    
    window.print();
  };
  
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
                <div className="text-right flex items-center gap-2">
                  <div>
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
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0"
                    onClick={() => handlePrintInvoice(invoice.id)}
                  >
                    <Printer className="h-4 w-4" />
                  </Button>
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
      
      {/* قسم الطباعة المخفي - سيظهر فقط عند الطباعة */}
      <div className="invoice-print-section print-a5 hidden">
        <PrintHeader 
          title="فاتورة ضريبية" 
          size="a5"
          documentNumber="INV-001"
        />
        
        <div className="mb-4">
          <div className="flex justify-between mb-6">
            <div>
              <h3 className="font-bold">بيانات العميل:</h3>
              <p>الاسم: شركة النور</p>
              <p>العنوان: شارع الاستقلال، نواكشوط</p>
              <p>رقم الهاتف: 1234567890</p>
            </div>
            <div className="text-left">
              <h3 className="font-bold">تفاصيل الفاتورة:</h3>
              <p>رقم الفاتورة: INV-001</p>
              <p>تاريخ الإصدار: 15-05-2023</p>
              <p>تاريخ الاستحقاق: 30-05-2023</p>
            </div>
          </div>
          
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2 text-right">م</th>
                <th className="border p-2 text-right">البيان</th>
                <th className="border p-2 text-right">الكمية</th>
                <th className="border p-2 text-right">السعر</th>
                <th className="border p-2 text-right">الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2 text-right">1</td>
                <td className="border p-2 text-right">خدمات اتصالات</td>
                <td className="border p-2 text-right">1</td>
                <td className="border p-2 text-right">2,000 MRU</td>
                <td className="border p-2 text-right">2,000 MRU</td>
              </tr>
              <tr>
                <td className="border p-2 text-right">2</td>
                <td className="border p-2 text-right">رسوم إضافية</td>
                <td className="border p-2 text-right">1</td>
                <td className="border p-2 text-right">500 MRU</td>
                <td className="border p-2 text-right">500 MRU</td>
              </tr>
              <tr>
                <td colSpan={3} className="border-0"></td>
                <td className="border p-2 text-right font-bold">الإجمالي:</td>
                <td className="border p-2 text-right font-bold">2,500 MRU</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="border-t pt-4 mt-8">
          <div className="flex justify-between">
            <div>
              <p className="font-bold">شروط الدفع:</p>
              <p>يرجى الدفع خلال 15 يوم من تاريخ الفاتورة</p>
            </div>
            <div className="text-center">
              <p className="mb-10">توقيع العميل</p>
              <p>________________________</p>
            </div>
            <div className="text-center">
              <p className="mb-10">ختم الشركة</p>
              <p>________________________</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

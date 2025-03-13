
import { cn } from '@/lib/utils';

const transactions = [
  {
    id: 1,
    description: 'فاتورة مبيعات #1234',
    amount: '1,200.00 ريال',
    date: '10-05-2023',
    status: 'completed',
    type: 'income'
  },
  {
    id: 2,
    description: 'شراء معدات',
    amount: '850.00 ريال',
    date: '08-05-2023',
    status: 'completed',
    type: 'expense'
  },
  {
    id: 3,
    description: 'فاتورة مبيعات #1235',
    amount: '3,400.00 ريال',
    date: '05-05-2023',
    status: 'pending',
    type: 'income'
  },
  {
    id: 4,
    description: 'رواتب الموظفين',
    amount: '4,500.00 ريال',
    date: '01-05-2023',
    status: 'completed',
    type: 'expense'
  },
  {
    id: 5,
    description: 'فاتورة خدمات #332',
    amount: '750.00 ريال',
    date: '29-04-2023',
    status: 'completed',
    type: 'income'
  }
];

export function RecentTransactions() {
  return (
    <div className="card-glass rounded-xl overflow-hidden">
      <div className="p-5 border-b border-border">
        <h3 className="font-medium">آخر المعاملات</h3>
      </div>
      
      <div className="divide-y divide-border">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="p-4 hover:bg-accent/30 transition-colors">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">{transaction.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{transaction.date}</p>
              </div>
              <div className="text-right">
                <p className={cn(
                  "font-medium",
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                )}>
                  {transaction.type === 'income' ? '+' : '-'} {transaction.amount}
                </p>
                <p className={cn(
                  "text-xs mt-1 px-2 py-0.5 rounded-full inline-block",
                  transaction.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-amber-100 text-amber-800'
                )}>
                  {transaction.status === 'completed' ? 'مكتمل' : 'معلق'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-3 border-t border-border bg-card">
        <button className="w-full text-center text-sm text-primary py-1.5 hover:bg-accent rounded-md transition-colors duration-200">
          عرض كل المعاملات
        </button>
      </div>
    </div>
  );
}

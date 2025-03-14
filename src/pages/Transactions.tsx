
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Download, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

// بيانات وهمية للمعاملات
const transactionsData = [
  {
    id: '1',
    date: '15/06/2023',
    description: 'استلام مدفوعات من العميل محمد',
    amount: 12500,
    type: 'income',
    status: 'completed',
    reference: 'INV-2023-001'
  },
  {
    id: '2',
    date: '10/06/2023',
    description: 'دفع فواتير المورد الرئيسي',
    amount: 8750,
    type: 'expense',
    status: 'completed',
    reference: 'EXP-2023-042'
  },
  {
    id: '3',
    date: '05/06/2023',
    description: 'سحب نقدي',
    amount: 5000,
    type: 'withdrawal',
    status: 'completed',
    reference: 'WTH-2023-007'
  },
  {
    id: '4',
    date: '01/06/2023',
    description: 'إيداع في الحساب البنكي',
    amount: 15000,
    type: 'deposit',
    status: 'pending',
    reference: 'DEP-2023-012'
  },
  {
    id: '5',
    date: '25/05/2023',
    description: 'تحويل إلى حساب الفرع',
    amount: 7500,
    type: 'transfer',
    status: 'completed',
    reference: 'TRF-2023-019'
  }
];

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [transactionType, setTransactionType] = useState('all');
  const { toast } = useToast();

  const filteredTransactions = transactionsData.filter(
    (transaction) => {
      const matchesSearch = transaction.description.includes(searchTerm) || 
                           transaction.reference.includes(searchTerm);
      const matchesType = transactionType === 'all' || transaction.type === transactionType;
      
      return matchesSearch && matchesType;
    }
  );

  const handleExport = () => {
    toast({
      title: "تم تصدير المعاملات",
      description: "تم تصدير المعاملات بنجاح إلى ملف إكسل",
    });
  };

  const handleAddTransaction = () => {
    toast({
      title: "إضافة معاملة جديدة",
      description: "تم فتح نموذج إضافة معاملة جديدة",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'income':
        return 'text-green-600 dark:text-green-400';
      case 'expense':
        return 'text-red-600 dark:text-red-400';
      case 'withdrawal':
        return 'text-orange-600 dark:text-orange-400';
      case 'deposit':
        return 'text-blue-600 dark:text-blue-400';
      case 'transfer':
        return 'text-purple-600 dark:text-purple-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">المعاملات المالية</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            تصدير
          </Button>
          <Button size="sm" onClick={handleAddTransaction}>
            <Plus className="h-4 w-4 mr-2" />
            معاملة جديدة
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">جميع المعاملات</TabsTrigger>
          <TabsTrigger value="income">المقبوضات</TabsTrigger>
          <TabsTrigger value="expense">المصروفات</TabsTrigger>
          <TabsTrigger value="transfer">التحويلات</TabsTrigger>
        </TabsList>

        <div className="card-glass rounded-xl p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative sm:max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="البحث في المعاملات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={transactionType}
                onValueChange={setTransactionType}
              >
                <SelectTrigger className="max-w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="نوع المعاملة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المعاملات</SelectItem>
                  <SelectItem value="income">المقبوضات</SelectItem>
                  <SelectItem value="expense">المصروفات</SelectItem>
                  <SelectItem value="withdrawal">السحب</SelectItem>
                  <SelectItem value="deposit">الإيداع</SelectItem>
                  <SelectItem value="transfer">التحويلات</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>الوصف</TableHead>
                  <TableHead>المبلغ (MRU)</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>المرجع</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell className={getTypeColor(transaction.type)}>
                        {transaction.type === 'expense' || transaction.type === 'withdrawal' 
                          ? `- ${transaction.amount.toLocaleString()}`
                          : transaction.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex">
                          {transaction.type === 'income' && 'مقبوضات'}
                          {transaction.type === 'expense' && 'مصروفات'}
                          {transaction.type === 'withdrawal' && 'سحب'}
                          {transaction.type === 'deposit' && 'إيداع'}
                          {transaction.type === 'transfer' && 'تحويل'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                          {transaction.status === 'completed' && 'مكتمل'}
                          {transaction.status === 'pending' && 'قيد المعالجة'}
                          {transaction.status === 'failed' && 'فشل'}
                        </span>
                      </TableCell>
                      <TableCell>{transaction.reference}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      لا توجد معاملات مطابقة للبحث
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="income" className="mt-0">
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>الوصف</TableHead>
                  <TableHead>المبلغ (MRU)</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>المرجع</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.filter(t => t.type === 'income').length > 0 ? (
                  filteredTransactions
                    .filter(t => t.type === 'income')
                    .map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell className="text-green-600 dark:text-green-400">
                          {transaction.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                            {transaction.status === 'completed' && 'مكتمل'}
                            {transaction.status === 'pending' && 'قيد المعالجة'}
                            {transaction.status === 'failed' && 'فشل'}
                          </span>
                        </TableCell>
                        <TableCell>{transaction.reference}</TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      لا توجد مقبوضات مطابقة للبحث
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="expense" className="mt-0">
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>الوصف</TableHead>
                  <TableHead>المبلغ (MRU)</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>المرجع</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.filter(t => t.type === 'expense').length > 0 ? (
                  filteredTransactions
                    .filter(t => t.type === 'expense')
                    .map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell className="text-red-600 dark:text-red-400">
                          - {transaction.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                            {transaction.status === 'completed' && 'مكتمل'}
                            {transaction.status === 'pending' && 'قيد المعالجة'}
                            {transaction.status === 'failed' && 'فشل'}
                          </span>
                        </TableCell>
                        <TableCell>{transaction.reference}</TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      لا توجد مصروفات مطابقة للبحث
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="transfer" className="mt-0">
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>الوصف</TableHead>
                  <TableHead>المبلغ (MRU)</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>المرجع</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.filter(t => t.type === 'transfer').length > 0 ? (
                  filteredTransactions
                    .filter(t => t.type === 'transfer')
                    .map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell className="text-purple-600 dark:text-purple-400">
                          {transaction.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                            {transaction.status === 'completed' && 'مكتمل'}
                            {transaction.status === 'pending' && 'قيد المعالجة'}
                            {transaction.status === 'failed' && 'فشل'}
                          </span>
                        </TableCell>
                        <TableCell>{transaction.reference}</TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      لا توجد تحويلات مطابقة للبحث
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

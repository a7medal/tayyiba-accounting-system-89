
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Eye
} from 'lucide-react';

interface Transfer {
  id: string;
  date: string;
  recipient: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  transactionId: string;
}

// بيانات تجريبية
const mockTransfers: Transfer[] = [
  {
    id: '1',
    date: '2023-05-18',
    recipient: 'محمد أحمد',
    amount: 500,
    status: 'completed',
    transactionId: 'TX12345',
  },
  {
    id: '2',
    date: '2023-05-17',
    recipient: 'علي محمود',
    amount: 300,
    status: 'completed',
    transactionId: 'TX12346',
  },
  {
    id: '3',
    date: '2023-05-16',
    recipient: 'سارة خالد',
    amount: 750,
    status: 'pending',
    transactionId: 'TX12347',
  },
  {
    id: '4',
    date: '2023-05-15',
    recipient: 'عمر حسن',
    amount: 200,
    status: 'failed',
    transactionId: 'TX12348',
  },
  {
    id: '5',
    date: '2023-05-14',
    recipient: 'فاطمة علي',
    amount: 1000,
    status: 'completed',
    transactionId: 'TX12349',
  },
];

export function TransferHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTransfers, setFilteredTransfers] = useState<Transfer[]>(mockTransfers);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    const filtered = mockTransfers.filter(transfer => 
      transfer.recipient.includes(term) || 
      transfer.transactionId.includes(term)
    );
    
    setFilteredTransfers(filtered);
  };
  
  const getStatusBadge = (status: Transfer['status']) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
            مكتمل
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-800">
            <Clock className="h-3.5 w-3.5 mr-1" />
            قيد الانتظار
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800">
            <XCircle className="h-3.5 w-3.5 mr-1" />
            فشل
          </Badge>
        );
    }
  };
  
  return (
    <Card className="border-border bg-card/90 backdrop-blur-sm shadow-md">
      <CardHeader>
        <CardTitle>سجل التحويلات</CardTitle>
        <CardDescription>
          عرض تاريخ جميع عمليات التحويل التي قمت بها
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث عن تحويل..."
              value={searchTerm}
              onChange={handleSearch}
              className="pr-9"
            />
          </div>
          <Button variant="outline" className="flex gap-2">
            <Filter className="h-4 w-4" />
            تصفية
          </Button>
          <Button variant="outline" className="flex gap-2">
            <ArrowUpDown className="h-4 w-4" />
            ترتيب
          </Button>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableCaption>
              {filteredTransfers.length 
                ? `إجمالي عدد التحويلات: ${filteredTransfers.length}` 
                : "لا توجد تحويلات مطابقة للبحث"}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>التاريخ</TableHead>
                <TableHead>المستلم</TableHead>
                <TableHead>المبلغ</TableHead>
                <TableHead>رقم التحويل</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransfers.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell className="font-medium">
                    {new Date(transfer.date).toLocaleDateString('ar-EG')}
                  </TableCell>
                  <TableCell>{transfer.recipient}</TableCell>
                  <TableCell>${transfer.amount.toFixed(2)}</TableCell>
                  <TableCell>{transfer.transactionId}</TableCell>
                  <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                  <TableCell className="text-left">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 ml-1" />
                      عرض
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

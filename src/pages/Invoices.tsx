import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileSearch, Download, Edit, Printer, ArrowLeft } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// بيانات الفواتير النموذجية
const dummyInvoices = [
  { 
    id: 1, 
    number: 'INV-2023-001', 
    client: 'شركة النور', 
    date: '2023-05-15', 
    dueDate: '2023-06-15', 
    amount: 2500, 
    status: 'paid',
    items: [
      { description: 'خدمات استشارية', quantity: 1, price: 2000 },
      { description: 'تقارير تحليلية', quantity: 1, price: 500 }
    ]
  },
  { 
    id: 2, 
    number: 'INV-2023-002', 
    client: 'مؤسسة الفجر', 
    date: '2023-05-20', 
    dueDate: '2023-06-20', 
    amount: 1800, 
    status: 'pending',
    items: [
      { description: 'صيانة نظام محاسبي', quantity: 1, price: 1800 }
    ]
  },
  { 
    id: 3, 
    number: 'INV-2023-003', 
    client: 'شركة السلام', 
    date: '2023-05-25', 
    dueDate: '2023-06-25', 
    amount: 3200, 
    status: 'paid',
    items: [
      { description: 'تطوير برمجيات', quantity: 1, price: 2500 },
      { description: 'دعم فني', quantity: 2, price: 350 }
    ]
  },
  { 
    id: 4, 
    number: 'INV-2023-004', 
    client: 'شركة الأمل', 
    date: '2023-06-01', 
    dueDate: '2023-07-01', 
    amount: 1200, 
    status: 'overdue',
    items: [
      { description: 'تدريب موظفين', quantity: 3, price: 400 }
    ]
  },
  { 
    id: 5, 
    number: 'INV-2023-005', 
    client: 'مؤسسة البركة', 
    date: '2023-06-05', 
    dueDate: '2023-07-05', 
    amount: 4500, 
    status: 'draft',
    items: [
      { description: 'دراسة جدوى', quantity: 1, price: 3500 },
      { description: 'تحليل مالي', quantity: 1, price: 1000 }
    ]
  }
];

export default function Invoices() {
  const [invoices, setInvoices] = useState(dummyInvoices);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState<null | any>(null);
  const [showDetails, setShowDetails] = useState(false);

  const filteredInvoices = activeTab === 'all' 
    ? invoices 
    : invoices.filter(invoice => invoice.status === activeTab);

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'مدفوعة';
      case 'pending':
        return 'معلقة';
      case 'overdue':
        return 'متأخرة';
      case 'draft':
        return 'مسودة';
      default:
        return status;
    }
  };
  
  return (
    <div className="animate-fade-in">
      {!showDetails ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">الفواتير</h1>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              فاتورة جديدة
            </Button>
          </div>

          <div className="card-glass rounded-xl overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="p-4 border-b border-border">
                <TabsList className="grid grid-cols-5 mb-0">
                  <TabsTrigger value="all">الكل</TabsTrigger>
                  <TabsTrigger value="draft">مسودة</TabsTrigger>
                  <TabsTrigger value="pending">معلقة</TabsTrigger>
                  <TabsTrigger value="paid">مدفوعة</TabsTrigger>
                  <TabsTrigger value="overdue">متأخرة</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value={activeTab} className="m-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>رقم الفاتورة</TableHead>
                      <TableHead>العميل</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>تاريخ الاستحقاق</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.length > 0 ? (
                      filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.id} className="cursor-pointer hover:bg-accent/50">
                          <TableCell className="font-medium">{invoice.number}</TableCell>
                          <TableCell>{invoice.client}</TableCell>
                          <TableCell>{new Date(invoice.date).toLocaleDateString('ar-SA')}</TableCell>
                          <TableCell>{new Date(invoice.dueDate).toLocaleDateString('ar-SA')}</TableCell>
                          <TableCell>{invoice.amount.toLocaleString()} أوقية</TableCell>
                          <TableCell>
                            <span className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium",
                              getStatusBadgeClass(invoice.status)
                            )}>
                              {getStatusText(invoice.status)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewInvoice(invoice)}
                              >
                                <FileSearch className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          لا توجد فواتير بالمعايير المحددة
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </div>
        </>
      ) : (
        <div className="invoice-print-section">
          <div className="card-glass rounded-xl p-6">
            <div className="flex justify-between items-center mb-6 no-print">
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleCloseDetails} className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  العودة
                </Button>
                <h2 className="text-xl font-bold">تفاصيل الفاتورة {selectedInvoice?.number}</h2>
              </div>
              <div className="flex gap-2">
                <Button onClick={handlePrintInvoice} className="flex items-center gap-2">
                  <Printer className="h-4 w-4" />
                  طباعة
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  تحميل
                </Button>
              </div>
            </div>
            
            <div className="mb-8 text-center print-only" style={{ display: 'none' }}>
              <div className="flex justify-center items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-lg font-bold text-primary-foreground">ط</span>
                </div>
                <h1 className="text-2xl font-bold">شركة طيبة</h1>
              </div>
              <p className="text-sm text-muted-foreground">نواكشوط، موريتانيا | هاتف: 123456789 | البريد الإلكتروني: info@taibah.mr</p>
            </div>

            <div className="border-b border-border pb-6 mb-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">معلومات العميل</h3>
                  <p className="font-medium text-lg">{selectedInvoice?.client}</p>
                  <p className="text-muted-foreground">العنوان: نواكشوط، موريتانيا</p>
                  <p className="text-muted-foreground">رقم الهاتف: 123456789</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <h3 className="text-sm font-medium text-muted-foreground">رقم الفاتورة:</h3>
                    <p className="font-medium">{selectedInvoice?.number}</p>
                  </div>
                  <div className="flex justify-between">
                    <h3 className="text-sm font-medium text-muted-foreground">تاريخ الإصدار:</h3>
                    <p>{new Date(selectedInvoice?.date).toLocaleDateString('ar-SA')}</p>
                  </div>
                  <div className="flex justify-between">
                    <h3 className="text-sm font-medium text-muted-foreground">تاريخ الاستحقاق:</h3>
                    <p>{new Date(selectedInvoice?.dueDate).toLocaleDateString('ar-SA')}</p>
                  </div>
                  <div className="flex justify-between">
                    <h3 className="text-sm font-medium text-muted-foreground">الحالة:</h3>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      getStatusBadgeClass(selectedInvoice?.status)
                    )}>
                      {getStatusText(selectedInvoice?.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg overflow-hidden mb-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الوصف</TableHead>
                    <TableHead className="text-center">الكمية</TableHead>
                    <TableHead className="text-center">السعر</TableHead>
                    <TableHead className="text-center">الإجمالي</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedInvoice?.items.map((item: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-center">{item.price.toLocaleString()} أوقية</TableCell>
                      <TableCell className="text-center">{(item.quantity * item.price).toLocaleString()} أوقية</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex justify-end">
              <div className="w-72 space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">المجموع الفرعي:</span>
                  <span>{selectedInvoice?.amount.toLocaleString()} أوقية</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">ضريبة القيمة المضافة (15%):</span>
                  <span>{(selectedInvoice?.amount * 0.15).toLocaleString()} أوقية</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-bold">الإجمالي:</span>
                  <span className="font-bold">{(selectedInvoice?.amount * 1.15).toLocaleString()} أوقية</span>
                </div>
              </div>
            </div>
            
            <div className="mt-10 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">شكراً لتعاملكم معنا!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

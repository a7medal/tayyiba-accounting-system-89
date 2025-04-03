
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileSearch, Download, Edit, Printer, ArrowLeft } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

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

interface InvoiceFormData {
  client: string;
  amount: number;
  dueDate: string;
  items: { description: string; quantity: number; price: number }[];
}

export default function Invoices() {
  const [invoices, setInvoices] = useState(dummyInvoices);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState<null | any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [newInvoiceData, setNewInvoiceData] = useState<InvoiceFormData>({
    client: '',
    amount: 0,
    dueDate: new Date().toISOString().split('T')[0],
    items: [{ description: '', quantity: 1, price: 0 }]
  });
  const { toast } = useToast();

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

  const handleAddInvoice = () => {
    const newInvoice = {
      id: invoices.length + 1,
      number: `INV-${new Date().getFullYear()}-${(invoices.length + 1).toString().padStart(3, '0')}`,
      client: newInvoiceData.client,
      date: new Date().toISOString().split('T')[0],
      dueDate: newInvoiceData.dueDate,
      amount: newInvoiceData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0),
      status: 'pending',
      items: newInvoiceData.items
    };
    
    setInvoices([...invoices, newInvoice]);
    setNewInvoiceData({
      client: '',
      amount: 0,
      dueDate: new Date().toISOString().split('T')[0],
      items: [{ description: '', quantity: 1, price: 0 }]
    });
    
    toast({
      title: "تمت الإضافة",
      description: "تمت إضافة الفاتورة الجديدة بنجاح",
    });
  };

  const handleAddInvoiceItem = () => {
    setNewInvoiceData({
      ...newInvoiceData,
      items: [...newInvoiceData.items, { description: '', quantity: 1, price: 0 }]
    });
  };

  const handleRemoveInvoiceItem = (index: number) => {
    const updatedItems = [...newInvoiceData.items];
    updatedItems.splice(index, 1);
    setNewInvoiceData({
      ...newInvoiceData,
      items: updatedItems
    });
  };

  const handleChangeInvoiceItem = (index: number, field: 'description' | 'quantity' | 'price', value: string | number) => {
    const updatedItems = [...newInvoiceData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'description' ? value : Number(value)
    };
    setNewInvoiceData({
      ...newInvoiceData,
      items: updatedItems
    });
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
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  فاتورة جديدة
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>إضافة فاتورة جديدة</DialogTitle>
                  <DialogDescription>
                    أدخل بيانات الفاتورة الجديدة
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="client">اسم العميل</Label>
                      <Input 
                        id="client"
                        value={newInvoiceData.client}
                        onChange={(e) => setNewInvoiceData({...newInvoiceData, client: e.target.value})}
                        placeholder="أدخل اسم العميل"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dueDate">تاريخ الاستحقاق</Label>
                      <Input 
                        id="dueDate"
                        type="date"
                        value={newInvoiceData.dueDate}
                        onChange={(e) => setNewInvoiceData({...newInvoiceData, dueDate: e.target.value})}
                      />
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">البنود</h3>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={handleAddInvoiceItem}
                        >
                          إضافة بند
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        {newInvoiceData.items.map((item, index) => (
                          <div key={index} className="grid grid-cols-12 gap-2 items-end">
                            <div className="col-span-5">
                              <Label htmlFor={`item-desc-${index}`}>الوصف</Label>
                              <Input 
                                id={`item-desc-${index}`}
                                value={item.description}
                                onChange={(e) => handleChangeInvoiceItem(index, 'description', e.target.value)}
                                placeholder="وصف البند"
                              />
                            </div>
                            <div className="col-span-2">
                              <Label htmlFor={`item-qty-${index}`}>الكمية</Label>
                              <Input 
                                id={`item-qty-${index}`}
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleChangeInvoiceItem(index, 'quantity', e.target.value)}
                                min={1}
                              />
                            </div>
                            <div className="col-span-3">
                              <Label htmlFor={`item-price-${index}`}>السعر</Label>
                              <Input 
                                id={`item-price-${index}`}
                                type="number"
                                value={item.price}
                                onChange={(e) => handleChangeInvoiceItem(index, 'price', e.target.value)}
                                min={0}
                              />
                            </div>
                            <div className="col-span-2">
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm"
                                className="w-full"
                                onClick={() => handleRemoveInvoiceItem(index)}
                                disabled={newInvoiceData.items.length <= 1}
                              >
                                حذف
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="font-medium">المجموع:</span>
                      <span>
                        {newInvoiceData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toLocaleString()} أوقية
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={handleAddInvoice}>إضافة الفاتورة</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
            
            <div className="mb-8 border-b pb-6">
              <div className="flex justify-center items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xl font-bold text-primary-foreground">ط</span>
                </div>
                <h1 className="text-2xl font-bold">طيبة المدينة تلكوم</h1>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                نواكشوط، موريتانيا | هاتف: 22371138 / 41101138 | البريد الإلكتروني: taybaelmedintelecom@gmail.com
              </p>
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

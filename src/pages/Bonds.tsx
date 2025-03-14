
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileSearch, Download, Edit, Printer, ArrowLeft, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { 
  Bond, 
  BondType, 
  BondStatus, 
  initialBonds, 
  getBondTypeLabel, 
  getBondStatusLabel, 
  getBondStatusColor 
} from '@/types/bond';

export default function Bonds() {
  const [bonds, setBonds] = useState<Bond[]>(initialBonds);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedBond, setSelectedBond] = useState<Bond | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newBond, setNewBond] = useState<Partial<Bond>>({
    type: 'receipt',
    status: 'draft',
    date: new Date().toISOString().split('T')[0],
    currency: 'MRU'
  });
  const { toast } = useToast();

  const filteredBonds = activeTab === 'all' 
    ? bonds 
    : bonds.filter(bond => bond.type === activeTab || bond.status === activeTab);

  const handleViewBond = (bond: Bond) => {
    setSelectedBond(bond);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const handlePrintBond = () => {
    window.print();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewBond(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) : value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewBond(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateBond = () => {
    const bondToCreate: Bond = {
      id: Date.now().toString(),
      number: `B-${new Date().getFullYear()}-${(bonds.length + 1).toString().padStart(3, '0')}`,
      date: newBond.date || new Date().toISOString().split('T')[0],
      amount: newBond.amount || 0,
      type: newBond.type as BondType,
      status: newBond.status as BondStatus,
      description: newBond.description || '',
      clientName: newBond.clientName,
      clientId: newBond.clientId,
      issuedBy: 'أحمد محمد', // This should be the current user
      currency: 'MRU',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setBonds(prev => [bondToCreate, ...prev]);
    setIsCreateDialogOpen(false);
    setNewBond({
      type: 'receipt',
      status: 'draft',
      date: new Date().toISOString().split('T')[0],
      currency: 'MRU'
    });

    toast({
      title: "تم إنشاء السند بنجاح",
      description: `تم إنشاء السند رقم ${bondToCreate.number} بنجاح`
    });
  };

  const handleEditBond = () => {
    if (!selectedBond) return;

    setBonds(prev => prev.map(bond => 
      bond.id === selectedBond.id 
        ? { ...bond, ...newBond, updatedAt: new Date().toISOString() } 
        : bond
    ));
    
    setIsEditDialogOpen(false);
    
    toast({
      title: "تم تحديث السند بنجاح",
      description: `تم تحديث السند رقم ${selectedBond.number} بنجاح`
    });
  };

  const handleEditClick = (bond: Bond) => {
    setSelectedBond(bond);
    setNewBond(bond);
    setIsEditDialogOpen(true);
  };

  const handleDeleteBond = (id: string) => {
    setBonds(prev => prev.filter(bond => bond.id !== id));
    toast({
      title: "تم حذف السند بنجاح",
      description: "تم حذف السند المحدد بنجاح"
    });
  };

  return (
    <div className="animate-fade-in">
      {!showDetails ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">السندات</h1>
            <Button 
              className="flex items-center gap-2"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <PlusCircle className="h-4 w-4" />
              سند جديد
            </Button>
          </div>

          <div className="card-glass rounded-xl overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="p-4 border-b border-border">
                <TabsList className="grid grid-cols-6 mb-0">
                  <TabsTrigger value="all">الكل</TabsTrigger>
                  <TabsTrigger value="receipt">سندات قبض</TabsTrigger>
                  <TabsTrigger value="payment">سندات صرف</TabsTrigger>
                  <TabsTrigger value="voucher">سندات قيد</TabsTrigger>
                  <TabsTrigger value="approved">معتمدة</TabsTrigger>
                  <TabsTrigger value="pending">معلقة</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value={activeTab} className="m-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>رقم السند</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>نوع السند</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>الوصف</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBonds.length > 0 ? (
                      filteredBonds.map((bond) => (
                        <TableRow key={bond.id} className="cursor-pointer hover:bg-accent/50">
                          <TableCell className="font-medium">{bond.number}</TableCell>
                          <TableCell>{new Date(bond.date).toLocaleDateString('ar-SA')}</TableCell>
                          <TableCell>{getBondTypeLabel(bond.type)}</TableCell>
                          <TableCell>{bond.amount.toLocaleString()} أوقية</TableCell>
                          <TableCell className="max-w-xs truncate">{bond.description}</TableCell>
                          <TableCell>
                            <span className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium",
                              getBondStatusColor(bond.status)
                            )}>
                              {getBondStatusLabel(bond.status)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewBond(bond)}
                              >
                                <FileSearch className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditClick(bond)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteBond(bond.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          لا توجد سندات بالمعايير المحددة
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
        <div className="bond-print-section">
          <div className="card-glass rounded-xl p-6">
            <div className="flex justify-between items-center mb-6 no-print">
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleCloseDetails} className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  العودة
                </Button>
                <h2 className="text-xl font-bold">تفاصيل السند {selectedBond?.number}</h2>
              </div>
              <div className="flex gap-2">
                <Button onClick={handlePrintBond} className="flex items-center gap-2">
                  <Printer className="h-4 w-4" />
                  طباعة
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => handleEditClick(selectedBond as Bond)}
                >
                  <Edit className="h-4 w-4" />
                  تعديل
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
                  <h3 className="text-lg font-medium mb-2">معلومات السند</h3>
                  <p className="mb-1"><span className="font-semibold">نوع السند:</span> {getBondTypeLabel(selectedBond?.type as BondType)}</p>
                  {selectedBond?.clientName && (
                    <p className="mb-1"><span className="font-semibold">اسم العميل:</span> {selectedBond.clientName}</p>
                  )}
                  <p className="mb-1"><span className="font-semibold">أصدره:</span> {selectedBond?.issuedBy}</p>
                  {selectedBond?.approvedBy && (
                    <p className="mb-1"><span className="font-semibold">اعتمده:</span> {selectedBond.approvedBy}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <h3 className="text-sm font-medium text-muted-foreground">رقم السند:</h3>
                    <p className="font-medium">{selectedBond?.number}</p>
                  </div>
                  <div className="flex justify-between">
                    <h3 className="text-sm font-medium text-muted-foreground">التاريخ:</h3>
                    <p>{new Date(selectedBond?.date || '').toLocaleDateString('ar-SA')}</p>
                  </div>
                  <div className="flex justify-between">
                    <h3 className="text-sm font-medium text-muted-foreground">الحالة:</h3>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      getBondStatusColor(selectedBond?.status as BondStatus)
                    )}>
                      {getBondStatusLabel(selectedBond?.status as BondStatus)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">البيانات المالية</h3>
              <div className="flex justify-between items-center border-b border-border py-3">
                <span className="font-semibold">المبلغ:</span>
                <span className="text-lg font-bold">{selectedBond?.amount.toLocaleString()} أوقية</span>
              </div>
            </div>
            
            <div className="mb-10">
              <h3 className="text-lg font-medium mb-2">الوصف</h3>
              <div className="border rounded-lg p-4 bg-muted/30">
                <p>{selectedBond?.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-10 pt-6 border-t border-border no-print">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">تاريخ الإنشاء: {new Date(selectedBond?.createdAt || '').toLocaleDateString('ar-SA')}</p>
              </div>
              <div className="text-left">
                <p className="text-sm text-muted-foreground">آخر تحديث: {new Date(selectedBond?.updatedAt || '').toLocaleDateString('ar-SA')}</p>
              </div>
            </div>
            
            <div className="mt-10 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">هذا المستند إلكتروني وصالح بدون توقيع</p>
            </div>
          </div>
        </div>
      )}

      {/* إنشاء سند جديد */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>إنشاء سند جديد</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">نوع السند</Label>
                <Select 
                  value={newBond.type} 
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="اختر نوع السند" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receipt">سند قبض</SelectItem>
                    <SelectItem value="payment">سند صرف</SelectItem>
                    <SelectItem value="voucher">سند قيد</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">التاريخ</Label>
                <Input 
                  id="date" 
                  type="date" 
                  name="date"
                  value={newBond.date}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">المبلغ (أوقية)</Label>
              <Input 
                id="amount" 
                type="number" 
                name="amount"
                placeholder="أدخل المبلغ"
                value={newBond.amount || ''}
                onChange={handleInputChange}
              />
            </div>
            {(newBond.type === 'receipt') && (
              <div className="space-y-2">
                <Label htmlFor="clientName">اسم العميل</Label>
                <Input 
                  id="clientName" 
                  name="clientName"
                  placeholder="أدخل اسم العميل"
                  value={newBond.clientName || ''}
                  onChange={handleInputChange}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="description">الوصف</Label>
              <Textarea 
                id="description" 
                name="description"
                placeholder="أدخل وصف السند"
                value={newBond.description || ''}
                onChange={handleInputChange}
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">الحالة</Label>
              <Select 
                value={newBond.status} 
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="اختر حالة السند" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">مسودة</SelectItem>
                  <SelectItem value="pending">معلق</SelectItem>
                  <SelectItem value="approved">معتمد</SelectItem>
                  <SelectItem value="rejected">مرفوض</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleCreateBond}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* تعديل سند */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>تعديل السند {selectedBond?.number}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-type">نوع السند</Label>
                <Select 
                  value={newBond.type} 
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger id="edit-type">
                    <SelectValue placeholder="اختر نوع السند" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receipt">سند قبض</SelectItem>
                    <SelectItem value="payment">سند صرف</SelectItem>
                    <SelectItem value="voucher">سند قيد</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-date">التاريخ</Label>
                <Input 
                  id="edit-date" 
                  type="date" 
                  name="date"
                  value={newBond.date?.split('T')[0]}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-amount">المبلغ (أوقية)</Label>
              <Input 
                id="edit-amount" 
                type="number" 
                name="amount"
                placeholder="أدخل المبلغ"
                value={newBond.amount || ''}
                onChange={handleInputChange}
              />
            </div>
            {(newBond.type === 'receipt') && (
              <div className="space-y-2">
                <Label htmlFor="edit-clientName">اسم العميل</Label>
                <Input 
                  id="edit-clientName" 
                  name="clientName"
                  placeholder="أدخل اسم العميل"
                  value={newBond.clientName || ''}
                  onChange={handleInputChange}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="edit-description">الوصف</Label>
              <Textarea 
                id="edit-description" 
                name="description"
                placeholder="أدخل وصف السند"
                value={newBond.description || ''}
                onChange={handleInputChange}
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">الحالة</Label>
              <Select 
                value={newBond.status} 
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger id="edit-status">
                  <SelectValue placeholder="اختر حالة السند" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">مسودة</SelectItem>
                  <SelectItem value="pending">معلق</SelectItem>
                  <SelectItem value="approved">معتمد</SelectItem>
                  <SelectItem value="rejected">مرفوض</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEditBond}>حفظ التغييرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

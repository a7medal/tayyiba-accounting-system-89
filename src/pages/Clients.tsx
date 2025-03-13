
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, UserCheck, Phone, Mail, Building, Edit, Trash, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';

// بيانات العملاء النموذجية
const dummyClients = [
  {
    id: 1,
    name: 'شركة النور',
    contact: 'أحمد محمد',
    email: 'ahmed@alnoor.com',
    phone: '966512345678',
    type: 'corporate',
    address: 'الرياض، المملكة العربية السعودية',
    status: 'active',
    totalSpent: 15200,
    invoices: 5
  },
  {
    id: 2,
    name: 'مؤسسة الفجر',
    contact: 'محمد علي',
    email: 'mohamed@alfajr.com',
    phone: '966598765432',
    type: 'corporate',
    address: 'جدة، المملكة العربية السعودية',
    status: 'active',
    totalSpent: 8300,
    invoices: 3
  },
  {
    id: 3,
    name: 'عبدالله الأحمد',
    contact: 'عبدالله الأحمد',
    email: 'abdullah@example.com',
    phone: '966555555555',
    type: 'individual',
    address: 'الدمام، المملكة العربية السعودية',
    status: 'inactive',
    totalSpent: 1200,
    invoices: 1
  },
  {
    id: 4,
    name: 'شركة السلام',
    contact: 'سارة محمود',
    email: 'sara@alsalam.com',
    phone: '966522222222',
    type: 'corporate',
    address: 'مكة، المملكة العربية السعودية',
    status: 'active',
    totalSpent: 23500,
    invoices: 8
  },
  {
    id: 5,
    name: 'مؤسسة الأمل',
    contact: 'خالد العمري',
    email: 'khaled@alamal.com',
    phone: '966533333333',
    type: 'corporate',
    address: 'المدينة، المملكة العربية السعودية',
    status: 'active',
    totalSpent: 18700,
    invoices: 6
  }
];

export default function Clients() {
  const [clients, setClients] = useState(dummyClients);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddClient, setShowAddClient] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    type: 'corporate',
    address: '',
  });

  // تصفية العملاء بناءً على الحالة
  const filteredClients = clients.filter(client => {
    // تصفية حسب الحالة
    if (activeTab !== 'all' && client.status !== activeTab) return false;
    
    // تصفية حسب البحث
    if (searchTerm && !client.name.includes(searchTerm) && 
        !client.contact.includes(searchTerm) && 
        !client.email.includes(searchTerm)) {
      return false;
    }
    
    return true;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClient(prev => ({ ...prev, [name]: value }));
  };

  const handleAddClient = () => {
    // التحقق من صحة البيانات
    if (!newClient.name || !newClient.email || !newClient.phone) {
      return;
    }
    
    const newClientData = {
      ...newClient,
      id: clients.length + 1,
      status: 'active',
      totalSpent: 0,
      invoices: 0
    };
    
    setClients([...clients, newClientData]);
    setShowAddClient(false);
    setNewClient({
      name: '',
      contact: '',
      email: '',
      phone: '',
      type: 'corporate',
      address: '',
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">العملاء</h1>
        <Button className="flex items-center gap-2" onClick={() => setShowAddClient(true)}>
          <PlusCircle className="h-4 w-4" />
          عميل جديد
        </Button>

        {/* نافذة إضافة عميل جديد */}
        <Dialog open={showAddClient} onOpenChange={setShowAddClient}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>إضافة عميل جديد</DialogTitle>
              <DialogDescription>
                أدخل معلومات العميل الجديد. اضغط على "إضافة" عند الانتهاء.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">اسم العميل</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newClient.name}
                    onChange={handleInputChange}
                    placeholder="اسم الشركة أو الشخص"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contact">جهة الاتصال</Label>
                  <Input
                    id="contact"
                    name="contact"
                    value={newClient.contact}
                    onChange={handleInputChange}
                    placeholder="اسم الشخص المسؤول"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newClient.email}
                    onChange={handleInputChange}
                    placeholder="example@domain.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={newClient.phone}
                    onChange={handleInputChange}
                    placeholder="966512345678"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">نوع العميل</Label>
                <select
                  id="type"
                  name="type"
                  value={newClient.type}
                  onChange={(e) => setNewClient(prev => ({ ...prev, type: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                >
                  <option value="corporate">شركة</option>
                  <option value="individual">فرد</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">العنوان</Label>
                <Input
                  id="address"
                  name="address"
                  value={newClient.address}
                  onChange={handleInputChange}
                  placeholder="المدينة، البلد"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddClient(false)}>إلغاء</Button>
              <Button type="submit" onClick={handleAddClient}>إضافة</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="w-full md:w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="بحث عن عميل..."
              className="pl-10 pr-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="all">الكل</TabsTrigger>
            <TabsTrigger value="active">نشط</TabsTrigger>
            <TabsTrigger value="inactive">غير نشط</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <div key={client.id} className="card-glass rounded-xl p-5 hover-scale">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{client.name}</h3>
                  <p className="text-muted-foreground text-sm">{client.contact}</p>
                </div>
                <div className={cn(
                  "rounded-full px-2 py-1 text-xs",
                  client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                )}>
                  {client.status === 'active' ? 'نشط' : 'غير نشط'}
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{client.address}</span>
                </div>
              </div>
              
              <div className="flex justify-between border-t pt-3">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي المدفوعات</p>
                  <p className="font-bold">{client.totalSpent.toLocaleString()} ريال</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">عدد الفواتير</p>
                  <p className="font-bold text-center">{client.invoices}</p>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            لا يوجد عملاء بالمعايير المحددة
          </div>
        )}
      </div>
    </div>
  );
}

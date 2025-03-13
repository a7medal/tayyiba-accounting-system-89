
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SupplierTable } from '@/components/suppliers/SupplierTable';
import { SupplierForm } from '@/components/suppliers/SupplierForm';
import { Supplier, initialSuppliers } from '@/types/supplier';
import { useToast } from '@/hooks/use-toast';
import { Search } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const { toast } = useToast();
  const { hasPermission } = useAuth();

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.phone.includes(searchTerm)
  );

  const handleCreateSupplier = (data: Partial<Supplier>) => {
    const newSupplier: Supplier = {
      id: Date.now().toString(),
      name: data.name || '',
      contactName: data.contactName || '',
      phone: data.phone || '',
      email: data.email || '',
      address: data.address || '',
      notes: data.notes,
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSuppliers([...suppliers, newSupplier]);
    toast({
      title: "تم إضافة المورد",
      description: `تم إضافة ${newSupplier.name} بنجاح`,
    });
  };

  const handleUpdateSupplier = (data: Partial<Supplier>) => {
    if (!data.id) return;

    setSuppliers(suppliers.map(supplier => 
      supplier.id === data.id ? { ...supplier, ...data, updatedAt: new Date().toISOString() } : supplier
    ));
    toast({
      title: "تم تحديث المورد",
      description: `تم تحديث بيانات ${data.name} بنجاح`,
    });
  };

  const handleDeleteSupplier = (id: string) => {
    const supplierToDelete = suppliers.find(supplier => supplier.id === id);
    if (!supplierToDelete) return;

    setSuppliers(suppliers.filter(supplier => supplier.id !== id));
    toast({
      title: "تم حذف المورد",
      description: `تم حذف ${supplierToDelete.name} بنجاح`,
      variant: "destructive",
    });
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsOpen(true);
  };

  const handleSubmit = (data: Partial<Supplier>) => {
    if (editingSupplier) {
      handleUpdateSupplier(data);
    } else {
      handleCreateSupplier(data);
    }
    setIsOpen(false);
    setEditingSupplier(null);
  };

  const canManageSuppliers = hasPermission('إدارة الموردين');

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة الموردين</h1>
        {canManageSuppliers && (
          <Button onClick={() => {
            setEditingSupplier(null);
            setIsOpen(true);
          }}>إضافة مورد جديد</Button>
        )}
      </div>

      <div className="mb-6 card-glass rounded-xl p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="البحث عن مورد..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <SupplierTable
        suppliers={filteredSuppliers}
        onEdit={canManageSuppliers ? handleEdit : () => {}}
        onDelete={canManageSuppliers ? handleDeleteSupplier : () => {}}
      />
      
      {canManageSuppliers && (
        <SupplierForm
          open={isOpen}
          onOpenChange={setIsOpen}
          initialData={editingSupplier}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

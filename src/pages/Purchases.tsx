
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PurchaseTable } from '@/components/purchases/PurchaseTable';
import { PurchaseDetails } from '@/components/purchases/PurchaseDetails';
import { Purchase, initialPurchases } from '@/types/purchase';
import { useToast } from '@/hooks/use-toast';
import { Search } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function Purchases() {
  const [purchases, setPurchases] = useState<Purchase[]>(initialPurchases);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingPurchase, setViewingPurchase] = useState<Purchase | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toast } = useToast();
  const { hasPermission } = useAuth();

  const filteredPurchases = purchases.filter(
    (purchase) =>
      purchase.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeletePurchase = (id: string) => {
    const purchaseToDelete = purchases.find(purchase => purchase.id === id);
    if (!purchaseToDelete) return;

    setPurchases(purchases.filter(purchase => purchase.id !== id));
    toast({
      title: "تم حذف المشتريات",
      description: `تم حذف ${purchaseToDelete.reference} بنجاح`,
      variant: "destructive",
    });
  };

  const handleViewPurchase = (purchase: Purchase) => {
    setViewingPurchase(purchase);
    setIsDetailsOpen(true);
  };

  const handleEditPurchase = (purchase: Purchase) => {
    toast({
      title: "تعديل المشتريات",
      description: "سيتم إضافة صفحة تعديل المشتريات قريباً",
    });
  };

  const canManagePurchases = hasPermission('إدارة المشتريات');

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة المشتريات</h1>
        {canManagePurchases && (
          <Button onClick={() => {
            toast({
              title: "إضافة مشتريات",
              description: "سيتم إضافة صفحة إدخال المشتريات قريباً",
            });
          }}>إضافة مشتريات جديدة</Button>
        )}
      </div>

      <div className="mb-6 card-glass rounded-xl p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="البحث عن مشتريات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <PurchaseTable
        purchases={filteredPurchases}
        onView={handleViewPurchase}
        onEdit={canManagePurchases ? handleEditPurchase : () => {}}
        onDelete={canManagePurchases ? handleDeletePurchase : () => {}}
      />
      
      <PurchaseDetails
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        purchase={viewingPurchase}
      />
    </div>
  );
}

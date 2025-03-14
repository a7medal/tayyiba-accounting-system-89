
import { Product } from './product';
import { Supplier } from './supplier';

export type PaymentStatus = 'paid' | 'pending' | 'partial' | 'cancelled';

export interface PurchaseItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: 'MRU';
}

export interface Purchase {
  id: string;
  reference: string;
  supplierId: string;
  supplierName: string;
  date: string;
  items: PurchaseItem[];
  totalAmount: number;
  paidAmount: number;
  currency: 'MRU';
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// تحويل حالة الدفع إلى نص عربي مناسب
export const getPaymentStatusLabel = (status: PaymentStatus): string => {
  switch (status) {
    case 'paid':
      return 'مدفوع';
    case 'pending':
      return 'معلق';
    case 'partial':
      return 'مدفوع جزئياً';
    case 'cancelled':
      return 'ملغي';
    default:
      return '';
  }
};

// الحصول على لون حالة الدفع
export const getPaymentStatusColor = (status: PaymentStatus): string => {
  switch (status) {
    case 'paid':
      return 'bg-green-500';
    case 'pending':
      return 'bg-yellow-500';
    case 'partial':
      return 'bg-blue-500';
    case 'cancelled':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

export const initialPurchases: Purchase[] = [
  {
    id: '1',
    reference: 'PO-2023-001',
    supplierId: '1',
    supplierName: 'شركة الوفاء للتجارة',
    date: new Date().toISOString(),
    items: [
      {
        id: '1',
        productId: '1',
        productName: 'لابتوب ديل XPS 13',
        quantity: 2,
        unitPrice: 150000,
        totalPrice: 300000,
        currency: 'MRU'
      },
      {
        id: '2',
        productId: '2',
        productName: 'آيفون 13 برو',
        quantity: 3,
        unitPrice: 120000,
        totalPrice: 360000,
        currency: 'MRU'
      }
    ],
    totalAmount: 660000,
    paidAmount: 660000,
    currency: 'MRU',
    paymentStatus: 'paid',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    reference: 'PO-2023-002',
    supplierId: '2',
    supplierName: 'شركة النور للإلكترونيات',
    date: new Date().toISOString(),
    items: [
      {
        id: '1',
        productId: '3',
        productName: 'سماعة بلوتوث سوني',
        quantity: 5,
        unitPrice: 5000,
        totalPrice: 25000,
        currency: 'MRU'
      }
    ],
    totalAmount: 25000,
    paidAmount: 10000,
    currency: 'MRU',
    paymentStatus: 'partial',
    notes: 'تم دفع جزء من المبلغ، والباقي خلال أسبوع',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    reference: 'PO-2023-003',
    supplierId: '3',
    supplierName: 'مؤسسة الأمانة',
    date: new Date().toISOString(),
    items: [
      {
        id: '1',
        productId: '4',
        productName: 'جهاز عرض بروجكتور',
        quantity: 1,
        unitPrice: 80000,
        totalPrice: 80000,
        currency: 'MRU'
      }
    ],
    totalAmount: 80000,
    paidAmount: 0,
    currency: 'MRU',
    paymentStatus: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

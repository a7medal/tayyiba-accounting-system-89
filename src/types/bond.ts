
export type BondType = 'receipt' | 'payment' | 'voucher';

export type BondStatus = 'approved' | 'pending' | 'rejected' | 'draft';

export interface Bond {
  id: string;
  number: string;
  date: string;
  amount: number;
  type: BondType;
  status: BondStatus;
  description: string;
  clientId?: string;
  clientName?: string;
  issuedBy: string;
  approvedBy?: string;
  currency: 'MRU';
  createdAt: string;
  updatedAt: string;
}

export const getBondTypeLabel = (type: BondType): string => {
  switch (type) {
    case 'receipt':
      return 'سند قبض';
    case 'payment':
      return 'سند صرف';
    case 'voucher':
      return 'سند قيد';
    default:
      return '';
  }
};

export const getBondStatusLabel = (status: BondStatus): string => {
  switch (status) {
    case 'approved':
      return 'معتمد';
    case 'pending':
      return 'معلق';
    case 'rejected':
      return 'مرفوض';
    case 'draft':
      return 'مسودة';
    default:
      return '';
  }
};

export const getBondStatusColor = (status: BondStatus): string => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-amber-100 text-amber-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'draft':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const initialBonds: Bond[] = [
  {
    id: '1',
    number: 'B-2023-001',
    date: '2023-06-15',
    amount: 3000,
    type: 'receipt',
    status: 'approved',
    description: 'استلام مبلغ نقدي من العميل محمد',
    clientName: 'محمد أحمد',
    clientId: '1',
    issuedBy: 'أحمد محمد',
    approvedBy: 'علي حسن',
    currency: 'MRU',
    createdAt: '2023-06-15T10:30:00',
    updatedAt: '2023-06-15T11:00:00'
  },
  {
    id: '2',
    number: 'B-2023-002',
    date: '2023-06-16',
    amount: 1500,
    type: 'payment',
    status: 'approved',
    description: 'دفع مبلغ للمورد شركة النور',
    issuedBy: 'أحمد محمد',
    approvedBy: 'علي حسن',
    currency: 'MRU',
    createdAt: '2023-06-16T09:15:00',
    updatedAt: '2023-06-16T10:00:00'
  },
  {
    id: '3',
    number: 'B-2023-003',
    date: '2023-06-17',
    amount: 2000,
    type: 'receipt',
    status: 'pending',
    description: 'استلام دفعة من العميل خالد',
    clientName: 'خالد عبد الله',
    clientId: '2',
    issuedBy: 'أحمد محمد',
    currency: 'MRU',
    createdAt: '2023-06-17T14:20:00',
    updatedAt: '2023-06-17T14:20:00'
  },
  {
    id: '4',
    number: 'B-2023-004',
    date: '2023-06-18',
    amount: 5000,
    type: 'voucher',
    status: 'draft',
    description: 'تسجيل مصاريف مكتبية',
    issuedBy: 'أحمد محمد',
    currency: 'MRU',
    createdAt: '2023-06-18T11:45:00',
    updatedAt: '2023-06-18T11:45:00'
  },
  {
    id: '5',
    number: 'B-2023-005',
    date: '2023-06-19',
    amount: 1000,
    type: 'payment',
    status: 'rejected',
    description: 'دفع فاتورة الكهرباء',
    issuedBy: 'أحمد محمد',
    currency: 'MRU',
    createdAt: '2023-06-19T09:30:00',
    updatedAt: '2023-06-19T13:15:00'
  }
];

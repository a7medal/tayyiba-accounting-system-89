
export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  cost: number;
  stock: number;
  categoryId: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  currency: 'MRU'; // الأوقية الموريتانية
}

export const formatCurrency = (amount: number, currency: string = 'MRU'): string => {
  // تنسيق المبلغ بالأوقية
  return `${amount.toLocaleString('ar-MR')} أوقية`;
};


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
  currency: 'MRO' | 'MRU'; // الأوقية الموريتانية القديمة أو الجديدة
}

export const convertCurrency = (amount: number, from: 'MRO' | 'MRU', to: 'MRO' | 'MRU'): number => {
  if (from === to) return amount;
  
  // 1 MRU = 10 MRO
  if (from === 'MRO' && to === 'MRU') {
    return amount / 10;
  } else {
    return amount * 10;
  }
};

export const formatCurrency = (amount: number, currency: 'MRO' | 'MRU'): string => {
  // تنسيق المبلغ بالعملة المحددة
  return `${amount.toLocaleString('ar-MR')} ${currency}`;
};

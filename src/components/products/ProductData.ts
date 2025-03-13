
import { Product } from '@/types/product';

// بيانات وهمية للمنتجات للعرض
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'لابتوب ديل XPS 15',
    sku: 'DELL-XPS15',
    description: 'لابتوب احترافي للعمل والتصميم مع معالج قوي وشاشة عالية الدقة.',
    price: 6999,
    cost: 5500,
    stock: 12,
    categoryId: '1',
    imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9',
    createdAt: '2023-04-15T08:00:00Z',
    updatedAt: '2023-04-15T08:00:00Z'
  },
  {
    id: '2',
    name: 'سماعات سوني WH-1000XM4',
    sku: 'SONY-WH1000XM4',
    description: 'سماعات لاسلكية مع خاصية إلغاء الضوضاء وجودة صوت ممتازة.',
    price: 1299,
    cost: 900,
    stock: 25,
    categoryId: '2',
    imageUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901',
    createdAt: '2023-04-16T09:30:00Z',
    updatedAt: '2023-04-16T09:30:00Z'
  },
  {
    id: '3',
    name: 'ايفون 15 برو',
    sku: 'APPLE-IP15P',
    description: 'هاتف ذكي متطور مع كاميرا احترافية وأداء فائق.',
    price: 4899,
    cost: 3800,
    stock: 8,
    categoryId: '3',
    imageUrl: 'https://images.unsplash.com/photo-1466721591366-2d5fba72006d',
    createdAt: '2023-04-17T10:45:00Z',
    updatedAt: '2023-04-17T10:45:00Z'
  },
  {
    id: '4',
    name: 'ساعة ابل الجيل 9',
    sku: 'APPLE-WATCH9',
    description: 'ساعة ذكية متطورة لمتابعة اللياقة والصحة مع تصميم أنيق.',
    price: 1899,
    cost: 1400,
    stock: 15,
    categoryId: '4',
    imageUrl: '',
    createdAt: '2023-04-18T11:15:00Z',
    updatedAt: '2023-04-18T11:15:00Z'
  },
  {
    id: '5',
    name: 'جهاز بلاي ستيشن 5',
    sku: 'SONY-PS5',
    description: 'منصة ألعاب متطورة مع رسومات عالية الجودة وأداء سريع.',
    price: 2099,
    cost: 1700,
    stock: 5,
    categoryId: '5',
    imageUrl: '',
    createdAt: '2023-04-19T12:30:00Z',
    updatedAt: '2023-04-19T12:30:00Z'
  },
  {
    id: '6',
    name: 'طابعة HP LaserJet Pro',
    sku: 'HP-LJPRO',
    description: 'طابعة ليزر سريعة للاستخدام المكتبي مع جودة طباعة عالية.',
    price: 899,
    cost: 650,
    stock: 20,
    categoryId: '6',
    imageUrl: '',
    createdAt: '2023-04-20T13:45:00Z',
    updatedAt: '2023-04-20T13:45:00Z'
  }
];

// دالة وهمية للبحث في المنتجات
export const searchProducts = (query: string): Product[] => {
  if (!query) return mockProducts;
  
  const lowercaseQuery = query.toLowerCase();
  return mockProducts.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) || 
    product.sku.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery)
  );
};

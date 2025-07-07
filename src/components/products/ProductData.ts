// import { Product } from '@/types/product';

// ملاحظة: هذا الملف كان يحتوي على بيانات وهمية (mock data) للمنتجات.
// تم تعديل صفحة المنتجات (src/pages/Products.tsx) لتستخدم IndexedDB
// لتخزين وإدارة بيانات المنتجات بشكل دائم في المتصفح.
// لم تعد البيانات الوهمية في هذا الملف مستخدمة للعمليات التشغيلية في صفحة المنتγματα.

/*
// بيانات وهمية للمنتجات للعرض (لم تعد مستخدمة بشكل مباشر في Products.tsx)
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
    updatedAt: '2023-04-15T08:00:00Z',
    currency: 'MRU'
  },
  // ... (باقي المنتجات الوهمية كانت هنا)
];

// دالة وهمية للبحث في المنتجات (لم تعد مستخدمة بشكل مباشر في Products.tsx)
export const searchProducts = (query: string): Product[] => {
  if (!query) return mockProducts;
  
  const lowercaseQuery = query.toLowerCase();
  return mockProducts.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) || 
    product.sku.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery)
  );
};
*/

export {}; // لإبقاء الملف كوحدة TypeScript صالحة إذا كان فارغًا تمامًا

// إذا تأكد أن هذا الملف غير مستورد في أي مكان آخر، يمكن حذفه بأمان.

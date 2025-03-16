
/**
 * وظائف مساعدة للرسوم البيانية
 */

// تحديد لون الشريط بناءً على القيمة
export const getBarColor = (value: number): string => {
  if (value > 0) {
    return '#22c55e'; // أخضر للقيم الموجبة
  } else if (value < 0) {
    return '#ef4444'; // أحمر للقيم السالبة
  } else {
    return '#9ca3af'; // رمادي للقيمة صفر
  }
};

// تنسيق رقم مع العملة
export const formatCurrency = (amount: number, currency: string = 'أوقية'): string => {
  return `${amount.toLocaleString()} ${currency}`;
};

// تحديد مجموعة ألوان للرسوم البيانية
export const CHART_COLORS = [
  '#3b82f6', // أزرق
  '#ef4444', // أحمر
  '#10b981', // أخضر
  '#f59e0b', // برتقالي
  '#8b5cf6', // أرجواني
  '#ec4899', // وردي
  '#06b6d4', // سماوي
];

// حساب النسبة المئوية
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

// تحويل التاريخ إلى تنسيق مناسب للعرض
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ar-EG', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  });
};

// الحصول على تاريخ اليوم السابق
export const getPreviousDay = (dateString: string): string => {
  const date = new Date(dateString);
  date.setDate(date.getDate() - 1);
  return date.toISOString().split('T')[0];
};

// مقارنة تاريخين إذا كانا في نفس اليوم
export const isSameDay = (date1: string | Date, date2: string | Date): boolean => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

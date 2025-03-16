
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

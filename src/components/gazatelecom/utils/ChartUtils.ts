
/**
 * وظائف مساعدة للرسوم البيانية والتقارير
 */

// إنشاء لون الأعمدة ديناميكيًا بناءً على قيمة البيانات
export const getBarColor = (value: number): string => {
  return value < 0 ? "#ef4444" : "#10b981";
};

// تنسيق المبالغ المالية
export const formatMoney = (value: number): string => {
  return `${value.toLocaleString()} MRU`;
};

// تنسيق النسب المئوية
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

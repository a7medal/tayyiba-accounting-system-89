
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

// تنسيق تاريخ لاستخدامه في SQLite
export const formatSQLiteDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
};

// تحويل تاريخ SQLite إلى كائن Date
export const parseSQLiteDate = (dateString: string): Date => {
  // إذا كان التاريخ بصيغة YYYY-MM-DD فقط، أضف وقتًا إليه
  if (dateString.length === 10) {
    return new Date(`${dateString}T00:00:00.000Z`);
  }
  return new Date(dateString);
};

// تحويل تاريخ بأي تنسيق إلى تنسيق YYYY-MM-DD
export const toYYYYMMDD = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// الحصول على نطاق تاريخ SQLite للاستعلامات
export const getSQLiteDateRange = (date: string): { start: string; end: string } => {
  const startDate = `${date} 00:00:00`;
  const endDate = `${date} 23:59:59`;
  return { start: startDate, end: endDate };
};

// تحويل تاريخ JavaScript إلى تنسيق SQLite
export const toSQLiteTimestamp = (date: Date): string => {
  return date.toISOString().replace('T', ' ').split('.')[0];
};

// استخراج التاريخ فقط من الطابع الزمني
export const extractDateFromTimestamp = (timestamp: string): string => {
  return timestamp.split('T')[0];
};

// تحويل تاريخ عربي إلى تاريخ JavaScript
export const parseArabicDate = (arabicDate: string): Date => {
  // مثال: تحويل "١٥/٠٤/٢٠٢٣" إلى تاريخ جافاسكريبت
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  
  let latinDate = arabicDate;
  arabicDigits.forEach((digit, index) => {
    latinDate = latinDate.replace(new RegExp(digit, 'g'), index.toString());
  });
  
  const parts = latinDate.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  
  return new Date();
};

// تنسيق التاريخ باللغة العربية
export const formatArabicDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return d.toLocaleDateString('ar-EG', options);
};

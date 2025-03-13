
import { format, subMonths } from 'date-fns';
import { ar } from 'date-fns/locale';

// مساعدة لإنشاء قائمة بالأشهر الستة الماضية
export const getCurrentMonth = () => new Date();

export const getLast6Months = () => {
  const currentMonth = getCurrentMonth();
  return Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(currentMonth, 5 - i);
    return format(date, 'MMM', { locale: ar });
  });
};

// بيانات المبيعات والمصروفات
const last6Months = getLast6Months();

export const salesData = [
  { name: last6Months[0], value: 12500, color: '#3B82F6' },
  { name: last6Months[1], value: 18200, color: '#3B82F6' },
  { name: last6Months[2], value: 15800, color: '#3B82F6' },
  { name: last6Months[3], value: 22000, color: '#3B82F6' },
  { name: last6Months[4], value: 19500, color: '#3B82F6' },
  { name: last6Months[5], value: 25000, color: '#3B82F6' },
];

export const expensesData = [
  { name: last6Months[0], value: 8200, color: '#F59E0B' },
  { name: last6Months[1], value: 9500, color: '#F59E0B' },
  { name: last6Months[2], value: 7800, color: '#F59E0B' },
  { name: last6Months[3], value: 10200, color: '#F59E0B' },
  { name: last6Months[4], value: 11000, color: '#F59E0B' },
  { name: last6Months[5], value: 12500, color: '#F59E0B' },
];

export const profitData = salesData.map((item, index) => ({
  name: item.name,
  value: item.value - expensesData[index].value,
  color: '#10B981'
}));

export const revenueByCategory = [
  { name: 'خدمات', value: 45, color: '#10B981' },
  { name: 'منتجات', value: 30, color: '#3B82F6' },
  { name: 'استشارات', value: 15, color: '#8B5CF6' },
  { name: 'أخرى', value: 10, color: '#F59E0B' },
];

export const topClients = [
  { name: 'شركة النور', value: 15200, percentage: 22 },
  { name: 'مؤسسة السلام', value: 12800, percentage: 18 },
  { name: 'شركة الأمل', value: 10500, percentage: 15 },
  { name: 'مؤسسة الفجر', value: 8300, percentage: 12 },
  { name: 'شركة المستقبل', value: 7200, percentage: 10 },
];

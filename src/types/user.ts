
export type UserRole = 'admin' | 'manager' | 'accountant' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export const rolePermissions = {
  admin: {
    label: 'مدير النظام',
    permissions: [
      'إدارة المستخدمين',
      'إدارة المنتجات',
      'إدارة الفواتير',
      'إدارة العملاء',
      'إدارة التقارير',
      'إدارة الإعدادات',
      'عرض التقارير',
      'عرض المعاملات'
    ]
  },
  manager: {
    label: 'مدير',
    permissions: [
      'إدارة المنتجات',
      'إدارة الفواتير',
      'إدارة العملاء',
      'عرض التقارير',
      'عرض المعاملات'
    ]
  },
  accountant: {
    label: 'محاسب',
    permissions: [
      'إدارة الفواتير',
      'عرض المنتجات',
      'عرض العملاء',
      'عرض التقارير',
      'عرض المعاملات'
    ]
  },
  viewer: {
    label: 'مشاهد',
    permissions: [
      'عرض المنتجات',
      'عرض الفواتير',
      'عرض العملاء',
      'عرض التقارير',
      'عرض المعاملات'
    ]
  }
};

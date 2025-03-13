
export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const initialSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'شركة الوفاء للتجارة',
    contactName: 'أحمد محمد',
    phone: '22222222',
    email: 'ahmed@alwafa.com',
    address: 'نواكشوط، موريتانيا',
    notes: 'مورد رئيسي للمواد الغذائية',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'شركة النور للإلكترونيات',
    contactName: 'محمد سالم',
    phone: '33333333',
    email: 'salem@alnoor.com',
    address: 'نواذيبو، موريتانيا',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'مؤسسة الأمانة',
    contactName: 'فاطمة أحمد',
    phone: '44444444',
    email: 'fatima@alamana.com',
    address: 'كيفة، موريتانيا',
    notes: 'موردون معتمدون للمواد المكتبية',
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

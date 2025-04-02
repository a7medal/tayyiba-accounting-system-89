
import { DebtService } from './DebtService';
import { Debt, DebtPayment, EntityTransaction } from '@/components/gazatelecom/models/MessageModel';

// واجهة خدمة قاعدة البيانات للتطبيق
export interface AppDatabaseService {
  isConnected(): boolean;
  connect(): Promise<boolean>;
  disconnect(): void;
  
  // وظائف الديون
  getDebts(): Promise<Debt[]>;
  saveDebt(debt: Debt): Promise<Debt>;
  deleteDebt(debtId: string): Promise<boolean>;
  
  // وظائف المشتريات - أضفناها لإصلاح الأخطاء
  getPurchases(): Promise<any[]>;
  deletePurchase(id: string): Promise<boolean>;
  
  // وظائف إضافية للخدمات
  setDbType?(type: string): void;
  exportDatabase?(): Promise<string>;
}

class DatabaseService implements AppDatabaseService {
  private connected: boolean = false;

  isConnected(): boolean {
    return this.connected || localStorage.getItem('dbConnectionState') === 'connected';
  }

  async connect(): Promise<boolean> {
    try {
      // محاكاة الاتصال بقاعدة البيانات
      this.connected = true;
      localStorage.setItem('dbConnectionState', 'connected');
      return true;
    } catch (error) {
      console.error('فشل الاتصال بقاعدة البيانات:', error);
      this.connected = false;
      localStorage.setItem('dbConnectionState', 'disconnected');
      return false;
    }
  }

  disconnect(): void {
    this.connected = false;
    localStorage.setItem('dbConnectionState', 'disconnected');
  }

  // وظائف الديون
  async getDebts(): Promise<Debt[]> {
    if (!this.isConnected()) {
      throw new Error('قاعدة البيانات غير متصلة');
    }
    return DebtService.getDebts();
  }

  async saveDebt(debt: Debt): Promise<Debt> {
    if (!this.isConnected()) {
      throw new Error('قاعدة البيانات غير متصلة');
    }
    return DebtService.saveDebt(debt);
  }

  async deleteDebt(debtId: string): Promise<boolean> {
    if (!this.isConnected()) {
      throw new Error('قاعدة البيانات غير متصلة');
    }
    return DebtService.deleteDebt(debtId);
  }
  
  // وظائف المشتريات (مؤقتة لإصلاح الأخطاء)
  async getPurchases(): Promise<any[]> {
    if (!this.isConnected()) {
      throw new Error('قاعدة البيانات غير متصلة');
    }
    // استخدام التخزين المحلي مؤقتًا
    const purchasesData = localStorage.getItem('app_purchases');
    return purchasesData ? JSON.parse(purchasesData) : [];
  }
  
  async deletePurchase(id: string): Promise<boolean> {
    if (!this.isConnected()) {
      throw new Error('قاعدة البيانات غير متصلة');
    }
    try {
      const purchases = await this.getPurchases();
      const filteredPurchases = purchases.filter(p => p.id !== id);
      localStorage.setItem('app_purchases', JSON.stringify(filteredPurchases));
      return true;
    } catch (error) {
      console.error('خطأ في حذف المشتريات:', error);
      return false;
    }
  }
  
  // وظائف إضافية للإعدادات
  setDbType(type: string): void {
    localStorage.setItem('dbType', type);
  }
  
  async exportDatabase(): Promise<string> {
    if (!this.isConnected()) {
      throw new Error('قاعدة البيانات غير متصلة');
    }
    
    // جمع جميع البيانات من التخزين المحلي
    const allData: Record<string, any> = {};
    
    // تجميع جميع مفاتيح التخزين المحلي التي تبدأ بـ 'app_'
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('app_')) {
        try {
          allData[key] = JSON.parse(localStorage.getItem(key) || '');
        } catch (e) {
          allData[key] = localStorage.getItem(key);
        }
      }
    }
    
    return JSON.stringify(allData, null, 2);
  }
}

export const AppDatabase = new DatabaseService();

// محاولة استعادة الاتصال عند تحميل الصفحة
if (localStorage.getItem('dbConnectionState') === 'connected') {
  AppDatabase.connect()
    .then(connected => {
      console.log('حالة الاتصال بقاعدة البيانات:', connected ? 'متصل' : 'غير متصل');
    })
    .catch(error => {
      console.error('خطأ في استعادة الاتصال:', error);
    });
}

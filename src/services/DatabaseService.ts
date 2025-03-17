
import { DebtService } from './DebtService';
import { Debt } from '@/components/gazatelecom/models/MessageModel';

// واجهة خدمة قاعدة البيانات للتطبيق
export interface AppDatabaseService {
  isConnected(): boolean;
  connect(): Promise<boolean>;
  disconnect(): void;
  
  // وظائف الديون
  getDebts(): Promise<Debt[]>;
  saveDebt(debt: Debt): Promise<Debt>;
  deleteDebt(debtId: string): Promise<boolean>;
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

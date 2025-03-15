
import { Message, DailyBalance } from '../models/MessageModel';
import { LocalStorageService } from './LocalStorageService';

/**
 * خدمة الاتصال بقاعدة البيانات
 * هذه النسخة تستخدم التخزين المحلي كبديل مؤقت، ويمكن استبدالها بالاتصال بقاعدة بيانات حقيقية في المستقبل
 */
export class DatabaseService {
  private static instance: DatabaseService;
  private isConnected: boolean = false;

  private constructor() {
    this.initialize();
  }

  /**
   * الحصول على نسخة واحدة من الخدمة (Singleton)
   */
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * تهيئة الاتصال بقاعدة البيانات
   */
  private async initialize(): Promise<void> {
    try {
      // محاكاة عملية الاتصال بقاعدة البيانات
      this.isConnected = localStorage.getItem('dbConnectionState') === 'connected';
      console.log('Database connection initialized:', this.isConnected);
    } catch (error) {
      console.error('Failed to initialize database connection:', error);
      this.isConnected = false;
    }
  }

  /**
   * إنشاء اتصال بقاعدة البيانات
   */
  public async connect(): Promise<boolean> {
    try {
      // محاكاة عملية الاتصال بقاعدة البيانات
      // في التطبيق الحقيقي، يمكن استبدال هذا بالاتصال الفعلي بقاعدة البيانات
      localStorage.setItem('dbConnectionState', 'connected');
      this.isConnected = true;
      console.log('Connected to database');
      return true;
    } catch (error) {
      console.error('Failed to connect to database:', error);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * قطع الاتصال بقاعدة البيانات
   */
  public async disconnect(): Promise<boolean> {
    try {
      localStorage.setItem('dbConnectionState', 'disconnected');
      this.isConnected = false;
      console.log('Disconnected from database');
      return true;
    } catch (error) {
      console.error('Failed to disconnect from database:', error);
      return false;
    }
  }

  /**
   * التحقق من حالة الاتصال بقاعدة البيانات
   */
  public isConnectedToDatabase(): boolean {
    return this.isConnected;
  }

  /**
   * استرجاع جميع الرسائل
   */
  public async getAllMessages(): Promise<Message[]> {
    if (!this.isConnected) {
      console.warn('Database not connected');
      return [];
    }
    
    try {
      return LocalStorageService.getMessages();
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      return [];
    }
  }

  /**
   * إضافة رسالة جديدة
   */
  public async addMessage(message: Message): Promise<Message | null> {
    if (!this.isConnected) {
      console.warn('Database not connected');
      return null;
    }
    
    try {
      const messages = LocalStorageService.getMessages();
      messages.push(message);
      LocalStorageService.saveMessages(messages);
      return message;
    } catch (error) {
      console.error('Failed to add message:', error);
      return null;
    }
  }

  /**
   * تحديث رسالة موجودة
   */
  public async updateMessage(message: Message): Promise<Message | null> {
    if (!this.isConnected) {
      console.warn('Database not connected');
      return null;
    }
    
    try {
      const messages = LocalStorageService.getMessages();
      const index = messages.findIndex(m => m.id === message.id);
      
      if (index === -1) {
        console.warn('Message not found');
        return null;
      }
      
      messages[index] = message;
      LocalStorageService.saveMessages(messages);
      return message;
    } catch (error) {
      console.error('Failed to update message:', error);
      return null;
    }
  }

  /**
   * حذف رسالة
   */
  public async deleteMessage(messageId: string): Promise<boolean> {
    if (!this.isConnected) {
      console.warn('Database not connected');
      return false;
    }
    
    try {
      const messages = LocalStorageService.getMessages();
      const filteredMessages = messages.filter(m => m.id !== messageId);
      
      if (filteredMessages.length === messages.length) {
        console.warn('Message not found');
        return false;
      }
      
      LocalStorageService.saveMessages(filteredMessages);
      return true;
    } catch (error) {
      console.error('Failed to delete message:', error);
      return false;
    }
  }

  /**
   * استرجاع رصيد اليوم
   */
  public async getDailyBalance(): Promise<number> {
    if (!this.isConnected) {
      console.warn('Database not connected');
      return 0;
    }
    
    try {
      return LocalStorageService.getDailyBalance();
    } catch (error) {
      console.error('Failed to fetch daily balance:', error);
      return 0;
    }
  }

  /**
   * تحديث رصيد اليوم
   */
  public async updateDailyBalance(amount: number): Promise<boolean> {
    if (!this.isConnected) {
      console.warn('Database not connected');
      return false;
    }
    
    try {
      LocalStorageService.saveDailyBalance(amount);
      return true;
    } catch (error) {
      console.error('Failed to update daily balance:', error);
      return false;
    }
  }

  /**
   * استرجاع سجل الأرصدة اليومية
   */
  public async getBalanceHistory(): Promise<DailyBalance[]> {
    if (!this.isConnected) {
      console.warn('Database not connected');
      return [];
    }
    
    try {
      return LocalStorageService.getBalanceHistory();
    } catch (error) {
      console.error('Failed to fetch balance history:', error);
      return [];
    }
  }

  /**
   * إضافة سجل رصيد يومي جديد
   */
  public async addDailyBalanceRecord(record: DailyBalance): Promise<boolean> {
    if (!this.isConnected) {
      console.warn('Database not connected');
      return false;
    }
    
    try {
      const history = LocalStorageService.getBalanceHistory();
      const existingIndex = history.findIndex(h => h.date === record.date);
      
      if (existingIndex !== -1) {
        history[existingIndex] = record;
      } else {
        history.push(record);
      }
      
      LocalStorageService.saveBalanceHistory(history);
      return true;
    } catch (error) {
      console.error('Failed to add daily balance record:', error);
      return false;
    }
  }
}

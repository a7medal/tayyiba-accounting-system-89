
import { LocalStorageService } from './LocalStorageService';
import { SQLiteService } from './SQLiteService';
import { Message } from '../models/MessageModel';

/**
 * خدمة قاعدة البيانات لتطبيق غزة تلكوم
 */
export class DatabaseService {
  private static instance: DatabaseService;
  private localStorageService: LocalStorageService;
  private sqliteService: SQLiteService;
  private activeService: 'local' | 'sqlite' = 'local';
  private _isConnected: boolean = false;

  /**
   * إنشاء كائن خدمة قاعدة البيانات
   */
  private constructor() {
    this.localStorageService = new LocalStorageService();
    this.sqliteService = new SQLiteService();
    
    // تحقق مما إذا كان هناك نوع مخزن في التخزين المحلي
    const savedDbType = localStorage.getItem('dbType');
    if (savedDbType === 'sqlite') {
      this.activeService = 'sqlite';
    }
    
    // تحقق من حالة الاتصال
    this._isConnected = this.activeService === 'local' ? true : false;
  }

  /**
   * الحصول على نسخة واحدة من خدمة قاعدة البيانات (Singleton)
   */
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * التحقق من حالة الاتصال بقاعدة البيانات
   */
  public isConnected(): boolean {
    return this._isConnected;
  }

  /**
   * الاتصال بقاعدة البيانات
   */
  public async connect(): Promise<boolean> {
    try {
      if (this.activeService === 'local') {
        this._isConnected = true;
        return true;
      } else {
        const connected = await this.sqliteService.connect();
        this._isConnected = connected;
        return connected;
      }
    } catch (error) {
      console.error('خطأ في الاتصال بقاعدة البيانات:', error);
      this._isConnected = false;
      return false;
    }
  }

  /**
   * قطع الاتصال بقاعدة البيانات
   */
  public disconnect(): void {
    if (this.activeService === 'sqlite') {
      this.sqliteService.disconnect();
    }
    this._isConnected = false;
  }

  /**
   * تغيير نوع قاعدة البيانات
   */
  public setDatabaseType(type: 'local' | 'sqlite'): void {
    this.activeService = type;
    localStorage.setItem('dbType', type);
    this._isConnected = type === 'local' ? true : false;
  }

  /**
   * الحصول على نوع قاعدة البيانات الحالي
   */
  public getDatabaseType(): 'local' | 'sqlite' {
    return this.activeService;
  }

  /**
   * حفظ رسالة في قاعدة البيانات
   */
  public saveMessage(message: Message): boolean {
    try {
      if (this.activeService === 'local') {
        return this.localStorageService.saveMessage(message);
      } else {
        return this.sqliteService.saveMessage(message);
      }
    } catch (error) {
      console.error('خطأ في حفظ الرسالة:', error);
      return false;
    }
  }

  /**
   * الحصول على جميع الرسائل من قاعدة البيانات
   */
  public getAllMessages(): Message[] {
    try {
      if (this.activeService === 'local') {
        return this.localStorageService.getAllMessages();
      } else {
        return this.sqliteService.getAllMessages();
      }
    } catch (error) {
      console.error('خطأ في جلب الرسائل:', error);
      return [];
    }
  }

  /**
   * البحث عن رسائل بناءً على معايير
   */
  public searchMessages(criteria: any): Message[] {
    try {
      if (this.activeService === 'local') {
        return this.localStorageService.searchMessages(criteria);
      } else {
        return this.sqliteService.searchMessages(criteria);
      }
    } catch (error) {
      console.error('خطأ في البحث عن الرسائل:', error);
      return [];
    }
  }

  /**
   * تحديث حالة رسالة
   */
  public updateMessageStatus(id: string, status: 'pending' | 'completed' | 'failed'): boolean {
    try {
      if (this.activeService === 'local') {
        return this.localStorageService.updateMessageStatus(id, status);
      } else {
        return this.sqliteService.updateMessageStatus(id, status);
      }
    } catch (error) {
      console.error('خطأ في تحديث حالة الرسالة:', error);
      return false;
    }
  }

  /**
   * حذف رسالة من قاعدة البيانات
   */
  public deleteMessage(id: string): boolean {
    try {
      if (this.activeService === 'local') {
        return this.localStorageService.deleteMessage(id);
      } else {
        return this.sqliteService.deleteMessage(id);
      }
    } catch (error) {
      console.error('خطأ في حذف الرسالة:', error);
      return false;
    }
  }

  /**
   * سحب رسالة وتحديث حالتها
   */
  public retractMessage(id: string): boolean {
    try {
      if (this.activeService === 'local') {
        return this.localStorageService.retractMessage(id);
      } else {
        return this.sqliteService.retractMessage(id);
      }
    } catch (error) {
      console.error('خطأ في سحب الرسالة:', error);
      return false;
    }
  }

  /**
   * تصدير قاعدة البيانات كملف JSON
   */
  public exportDatabase(): string {
    try {
      if (this.activeService === 'local') {
        return this.localStorageService.exportDatabase();
      } else {
        return this.sqliteService.exportDatabase();
      }
    } catch (error) {
      console.error('خطأ في تصدير قاعدة البيانات:', error);
      return '';
    }
  }

  /**
   * استيراد قاعدة البيانات من ملف JSON
   */
  public importDatabase(data: string): boolean {
    try {
      if (this.activeService === 'local') {
        return this.localStorageService.importDatabase(data);
      } else {
        return this.sqliteService.importDatabase(data);
      }
    } catch (error) {
      console.error('خطأ في استيراد قاعدة البيانات:', error);
      return false;
    }
  }

  /**
   * إعادة تعيين قاعدة البيانات وحذف جميع البيانات
   */
  public resetDatabase(): boolean {
    try {
      if (this.activeService === 'local') {
        return this.localStorageService.resetDatabase();
      } else {
        return this.sqliteService.resetDatabase();
      }
    } catch (error) {
      console.error('خطأ في إعادة تعيين قاعدة البيانات:', error);
      return false;
    }
  }
}

// تصدير نسخة واحدة من خدمة قاعدة البيانات
export const DatabaseService_Instance = DatabaseService.getInstance();


import initSqlJs, { Database } from 'sql.js';
import { Message, DailyBalance } from '../models/MessageModel';

/**
 * خدمة قاعدة بيانات SQLite
 */
class SQLiteServiceClass {
  private db: Database | null = null;
  private initPromise: Promise<void> | null = null;

  constructor() {
    // تهيئة قاعدة البيانات عند إنشاء الكائن
    this.initPromise = this.initDatabase();
  }

  /**
   * تهيئة قاعدة البيانات والجداول
   */
  private async initDatabase(): Promise<void> {
    try {
      console.log('تهيئة قاعدة بيانات SQLite...');
      const SQL = await initSqlJs({
        locateFile: file => `https://sql.js.org/dist/${file}`
      });

      // إنشاء قاعدة بيانات جديدة في الذاكرة
      this.db = new SQL.Database();
      
      // إنشاء جدول الرسائل إذا لم يكن موجودًا
      this.db.run(`
        CREATE TABLE IF NOT EXISTS messages (
          id TEXT PRIMARY KEY,
          accountType TEXT NOT NULL,
          messageType TEXT NOT NULL,
          serialNumber TEXT NOT NULL,
          amount REAL NOT NULL,
          interest REAL NOT NULL,
          timestamp TEXT NOT NULL,
          note TEXT
        );
      `);

      // إنشاء جدول الأرصدة اليومية إذا لم يكن موجودًا
      this.db.run(`
        CREATE TABLE IF NOT EXISTS daily_balances (
          date TEXT PRIMARY KEY,
          amount REAL NOT NULL
        );
      `);

      // استيراد البيانات من التخزين المحلي إذا كانت قاعدة البيانات فارغة
      await this.importFromLocalStorage();
      
      console.log('تم تهيئة قاعدة بيانات SQLite بنجاح');
    } catch (error) {
      console.error('فشل في تهيئة قاعدة بيانات SQLite:', error);
      throw error;
    }
  }

  /**
   * التأكد من اكتمال تهيئة قاعدة البيانات قبل أي عملية
   */
  private async ensureInitialized(): Promise<void> {
    if (this.initPromise) {
      await this.initPromise;
    }
    
    if (!this.db) {
      throw new Error('لم يتم تهيئة قاعدة البيانات بعد');
    }
  }

  /**
   * استيراد البيانات من التخزين المحلي
   */
  private async importFromLocalStorage(): Promise<void> {
    try {
      // استيراد الرسائل
      const messagesCount = this.db?.exec('SELECT COUNT(*) FROM messages')[0]?.values[0][0] || 0;
      
      if (messagesCount === 0) {
        const { LocalStorageService } = await import('./LocalStorageService');
        const messages = LocalStorageService.getMessages();
        
        if (messages.length > 0) {
          console.log(`استيراد ${messages.length} رسالة من التخزين المحلي...`);
          
          // بدء المعاملة
          this.db?.exec('BEGIN TRANSACTION;');
          
          messages.forEach(message => {
            this.db?.run(
              `INSERT INTO messages (id, accountType, messageType, serialNumber, amount, interest, timestamp, note)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                message.id,
                message.accountType,
                message.messageType,
                message.serialNumber,
                message.amount,
                message.interest,
                message.timestamp,
                message.note || null
              ]
            );
          });
          
          // إنهاء المعاملة
          this.db?.exec('COMMIT;');
        }
        
        // استيراد الأرصدة اليومية
        const balances = LocalStorageService.getBalanceHistory();
        
        if (balances.length > 0) {
          console.log(`استيراد ${balances.length} رصيد يومي من التخزين المحلي...`);
          
          // بدء المعاملة
          this.db?.exec('BEGIN TRANSACTION;');
          
          balances.forEach(balance => {
            this.db?.run(
              `INSERT INTO daily_balances (date, amount) VALUES (?, ?)`,
              [balance.date, balance.amount]
            );
          });
          
          // إنهاء المعاملة
          this.db?.exec('COMMIT;');
        }
      }
    } catch (error) {
      console.error('فشل في استيراد البيانات من التخزين المحلي:', error);
    }
  }

  /**
   * الحصول على جميع الرسائل
   */
  async getMessages(): Promise<Message[]> {
    await this.ensureInitialized();
    
    const result = this.db!.exec(`
      SELECT id, accountType, messageType, serialNumber, amount, interest, timestamp, note
      FROM messages
      ORDER BY timestamp DESC
    `);
    
    if (result.length === 0 || !result[0].values) {
      return [];
    }
    
    return result[0].values.map(row => ({
      id: row[0] as string,
      accountType: row[1] as 'main' | 'brina',
      messageType: row[2] as 'incoming' | 'outgoing',
      serialNumber: row[3] as string,
      amount: row[4] as number,
      interest: row[5] as number,
      timestamp: row[6] as string,
      note: row[7] as string | undefined
    }));
  }

  /**
   * حفظ رسالة جديدة
   */
  async saveMessage(message: Message): Promise<Message> {
    await this.ensureInitialized();
    
    this.db!.run(
      `INSERT INTO messages (id, accountType, messageType, serialNumber, amount, interest, timestamp, note)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        message.id,
        message.accountType,
        message.messageType,
        message.serialNumber,
        message.amount,
        message.interest,
        message.timestamp,
        message.note || null
      ]
    );
    
    return message;
  }

  /**
   * تحديث رسالة موجودة
   */
  async updateMessage(message: Message): Promise<Message> {
    await this.ensureInitialized();
    
    this.db!.run(
      `UPDATE messages
       SET accountType = ?, messageType = ?, serialNumber = ?, amount = ?, interest = ?, note = ?
       WHERE id = ?`,
      [
        message.accountType,
        message.messageType,
        message.serialNumber,
        message.amount,
        message.interest,
        message.note || null,
        message.id
      ]
    );
    
    return message;
  }

  /**
   * حذف رسالة
   */
  async deleteMessage(messageId: string): Promise<boolean> {
    await this.ensureInitialized();
    
    this.db!.run('DELETE FROM messages WHERE id = ?', [messageId]);
    
    return true;
  }

  /**
   * الحصول على جميع الأرصدة اليومية
   */
  async getDailyBalances(): Promise<DailyBalance[]> {
    await this.ensureInitialized();
    
    const result = this.db!.exec(`
      SELECT date, amount
      FROM daily_balances
      ORDER BY date DESC
    `);
    
    if (result.length === 0 || !result[0].values) {
      return [];
    }
    
    return result[0].values.map(row => ({
      date: row[0] as string,
      amount: row[1] as number
    }));
  }

  /**
   * حفظ رصيد يومي جديد
   */
  async saveDailyBalance(balance: DailyBalance): Promise<DailyBalance> {
    await this.ensureInitialized();
    
    // محاولة التحديث أولاً
    const updateResult = this.db!.run(
      'UPDATE daily_balances SET amount = ? WHERE date = ?',
      [balance.amount, balance.date]
    );
    
    // إذا لم يتم تحديث أي صفوف، قم بالإدراج
    if (this.db!.getRowsModified() === 0) {
      this.db!.run(
        'INSERT INTO daily_balances (date, amount) VALUES (?, ?)',
        [balance.date, balance.amount]
      );
    }
    
    return balance;
  }

  /**
   * حفظ قاعدة البيانات كملف
   */
  async exportDatabase(): Promise<Uint8Array | null> {
    if (!this.db) return null;
    return this.db.export();
  }
}

// تصدير نسخة واحدة من خدمة SQLite
export const SQLiteService = new SQLiteServiceClass();


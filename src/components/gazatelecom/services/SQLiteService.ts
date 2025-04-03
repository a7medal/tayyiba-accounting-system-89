
import { Message } from '../models/MessageModel';
import initSqlJs from 'sql.js';

/**
 * خدمة SQLite لتطبيق غزة تلكوم
 */
export class SQLiteService {
  private db: any = null;
  private SQL: any = null;

  /**
   * الاتصال بقاعدة بيانات SQLite
   */
  public async connect(): Promise<boolean> {
    try {
      // تهيئة SQL.js
      this.SQL = await initSqlJs({
        locateFile: file => `https://sql.js.org/dist/${file}`
      });
      
      // إنشاء قاعدة بيانات في الذاكرة
      this.db = new this.SQL.Database();
      
      // إنشاء جدول الرسائل إذا لم يكن موجودًا
      this.db.run(`
        CREATE TABLE IF NOT EXISTS messages (
          id TEXT PRIMARY KEY,
          messageNumber TEXT,
          phone TEXT,
          amount REAL,
          date TEXT,
          messageType TEXT,
          status TEXT,
          note TEXT,
          retracted INTEGER DEFAULT 0,
          retractionDate TEXT
        )
      `);
      
      return true;
    } catch (error) {
      console.error('خطأ في الاتصال بقاعدة بيانات SQLite:', error);
      return false;
    }
  }

  /**
   * قطع الاتصال بقاعدة بيانات SQLite
   */
  public disconnect(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  /**
   * حفظ رسالة في قاعدة بيانات SQLite
   */
  public saveMessage(message: Message): boolean {
    try {
      if (!this.db) return false;
      
      // التحقق مما إذا كانت الرسالة موجودة بالفعل
      const checkStmt = this.db.prepare('SELECT id FROM messages WHERE id = :id');
      checkStmt.bind({ ':id': message.id });
      const exists = checkStmt.step();
      checkStmt.free();
      
      if (exists) {
        // تحديث الرسالة الموجودة
        const stmt = this.db.prepare(`
          UPDATE messages 
          SET messageNumber = :messageNumber, phone = :phone, amount = :amount, 
          date = :date, messageType = :messageType, status = :status, 
          note = :note, retracted = :retracted, retractionDate = :retractionDate
          WHERE id = :id
        `);
        
        stmt.bind({
          ':id': message.id,
          ':messageNumber': message.messageNumber,
          ':phone': message.phone,
          ':amount': message.amount,
          ':date': message.date,
          ':messageType': message.messageType,
          ':status': message.status,
          ':note': message.note || null,
          ':retracted': message.retracted ? 1 : 0,
          ':retractionDate': message.retractionDate || null
        });
        
        stmt.step();
        stmt.free();
      } else {
        // إدراج رسالة جديدة
        const stmt = this.db.prepare(`
          INSERT INTO messages (id, messageNumber, phone, amount, date, messageType, status, note, retracted, retractionDate)
          VALUES (:id, :messageNumber, :phone, :amount, :date, :messageType, :status, :note, :retracted, :retractionDate)
        `);
        
        stmt.bind({
          ':id': message.id,
          ':messageNumber': message.messageNumber,
          ':phone': message.phone,
          ':amount': message.amount,
          ':date': message.date,
          ':messageType': message.messageType,
          ':status': message.status,
          ':note': message.note || null,
          ':retracted': message.retracted ? 1 : 0,
          ':retractionDate': message.retractionDate || null
        });
        
        stmt.step();
        stmt.free();
      }
      
      return true;
    } catch (error) {
      console.error('خطأ في حفظ الرسالة في قاعدة بيانات SQLite:', error);
      return false;
    }
  }

  /**
   * الحصول على جميع الرسائل من قاعدة بيانات SQLite
   */
  public getAllMessages(): Message[] {
    try {
      if (!this.db) return [];
      
      const results: Message[] = [];
      const stmt = this.db.prepare('SELECT * FROM messages ORDER BY date DESC');
      
      while (stmt.step()) {
        const row = stmt.getAsObject();
        results.push({
          id: row.id,
          messageNumber: row.messageNumber,
          phone: row.phone,
          amount: row.amount,
          date: row.date,
          messageType: row.messageType,
          status: row.status,
          note: row.note,
          retracted: row.retracted === 1,
          retractionDate: row.retractionDate
        });
      }
      
      stmt.free();
      return results;
    } catch (error) {
      console.error('خطأ في جلب الرسائل من قاعدة بيانات SQLite:', error);
      return [];
    }
  }

  /**
   * البحث عن رسائل بناءً على معايير
   */
  public searchMessages(criteria: any): Message[] {
    try {
      if (!this.db) return [];
      
      let query = 'SELECT * FROM messages WHERE 1=1';
      const params: any = {};
      
      if (criteria.startDate) {
        query += ' AND date >= :startDate';
        params[':startDate'] = criteria.startDate;
      }
      
      if (criteria.endDate) {
        query += ' AND date <= :endDate';
        params[':endDate'] = criteria.endDate;
      }
      
      if (criteria.type) {
        query += ' AND messageType = :type';
        params[':type'] = criteria.type;
      }
      
      if (criteria.status) {
        query += ' AND status = :status';
        params[':status'] = criteria.status;
      }
      
      if (criteria.searchText) {
        query += ' AND (messageNumber LIKE :search OR phone LIKE :search OR note LIKE :search)';
        params[':search'] = `%${criteria.searchText}%`;
      }
      
      query += ' ORDER BY date DESC';
      
      const results: Message[] = [];
      const stmt = this.db.prepare(query);
      stmt.bind(params);
      
      while (stmt.step()) {
        const row = stmt.getAsObject();
        results.push({
          id: row.id,
          messageNumber: row.messageNumber,
          phone: row.phone,
          amount: row.amount,
          date: row.date,
          messageType: row.messageType,
          status: row.status,
          note: row.note,
          retracted: row.retracted === 1,
          retractionDate: row.retractionDate
        });
      }
      
      stmt.free();
      return results;
    } catch (error) {
      console.error('خطأ في البحث عن الرسائل في قاعدة بيانات SQLite:', error);
      return [];
    }
  }

  /**
   * تحديث حالة رسالة
   */
  public updateMessageStatus(id: string, status: 'pending' | 'completed' | 'failed'): boolean {
    try {
      if (!this.db) return false;
      
      const stmt = this.db.prepare('UPDATE messages SET status = :status WHERE id = :id');
      stmt.bind({ ':id': id, ':status': status });
      stmt.step();
      stmt.free();
      
      return true;
    } catch (error) {
      console.error('خطأ في تحديث حالة الرسالة في قاعدة بيانات SQLite:', error);
      return false;
    }
  }

  /**
   * حذف رسالة من قاعدة بيانات SQLite
   */
  public deleteMessage(id: string): boolean {
    try {
      if (!this.db) return false;
      
      const stmt = this.db.prepare('DELETE FROM messages WHERE id = :id');
      stmt.bind({ ':id': id });
      stmt.step();
      stmt.free();
      
      return true;
    } catch (error) {
      console.error('خطأ في حذف الرسالة من قاعدة بيانات SQLite:', error);
      return false;
    }
  }

  /**
   * سحب رسالة وتحديث حالتها
   */
  public retractMessage(id: string): boolean {
    try {
      if (!this.db) return false;
      
      const now = new Date().toISOString();
      const stmt = this.db.prepare('UPDATE messages SET retracted = 1, retractionDate = :date WHERE id = :id');
      stmt.bind({ ':id': id, ':date': now });
      stmt.step();
      stmt.free();
      
      return true;
    } catch (error) {
      console.error('خطأ في سحب الرسالة في قاعدة بيانات SQLite:', error);
      return false;
    }
  }

  /**
   * تصدير قاعدة البيانات كملف JSON
   */
  public exportDatabase(): string {
    try {
      if (!this.db) return '';
      
      const data = {
        messages: this.getAllMessages(),
      };
      
      return JSON.stringify(data);
    } catch (error) {
      console.error('خطأ في تصدير قاعدة بيانات SQLite:', error);
      return '';
    }
  }

  /**
   * استيراد قاعدة البيانات من ملف JSON
   */
  public importDatabase(data: string): boolean {
    try {
      if (!this.db) return false;
      
      const parsedData = JSON.parse(data);
      
      if (parsedData.messages && Array.isArray(parsedData.messages)) {
        // حذف البيانات الحالية
        this.db.run('DELETE FROM messages');
        
        // إدراج البيانات الجديدة
        parsedData.messages.forEach((message: Message) => {
          this.saveMessage(message);
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('خطأ في استيراد قاعدة بيانات SQLite:', error);
      return false;
    }
  }

  /**
   * إعادة تعيين قاعدة البيانات وحذف جميع البيانات
   */
  public resetDatabase(): boolean {
    try {
      if (!this.db) return false;
      
      this.db.run('DELETE FROM messages');
      return true;
    } catch (error) {
      console.error('خطأ في إعادة تعيين قاعدة بيانات SQLite:', error);
      return false;
    }
  }
}

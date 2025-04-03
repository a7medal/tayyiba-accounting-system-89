
import { Message } from '../models/MessageModel';

/**
 * خدمة التخزين المحلي لتطبيق غزة تلكوم
 */
export class LocalStorageService {
  private readonly storageKey = 'gazatelecom_messages';

  /**
   * حفظ رسالة في التخزين المحلي
   */
  public saveMessage(message: Message): boolean {
    try {
      const messages = this.getAllMessages();
      const existingIndex = messages.findIndex(m => m.id === message.id);
      
      if (existingIndex >= 0) {
        messages[existingIndex] = message;
      } else {
        messages.push(message);
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(messages));
      return true;
    } catch (error) {
      console.error('خطأ في حفظ الرسالة في التخزين المحلي:', error);
      return false;
    }
  }

  /**
   * الحصول على جميع الرسائل من التخزين المحلي
   */
  public getAllMessages(): Message[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('خطأ في جلب الرسائل من التخزين المحلي:', error);
      return [];
    }
  }

  /**
   * البحث عن رسائل بناءً على معايير
   */
  public searchMessages(criteria: any): Message[] {
    try {
      const messages = this.getAllMessages();
      
      return messages.filter(message => {
        // فلترة حسب التاريخ
        if (criteria.startDate && new Date(message.date) < new Date(criteria.startDate)) {
          return false;
        }
        
        if (criteria.endDate && new Date(message.date) > new Date(criteria.endDate)) {
          return false;
        }
        
        // فلترة حسب النوع
        if (criteria.type && message.messageType !== criteria.type) {
          return false;
        }
        
        // فلترة حسب الحالة
        if (criteria.status && message.status !== criteria.status) {
          return false;
        }
        
        // فلترة حسب نص البحث
        if (criteria.searchText) {
          const searchLower = criteria.searchText.toLowerCase();
          return (
            message.messageNumber.toLowerCase().includes(searchLower) ||
            message.phone.toLowerCase().includes(searchLower) ||
            (message.note && message.note.toLowerCase().includes(searchLower))
          );
        }
        
        return true;
      });
    } catch (error) {
      console.error('خطأ في البحث عن الرسائل في التخزين المحلي:', error);
      return [];
    }
  }

  /**
   * تحديث حالة رسالة
   */
  public updateMessageStatus(id: string, status: 'pending' | 'completed' | 'failed'): boolean {
    try {
      const messages = this.getAllMessages();
      const messageIndex = messages.findIndex(m => m.id === id);
      
      if (messageIndex >= 0) {
        messages[messageIndex].status = status;
        localStorage.setItem(this.storageKey, JSON.stringify(messages));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('خطأ في تحديث حالة الرسالة في التخزين المحلي:', error);
      return false;
    }
  }

  /**
   * حذف رسالة من التخزين المحلي
   */
  public deleteMessage(id: string): boolean {
    try {
      const messages = this.getAllMessages();
      const filteredMessages = messages.filter(m => m.id !== id);
      
      if (filteredMessages.length !== messages.length) {
        localStorage.setItem(this.storageKey, JSON.stringify(filteredMessages));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('خطأ في حذف الرسالة من التخزين المحلي:', error);
      return false;
    }
  }

  /**
   * سحب رسالة وتحديث حالتها
   */
  public retractMessage(id: string): boolean {
    try {
      const messages = this.getAllMessages();
      const messageIndex = messages.findIndex(m => m.id === id);
      
      if (messageIndex >= 0) {
        messages[messageIndex].retracted = true;
        messages[messageIndex].retractionDate = new Date().toISOString();
        localStorage.setItem(this.storageKey, JSON.stringify(messages));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('خطأ في سحب الرسالة في التخزين المحلي:', error);
      return false;
    }
  }

  /**
   * تصدير قاعدة البيانات كملف JSON
   */
  public exportDatabase(): string {
    try {
      const data = {
        messages: this.getAllMessages(),
      };
      
      return JSON.stringify(data);
    } catch (error) {
      console.error('خطأ في تصدير قاعدة البيانات من التخزين المحلي:', error);
      return '';
    }
  }

  /**
   * استيراد قاعدة البيانات من ملف JSON
   */
  public importDatabase(data: string): boolean {
    try {
      const parsedData = JSON.parse(data);
      
      if (parsedData.messages && Array.isArray(parsedData.messages)) {
        localStorage.setItem(this.storageKey, JSON.stringify(parsedData.messages));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('خطأ في استيراد قاعدة البيانات إلى التخزين المحلي:', error);
      return false;
    }
  }

  /**
   * إعادة تعيين قاعدة البيانات وحذف جميع البيانات
   */
  public resetDatabase(): boolean {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error('خطأ في إعادة تعيين قاعدة البيانات في التخزين المحلي:', error);
      return false;
    }
  }
}

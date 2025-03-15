
import { Message, DailyBalance } from '../models/MessageModel';
import { LocalStorageService } from './LocalStorageService';

/**
 * خدمة قاعدة البيانات لإدارة بيانات غزة تليكوم
 * هذه نسخة مبسطة تستخدم التخزين المحلي، لكن يمكن استبدالها لاحقًا بخدمة حقيقية تتصل بقاعدة بيانات
 */
export const DatabaseService = {
  // استرجاع جميع الرسائل
  getAllMessages: async (): Promise<Message[]> => {
    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 300));
    return LocalStorageService.getMessages();
  },

  // إضافة رسالة جديدة
  addMessage: async (message: Message): Promise<Message> => {
    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const messages = LocalStorageService.getMessages();
    messages.push(message);
    LocalStorageService.saveMessages(messages);
    
    return message;
  },

  // استرجاع الرصيد اليومي
  getDailyBalance: async (): Promise<number> => {
    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 200));
    return LocalStorageService.getDailyBalance();
  },

  // تحديث الرصيد اليومي
  updateDailyBalance: async (amount: number): Promise<number> => {
    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 200));
    
    LocalStorageService.saveDailyBalance(amount);
    return amount;
  },

  // استرجاع تاريخ الأرصدة
  getBalanceHistory: async (): Promise<DailyBalance[]> => {
    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 300));
    return LocalStorageService.getBalanceHistory();
  },

  // إضافة سجل رصيد جديد
  addBalanceRecord: async (record: DailyBalance): Promise<DailyBalance> => {
    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const history = LocalStorageService.getBalanceHistory();
    
    // التحقق من وجود سجل لنفس التاريخ
    const existingIndex = history.findIndex(item => item.date === record.date);
    
    if (existingIndex !== -1) {
      // تحديث السجل الموجود
      history[existingIndex] = record;
    } else {
      // إضافة سجل جديد
      history.push(record);
    }
    
    LocalStorageService.saveBalanceHistory(history);
    return record;
  }
};

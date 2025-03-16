
import { LocalStorageService } from './LocalStorageService';
import { Message, DailyBalance } from '../models/MessageModel';

// واجهة خدمة قاعدة البيانات
export interface DatabaseServiceInterface {
  connect(): Promise<boolean>;
  disconnect(): void;
  isConnected(): boolean;
  getMessages(): Promise<Message[]>;
  saveMessage(message: Message): Promise<Message>;
  deleteMessage(messageId: string): Promise<boolean>;
  updateMessage(message: Message): Promise<Message>;
  getDailyBalances(): Promise<DailyBalance[]>;
  saveDailyBalance(balance: DailyBalance): Promise<DailyBalance>;
}

// تنفيذ خدمة قاعدة البيانات باستخدام التخزين المحلي (وهمية)
class LocalDatabaseService implements DatabaseServiceInterface {
  private connected: boolean = false;

  async connect(): Promise<boolean> {
    console.log('محاولة الاتصال بقاعدة البيانات المحلية...');
    // نظرًا لأن هذه قاعدة بيانات وهمية، فإننا نوافق على الاتصال دائمًا
    this.connected = true;
    localStorage.setItem('dbConnectionState', 'connected');
    console.log('تم الاتصال بقاعدة البيانات المحلية بنجاح');
    return true;
  }

  disconnect(): void {
    console.log('قطع الاتصال بقاعدة البيانات المحلية...');
    this.connected = false;
    localStorage.setItem('dbConnectionState', 'disconnected');
    console.log('تم قطع الاتصال بقاعدة البيانات المحلية');
  }

  isConnected(): boolean {
    return this.connected || localStorage.getItem('dbConnectionState') === 'connected';
  }

  async getMessages(): Promise<Message[]> {
    console.log('استرجاع الرسائل من قاعدة البيانات...');
    return LocalStorageService.getMessages();
  }

  async saveMessage(message: Message): Promise<Message> {
    console.log('حفظ رسالة في قاعدة البيانات...', message);
    const messages = LocalStorageService.getMessages();
    messages.push(message);
    LocalStorageService.saveMessages(messages);
    return message;
  }

  async deleteMessage(messageId: string): Promise<boolean> {
    console.log('حذف رسالة من قاعدة البيانات...', messageId);
    const messages = LocalStorageService.getMessages();
    const filteredMessages = messages.filter(message => message.id !== messageId);
    LocalStorageService.saveMessages(filteredMessages);
    return true;
  }

  async updateMessage(message: Message): Promise<Message> {
    console.log('تحديث رسالة في قاعدة البيانات...', message);
    const messages = LocalStorageService.getMessages();
    const updatedMessages = messages.map(m => 
      m.id === message.id ? message : m
    );
    LocalStorageService.saveMessages(updatedMessages);
    return message;
  }

  async getDailyBalances(): Promise<DailyBalance[]> {
    console.log('استرجاع الأرصدة اليومية من قاعدة البيانات...');
    return LocalStorageService.getBalanceHistory();
  }

  async saveDailyBalance(balance: DailyBalance): Promise<DailyBalance> {
    console.log('حفظ رصيد يومي في قاعدة البيانات...', balance);
    const balances = LocalStorageService.getBalanceHistory();
    const existingIndex = balances.findIndex(b => b.date === balance.date);
    
    if (existingIndex >= 0) {
      balances[existingIndex] = balance;
    } else {
      balances.push(balance);
    }
    
    LocalStorageService.saveBalanceHistory(balances);
    
    if (new Date(balance.date).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]) {
      LocalStorageService.saveDailyBalance(balance.amount);
    }
    
    return balance;
  }
}

// تنفيذ خدمة قاعدة البيانات باستخدام خادم خارجي (في المستقبل)
class RemoteDatabaseService implements DatabaseServiceInterface {
  private connected: boolean = false;
  private apiUrl: string = 'https://api.taybaelmadin.com/telecom'; // عنوان وهمي

  async connect(): Promise<boolean> {
    console.log('محاولة الاتصال بقاعدة البيانات البعيدة...');
    // هنا ستكون محاولة حقيقية للاتصال بخادم قاعدة البيانات
    try {
      // تنفيذ استدعاء الخادم الفعلي هنا
      // حاليًا نقوم بمحاكاة نجاح الاتصال
      this.connected = true;
      localStorage.setItem('dbConnectionState', 'connected');
      console.log('تم الاتصال بقاعدة البيانات البعيدة بنجاح');
      return true;
    } catch (error) {
      console.error('فشل الاتصال بقاعدة البيانات البعيدة', error);
      this.connected = false;
      localStorage.setItem('dbConnectionState', 'disconnected');
      return false;
    }
  }

  disconnect(): void {
    console.log('قطع الاتصال بقاعدة البيانات البعيدة...');
    this.connected = false;
    localStorage.setItem('dbConnectionState', 'disconnected');
    console.log('تم قطع الاتصال بقاعدة البيانات البعيدة');
  }

  isConnected(): boolean {
    return this.connected || localStorage.getItem('dbConnectionState') === 'connected';
  }

  // باقي التنفيذات ستكون مشابهة لتلك الخاصة بـ LocalDatabaseService
  // ولكن مع استدعاءات API حقيقية

  async getMessages(): Promise<Message[]> {
    // ستتم استبدال هذه الدالة بمكالمة API حقيقية
    return LocalStorageService.getMessages();
  }

  async saveMessage(message: Message): Promise<Message> {
    // ستتم استبدال هذه الدالة بمكالمة API حقيقية
    const messages = LocalStorageService.getMessages();
    messages.push(message);
    LocalStorageService.saveMessages(messages);
    return message;
  }

  async deleteMessage(messageId: string): Promise<boolean> {
    // ستتم استبدال هذه الدالة بمكالمة API حقيقية
    const messages = LocalStorageService.getMessages();
    const filteredMessages = messages.filter(message => message.id !== messageId);
    LocalStorageService.saveMessages(filteredMessages);
    return true;
  }

  async updateMessage(message: Message): Promise<Message> {
    // ستتم استبدال هذه الدالة بمكالمة API حقيقية
    const messages = LocalStorageService.getMessages();
    const updatedMessages = messages.map(m => 
      m.id === message.id ? message : m
    );
    LocalStorageService.saveMessages(updatedMessages);
    return message;
  }

  async getDailyBalances(): Promise<DailyBalance[]> {
    // ستتم استبدال هذه الدالة بمكالمة API حقيقية
    return LocalStorageService.getBalanceHistory();
  }

  async saveDailyBalance(balance: DailyBalance): Promise<DailyBalance> {
    // ستتم استبدال هذه الدالة بمكالمة API حقيقية
    const balances = LocalStorageService.getBalanceHistory();
    const existingIndex = balances.findIndex(b => b.date === balance.date);
    
    if (existingIndex >= 0) {
      balances[existingIndex] = balance;
    } else {
      balances.push(balance);
    }
    
    LocalStorageService.saveBalanceHistory(balances);
    return balance;
  }
}

// استخدم البيئة لاختيار نوع الخدمة المناسب
function createDatabaseService(): DatabaseServiceInterface {
  // يمكن استخدام متغيرات البيئة أو الإعدادات لتحديد نوع الخدمة الذي سيتم استخدامه
  const useRemoteDB = localStorage.getItem('useRemoteDB') === 'true';
  
  if (useRemoteDB) {
    console.log('استخدام خدمة قاعدة البيانات البعيدة');
    return new RemoteDatabaseService();
  } else {
    console.log('استخدام خدمة قاعدة البيانات المحلية');
    return new LocalDatabaseService();
  }
}

// تصدير نسخة واحدة من خدمة قاعدة البيانات
export const DatabaseService: DatabaseServiceInterface = createDatabaseService();

// استعادة حالة الاتصال عند بدء التشغيل
if (localStorage.getItem('dbConnectionState') === 'connected') {
  DatabaseService.connect()
    .then(connected => {
      console.log('استعادة حالة الاتصال بقاعدة البيانات:', connected ? 'متصل' : 'غير متصل');
    })
    .catch(error => {
      console.error('خطأ في استعادة الاتصال بقاعدة البيانات:', error);
    });
}

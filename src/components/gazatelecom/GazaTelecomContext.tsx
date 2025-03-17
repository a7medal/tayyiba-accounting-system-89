
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Message, 
  AccountType, 
  MessageType, 
  DailyBalance, 
  AccountSummary 
} from './models/MessageModel';
import { LocalStorageService } from './services/LocalStorageService';
import { DatabaseService } from './services/DatabaseService';
import { 
  calculateAccountSummary, 
  calculateMainAccountFinals as calcMainFinals,
  calculateBrinaAccountFinals as calcBrinaFinals,
  filterMessages as filterMessagesByFilters
} from './utils/AccountCalculations';
import { getPreviousDay } from './utils/ChartUtils';

interface GazaTelecomContextType {
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'> & { customDate?: string }) => void;
  updateMessage: (message: Message) => void;
  deleteMessage: (messageId: string) => void;
  dailyBalanceHistory: DailyBalance[];
  addDailyBalanceRecord: (record: Omit<DailyBalance, 'date'> & { date?: string }) => void;
  getHistoricalBalances: (days: number) => DailyBalance[];
  getBalanceForDate: (date: string) => number;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  getMainAccountSummary: (date?: string) => AccountSummary;
  getBrinaAccountSummary: (date?: string) => AccountSummary;
  calculateMainAccountFinals: (date?: string) => {
    final1: number;
    final2: number;
    totalInterest: number;
  };
  calculateBrinaAccountFinals: (date?: string) => {
    expectedBalance: number;
    balanceDifference: number;
  };
  filterMessages: (filters: {
    startDate?: string;
    endDate?: string;
    accountType?: AccountType;
    messageType?: MessageType;
    minAmount?: number;
    maxAmount?: number;
  }) => Message[];
  getMessagesByDate: (date?: string, accountType?: AccountType) => Message[];
}

const GazaTelecomContext = createContext<GazaTelecomContextType | undefined>(undefined);

export const GazaTelecomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // حالة التطبيق
  const [messages, setMessages] = useState<Message[]>([]);
  const [dailyBalanceHistory, setDailyBalanceHistory] = useState<DailyBalance[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // تحميل البيانات من قاعدة البيانات عند تحميل المكون
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // التحقق من حالة الاتصال بقاعدة البيانات
        const isConnected = DatabaseService.isConnected();
        
        if (isConnected) {
          // إذا كان هناك اتصال بقاعدة البيانات، نستخدمها
          console.log('تحميل البيانات من قاعدة البيانات...');
          const loadedMessages = await DatabaseService.getMessages();
          setMessages(loadedMessages);
          
          const loadedBalances = await DatabaseService.getDailyBalances();
          setDailyBalanceHistory(loadedBalances);
        } else {
          // إذا لم يكن هناك اتصال، نستخدم التخزين المحلي
          console.log('تحميل البيانات من التخزين المحلي...');
          setMessages(LocalStorageService.getMessages());
          setDailyBalanceHistory(LocalStorageService.getBalanceHistory());
        }
      } catch (error) {
        console.error('خطأ في تحميل البيانات:', error);
        // في حالة حدوث خطأ، نستخدم التخزين المحلي
        setMessages(LocalStorageService.getMessages());
        setDailyBalanceHistory(LocalStorageService.getBalanceHistory());
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // حفظ البيانات في قاعدة البيانات أو التخزين المحلي عند تغيرها
  useEffect(() => {
    if (isLoading) return; // تجنب حفظ البيانات أثناء التحميل الأولي
    
    const saveData = async () => {
      try {
        if (DatabaseService.isConnected()) {
          // لا نحتاج إلى حفظ الرسائل بشكل جماعي لأننا نحفظها بشكل فردي عند إضافتها أو تعديلها
          console.log('البيانات محفوظة في قاعدة البيانات');
        } else {
          // إذا لم يكن هناك اتصال، نستخدم التخزين المحلي
          LocalStorageService.saveMessages(messages);
          console.log('تم حفظ الرسائل في التخزين المحلي');
        }
      } catch (error) {
        console.error('خطأ في حفظ البيانات:', error);
        // في حالة حدوث خطأ، نستخدم التخزين المحلي
        LocalStorageService.saveMessages(messages);
      }
    };
    
    saveData();
  }, [messages, isLoading]);

  useEffect(() => {
    if (isLoading) return; // تجنب حفظ البيانات أثناء التحميل الأولي
    
    const saveBalances = async () => {
      try {
        if (DatabaseService.isConnected()) {
          // في الواقع، نحن نحفظ الأرصدة بشكل فردي في دالة addDailyBalanceRecord
          console.log('الأرصدة محفوظة في قاعدة البيانات');
        } else {
          LocalStorageService.saveBalanceHistory(dailyBalanceHistory);
          console.log('تم حفظ الأرصدة في التخزين المحلي');
        }
      } catch (error) {
        console.error('خطأ في حفظ الأرصدة:', error);
        LocalStorageService.saveBalanceHistory(dailyBalanceHistory);
      }
    };
    
    saveBalances();
  }, [dailyBalanceHistory, isLoading]);

  // إضافة رسالة جديدة
  const addMessage = async (newMessage: Omit<Message, 'id' | 'timestamp'> & { customDate?: string }) => {
    const now = new Date();
    const messageDate = newMessage.customDate ? new Date(newMessage.customDate) : now;
    
    // ضبط الوقت للتاريخ المخصص ليكون الوقت الحالي
    if (newMessage.customDate) {
      messageDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
    }
    
    const message: Message = {
      ...newMessage,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      timestamp: messageDate.toISOString(),
    };
    
    try {
      if (DatabaseService.isConnected()) {
        // حفظ الرسالة في قاعدة البيانات
        const savedMessage = await DatabaseService.saveMessage(message);
        
        // إضافة الرسالة للحالة المحلية
        setMessages(prev => [...prev, savedMessage]);
        
        // إذا كانت الرسالة واردة للحساب الرئيسي، قم بنسخها لحساب برينة تلقائيًا
        if (newMessage.accountType === 'main' && newMessage.messageType === 'incoming') {
          const brinaMessage: Message = {
            ...newMessage,
            accountType: 'brina',
            id: (Date.now() + 1).toString() + Math.random().toString(36).substr(2, 5),
            timestamp: messageDate.toISOString(),
            note: (newMessage.note ? newMessage.note + ' - ' : '') + 'تم النسخ تلقائيًا من الحساب الرئيسي',
          };
          
          const savedBrinaMessage = await DatabaseService.saveMessage(brinaMessage);
          setMessages(prev => [...prev, savedBrinaMessage]);
        }
      } else {
        // إضافة الرسالة للحالة المحلية
        setMessages(prev => [...prev, message]);
        
        // إذا كانت الرسالة واردة للحساب الرئيسي، قم بنسخها لحساب برينة تلقائيًا
        if (newMessage.accountType === 'main' && newMessage.messageType === 'incoming') {
          const brinaMessage: Message = {
            ...newMessage,
            accountType: 'brina',
            id: (Date.now() + 1).toString() + Math.random().toString(36).substr(2, 5),
            timestamp: messageDate.toISOString(),
            note: (newMessage.note ? newMessage.note + ' - ' : '') + 'تم النسخ تلقائيًا من الحساب الرئيسي',
          };
          
          setMessages(prev => [...prev, brinaMessage]);
        }
      }
    } catch (error) {
      console.error('خطأ في إضافة الرسالة:', error);
      
      // في حالة حدوث خطأ، نضيف الرسالة محليًا فقط
      setMessages(prev => [...prev, message]);
      
      if (newMessage.accountType === 'main' && newMessage.messageType === 'incoming') {
        const brinaMessage: Message = {
          ...newMessage,
          accountType: 'brina',
          id: (Date.now() + 1).toString() + Math.random().toString(36).substr(2, 5),
          timestamp: messageDate.toISOString(),
          note: (newMessage.note ? newMessage.note + ' - ' : '') + 'تم النسخ تلقائيًا من الحساب الرئيسي',
        };
        
        setMessages(prev => [...prev, brinaMessage]);
      }
    }
  };
  
  // تعديل رسالة
  const updateMessage = async (updatedMessage: Message) => {
    try {
      if (DatabaseService.isConnected()) {
        // تحديث الرسالة في قاعدة البيانات
        await DatabaseService.updateMessage(updatedMessage);
      }
      
      // تحديث الحالة المحلية
      setMessages(prev => 
        prev.map(message => 
          message.id === updatedMessage.id ? updatedMessage : message
        )
      );
    } catch (error) {
      console.error('خطأ في تحديث الرسالة:', error);
      
      // في حالة حدوث خطأ، نحدث الحالة المحلية فقط
      setMessages(prev => 
        prev.map(message => 
          message.id === updatedMessage.id ? updatedMessage : message
        )
      );
    }
  };
  
  // حذف رسالة
  const deleteMessage = async (messageId: string) => {
    try {
      if (DatabaseService.isConnected()) {
        // حذف الرسالة من قاعدة البيانات
        await DatabaseService.deleteMessage(messageId);
      }
      
      // تحديث الحالة المحلية
      setMessages(prev => prev.filter(message => message.id !== messageId));
    } catch (error) {
      console.error('خطأ في حذف الرسالة:', error);
      
      // في حالة حدوث خطأ، نحدث الحالة المحلية فقط
      setMessages(prev => prev.filter(message => message.id !== messageId));
    }
  };

  // الحصول على الرسائل حسب التاريخ
  const getMessagesByDate = (date?: string, accountType?: AccountType) => {
    const targetDate = date || selectedDate;
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    return messages.filter(message => {
      const messageDate = new Date(message.timestamp);
      const dateMatches = messageDate >= startOfDay && messageDate <= endOfDay;
      const accountMatches = !accountType || message.accountType === accountType;
      
      return dateMatches && accountMatches;
    });
  };

  // الحصول على ملخص الحساب
  const getMainAccountSummary = (date?: string) => {
    const filteredMessages = date 
      ? getMessagesByDate(date, 'main')
      : messages.filter(m => m.accountType === 'main');
    return calculateAccountSummary(filteredMessages, 'main');
  };
  
  const getBrinaAccountSummary = (date?: string) => {
    const filteredMessages = date 
      ? getMessagesByDate(date, 'brina')
      : messages.filter(m => m.accountType === 'brina');
    return calculateAccountSummary(filteredMessages, 'brina');
  };

  // حساب النهائيات
  const calculateMainAccountFinals = (date?: string) => {
    return calcMainFinals(getMainAccountSummary(date));
  };

  const calculateBrinaAccountFinals = (date?: string) => {
    const targetDate = date || selectedDate;
    const currentBalance = getBalanceForDate(targetDate);
    const previousDate = getPreviousDay(targetDate);
    const previousBalance = getBalanceForDate(previousDate);
    
    return calcBrinaFinals(getBrinaAccountSummary(targetDate), currentBalance, previousBalance);
  };

  // الحصول على رصيد لتاريخ معين
  const getBalanceForDate = (date: string): number => {
    const record = dailyBalanceHistory.find(item => item.date === date);
    return record ? record.amount : 0;
  };

  // إضافة سجل رصيد يومي جديد
  const addDailyBalanceRecord = async (record: Omit<DailyBalance, 'date'> & { date?: string }) => {
    const targetDate = record.date || new Date().toISOString().split('T')[0];
    const balanceRecord: DailyBalance = {
      date: targetDate,
      amount: record.amount
    };
    
    try {
      if (DatabaseService.isConnected()) {
        // حفظ الرصيد في قاعدة البيانات
        await DatabaseService.saveDailyBalance(balanceRecord);
      }
      
      // التحقق من وجود سجل لهذا اليوم
      const existingRecordIndex = dailyBalanceHistory.findIndex(
        item => item.date === targetDate
      );
      
      if (existingRecordIndex !== -1) {
        // تحديث السجل الموجود
        const updatedHistory = [...dailyBalanceHistory];
        updatedHistory[existingRecordIndex] = balanceRecord;
        setDailyBalanceHistory(updatedHistory);
      } else {
        // إضافة سجل جديد
        setDailyBalanceHistory(prev => [...prev, balanceRecord]);
      }
    } catch (error) {
      console.error('خطأ في حفظ الرصيد اليومي:', error);
      
      // في حالة حدوث خطأ، نحدث الحالة المحلية فقط
      const existingRecordIndex = dailyBalanceHistory.findIndex(
        item => item.date === targetDate
      );
      
      if (existingRecordIndex !== -1) {
        // تحديث السجل الموجود
        const updatedHistory = [...dailyBalanceHistory];
        updatedHistory[existingRecordIndex] = balanceRecord;
        setDailyBalanceHistory(updatedHistory);
      } else {
        // إضافة سجل جديد
        setDailyBalanceHistory(prev => [...prev, balanceRecord]);
      }
    }
  };

  // استرجاع الأرصدة التاريخية
  const getHistoricalBalances = (days: number): DailyBalance[] => {
    const sortedHistory = [...dailyBalanceHistory].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return sortedHistory.slice(0, days);
  };

  // تصفية الرسائل
  const filterMessages = (filters: {
    startDate?: string;
    endDate?: string;
    accountType?: AccountType;
    messageType?: MessageType;
    minAmount?: number;
    maxAmount?: number;
  }) => {
    return filterMessagesByFilters(messages, filters);
  };

  return (
    <GazaTelecomContext.Provider
      value={{
        messages,
        addMessage,
        updateMessage,
        deleteMessage,
        dailyBalanceHistory,
        addDailyBalanceRecord,
        getHistoricalBalances,
        getBalanceForDate,
        selectedDate,
        setSelectedDate,
        getMainAccountSummary,
        getBrinaAccountSummary,
        calculateMainAccountFinals,
        calculateBrinaAccountFinals,
        filterMessages,
        getMessagesByDate
      }}
    >
      {children}
    </GazaTelecomContext.Provider>
  );
};

// Fixed re-export using 'export type' syntax
export type { AccountType, MessageType };

export const useGazaTelecom = () => {
  const context = useContext(GazaTelecomContext);
  if (context === undefined) {
    throw new Error('useGazaTelecom must be used within a GazaTelecomProvider');
  }
  return context;
};

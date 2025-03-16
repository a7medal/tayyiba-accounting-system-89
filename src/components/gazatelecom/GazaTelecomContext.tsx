
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Message, 
  AccountType, 
  MessageType, 
  DailyBalance, 
  AccountSummary 
} from './models/MessageModel';
import { LocalStorageService } from './services/LocalStorageService';
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

  // تحميل البيانات من التخزين المحلي عند تحميل المكون
  useEffect(() => {
    setMessages(LocalStorageService.getMessages());
    setDailyBalanceHistory(LocalStorageService.getBalanceHistory());
  }, []);

  // حفظ البيانات في التخزين المحلي عند تغيرها
  useEffect(() => {
    LocalStorageService.saveMessages(messages);
  }, [messages]);

  useEffect(() => {
    LocalStorageService.saveBalanceHistory(dailyBalanceHistory);
  }, [dailyBalanceHistory]);

  // إضافة رسالة جديدة
  const addMessage = (newMessage: Omit<Message, 'id' | 'timestamp'> & { customDate?: string }) => {
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
    
    // إضافة الرسالة الأصلية
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
  };
  
  // تعديل رسالة
  const updateMessage = (updatedMessage: Message) => {
    setMessages(prev => 
      prev.map(message => 
        message.id === updatedMessage.id ? updatedMessage : message
      )
    );
  };
  
  // حذف رسالة
  const deleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(message => message.id !== messageId));
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
  const addDailyBalanceRecord = (record: Omit<DailyBalance, 'date'> & { date?: string }) => {
    const targetDate = record.date || new Date().toISOString().split('T')[0];
    
    // التحقق من وجود سجل لهذا اليوم
    const existingRecordIndex = dailyBalanceHistory.findIndex(
      item => item.date === targetDate
    );
    
    if (existingRecordIndex !== -1) {
      // تحديث السجل الموجود
      const updatedHistory = [...dailyBalanceHistory];
      updatedHistory[existingRecordIndex] = {
        date: targetDate,
        amount: record.amount
      };
      setDailyBalanceHistory(updatedHistory);
    } else {
      // إضافة سجل جديد
      setDailyBalanceHistory(prev => [
        ...prev,
        { date: targetDate, amount: record.amount }
      ]);
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

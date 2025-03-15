
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

interface GazaTelecomContextType {
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateMessage: (message: Message) => void;
  deleteMessage: (messageId: string) => void;
  dailyBalance: number;
  setDailyBalance: (amount: number) => void;
  previousDayBalance: number;
  setPreviousDayBalance: (amount: number) => void;
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
  dailyBalanceHistory: DailyBalance[];
  addDailyBalanceRecord: (record: Omit<DailyBalance, 'date'>) => void;
  getHistoricalBalances: (days: number) => DailyBalance[];
  getBalanceForDate: (date: string) => number;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

const GazaTelecomContext = createContext<GazaTelecomContextType | undefined>(undefined);

export const GazaTelecomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // حالة التطبيق
  const [messages, setMessages] = useState<Message[]>([]);
  const [dailyBalance, setDailyBalance] = useState<number>(0);
  const [previousDayBalance, setPreviousDayBalance] = useState<number>(0);
  const [dailyBalanceHistory, setDailyBalanceHistory] = useState<DailyBalance[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // تحميل البيانات من التخزين المحلي عند تحميل المكون
  useEffect(() => {
    setMessages(LocalStorageService.getMessages());
    setDailyBalance(LocalStorageService.getDailyBalance());
    setPreviousDayBalance(LocalStorageService.getPreviousDayBalance());
    setDailyBalanceHistory(LocalStorageService.getBalanceHistory());
  }, []);

  // حفظ البيانات في التخزين المحلي عند تغيرها
  useEffect(() => {
    LocalStorageService.saveMessages(messages);
  }, [messages]);

  useEffect(() => {
    LocalStorageService.saveDailyBalance(dailyBalance);
  }, [dailyBalance]);

  useEffect(() => {
    LocalStorageService.savePreviousDayBalance(previousDayBalance);
  }, [previousDayBalance]);

  useEffect(() => {
    LocalStorageService.saveBalanceHistory(dailyBalanceHistory);
  }, [dailyBalanceHistory]);

  // إضافة رسالة جديدة
  const addMessage = (newMessage: Omit<Message, 'id' | 'timestamp'>) => {
    const message: Message = {
      ...newMessage,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    
    // إضافة الرسالة الأصلية
    setMessages(prev => [...prev, message]);
    
    // إذا كانت الرسالة واردة للحساب الرئيسي، قم بنسخها لحساب برينة تلقائيًا
    if (newMessage.accountType === 'main' && newMessage.messageType === 'incoming') {
      const brinaMessage: Message = {
        ...newMessage,
        accountType: 'brina',
        id: (Date.now() + 1).toString(),
        timestamp: new Date().toISOString(),
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
    const balance = getBalanceForDate(date || selectedDate);
    const prevBalance = getPreviousDateBalance(date || selectedDate);
    return calcBrinaFinals(getBrinaAccountSummary(date), balance, prevBalance);
  };

  // الحصول على رصيد لتاريخ معين
  const getBalanceForDate = (date: string): number => {
    const record = dailyBalanceHistory.find(item => item.date === date);
    return record ? record.amount : 0;
  };
  
  // الحصول على رصيد اليوم السابق
  const getPreviousDateBalance = (date: string): number => {
    const targetDate = new Date(date);
    targetDate.setDate(targetDate.getDate() - 1);
    const prevDateStr = targetDate.toISOString().split('T')[0];
    
    const record = dailyBalanceHistory.find(item => item.date === prevDateStr);
    return record ? record.amount : 0;
  };

  // إضافة سجل رصيد يومي جديد
  const addDailyBalanceRecord = (record: Omit<DailyBalance, 'date'>) => {
    const today = new Date().toISOString().split('T')[0];
    
    // التحقق من وجود سجل لهذا اليوم
    const existingRecordIndex = dailyBalanceHistory.findIndex(
      item => item.date === today
    );
    
    if (existingRecordIndex !== -1) {
      // تحديث السجل الموجود
      const updatedHistory = [...dailyBalanceHistory];
      updatedHistory[existingRecordIndex] = {
        date: today,
        amount: record.amount
      };
      setDailyBalanceHistory(updatedHistory);
    } else {
      // إضافة سجل جديد
      setDailyBalanceHistory(prev => [
        ...prev,
        { date: today, amount: record.amount }
      ]);
    }
    
    // تحديث رصيد اليوم
    setDailyBalance(record.amount);
    
    // تخزين رصيد الأمس
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    const yesterdayRecord = dailyBalanceHistory.find(
      item => item.date === yesterdayStr
    );
    
    if (yesterdayRecord) {
      setPreviousDayBalance(yesterdayRecord.amount);
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
        dailyBalance,
        setDailyBalance,
        previousDayBalance,
        setPreviousDayBalance,
        getMainAccountSummary,
        getBrinaAccountSummary,
        calculateMainAccountFinals,
        calculateBrinaAccountFinals,
        filterMessages,
        dailyBalanceHistory,
        addDailyBalanceRecord,
        getHistoricalBalances,
        getMessagesByDate,
        getBalanceForDate,
        selectedDate,
        setSelectedDate
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

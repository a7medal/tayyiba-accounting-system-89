
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
  dailyBalance: number;
  setDailyBalance: (amount: number) => void;
  previousDayBalance: number;
  setPreviousDayBalance: (amount: number) => void;
  getMainAccountSummary: () => AccountSummary;
  getBrinaAccountSummary: () => AccountSummary;
  calculateMainAccountFinals: () => {
    final1: number;
    final2: number;
    totalInterest: number;
  };
  calculateBrinaAccountFinals: () => {
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
  dailyBalanceHistory: DailyBalance[];
  addDailyBalanceRecord: (record: Omit<DailyBalance, 'date'>) => void;
  getHistoricalBalances: (days: number) => DailyBalance[];
}

const GazaTelecomContext = createContext<GazaTelecomContextType | undefined>(undefined);

export const GazaTelecomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // حالة التطبيق
  const [messages, setMessages] = useState<Message[]>([]);
  const [dailyBalance, setDailyBalance] = useState<number>(0);
  const [previousDayBalance, setPreviousDayBalance] = useState<number>(0);
  const [dailyBalanceHistory, setDailyBalanceHistory] = useState<DailyBalance[]>([]);

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
    setMessages(prev => [...prev, message]);
  };

  // الحصول على ملخص الحساب
  const getMainAccountSummary = () => calculateAccountSummary(messages, 'main');
  const getBrinaAccountSummary = () => calculateAccountSummary(messages, 'brina');

  // حساب النهائيات
  const calculateMainAccountFinals = () => {
    return calcMainFinals(getMainAccountSummary());
  };

  const calculateBrinaAccountFinals = () => {
    return calcBrinaFinals(getBrinaAccountSummary(), dailyBalance, previousDayBalance);
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
        getHistoricalBalances
      }}
    >
      {children}
    </GazaTelecomContext.Provider>
  );
};

export { AccountType, MessageType };

export const useGazaTelecom = () => {
  const context = useContext(GazaTelecomContext);
  if (context === undefined) {
    throw new Error('useGazaTelecom must be used within a GazaTelecomProvider');
  }
  return context;
};

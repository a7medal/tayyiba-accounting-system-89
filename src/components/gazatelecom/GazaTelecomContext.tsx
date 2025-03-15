
import React, { createContext, useContext, useState, useEffect } from 'react';

export type AccountType = 'main' | 'brina';
export type MessageType = 'incoming' | 'outgoing';

export interface Message {
  id: string;
  accountType: AccountType;
  messageType: MessageType;
  serialNumber: string;
  amount: number;
  interest: number;
  note?: string;
  timestamp: string;
}

interface DailyBalance {
  date: string;
  amount: number;
}

interface AccountSummary {
  outgoingTotal: number;
  outgoingInterestTotal: number;
  outgoingCount: number;
  incomingTotal: number;
  incomingInterestTotal: number;
  incomingCount: number;
}

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [dailyBalance, setDailyBalance] = useState<number>(0);
  const [previousDayBalance, setPreviousDayBalance] = useState<number>(0);
  const [dailyBalanceHistory, setDailyBalanceHistory] = useState<DailyBalance[]>([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('gazaTelecomMessages');
    const savedDailyBalance = localStorage.getItem('gazaTelecomDailyBalance');
    const savedPreviousDayBalance = localStorage.getItem('gazaTelecomPreviousDayBalance');
    const savedBalanceHistory = localStorage.getItem('gazaTelecomBalanceHistory');

    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
    if (savedDailyBalance) {
      setDailyBalance(Number(savedDailyBalance));
    }
    if (savedPreviousDayBalance) {
      setPreviousDayBalance(Number(savedPreviousDayBalance));
    }
    if (savedBalanceHistory) {
      setDailyBalanceHistory(JSON.parse(savedBalanceHistory));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('gazaTelecomMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('gazaTelecomDailyBalance', dailyBalance.toString());
  }, [dailyBalance]);

  useEffect(() => {
    localStorage.setItem('gazaTelecomPreviousDayBalance', previousDayBalance.toString());
  }, [previousDayBalance]);

  useEffect(() => {
    localStorage.setItem('gazaTelecomBalanceHistory', JSON.stringify(dailyBalanceHistory));
  }, [dailyBalanceHistory]);

  const addMessage = (newMessage: Omit<Message, 'id' | 'timestamp'>) => {
    const message: Message = {
      ...newMessage,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, message]);
  };

  const getAccountSummary = (accountType: AccountType): AccountSummary => {
    const accountMessages = messages.filter(msg => msg.accountType === accountType);
    
    const outgoing = accountMessages.filter(msg => msg.messageType === 'outgoing');
    const incoming = accountMessages.filter(msg => msg.messageType === 'incoming');
    
    const outgoingTotal = outgoing.reduce((sum, msg) => sum + msg.amount, 0);
    const outgoingInterestTotal = outgoing.reduce((sum, msg) => sum + msg.interest, 0);
    const incomingTotal = incoming.reduce((sum, msg) => sum + msg.amount, 0);
    const incomingInterestTotal = incoming.reduce((sum, msg) => sum + msg.interest, 0);
    
    return {
      outgoingTotal,
      outgoingInterestTotal,
      outgoingCount: outgoing.length,
      incomingTotal,
      incomingInterestTotal,
      incomingCount: incoming.length,
    };
  };

  const getMainAccountSummary = () => getAccountSummary('main');
  const getBrinaAccountSummary = () => getAccountSummary('brina');

  const calculateMainAccountFinals = () => {
    const { outgoingTotal, outgoingInterestTotal, incomingTotal, incomingInterestTotal } = getMainAccountSummary();
    
    const final1 = outgoingTotal - incomingTotal;
    const final2 = final1 * 10;
    const totalInterest = outgoingInterestTotal + incomingInterestTotal;
    
    return { final1, final2, totalInterest };
  };

  const calculateBrinaAccountFinals = () => {
    const { outgoingTotal, incomingTotal } = getBrinaAccountSummary();
    
    const expectedBalance = outgoingTotal - incomingTotal + previousDayBalance;
    const balanceDifference = expectedBalance - dailyBalance;
    
    return { expectedBalance, balanceDifference };
  };

  // إضافة سجل رصيد يومي جديد
  const addDailyBalanceRecord = (record: Omit<DailyBalance, 'date'>) => {
    const today = new Date().toISOString().split('T')[0];
    
    // تحقق مما إذا كان هناك سجل لهذا اليوم بالفعل
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
    
    // تخزين رصيد الأمس إذا كان اليوم التالي
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

  // استرجاع أرصدة تاريخية لعدد معين من الأيام
  const getHistoricalBalances = (days: number): DailyBalance[] => {
    // ترتيب السجلات بترتيب تنازلي حسب التاريخ
    const sortedHistory = [...dailyBalanceHistory].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // إرجاع العدد المطلوب من السجلات
    return sortedHistory.slice(0, days);
  };

  const filterMessages = (filters: {
    startDate?: string;
    endDate?: string;
    accountType?: AccountType;
    messageType?: MessageType;
    minAmount?: number;
    maxAmount?: number;
  }) => {
    return messages.filter(message => {
      if (filters.startDate && new Date(message.timestamp) < new Date(filters.startDate)) {
        return false;
      }
      if (filters.endDate && new Date(message.timestamp) > new Date(filters.endDate)) {
        return false;
      }
      if (filters.accountType && message.accountType !== filters.accountType) {
        return false;
      }
      if (filters.messageType && message.messageType !== filters.messageType) {
        return false;
      }
      if (filters.minAmount !== undefined && message.amount < filters.minAmount) {
        return false;
      }
      if (filters.maxAmount !== undefined && message.amount > filters.maxAmount) {
        return false;
      }
      return true;
    });
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

export const useGazaTelecom = () => {
  const context = useContext(GazaTelecomContext);
  if (context === undefined) {
    throw new Error('useGazaTelecom must be used within a GazaTelecomProvider');
  }
  return context;
};

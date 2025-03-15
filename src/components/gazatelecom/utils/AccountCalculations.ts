
import { Message, AccountType, AccountSummary } from '../models/MessageModel';

/**
 * وظائف مساعدة لحسابات الحسابات
 */

// حساب ملخص الحساب
export const calculateAccountSummary = (messages: Message[], accountType: AccountType): AccountSummary => {
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

// حساب النهائيات للحساب الرئيسي
export const calculateMainAccountFinals = (summary: AccountSummary) => {
  const { outgoingTotal, outgoingInterestTotal, incomingTotal, incomingInterestTotal } = summary;
  
  const final1 = outgoingTotal - incomingTotal;
  const final2 = final1 * 10;
  const totalInterest = outgoingInterestTotal + incomingInterestTotal;
  
  return { final1, final2, totalInterest };
};

// حساب النهائيات لحساب برينة
export const calculateBrinaAccountFinals = (summary: AccountSummary, dailyBalance: number, previousDayBalance: number) => {
  const { outgoingTotal, incomingTotal } = summary;
  
  const expectedBalance = outgoingTotal - incomingTotal + previousDayBalance;
  const balanceDifference = expectedBalance - dailyBalance;
  
  return { expectedBalance, balanceDifference };
};

// تصفية الرسائل حسب المعايير
export const filterMessages = (
  messages: Message[],
  filters: {
    startDate?: string;
    endDate?: string;
    accountType?: AccountType;
    messageType?: any;
    minAmount?: number;
    maxAmount?: number;
  }
) => {
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


import { Message, DailyBalance } from '../models/MessageModel';

// المفاتيح المستخدمة في التخزين المحلي
const STORAGE_KEYS = {
  MESSAGES: 'gazaTelecomMessages',
  DAILY_BALANCE: 'gazaTelecomDailyBalance',
  PREVIOUS_DAY_BALANCE: 'gazaTelecomPreviousDayBalance',
  BALANCE_HISTORY: 'gazaTelecomBalanceHistory'
};

/**
 * خدمة التخزين المحلي لإدارة بيانات تطبيق غزة تليكوم
 */
export const LocalStorageService = {
  // استرجاع الرسائل من التخزين المحلي
  getMessages: (): Message[] => {
    const savedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return savedMessages ? JSON.parse(savedMessages) : [];
  },

  // حفظ الرسائل في التخزين المحلي
  saveMessages: (messages: Message[]): void => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  },

  // استرجاع الرصيد اليومي من التخزين المحلي
  getDailyBalance: (): number => {
    const savedBalance = localStorage.getItem(STORAGE_KEYS.DAILY_BALANCE);
    return savedBalance ? Number(savedBalance) : 0;
  },

  // حفظ الرصيد اليومي في التخزين المحلي
  saveDailyBalance: (balance: number): void => {
    localStorage.setItem(STORAGE_KEYS.DAILY_BALANCE, balance.toString());
  },

  // استرجاع رصيد اليوم السابق من التخزين المحلي
  getPreviousDayBalance: (): number => {
    const savedBalance = localStorage.getItem(STORAGE_KEYS.PREVIOUS_DAY_BALANCE);
    return savedBalance ? Number(savedBalance) : 0;
  },

  // حفظ رصيد اليوم السابق في التخزين المحلي
  savePreviousDayBalance: (balance: number): void => {
    localStorage.setItem(STORAGE_KEYS.PREVIOUS_DAY_BALANCE, balance.toString());
  },

  // استرجاع سجل الأرصدة اليومية من التخزين المحلي
  getBalanceHistory: (): DailyBalance[] => {
    const savedHistory = localStorage.getItem(STORAGE_KEYS.BALANCE_HISTORY);
    return savedHistory ? JSON.parse(savedHistory) : [];
  },

  // حفظ سجل الأرصدة اليومية في التخزين المحلي
  saveBalanceHistory: (history: DailyBalance[]): void => {
    localStorage.setItem(STORAGE_KEYS.BALANCE_HISTORY, JSON.stringify(history));
  }
};

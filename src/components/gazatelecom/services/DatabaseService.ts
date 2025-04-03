
import { Message, DailyBalance, AccountTransaction, Account } from '../models/MessageModel';

class GazaTelemDatabaseService {
  private LOCAL_STORAGE_MESSAGES = 'gazaTelecom_messages';
  private LOCAL_STORAGE_BALANCES = 'gazaTelecom_balances';
  private LOCAL_STORAGE_ACCOUNTS = 'gazaTelecom_accounts';
  private LOCAL_STORAGE_TRANSACTIONS = 'gazaTelecom_transactions';

  // وظائف الرسائل
  async getMessages(): Promise<Message[]> {
    try {
      const data = localStorage.getItem(this.LOCAL_STORAGE_MESSAGES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('خطأ في استرجاع الرسائل:', error);
      return [];
    }
  }

  async saveMessage(message: Message): Promise<Message> {
    try {
      const messages = await this.getMessages();
      messages.push(message);
      localStorage.setItem(this.LOCAL_STORAGE_MESSAGES, JSON.stringify(messages));
      return message;
    } catch (error) {
      console.error('خطأ في حفظ الرسالة:', error);
      throw error;
    }
  }

  async updateMessage(message: Message): Promise<Message> {
    try {
      const messages = await this.getMessages();
      const index = messages.findIndex(m => m.id === message.id);
      if (index === -1) {
        throw new Error('الرسالة غير موجودة');
      }
      
      messages[index] = message;
      localStorage.setItem(this.LOCAL_STORAGE_MESSAGES, JSON.stringify(messages));
      return message;
    } catch (error) {
      console.error('خطأ في تحديث الرسالة:', error);
      throw error;
    }
  }

  async deleteMessage(messageId: string): Promise<boolean> {
    try {
      const messages = await this.getMessages();
      const filteredMessages = messages.filter(message => message.id !== messageId);
      localStorage.setItem(this.LOCAL_STORAGE_MESSAGES, JSON.stringify(filteredMessages));
      return true;
    } catch (error) {
      console.error('خطأ في حذف الرسالة:', error);
      throw error;
    }
  }

  // وظائف الأرصدة اليومية
  async getDailyBalances(): Promise<DailyBalance[]> {
    try {
      const data = localStorage.getItem(this.LOCAL_STORAGE_BALANCES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('خطأ في استرجاع الأرصدة اليومية:', error);
      return [];
    }
  }

  async saveDailyBalance(balance: DailyBalance): Promise<DailyBalance> {
    try {
      const balances = await this.getDailyBalances();
      const index = balances.findIndex(b => b.date === balance.date);
      
      if (index !== -1) {
        balances[index] = balance;
      } else {
        balances.push(balance);
      }
      
      localStorage.setItem(this.LOCAL_STORAGE_BALANCES, JSON.stringify(balances));
      return balance;
    } catch (error) {
      console.error('خطأ في حفظ الرصيد اليومي:', error);
      throw error;
    }
  }

  // وظائف الحسابات
  async getAccounts(): Promise<Account[]> {
    try {
      const data = localStorage.getItem(this.LOCAL_STORAGE_ACCOUNTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('خطأ في استرجاع الحسابات:', error);
      return [];
    }
  }

  async saveAccount(account: Account): Promise<Account> {
    try {
      const accounts = await this.getAccounts();
      const index = accounts.findIndex(a => a.id === account.id);
      
      if (index !== -1) {
        accounts[index] = account;
      } else {
        accounts.push(account);
      }
      
      localStorage.setItem(this.LOCAL_STORAGE_ACCOUNTS, JSON.stringify(accounts));
      return account;
    } catch (error) {
      console.error('خطأ في حفظ الحساب:', error);
      throw error;
    }
  }

  async deleteAccount(accountId: string): Promise<boolean> {
    try {
      const accounts = await this.getAccounts();
      const filteredAccounts = accounts.filter(account => account.id !== accountId);
      localStorage.setItem(this.LOCAL_STORAGE_ACCOUNTS, JSON.stringify(filteredAccounts));
      return true;
    } catch (error) {
      console.error('خطأ في حذف الحساب:', error);
      throw error;
    }
  }

  // وظائف معاملات الحسابات
  async getTransactions(): Promise<AccountTransaction[]> {
    try {
      const data = localStorage.getItem(this.LOCAL_STORAGE_TRANSACTIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('خطأ في استرجاع المعاملات:', error);
      return [];
    }
  }

  async saveTransaction(transaction: AccountTransaction): Promise<AccountTransaction> {
    try {
      const transactions = await this.getTransactions();
      transactions.push(transaction);
      localStorage.setItem(this.LOCAL_STORAGE_TRANSACTIONS, JSON.stringify(transactions));
      return transaction;
    } catch (error) {
      console.error('خطأ في حفظ المعاملة:', error);
      throw error;
    }
  }

  async getTransactionsByDate(startDate: string, endDate: string): Promise<AccountTransaction[]> {
    try {
      const transactions = await this.getTransactions();
      return transactions.filter(transaction => {
        const transDate = new Date(transaction.timestamp);
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        
        return transDate >= start && transDate <= end;
      });
    } catch (error) {
      console.error('خطأ في استرجاع المعاملات حسب التاريخ:', error);
      return [];
    }
  }

  async getTransactionsByAccount(accountId: string): Promise<AccountTransaction[]> {
    try {
      const transactions = await this.getTransactions();
      return transactions.filter(transaction => 
        transaction.accountId === accountId || transaction.toAccountId === accountId
      );
    } catch (error) {
      console.error('خطأ في استرجاع معاملات الحساب:', error);
      return [];
    }
  }
}

export const DatabaseService = new GazaTelemDatabaseService();

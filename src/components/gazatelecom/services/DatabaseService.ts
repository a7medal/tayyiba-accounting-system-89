
import { 
  Message, 
  DailyBalance, 
  Account, 
  AccountTransaction,
  Debt, 
  DebtPayment, 
  EntityTransaction 
} from '../models/MessageModel';
import { LocalStorageService } from './LocalStorageService';

export class DatabaseService {
  private static connected = false;

  static isConnected(): boolean {
    return this.connected || localStorage.getItem('dbConnectionState') === 'connected';
  }

  static async connect(): Promise<boolean> {
    try {
      // Simulating database connection
      this.connected = true;
      localStorage.setItem('dbConnectionState', 'connected');
      return true;
    } catch (error) {
      console.error('فشل الاتصال بقاعدة البيانات:', error);
      this.connected = false;
      localStorage.setItem('dbConnectionState', 'disconnected');
      return false;
    }
  }

  static disconnect(): void {
    this.connected = false;
    localStorage.setItem('dbConnectionState', 'disconnected');
  }

  // Message operations
  static async getMessages(): Promise<Message[]> {
    // For now, we'll use LocalStorageService as our database
    return LocalStorageService.getMessages();
  }

  static async saveMessage(message: Message): Promise<Message> {
    return LocalStorageService.saveMessage(message);
  }

  static async updateMessage(message: Message): Promise<Message> {
    return LocalStorageService.saveMessage(message);
  }

  static async deleteMessage(messageId: string): Promise<boolean> {
    return LocalStorageService.deleteMessage(messageId);
  }

  // Daily balance operations
  static async getDailyBalances(): Promise<DailyBalance[]> {
    return LocalStorageService.getBalanceHistory();
  }

  static async saveDailyBalance(balance: DailyBalance): Promise<DailyBalance> {
    return LocalStorageService.saveDailyBalance(balance);
  }

  // Account operations 
  static async getAccounts(): Promise<Account[]> {
    const accounts = localStorage.getItem('app_accounts');
    return accounts ? JSON.parse(accounts) : [];
  }

  static async saveAccount(account: Account): Promise<Account> {
    const accounts = await this.getAccounts();
    const existingIndex = accounts.findIndex(a => a.id === account.id);
    
    if (existingIndex !== -1) {
      accounts[existingIndex] = account;
    } else {
      accounts.push(account);
    }
    
    localStorage.setItem('app_accounts', JSON.stringify(accounts));
    return account;
  }

  // Transaction operations
  static async getTransactions(): Promise<AccountTransaction[]> {
    const transactions = localStorage.getItem('app_transactions');
    return transactions ? JSON.parse(transactions) : [];
  }

  static async saveTransaction(transaction: AccountTransaction): Promise<AccountTransaction> {
    const transactions = await this.getTransactions();
    transactions.push(transaction);
    localStorage.setItem('app_transactions', JSON.stringify(transactions));
    return transaction;
  }
}

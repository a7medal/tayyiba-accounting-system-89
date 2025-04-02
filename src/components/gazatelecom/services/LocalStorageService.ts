
import { Message, DailyBalance } from '../models/MessageModel';

export class LocalStorageService {
  private static readonly MESSAGES_KEY = 'app_messages';
  private static readonly BALANCE_HISTORY_KEY = 'app_balance_history';

  // Message operations
  static getMessages(): Message[] {
    const messages = localStorage.getItem(this.MESSAGES_KEY);
    return messages ? JSON.parse(messages) : [];
  }

  static saveMessages(messages: Message[]): void {
    localStorage.setItem(this.MESSAGES_KEY, JSON.stringify(messages));
  }

  static saveMessage(message: Message): Message {
    const messages = this.getMessages();
    const existingIndex = messages.findIndex(m => m.id === message.id);
    
    if (existingIndex !== -1) {
      // Update existing message
      messages[existingIndex] = message;
    } else {
      // Add new message
      messages.push(message);
    }
    
    this.saveMessages(messages);
    return message;
  }

  static deleteMessage(messageId: string): boolean {
    const messages = this.getMessages();
    const initialLength = messages.length;
    const filteredMessages = messages.filter(m => m.id !== messageId);
    
    if (filteredMessages.length !== initialLength) {
      this.saveMessages(filteredMessages);
      return true;
    }
    
    return false;
  }

  // Balance history operations
  static getBalanceHistory(): DailyBalance[] {
    const history = localStorage.getItem(this.BALANCE_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  }

  static saveBalanceHistory(history: DailyBalance[]): void {
    localStorage.setItem(this.BALANCE_HISTORY_KEY, JSON.stringify(history));
  }

  static saveDailyBalance(balance: DailyBalance): DailyBalance {
    const history = this.getBalanceHistory();
    const existingIndex = history.findIndex(item => item.date === balance.date);
    
    if (existingIndex !== -1) {
      // Update existing balance
      history[existingIndex] = balance;
    } else {
      // Add new balance record
      history.push(balance);
    }
    
    this.saveBalanceHistory(history);
    return balance;
  }
}

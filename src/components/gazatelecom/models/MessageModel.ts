
// نماذج البيانات المستخدمة في تطبيق غزة تليكوم

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

export interface DailyBalance {
  date: string;
  amount: number;
}

export interface AccountSummary {
  outgoingTotal: number;
  outgoingInterestTotal: number;
  outgoingCount: number;
  incomingTotal: number;
  incomingInterestTotal: number;
  incomingCount: number;
}

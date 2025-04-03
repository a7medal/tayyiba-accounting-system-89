
export type AccountType = 'main' | 'brina';
export type MessageType = 'outgoing' | 'incoming';
export type TransactionType = 'deposit' | 'withdrawal' | 'transfer';

export interface Message {
  id: string;
  messageNumber: string;
  phone: string;
  amount: number;
  date: string;
  messageType: MessageType;
  status: 'pending' | 'completed' | 'failed';
  note?: string;
  retracted?: boolean;
  retractionDate?: string;
  
  // Adding properties that are being used in the components
  timestamp: string;
  accountType: AccountType;
  serialNumber: string;
  interest: number;
}

export interface MessageFilter {
  startDate?: string;
  endDate?: string;
  type?: string;
  status?: string;
  searchText?: string;
}

export interface DailyBalance {
  date: string;
  amount: number;
}

export interface AccountSummary {
  incomingTotal: number;
  outgoingTotal: number;
  incomingCount: number;
  outgoingCount: number;
  incomingInterestTotal: number;
  outgoingInterestTotal: number;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface AccountTransaction {
  id: string;
  accountId: string;
  amount: number;
  type: TransactionType;
  description?: string;
  createdAt: string;
}

export interface Debt {
  id: string;
  entityId: string;
  entityType: 'client' | 'supplier';
  amount: number;
  remainingAmount: number;
  description: string;
  createdAt: string;
  dueDate?: string;
}

export interface DebtPayment {
  id: string;
  debtId: string;
  amount: number;
  date: string;
  notes?: string;
}

export interface EntityTransaction {
  id: string;
  entityId: string;
  entityType: 'client' | 'supplier';
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  date: string;
}

export const createNewMessage = (data: Partial<Message>): Message => {
  return {
    id: data.id || crypto.randomUUID(),
    messageNumber: data.messageNumber || generateMessageNumber(),
    phone: data.phone || '',
    amount: data.amount || 0,
    date: data.date || new Date().toISOString(),
    messageType: data.messageType || 'outgoing',
    status: data.status || 'pending',
    note: data.note,
    retracted: data.retracted || false,
    retractionDate: data.retractionDate,
    
    // Adding the new required properties
    timestamp: data.timestamp || new Date().toISOString(),
    accountType: data.accountType || 'main',
    serialNumber: data.serialNumber || generateSerialNumber(),
    interest: data.interest || 0
  };
};

const generateMessageNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `MSG-${year}${month}${day}-${random}`;
};

const generateSerialNumber = (): string => {
  const date = new Date();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `SN-${date.getFullYear()}${random}`;
};

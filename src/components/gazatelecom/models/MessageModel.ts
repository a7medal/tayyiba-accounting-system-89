
export interface Message {
  id: string;
  messageNumber: string;
  phone: string;
  amount: number;
  date: string;
  messageType: 'receive' | 'send';
  status: 'pending' | 'completed' | 'failed';
  note?: string;
  retracted?: boolean;
  retractionDate?: string;
}

export interface MessageFilter {
  startDate?: string;
  endDate?: string;
  type?: string;
  status?: string;
  searchText?: string;
}

export const createNewMessage = (data: Partial<Message>): Message => {
  return {
    id: data.id || crypto.randomUUID(),
    messageNumber: data.messageNumber || generateMessageNumber(),
    phone: data.phone || '',
    amount: data.amount || 0,
    date: data.date || new Date().toISOString(),
    messageType: data.messageType || 'receive',
    status: data.status || 'pending',
    note: data.note,
    retracted: data.retracted || false,
    retractionDate: data.retractionDate
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

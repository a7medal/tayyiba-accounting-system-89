
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
  retracted?: boolean;
  retractionDate?: string;
  transferId?: string; // معرف التحويل المرتبط بالرسالة إن وجد
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

// نموذج التحويل بين الحسابات
export interface Transfer {
  id: string;
  fromAccount: AccountType;
  toAccount: AccountType;
  amount: number;
  timestamp: string;
  notes?: string;
  retracted?: boolean;
  retractionDate?: string;
}

// نموذج الدين
export interface Debt {
  id: string;
  entityId: string; // معرف العميل أو المورد
  entityType: 'client' | 'supplier'; // نوع الكيان (عميل أو مورد)
  entityName: string; // اسم العميل أو المورد
  amount: number; // المبلغ
  remainingAmount: number; // المبلغ المتبقي
  dueDate: string; // تاريخ الاستحقاق
  creationDate: string; // تاريخ الإنشاء
  referenceId: string; // معرف المرجع (مثل رقم الفاتورة)
  referenceType: 'invoice' | 'purchase' | 'other'; // نوع المرجع
  status: 'active' | 'partial' | 'paid'; // حالة الدين
  lastPaymentDate?: string; // تاريخ آخر دفعة
  notes?: string; // ملاحظات
}

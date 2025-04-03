
export type AccountType = 'main' | 'brina';
export type MessageType = 'incoming' | 'outgoing';
export type TransactionType = 'withdraw' | 'deposit' | 'transfer';

// نموذج الرسالة
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

// نموذج الرصيد اليومي
export interface DailyBalance {
  date: string;
  amount: number;
}

// ملخص الحساب
export interface AccountSummary {
  incomingTotal: number;
  outgoingTotal: number;
  incomingCount: number;
  outgoingCount: number;
  incomingInterestTotal: number;
  outgoingInterestTotal: number;
}

// نموذج معاملة الحساب
export interface AccountTransaction {
  id: string;
  accountId: string;
  transactionType: TransactionType;
  amount: number;
  description: string;
  timestamp: string;
  toAccountId?: string; // في حالة التحويل
  reference?: string; // مرجع للمعاملة
}

// نموذج الحساب المالي
export interface Account {
  id: string;
  name: string;
  balance: number;
  type: string; // نقدي، بنكي، إلخ
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// نموذج الدين
export interface Debt {
  id: string;
  entityId: string; // معرف العميل أو المورد
  entityName: string; // اسم العميل أو المورد
  entityType: 'client' | 'supplier'; // نوع الكيان: عميل أو مورد
  amount: number; // قيمة الدين
  remainingAmount: number; // المبلغ المتبقي
  dueDate: string; // تاريخ الاستحقاق
  description: string; // وصف الدين
  reference?: string; // رقم مرجعي (مثل رقم الفاتورة)
  createdAt: string; // تاريخ إنشاء الدين
  status: 'active' | 'partial' | 'paid'; // حالة الدين: نشط، مدفوع جزئيا، مدفوع بالكامل
}

// نموذج دفعة الدين
export interface DebtPayment {
  id: string;
  debtId: string; // معرف الدين المرتبط
  amount: number; // مبلغ الدفعة
  paymentDate: string; // تاريخ الدفعة
  method: string; // طريقة الدفع
  reference?: string; // رقم مرجعي
  note?: string; // ملاحظة
}

// نموذج معاملة الكيان (العميل/المورد)
export interface EntityTransaction {
  id: string;
  entityId: string; // معرف العميل أو المورد
  entityType: 'client' | 'supplier'; // نوع الكيان
  type: 'debit' | 'credit'; // مدين أو دائن
  amount: number; // قيمة المعاملة
  description: string; // وصف المعاملة
  reference?: string; // رقم مرجعي
  timestamp: string; // وقت المعاملة
}

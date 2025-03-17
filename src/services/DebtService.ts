
import { Debt, DebtPayment, EntityTransaction } from '@/components/gazatelecom/models/MessageModel';

class DebtDatabaseService {
  private LOCAL_STORAGE_KEY_DEBTS = 'app_debts';
  private LOCAL_STORAGE_KEY_PAYMENTS = 'app_debt_payments';
  private LOCAL_STORAGE_KEY_ENTITY_TRANSACTIONS = 'app_entity_transactions';

  // الحصول على جميع الديون
  getDebts(): Debt[] {
    try {
      const debtsJson = localStorage.getItem(this.LOCAL_STORAGE_KEY_DEBTS);
      return debtsJson ? JSON.parse(debtsJson) : [];
    } catch (error) {
      console.error('خطأ في استرجاع الديون:', error);
      return [];
    }
  }

  // حفظ دين جديد أو تحديث دين موجود
  saveDebt(debt: Debt): Debt {
    try {
      const debts = this.getDebts();
      const existingIndex = debts.findIndex(d => d.id === debt.id);
      
      if (existingIndex >= 0) {
        // تحديث دين موجود
        debts[existingIndex] = debt;
      } else {
        // إضافة دين جديد
        debts.push(debt);
      }
      
      localStorage.setItem(this.LOCAL_STORAGE_KEY_DEBTS, JSON.stringify(debts));
      return debt;
    } catch (error) {
      console.error('خطأ في حفظ الدين:', error);
      throw error;
    }
  }

  // حذف دين
  deleteDebt(debtId: string): boolean {
    try {
      const debts = this.getDebts();
      const filteredDebts = debts.filter(debt => debt.id !== debtId);
      
      if (debts.length === filteredDebts.length) {
        // لم يتم العثور على الدين
        return false;
      }
      
      localStorage.setItem(this.LOCAL_STORAGE_KEY_DEBTS, JSON.stringify(filteredDebts));
      
      // أيضًا حذف جميع المدفوعات المرتبطة
      const payments = this.getDebtPayments();
      const filteredPayments = payments.filter(payment => payment.debtId !== debtId);
      localStorage.setItem(this.LOCAL_STORAGE_KEY_PAYMENTS, JSON.stringify(filteredPayments));
      
      return true;
    } catch (error) {
      console.error('خطأ في حذف الدين:', error);
      return false;
    }
  }

  // الحصول على جميع المدفوعات
  getDebtPayments(): DebtPayment[] {
    try {
      const paymentsJson = localStorage.getItem(this.LOCAL_STORAGE_KEY_PAYMENTS);
      return paymentsJson ? JSON.parse(paymentsJson) : [];
    } catch (error) {
      console.error('خطأ في استرجاع المدفوعات:', error);
      return [];
    }
  }

  // حفظ مدفوعة جديدة
  saveDebtPayment(payment: DebtPayment): DebtPayment {
    try {
      const payments = this.getDebtPayments();
      payments.push(payment);
      localStorage.setItem(this.LOCAL_STORAGE_KEY_PAYMENTS, JSON.stringify(payments));
      return payment;
    } catch (error) {
      console.error('خطأ في حفظ المدفوعة:', error);
      throw error;
    }
  }

  // الحصول على المدفوعات لدين معين
  getPaymentsForDebt(debtId: string): DebtPayment[] {
    try {
      const payments = this.getDebtPayments();
      return payments.filter(payment => payment.debtId === debtId);
    } catch (error) {
      console.error('خطأ في استرجاع المدفوعات للدين:', error);
      return [];
    }
  }

  // الحصول على معاملات الكيان (العميل/المورد)
  getEntityTransactions(): EntityTransaction[] {
    try {
      const transactionsJson = localStorage.getItem(this.LOCAL_STORAGE_KEY_ENTITY_TRANSACTIONS);
      return transactionsJson ? JSON.parse(transactionsJson) : [];
    } catch (error) {
      console.error('خطأ في استرجاع معاملات الكيان:', error);
      return [];
    }
  }

  // حفظ معاملة كيان جديدة
  saveEntityTransaction(transaction: EntityTransaction): EntityTransaction {
    try {
      const transactions = this.getEntityTransactions();
      transactions.push(transaction);
      localStorage.setItem(this.LOCAL_STORAGE_KEY_ENTITY_TRANSACTIONS, JSON.stringify(transactions));
      return transaction;
    } catch (error) {
      console.error('خطأ في حفظ معاملة الكيان:', error);
      throw error;
    }
  }

  // الحصول على معاملات كيان معين
  getTransactionsForEntity(entityId: string, entityType: 'client' | 'supplier'): EntityTransaction[] {
    try {
      const transactions = this.getEntityTransactions();
      return transactions.filter(
        transaction => transaction.entityId === entityId && transaction.entityType === entityType
      );
    } catch (error) {
      console.error('خطأ في استرجاع معاملات الكيان:', error);
      return [];
    }
  }
}

export const DebtService = new DebtDatabaseService();

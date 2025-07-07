// src/services/AccountDBService.ts

// واجهة الحساب المحدثة
export interface Account {
  id: string; // المفتاح الأساسي
  name: string;
  type: 'bank' | 'cash' | 'credit';
  accountNumber?: string; // رقم الحساب، قد يكون فريدًا
  balance: number;
  currency: string; // مثل 'MRU', 'USD'
  description?: string;
  bankName?: string; 
  branchName?: string;
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// واجهة معاملة الحساب المحدثة
export interface AccountTransaction {
  id: string; // المفتاح الأساسي
  accountId: string; // Foreign key to Account.id
  type: 'withdrawal' | 'deposit' | 'transfer' | 'fee' | 'interest';
  amount: number;
  date: string; // ISO date string (YYYY-MM-DD)
  description?: string;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  category?: string;
  targetAccountId?: string; // Foreign key to Account.id (for transfers)
  referenceNumber?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

const DB_NAME = 'TaybahAppDB';
const DB_VERSION = 2; // زيادة الإصدار بسبب إضافة object stores جديدة وفهارس محتملة
const ACCOUNT_STORE_NAME = 'accounts';
const TRANSACTION_STORE_NAME = 'accountTransactions';

let db: IDBDatabase | null = null;

const AccountDBService = {
  openDB: (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      if (db && db.version === DB_VERSION) { // تحقق من الإصدار أيضًا
        resolve(db);
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('IndexedDB error:', request.error);
        reject(`Error opening IndexedDB: ${request.error?.message}`);
      };

      request.onsuccess = () => {
        db = request.result;
        console.log(`IndexedDB '${DB_NAME}' opened successfully with version ${db.version}`);
        // إذا تم فتح إصدار أقدم، قد لا تكون المتاجر موجودة، onupgradeneeded هو المكان الصحيح للإنشاء
        if (!db.objectStoreNames.contains(ACCOUNT_STORE_NAME) || !db.objectStoreNames.contains(TRANSACTION_STORE_NAME)) {
            console.warn(`Object stores not found in version ${db.version}. This might indicate an issue with upgrade logic or an older DB version being accessed.`);
            // يمكن محاولة إعادة الفتح بإصدار أعلى، أو رفض Promise
            // reject('Object stores not found, DB upgrade might be needed or failed.');
            // حاليًا سنسمح بالاستمرار، لكن onupgradeneeded هو المكان الأساسي للإنشاء
        }
        resolve(db);
      };

      request.onupgradeneeded = (event) => {
        const tempDb = request.result;
        console.log(`Upgrading IndexedDB from version ${event.oldVersion} to ${event.newVersion}`);

        // إنشاء/تحديث object store للحسابات
        if (!tempDb.objectStoreNames.contains(ACCOUNT_STORE_NAME)) {
          const accountStore = tempDb.createObjectStore(ACCOUNT_STORE_NAME, { keyPath: 'id' });
          accountStore.createIndex('name_idx', 'name', { unique: false });
          accountStore.createIndex('type_idx', 'type', { unique: false });
          if ('accountNumber' in {} as Account) { // تحقق من وجود الحقل قبل إنشاء الفهرس
            accountStore.createIndex('accountNumber_idx', 'accountNumber', { unique: true });
          }
          accountStore.createIndex('isActive_idx', 'isActive', { unique: false });
          console.log(`Object store '${ACCOUNT_STORE_NAME}' created.`);
        } else {
          // يمكن إضافة منطق لترقية الفهارس هنا إذا لزم الأمر لإصدارات موجودة
          const accountStore = request.transaction?.objectStore(ACCOUNT_STORE_NAME);
          if (accountStore && 'accountNumber' in {} as Account && !accountStore.indexNames.contains('accountNumber_idx')) {
            accountStore.createIndex('accountNumber_idx', 'accountNumber', { unique: true });
            console.log(`Index 'accountNumber_idx' created for '${ACCOUNT_STORE_NAME}'.`);
          }
        }

        // إنشاء/تحديث object store للمعاملات
        if (!tempDb.objectStoreNames.contains(TRANSACTION_STORE_NAME)) {
          const transactionStore = tempDb.createObjectStore(TRANSACTION_STORE_NAME, { keyPath: 'id' });
          transactionStore.createIndex('accountId_idx', 'accountId', { unique: false });
          transactionStore.createIndex('date_idx', 'date', { unique: false });
          transactionStore.createIndex('type_idx', 'type', { unique: false });
          transactionStore.createIndex('status_idx', 'status', { unique: false });
          // فهرس مركب (مثال، قد لا يكون مدعومًا بشكل مباشر في جميع المتصفحات أو يتطلب ترتيبًا معينًا)
          // transactionStore.createIndex('accountId_date_idx', ['accountId', 'date'], { unique: false });
          console.log(`Object store '${TRANSACTION_STORE_NAME}' created.`);
        }
        console.log('IndexedDB upgrade complete.');
      };
    });
  },

  // --- دوال CRUD للحسابات (Accounts) ---
  addAccount: async (account: Account): Promise<Account> => {
    const currentDb = await AccountDBService.openDB();
    return new Promise((resolve, reject) => {
      const transaction = currentDb.transaction(ACCOUNT_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(ACCOUNT_STORE_NAME);
      // التأكد من أن createdAt و updatedAt موجودان
      const accountToAdd = {
        ...account,
        createdAt: account.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: typeof account.isActive === 'boolean' ? account.isActive : true,
      };
      const request = store.add(accountToAdd);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(accountToAdd);
    });
  },

  getAccountById: async (id: string): Promise<Account | undefined> => {
    const currentDb = await AccountDBService.openDB();
    return new Promise((resolve, reject) => {
      const transaction = currentDb.transaction(ACCOUNT_STORE_NAME, 'readonly');
      const store = transaction.objectStore(ACCOUNT_STORE_NAME);
      const request = store.get(id);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result as Account | undefined);
    });
  },

  getAllAccounts: async (): Promise<Account[]> => {
    const currentDb = await AccountDBService.openDB();
    return new Promise((resolve, reject) => {
      const transaction = currentDb.transaction(ACCOUNT_STORE_NAME, 'readonly');
      const store = transaction.objectStore(ACCOUNT_STORE_NAME);
      const request = store.getAll();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result as Account[]);
    });
  },

  updateAccount: async (account: Account): Promise<Account> => {
    const currentDb = await AccountDBService.openDB();
    return new Promise((resolve, reject) => {
      const transaction = currentDb.transaction(ACCOUNT_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(ACCOUNT_STORE_NAME);
      const accountToUpdate = {
        ...account,
        updatedAt: new Date().toISOString(),
      };
      const request = store.put(accountToUpdate);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(accountToUpdate);
    });
  },

  deleteAccount: async (id: string): Promise<void> => {
    const currentDb = await AccountDBService.openDB();
    return new Promise((resolve, reject) => {
      // قبل حذف الحساب، يجب حذف جميع المعاملات المرتبطة به
      const deleteTransactionsPromise = AccountDBService.deleteTransactionsByAccountId(id);
      
      deleteTransactionsPromise.then(() => {
        const transaction = currentDb.transaction(ACCOUNT_STORE_NAME, 'readwrite');
        const store = transaction.objectStore(ACCOUNT_STORE_NAME);
        const request = store.delete(id);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      }).catch(reject);
    });
  },

  searchAccounts: async (query: string, filterType?: string): Promise<Account[]> => {
    const currentDb = await AccountDBService.openDB();
    return new Promise((resolve, reject) => {
      const transaction = currentDb.transaction(ACCOUNT_STORE_NAME, 'readonly');
      const store = transaction.objectStore(ACCOUNT_STORE_NAME);
      const index = store.index('name_idx'); // البحث بالاسم كمثال أساسي
      const lowerCaseQuery = query.toLowerCase();
      const results: Account[] = [];

      // getAll() مع IDBKeyRange يمكن أن يكون أكثر كفاءة للبحث بالبداية
      // لكن للبحث "يحتوي على"، غالبًا ما نحتاج إلى المرور على النتائج
      const request = index.openCursor(); 

      request.onerror = () => reject(request.error);
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          const account = cursor.value as Account;
          let matchesQuery = account.name.toLowerCase().includes(lowerCaseQuery) ||
                             (account.accountNumber && account.accountNumber.toLowerCase().includes(lowerCaseQuery));
          
          let matchesType = true;
          if (filterType && account.type !== filterType) {
            matchesType = false;
          }

          if (matchesQuery && matchesType) {
            results.push(account);
          }
          cursor.continue();
        } else {
          resolve(results);
        }
      };
    });
  },

  // --- دوال CRUD لمعاملات الحساب (AccountTransactions) ---
  addTransaction: async (tx: AccountTransaction): Promise<AccountTransaction> => {
    const currentDb = await AccountDBService.openDB();
    return new Promise((resolve, reject) => {
      const transaction = currentDb.transaction(TRANSACTION_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(TRANSACTION_STORE_NAME);
      const txToAdd = {
        ...tx,
        createdAt: tx.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const request = store.add(txToAdd);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(txToAdd);
    });
  },

  getTransactionsByAccountId: async (accountId: string): Promise<AccountTransaction[]> => {
    const currentDb = await AccountDBService.openDB();
    return new Promise((resolve, reject) => {
      const transaction = currentDb.transaction(TRANSACTION_STORE_NAME, 'readonly');
      const store = transaction.objectStore(TRANSACTION_STORE_NAME);
      const index = store.index('accountId_idx');
      const request = index.getAll(accountId);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result as AccountTransaction[]);
    });
  },
  
  getAllTransactions: async (): Promise<AccountTransaction[]> => {
    const currentDb = await AccountDBService.openDB();
    return new Promise((resolve, reject) => {
      const transaction = currentDb.transaction(TRANSACTION_STORE_NAME, 'readonly');
      const store = transaction.objectStore(TRANSACTION_STORE_NAME);
      const request = store.getAll();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result as AccountTransaction[]);
    });
  },

  updateTransaction: async (tx: AccountTransaction): Promise<AccountTransaction> => {
    const currentDb = await AccountDBService.openDB();
    return new Promise((resolve, reject) => {
      const transaction = currentDb.transaction(TRANSACTION_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(TRANSACTION_STORE_NAME);
      const txToUpdate = {
        ...tx,
        updatedAt: new Date().toISOString(),
      };
      const request = store.put(txToUpdate);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(txToUpdate);
    });
  },

  deleteTransaction: async (id: string): Promise<void> => {
    const currentDb = await AccountDBService.openDB();
    return new Promise((resolve, reject) => {
      const transaction = currentDb.transaction(TRANSACTION_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(TRANSACTION_STORE_NAME);
      const request = store.delete(id);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  },

  // دالة مساعدة لحذف جميع معاملات حساب معين
  deleteTransactionsByAccountId: async (accountId: string): Promise<void> => {
    const currentDb = await AccountDBService.openDB();
    return new Promise((resolve, reject) => {
      const dbTransaction = currentDb.transaction(TRANSACTION_STORE_NAME, 'readwrite');
      const store = dbTransaction.objectStore(TRANSACTION_STORE_NAME);
      const index = store.index('accountId_idx');
      const request = index.openCursor(IDBKeyRange.only(accountId));
      
      request.onerror = () => reject(request.error);
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve(); // تم حذف جميع المعاملات المطابقة
        }
      };
    });
  },
};

// محاولة فتح قاعدة البيانات عند تحميل الوحدة للتأكد من إنشائها/ترقيتها
AccountDBService.openDB().catch(error => {
  console.error("Failed to initialize AccountDBService on load:", error);
});

export default AccountDBService;

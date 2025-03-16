
import initSqlJs, { Database } from 'sql.js';
import { Message, DailyBalance } from '../models/MessageModel';
import { Product } from '@/types/product';
import { Supplier } from '@/types/supplier';
import { Bond } from '@/types/bond';
import { Purchase, PurchaseItem } from '@/types/purchase';
import { User } from '@/types/user';

/**
 * خدمة قاعدة بيانات SQLite
 */
class SQLiteServiceClass {
  private db: Database | null = null;
  private initPromise: Promise<void> | null = null;

  constructor() {
    // تهيئة قاعدة البيانات عند إنشاء الكائن
    this.initPromise = this.initDatabase();
  }

  /**
   * تهيئة قاعدة البيانات والجداول
   */
  private async initDatabase(): Promise<void> {
    try {
      console.log('تهيئة قاعدة بيانات SQLite...');
      const SQL = await initSqlJs({
        locateFile: file => `https://sql.js.org/dist/${file}`
      });

      // إنشاء قاعدة بيانات جديدة في الذاكرة
      this.db = new SQL.Database();
      
      // إنشاء جداول غزة تليكوم
      await this.initializeGazaTelecomTables();
      
      console.log('تم تهيئة قاعدة بيانات SQLite بنجاح');
    } catch (error) {
      console.error('فشل في تهيئة قاعدة بيانات SQLite:', error);
      throw error;
    }
  }

  /**
   * تهيئة جداول غزة تليكوم
   */
  private async initializeGazaTelecomTables(): Promise<void> {
    if (!this.db) return;
    
    // إنشاء جدول الرسائل إذا لم يكن موجودًا
    this.db.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        accountType TEXT NOT NULL,
        messageType TEXT NOT NULL,
        serialNumber TEXT NOT NULL,
        amount REAL NOT NULL,
        interest REAL NOT NULL,
        timestamp TEXT NOT NULL,
        note TEXT
      );
    `);

    // إنشاء جدول الأرصدة اليومية إذا لم يكن موجودًا
    this.db.run(`
      CREATE TABLE IF NOT EXISTS daily_balances (
        date TEXT PRIMARY KEY,
        amount REAL NOT NULL
      );
    `);

    // استيراد البيانات من التخزين المحلي إذا كانت قاعدة البيانات فارغة
    await this.importGazaTelecomFromLocalStorage();
  }

  /**
   * تهيئة جداول التطبيق
   */
  async initializeAppTables(): Promise<void> {
    await this.ensureInitialized();
    
    // المنتجات
    this.db!.run(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        sku TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        cost REAL NOT NULL,
        stock INTEGER NOT NULL,
        categoryId TEXT,
        imageUrl TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        currency TEXT NOT NULL
      );
    `);

    // الموردين
    this.db!.run(`
      CREATE TABLE IF NOT EXISTS suppliers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        contactName TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        address TEXT NOT NULL,
        notes TEXT,
        isActive INTEGER NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);

    // السندات
    this.db!.run(`
      CREATE TABLE IF NOT EXISTS bonds (
        id TEXT PRIMARY KEY,
        number TEXT NOT NULL,
        date TEXT NOT NULL,
        amount REAL NOT NULL,
        type TEXT NOT NULL,
        status TEXT NOT NULL,
        description TEXT NOT NULL,
        clientId TEXT,
        clientName TEXT,
        issuedBy TEXT NOT NULL,
        approvedBy TEXT,
        currency TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);

    // المشتريات
    this.db!.run(`
      CREATE TABLE IF NOT EXISTS purchases (
        id TEXT PRIMARY KEY,
        reference TEXT NOT NULL,
        supplierId TEXT NOT NULL,
        supplierName TEXT NOT NULL,
        date TEXT NOT NULL,
        totalAmount REAL NOT NULL,
        paidAmount REAL NOT NULL,
        currency TEXT NOT NULL,
        paymentStatus TEXT NOT NULL,
        notes TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);

    // عناصر المشتريات
    this.db!.run(`
      CREATE TABLE IF NOT EXISTS purchase_items (
        id TEXT PRIMARY KEY,
        purchaseId TEXT NOT NULL,
        productId TEXT NOT NULL,
        productName TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unitPrice REAL NOT NULL,
        totalPrice REAL NOT NULL,
        currency TEXT NOT NULL,
        FOREIGN KEY (purchaseId) REFERENCES purchases (id) ON DELETE CASCADE
      );
    `);

    // المستخدمين
    this.db!.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        role TEXT NOT NULL,
        isActive INTEGER NOT NULL,
        createdAt TEXT NOT NULL,
        lastLogin TEXT
      );
    `);

    // استيراد البيانات الأولية من التخزين المحلي
    await this.importInitialData();
  }

  /**
   * استيراد البيانات الأولية
   */
  private async importInitialData(): Promise<void> {
    if (!this.db) return;
    
    try {
      // استيراد المنتجات الأولية
      const productsCount = this.db?.exec('SELECT COUNT(*) FROM products')[0]?.values[0][0] || 0;
      if (productsCount === 0) {
        const { initialSuppliers } = await import('@/types/supplier');
        if (initialSuppliers.length > 0) {
          console.log(`استيراد ${initialSuppliers.length} مورد للبيانات الأولية...`);
          
          // بدء المعاملة
          this.db?.exec('BEGIN TRANSACTION;');
          
          initialSuppliers.forEach(supplier => {
            this.db?.run(
              `INSERT INTO suppliers (id, name, contactName, phone, email, address, notes, isActive, createdAt, updatedAt)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                supplier.id,
                supplier.name,
                supplier.contactName,
                supplier.phone,
                supplier.email,
                supplier.address,
                supplier.notes || null,
                supplier.isActive ? 1 : 0,
                supplier.createdAt,
                supplier.updatedAt
              ]
            );
          });
          
          // إنهاء المعاملة
          this.db?.exec('COMMIT;');
        }
      }
      
      // استيراد السندات الأولية
      const bondsCount = this.db?.exec('SELECT COUNT(*) FROM bonds')[0]?.values[0][0] || 0;
      if (bondsCount === 0) {
        const { initialBonds } = await import('@/types/bond');
        if (initialBonds.length > 0) {
          console.log(`استيراد ${initialBonds.length} سند للبيانات الأولية...`);
          
          // بدء المعاملة
          this.db?.exec('BEGIN TRANSACTION;');
          
          initialBonds.forEach(bond => {
            this.db?.run(
              `INSERT INTO bonds (id, number, date, amount, type, status, description, clientId, clientName, issuedBy, approvedBy, currency, createdAt, updatedAt)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                bond.id,
                bond.number,
                bond.date,
                bond.amount,
                bond.type,
                bond.status,
                bond.description,
                bond.clientId || null,
                bond.clientName || null,
                bond.issuedBy,
                bond.approvedBy || null,
                bond.currency,
                bond.createdAt,
                bond.updatedAt
              ]
            );
          });
          
          // إنهاء المعاملة
          this.db?.exec('COMMIT;');
        }
      }
      
      // استيراد المشتريات الأولية
      const purchasesCount = this.db?.exec('SELECT COUNT(*) FROM purchases')[0]?.values[0][0] || 0;
      if (purchasesCount === 0) {
        const { initialPurchases } = await import('@/types/purchase');
        if (initialPurchases.length > 0) {
          console.log(`استيراد ${initialPurchases.length} عملية شراء للبيانات الأولية...`);
          
          // بدء المعاملة
          this.db?.exec('BEGIN TRANSACTION;');
          
          initialPurchases.forEach(purchase => {
            // إدخال المشتريات الرئيسية
            this.db?.run(
              `INSERT INTO purchases (id, reference, supplierId, supplierName, date, totalAmount, paidAmount, currency, paymentStatus, notes, createdAt, updatedAt)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                purchase.id,
                purchase.reference,
                purchase.supplierId,
                purchase.supplierName,
                purchase.date,
                purchase.totalAmount,
                purchase.paidAmount,
                purchase.currency,
                purchase.paymentStatus,
                purchase.notes || null,
                purchase.createdAt,
                purchase.updatedAt
              ]
            );
            
            // إدخال عناصر المشتريات
            purchase.items.forEach(item => {
              this.db?.run(
                `INSERT INTO purchase_items (id, purchaseId, productId, productName, quantity, unitPrice, totalPrice, currency)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  item.id,
                  purchase.id,
                  item.productId,
                  item.productName,
                  item.quantity,
                  item.unitPrice,
                  item.totalPrice,
                  item.currency
                ]
              );
            });
          });
          
          // إنهاء المعاملة
          this.db?.exec('COMMIT;');
        }
      }
    } catch (error) {
      console.error('فشل في استيراد البيانات الأولية:', error);
    }
  }

  /**
   * استيراد بيانات غزة تليكوم من التخزين المحلي
   */
  private async importGazaTelecomFromLocalStorage(): Promise<void> {
    try {
      // استيراد الرسائل
      const messagesCount = this.db?.exec('SELECT COUNT(*) FROM messages')[0]?.values[0][0] || 0;
      
      if (messagesCount === 0) {
        const { LocalStorageService } = await import('./LocalStorageService');
        const messages = LocalStorageService.getMessages();
        
        if (messages.length > 0) {
          console.log(`استيراد ${messages.length} رسالة من التخزين المحلي...`);
          
          // بدء المعاملة
          this.db?.exec('BEGIN TRANSACTION;');
          
          messages.forEach(message => {
            this.db?.run(
              `INSERT INTO messages (id, accountType, messageType, serialNumber, amount, interest, timestamp, note)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                message.id,
                message.accountType,
                message.messageType,
                message.serialNumber,
                message.amount,
                message.interest,
                message.timestamp,
                message.note || null
              ]
            );
          });
          
          // إنهاء المعاملة
          this.db?.exec('COMMIT;');
        }
        
        // استيراد الأرصدة اليومية
        const balances = LocalStorageService.getBalanceHistory();
        
        if (balances.length > 0) {
          console.log(`استيراد ${balances.length} رصيد يومي من التخزين المحلي...`);
          
          // بدء المعاملة
          this.db?.exec('BEGIN TRANSACTION;');
          
          balances.forEach(balance => {
            this.db?.run(
              `INSERT INTO daily_balances (date, amount) VALUES (?, ?)`,
              [balance.date, balance.amount]
            );
          });
          
          // إنهاء المعاملة
          this.db?.exec('COMMIT;');
        }
      }
    } catch (error) {
      console.error('فشل في استيراد البيانات من التخزين المحلي:', error);
    }
  }

  /**
   * التأكد من اكتمال تهيئة قاعدة البيانات قبل أي عملية
   */
  private async ensureInitialized(): Promise<void> {
    if (this.initPromise) {
      await this.initPromise;
    }
    
    if (!this.db) {
      throw new Error('لم يتم تهيئة قاعدة البيانات بعد');
    }
  }

  //=== وظائف غزة تليكوم ===//

  /**
   * الحصول على جميع الرسائل
   */
  async getMessages(): Promise<Message[]> {
    await this.ensureInitialized();
    
    const result = this.db!.exec(`
      SELECT id, accountType, messageType, serialNumber, amount, interest, timestamp, note
      FROM messages
      ORDER BY timestamp DESC
    `);
    
    if (result.length === 0 || !result[0].values) {
      return [];
    }
    
    return result[0].values.map(row => ({
      id: row[0] as string,
      accountType: row[1] as 'main' | 'brina',
      messageType: row[2] as 'incoming' | 'outgoing',
      serialNumber: row[3] as string,
      amount: row[4] as number,
      interest: row[5] as number,
      timestamp: row[6] as string,
      note: row[7] as string | undefined
    }));
  }

  /**
   * حفظ رسالة جديدة
   */
  async saveMessage(message: Message): Promise<Message> {
    await this.ensureInitialized();
    
    this.db!.run(
      `INSERT INTO messages (id, accountType, messageType, serialNumber, amount, interest, timestamp, note)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        message.id,
        message.accountType,
        message.messageType,
        message.serialNumber,
        message.amount,
        message.interest,
        message.timestamp,
        message.note || null
      ]
    );
    
    return message;
  }

  /**
   * تحديث رسالة موجودة
   */
  async updateMessage(message: Message): Promise<Message> {
    await this.ensureInitialized();
    
    this.db!.run(
      `UPDATE messages
       SET accountType = ?, messageType = ?, serialNumber = ?, amount = ?, interest = ?, note = ?
       WHERE id = ?`,
      [
        message.accountType,
        message.messageType,
        message.serialNumber,
        message.amount,
        message.interest,
        message.note || null,
        message.id
      ]
    );
    
    return message;
  }

  /**
   * حذف رسالة
   */
  async deleteMessage(messageId: string): Promise<boolean> {
    await this.ensureInitialized();
    
    this.db!.run('DELETE FROM messages WHERE id = ?', [messageId]);
    
    return true;
  }

  /**
   * الحصول على جميع الأرصدة اليومية
   */
  async getDailyBalances(): Promise<DailyBalance[]> {
    await this.ensureInitialized();
    
    const result = this.db!.exec(`
      SELECT date, amount
      FROM daily_balances
      ORDER BY date DESC
    `);
    
    if (result.length === 0 || !result[0].values) {
      return [];
    }
    
    return result[0].values.map(row => ({
      date: row[0] as string,
      amount: row[1] as number
    }));
  }

  /**
   * حفظ رصيد يومي جديد
   */
  async saveDailyBalance(balance: DailyBalance): Promise<DailyBalance> {
    await this.ensureInitialized();
    
    // محاولة التحديث أولاً
    const updateResult = this.db!.run(
      'UPDATE daily_balances SET amount = ? WHERE date = ?',
      [balance.amount, balance.date]
    );
    
    // إذا لم يتم تحديث أي صفوف، قم بالإدراج
    if (this.db!.getRowsModified() === 0) {
      this.db!.run(
        'INSERT INTO daily_balances (date, amount) VALUES (?, ?)',
        [balance.date, balance.amount]
      );
    }
    
    return balance;
  }

  //=== وظائف باقي التطبيق ===//

  /**
   * الحصول على جميع المنتجات
   */
  async getProducts(): Promise<Product[]> {
    await this.ensureInitialized();
    
    const result = this.db!.exec(`
      SELECT id, name, sku, description, price, cost, stock, categoryId, imageUrl, createdAt, updatedAt, currency
      FROM products
      ORDER BY name ASC
    `);
    
    if (result.length === 0 || !result[0].values) {
      return [];
    }
    
    return result[0].values.map(row => ({
      id: row[0] as string,
      name: row[1] as string,
      sku: row[2] as string,
      description: row[3] as string,
      price: row[4] as number,
      cost: row[5] as number,
      stock: row[6] as number,
      categoryId: row[7] as string,
      imageUrl: row[8] as string | undefined,
      createdAt: row[9] as string,
      updatedAt: row[10] as string,
      currency: row[11] as 'MRU'
    }));
  }

  /**
   * حفظ منتج
   */
  async saveProduct(product: Product): Promise<Product> {
    await this.ensureInitialized();
    
    // التحقق من وجود المنتج
    const existingProduct = this.db!.exec(
      'SELECT id FROM products WHERE id = ?',
      [product.id]
    );
    
    if (existingProduct.length > 0 && existingProduct[0].values && existingProduct[0].values.length > 0) {
      // تحديث منتج موجود
      this.db!.run(
        `UPDATE products
         SET name = ?, sku = ?, description = ?, price = ?, cost = ?, stock = ?, 
             categoryId = ?, imageUrl = ?, updatedAt = ?, currency = ?
         WHERE id = ?`,
        [
          product.name,
          product.sku,
          product.description,
          product.price,
          product.cost,
          product.stock,
          product.categoryId,
          product.imageUrl || null,
          product.updatedAt,
          product.currency,
          product.id
        ]
      );
    } else {
      // إضافة منتج جديد
      this.db!.run(
        `INSERT INTO products (id, name, sku, description, price, cost, stock, categoryId, imageUrl, createdAt, updatedAt, currency)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product.id,
          product.name,
          product.sku,
          product.description,
          product.price,
          product.cost,
          product.stock,
          product.categoryId,
          product.imageUrl || null,
          product.createdAt,
          product.updatedAt,
          product.currency
        ]
      );
    }
    
    return product;
  }

  /**
   * حذف منتج
   */
  async deleteProduct(productId: string): Promise<boolean> {
    await this.ensureInitialized();
    
    this.db!.run('DELETE FROM products WHERE id = ?', [productId]);
    
    return true;
  }

  /**
   * الحصول على جميع الموردين
   */
  async getSuppliers(): Promise<Supplier[]> {
    await this.ensureInitialized();
    
    const result = this.db!.exec(`
      SELECT id, name, contactName, phone, email, address, notes, isActive, createdAt, updatedAt
      FROM suppliers
      ORDER BY name ASC
    `);
    
    if (result.length === 0 || !result[0].values) {
      return [];
    }
    
    return result[0].values.map(row => ({
      id: row[0] as string,
      name: row[1] as string,
      contactName: row[2] as string,
      phone: row[3] as string,
      email: row[4] as string,
      address: row[5] as string,
      notes: row[6] as string | undefined,
      isActive: Boolean(row[7]),
      createdAt: row[8] as string,
      updatedAt: row[9] as string
    }));
  }

  /**
   * حفظ مورد
   */
  async saveSupplier(supplier: Supplier): Promise<Supplier> {
    await this.ensureInitialized();
    
    // التحقق من وجود المورد
    const existingSupplier = this.db!.exec(
      'SELECT id FROM suppliers WHERE id = ?',
      [supplier.id]
    );
    
    if (existingSupplier.length > 0 && existingSupplier[0].values && existingSupplier[0].values.length > 0) {
      // تحديث مورد موجود
      this.db!.run(
        `UPDATE suppliers
         SET name = ?, contactName = ?, phone = ?, email = ?, address = ?, 
             notes = ?, isActive = ?, updatedAt = ?
         WHERE id = ?`,
        [
          supplier.name,
          supplier.contactName,
          supplier.phone,
          supplier.email,
          supplier.address,
          supplier.notes || null,
          supplier.isActive ? 1 : 0,
          supplier.updatedAt,
          supplier.id
        ]
      );
    } else {
      // إضافة مورد جديد
      this.db!.run(
        `INSERT INTO suppliers (id, name, contactName, phone, email, address, notes, isActive, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          supplier.id,
          supplier.name,
          supplier.contactName,
          supplier.phone,
          supplier.email,
          supplier.address,
          supplier.notes || null,
          supplier.isActive ? 1 : 0,
          supplier.createdAt,
          supplier.updatedAt
        ]
      );
    }
    
    return supplier;
  }

  /**
   * حذف مورد
   */
  async deleteSupplier(supplierId: string): Promise<boolean> {
    await this.ensureInitialized();
    
    this.db!.run('DELETE FROM suppliers WHERE id = ?', [supplierId]);
    
    return true;
  }

  /**
   * الحصول على جميع السندات
   */
  async getBonds(): Promise<Bond[]> {
    await this.ensureInitialized();
    
    const result = this.db!.exec(`
      SELECT id, number, date, amount, type, status, description, clientId, clientName, issuedBy, approvedBy, currency, createdAt, updatedAt
      FROM bonds
      ORDER BY date DESC
    `);
    
    if (result.length === 0 || !result[0].values) {
      return [];
    }
    
    return result[0].values.map(row => ({
      id: row[0] as string,
      number: row[1] as string,
      date: row[2] as string,
      amount: row[3] as number,
      type: row[4] as any,
      status: row[5] as any,
      description: row[6] as string,
      clientId: row[7] as string | undefined,
      clientName: row[8] as string | undefined,
      issuedBy: row[9] as string,
      approvedBy: row[10] as string | undefined,
      currency: row[11] as 'MRU',
      createdAt: row[12] as string,
      updatedAt: row[13] as string
    }));
  }

  /**
   * حفظ سند
   */
  async saveBond(bond: Bond): Promise<Bond> {
    await this.ensureInitialized();
    
    // التحقق من وجود السند
    const existingBond = this.db!.exec(
      'SELECT id FROM bonds WHERE id = ?',
      [bond.id]
    );
    
    if (existingBond.length > 0 && existingBond[0].values && existingBond[0].values.length > 0) {
      // تحديث سند موجود
      this.db!.run(
        `UPDATE bonds
         SET number = ?, date = ?, amount = ?, type = ?, status = ?, description = ?, 
             clientId = ?, clientName = ?, issuedBy = ?, approvedBy = ?, currency = ?, updatedAt = ?
         WHERE id = ?`,
        [
          bond.number,
          bond.date,
          bond.amount,
          bond.type,
          bond.status,
          bond.description,
          bond.clientId || null,
          bond.clientName || null,
          bond.issuedBy,
          bond.approvedBy || null,
          bond.currency,
          bond.updatedAt,
          bond.id
        ]
      );
    } else {
      // إضافة سند جديد
      this.db!.run(
        `INSERT INTO bonds (id, number, date, amount, type, status, description, clientId, clientName, issuedBy, approvedBy, currency, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          bond.id,
          bond.number,
          bond.date,
          bond.amount,
          bond.type,
          bond.status,
          bond.description,
          bond.clientId || null,
          bond.clientName || null,
          bond.issuedBy,
          bond.approvedBy || null,
          bond.currency,
          bond.createdAt,
          bond.updatedAt
        ]
      );
    }
    
    return bond;
  }

  /**
   * حذف سند
   */
  async deleteBond(bondId: string): Promise<boolean> {
    await this.ensureInitialized();
    
    this.db!.run('DELETE FROM bonds WHERE id = ?', [bondId]);
    
    return true;
  }

  /**
   * الحصول على جميع المشتريات
   */
  async getPurchases(): Promise<Purchase[]> {
    await this.ensureInitialized();
    
    // استرجاع المشتريات
    const purchasesResult = this.db!.exec(`
      SELECT id, reference, supplierId, supplierName, date, totalAmount, paidAmount, currency, paymentStatus, notes, createdAt, updatedAt
      FROM purchases
      ORDER BY date DESC
    `);
    
    if (purchasesResult.length === 0 || !purchasesResult[0].values) {
      return [];
    }
    
    // إنشاء قائمة المشتريات
    const purchases: Purchase[] = [];
    
    for (const row of purchasesResult[0].values) {
      const purchaseId = row[0] as string;
      
      // استرجاع عناصر المشتريات
      const itemsResult = this.db!.exec(`
        SELECT id, productId, productName, quantity, unitPrice, totalPrice, currency
        FROM purchase_items
        WHERE purchaseId = ?
      `, [purchaseId]);
      
      const items: PurchaseItem[] = [];
      
      if (itemsResult.length > 0 && itemsResult[0].values) {
        for (const itemRow of itemsResult[0].values) {
          items.push({
            id: itemRow[0] as string,
            productId: itemRow[1] as string,
            productName: itemRow[2] as string,
            quantity: itemRow[3] as number,
            unitPrice: itemRow[4] as number,
            totalPrice: itemRow[5] as number,
            currency: itemRow[6] as 'MRU'
          });
        }
      }
      
      purchases.push({
        id: purchaseId,
        reference: row[1] as string,
        supplierId: row[2] as string,
        supplierName: row[3] as string,
        date: row[4] as string,
        totalAmount: row[5] as number,
        paidAmount: row[6] as number,
        currency: row[7] as 'MRU',
        paymentStatus: row[8] as any,
        notes: row[9] as string | undefined,
        items,
        createdAt: row[10] as string,
        updatedAt: row[11] as string
      });
    }
    
    return purchases;
  }

  /**
   * حفظ عملية شراء
   */
  async savePurchase(purchase: Purchase): Promise<Purchase> {
    await this.ensureInitialized();
    
    // بدء المعاملة
    this.db!.exec('BEGIN TRANSACTION;');
    
    try {
      // التحقق من وجود عملية الشراء
      const existingPurchase = this.db!.exec(
        'SELECT id FROM purchases WHERE id = ?',
        [purchase.id]
      );
      
      if (existingPurchase.length > 0 && existingPurchase[0].values && existingPurchase[0].values.length > 0) {
        // تحديث عملية شراء موجودة
        this.db!.run(
          `UPDATE purchases
           SET reference = ?, supplierId = ?, supplierName = ?, date = ?, totalAmount = ?, 
               paidAmount = ?, currency = ?, paymentStatus = ?, notes = ?, updatedAt = ?
           WHERE id = ?`,
          [
            purchase.reference,
            purchase.supplierId,
            purchase.supplierName,
            purchase.date,
            purchase.totalAmount,
            purchase.paidAmount,
            purchase.currency,
            purchase.paymentStatus,
            purchase.notes || null,
            purchase.updatedAt,
            purchase.id
          ]
        );
        
        // حذف العناصر القديمة
        this.db!.run('DELETE FROM purchase_items WHERE purchaseId = ?', [purchase.id]);
      } else {
        // إضافة عملية شراء جديدة
        this.db!.run(
          `INSERT INTO purchases (id, reference, supplierId, supplierName, date, totalAmount, paidAmount, currency, paymentStatus, notes, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            purchase.id,
            purchase.reference,
            purchase.supplierId,
            purchase.supplierName,
            purchase.date,
            purchase.totalAmount,
            purchase.paidAmount,
            purchase.currency,
            purchase.paymentStatus,
            purchase.notes || null,
            purchase.createdAt,
            purchase.updatedAt
          ]
        );
      }
      
      // إضافة العناصر الجديدة
      for (const item of purchase.items) {
        this.db!.run(
          `INSERT INTO purchase_items (id, purchaseId, productId, productName, quantity, unitPrice, totalPrice, currency)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            item.id,
            purchase.id,
            item.productId,
            item.productName,
            item.quantity,
            item.unitPrice,
            item.totalPrice,
            item.currency
          ]
        );
      }
      
      // إنهاء المعاملة
      this.db!.exec('COMMIT;');
      
      return purchase;
    } catch (error) {
      // التراجع عن المعاملة في حالة حدوث خطأ
      this.db!.exec('ROLLBACK;');
      throw error;
    }
  }

  /**
   * حذف عملية شراء
   */
  async deletePurchase(purchaseId: string): Promise<boolean> {
    await this.ensureInitialized();
    
    // بدء المعاملة
    this.db!.exec('BEGIN TRANSACTION;');
    
    try {
      // حذف العناصر أولاً (بسبب قيد المفتاح الأجنبي)
      this.db!.run('DELETE FROM purchase_items WHERE purchaseId = ?', [purchaseId]);
      
      // ثم حذف عملية الشراء نفسها
      this.db!.run('DELETE FROM purchases WHERE id = ?', [purchaseId]);
      
      // إنهاء المعاملة
      this.db!.exec('COMMIT;');
      
      return true;
    } catch (error) {
      // التراجع عن المعاملة في حالة حدوث خطأ
      this.db!.exec('ROLLBACK;');
      throw error;
    }
  }

  /**
   * الحصول على جميع المستخدمين
   */
  async getUsers(): Promise<User[]> {
    await this.ensureInitialized();
    
    const result = this.db!.exec(`
      SELECT id, name, email, role, isActive, createdAt, lastLogin
      FROM users
      ORDER BY name ASC
    `);
    
    if (result.length === 0 || !result[0].values) {
      return [];
    }
    
    return result[0].values.map(row => ({
      id: row[0] as string,
      name: row[1] as string,
      email: row[2] as string,
      role: row[3] as any,
      isActive: Boolean(row[4]),
      createdAt: row[5] as string,
      lastLogin: row[6] as string | undefined
    }));
  }

  /**
   * حفظ مستخدم
   */
  async saveUser(user: User): Promise<User> {
    await this.ensureInitialized();
    
    // التحقق من وجود المستخدم
    const existingUser = this.db!.exec(
      'SELECT id FROM users WHERE id = ?',
      [user.id]
    );
    
    if (existingUser.length > 0 && existingUser[0].values && existingUser[0].values.length > 0) {
      // تحديث مستخدم موجود
      this.db!.run(
        `UPDATE users
         SET name = ?, email = ?, role = ?, isActive = ?, lastLogin = ?
         WHERE id = ?`,
        [
          user.name,
          user.email,
          user.role,
          user.isActive ? 1 : 0,
          user.lastLogin || null,
          user.id
        ]
      );
    } else {
      // إضافة مستخدم جديد
      this.db!.run(
        `INSERT INTO users (id, name, email, role, isActive, createdAt, lastLogin)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          user.id,
          user.name,
          user.email,
          user.role,
          user.isActive ? 1 : 0,
          user.createdAt,
          user.lastLogin || null
        ]
      );
    }
    
    return user;
  }

  /**
   * حذف مستخدم
   */
  async deleteUser(userId: string): Promise<boolean> {
    await this.ensureInitialized();
    
    this.db!.run('DELETE FROM users WHERE id = ?', [userId]);
    
    return true;
  }

  /**
   * حفظ قاعدة البيانات كملف
   */
  async exportDatabase(): Promise<Uint8Array | null> {
    if (!this.db) return null;
    return this.db.export();
  }
}

// تصدير نسخة واحدة من خدمة SQLite
export const SQLiteService = new SQLiteServiceClass();

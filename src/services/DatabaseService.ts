
import { SQLiteService } from '@/components/gazatelecom/services/SQLiteService';
import { Product } from '@/types/product';
import { Supplier } from '@/types/supplier';
import { Bond } from '@/types/bond';
import { Purchase } from '@/types/purchase';
import { User } from '@/types/user';

// العلامة التي تشير إلى حالة اتصال قاعدة البيانات
const DB_CONNECTION_KEY = 'appDbConnectionState';
// نوع قاعدة البيانات المستخدمة
const DB_TYPE_KEY = 'appDbType';

/**
 * خدمة قاعدة البيانات المركزية للتطبيق
 */
class AppDatabaseService {
  private connected: boolean = false;
  private dbType: string = localStorage.getItem(DB_TYPE_KEY) || 'sqlite';

  constructor() {
    // استعادة حالة الاتصال عند بدء التشغيل
    this.connected = localStorage.getItem(DB_CONNECTION_KEY) === 'connected';
  }

  /**
   * الحصول على نوع قاعدة البيانات الحالي
   */
  getDbType(): string {
    return this.dbType;
  }

  /**
   * تعيين نوع قاعدة البيانات
   */
  setDbType(type: string): void {
    this.dbType = type;
    localStorage.setItem(DB_TYPE_KEY, type);
  }

  /**
   * الاتصال بقاعدة البيانات
   */
  async connect(): Promise<boolean> {
    console.log('محاولة الاتصال بقاعدة البيانات...');
    try {
      if (this.dbType === 'sqlite') {
        // تأكد من أن خدمة SQLite مهيأة
        await this.initializeSQLite();
        this.connected = true;
        localStorage.setItem(DB_CONNECTION_KEY, 'connected');
        console.log('تم الاتصال بقاعدة البيانات بنجاح');
        return true;
      } else if (this.dbType === 'local') {
        // التخزين المحلي دائماً متصل
        this.connected = true;
        localStorage.setItem(DB_CONNECTION_KEY, 'connected');
        console.log('تم الاتصال بقاعدة البيانات المحلية');
        return true;
      } else {
        console.log('نوع قاعدة البيانات غير مدعوم حالياً');
        return false;
      }
    } catch (error) {
      console.error('فشل الاتصال بقاعدة البيانات:', error);
      this.connected = false;
      localStorage.setItem(DB_CONNECTION_KEY, 'disconnected');
      return false;
    }
  }

  /**
   * تهيئة قاعدة بيانات SQLite
   */
  private async initializeSQLite(): Promise<void> {
    if (this.dbType === 'sqlite') {
      // إنشاء جداول للتطبيق بالكامل
      await SQLiteService.initializeAppTables();
    }
  }

  /**
   * قطع الاتصال بقاعدة البيانات
   */
  disconnect(): void {
    console.log('قطع الاتصال بقاعدة البيانات...');
    this.connected = false;
    localStorage.setItem(DB_CONNECTION_KEY, 'disconnected');
    console.log('تم قطع الاتصال بقاعدة البيانات');
  }

  /**
   * التحقق من حالة الاتصال
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * الحصول على جميع المنتجات
   */
  async getProducts(): Promise<Product[]> {
    if (!this.connected) {
      throw new Error('قاعدة البيانات غير متصلة');
    }
    
    if (this.dbType === 'sqlite') {
      return SQLiteService.getProducts();
    } else {
      // استخدام التخزين المحلي كمصدر بديل
      const products = localStorage.getItem('appProducts');
      return products ? JSON.parse(products) : [];
    }
  }

  /**
   * حفظ منتج
   */
  async saveProduct(product: Product): Promise<Product> {
    if (!this.connected) {
      throw new Error('قاعدة البيانات غير متصلة');
    }
    
    if (this.dbType === 'sqlite') {
      return SQLiteService.saveProduct(product);
    } else {
      const products = await this.getProducts();
      const updatedProducts = [...products.filter(p => p.id !== product.id), product];
      localStorage.setItem('appProducts', JSON.stringify(updatedProducts));
      return product;
    }
  }

  /**
   * حذف منتج
   */
  async deleteProduct(productId: string): Promise<boolean> {
    if (!this.connected) {
      throw new Error('قاعدة البيانات غير متصلة');
    }
    
    if (this.dbType === 'sqlite') {
      return SQLiteService.deleteProduct(productId);
    } else {
      const products = await this.getProducts();
      const updatedProducts = products.filter(p => p.id !== productId);
      localStorage.setItem('appProducts', JSON.stringify(updatedProducts));
      return true;
    }
  }

  /**
   * الحصول على جميع الموردين
   */
  async getSuppliers(): Promise<Supplier[]> {
    if (!this.connected) {
      throw new Error('قاعدة البيانات غير متصلة');
    }
    
    if (this.dbType === 'sqlite') {
      return SQLiteService.getSuppliers();
    } else {
      const suppliers = localStorage.getItem('appSuppliers');
      return suppliers ? JSON.parse(suppliers) : [];
    }
  }

  /**
   * حفظ مورد
   */
  async saveSupplier(supplier: Supplier): Promise<Supplier> {
    if (!this.connected) {
      throw new Error('قاعدة البيانات غير متصلة');
    }
    
    if (this.dbType === 'sqlite') {
      return SQLiteService.saveSupplier(supplier);
    } else {
      const suppliers = await this.getSuppliers();
      const updatedSuppliers = [...suppliers.filter(s => s.id !== supplier.id), supplier];
      localStorage.setItem('appSuppliers', JSON.stringify(updatedSuppliers));
      return supplier;
    }
  }

  /**
   * حذف مورد
   */
  async deleteSupplier(supplierId: string): Promise<boolean> {
    if (!this.connected) {
      throw new Error('قاعدة البيانات غير متصلة');
    }
    
    if (this.dbType === 'sqlite') {
      return SQLiteService.deleteSupplier(supplierId);
    } else {
      const suppliers = await this.getSuppliers();
      const updatedSuppliers = suppliers.filter(s => s.id !== supplierId);
      localStorage.setItem('appSuppliers', JSON.stringify(updatedSuppliers));
      return true;
    }
  }

  /**
   * الحصول على جميع السندات
   */
  async getBonds(): Promise<Bond[]> {
    if (!this.connected) {
      throw new Error('قاعدة البيانات غير متصلة');
    }
    
    if (this.dbType === 'sqlite') {
      return SQLiteService.getBonds();
    } else {
      const bonds = localStorage.getItem('appBonds');
      return bonds ? JSON.parse(bonds) : [];
    }
  }

  /**
   * حفظ سند
   */
  async saveBond(bond: Bond): Promise<Bond> {
    if (!this.connected) {
      throw new Error('قاعدة البيانات غير متصلة');
    }
    
    if (this.dbType === 'sqlite') {
      return SQLiteService.saveBond(bond);
    } else {
      const bonds = await this.getBonds();
      const updatedBonds = [...bonds.filter(b => b.id !== bond.id), bond];
      localStorage.setItem('appBonds', JSON.stringify(updatedBonds));
      return bond;
    }
  }

  /**
   * حذف سند
   */
  async deleteBond(bondId: string): Promise<boolean> {
    if (!this.connected) {
      throw new Error('قاعدة البيانات غير متصلة');
    }
    
    if (this.dbType === 'sqlite') {
      return SQLiteService.deleteBond(bondId);
    } else {
      const bonds = await this.getBonds();
      const updatedBonds = bonds.filter(b => b.id !== bondId);
      localStorage.setItem('appBonds', JSON.stringify(updatedBonds));
      return true;
    }
  }

  /**
   * الحصول على جميع المشتريات
   */
  async getPurchases(): Promise<Purchase[]> {
    if (!this.connected) {
      throw new Error('قاعدة البيانات غير متصلة');
    }
    
    if (this.dbType === 'sqlite') {
      return SQLiteService.getPurchases();
    } else {
      const purchases = localStorage.getItem('appPurchases');
      return purchases ? JSON.parse(purchases) : [];
    }
  }

  /**
   * حفظ عملية شراء
   */
  async savePurchase(purchase: Purchase): Promise<Purchase> {
    if (!this.connected) {
      throw new Error('قاعدة البيانات غير متصلة');
    }
    
    if (this.dbType === 'sqlite') {
      return SQLiteService.savePurchase(purchase);
    } else {
      const purchases = await this.getPurchases();
      const updatedPurchases = [...purchases.filter(p => p.id !== purchase.id), purchase];
      localStorage.setItem('appPurchases', JSON.stringify(updatedPurchases));
      return purchase;
    }
  }

  /**
   * حذف عملية شراء
   */
  async deletePurchase(purchaseId: string): Promise<boolean> {
    if (!this.connected) {
      throw new Error('قاعدة البيانات غير متصلة');
    }
    
    if (this.dbType === 'sqlite') {
      return SQLiteService.deletePurchase(purchaseId);
    } else {
      const purchases = await this.getPurchases();
      const updatedPurchases = purchases.filter(p => p.id !== purchaseId);
      localStorage.setItem('appPurchases', JSON.stringify(updatedPurchases));
      return true;
    }
  }

  /**
   * الحصول على جميع المستخدمين
   */
  async getUsers(): Promise<User[]> {
    if (!this.connected) {
      throw new Error('قاعدة البيانات غير متصلة');
    }
    
    if (this.dbType === 'sqlite') {
      return SQLiteService.getUsers();
    } else {
      const users = localStorage.getItem('appUsers');
      return users ? JSON.parse(users) : [];
    }
  }

  /**
   * حفظ مستخدم
   */
  async saveUser(user: User): Promise<User> {
    if (!this.connected) {
      throw new Error('قاعدة البيانات غير متصلة');
    }
    
    if (this.dbType === 'sqlite') {
      return SQLiteService.saveUser(user);
    } else {
      const users = await this.getUsers();
      const updatedUsers = [...users.filter(u => u.id !== user.id), user];
      localStorage.setItem('appUsers', JSON.stringify(updatedUsers));
      return user;
    }
  }

  /**
   * حذف مستخدم
   */
  async deleteUser(userId: string): Promise<boolean> {
    if (!this.connected) {
      throw new Error('قاعدة البيانات غير متصلة');
    }
    
    if (this.dbType === 'sqlite') {
      return SQLiteService.deleteUser(userId);
    } else {
      const users = await this.getUsers();
      const updatedUsers = users.filter(u => u.id !== userId);
      localStorage.setItem('appUsers', JSON.stringify(updatedUsers));
      return true;
    }
  }

  /**
   * تصدير قاعدة البيانات (SQLite فقط)
   */
  async exportDatabase(): Promise<Uint8Array | null> {
    if (this.dbType === 'sqlite' && this.connected) {
      return SQLiteService.exportDatabase();
    }
    return null;
  }
}

// تصدير نسخة واحدة من خدمة قاعدة البيانات
export const AppDatabase = new AppDatabaseService();

// محاولة الاتصال بقاعدة البيانات عند تحميل التطبيق
if (localStorage.getItem(DB_CONNECTION_KEY) === 'connected') {
  AppDatabase.connect()
    .then(connected => {
      console.log('استعادة حالة الاتصال بقاعدة البيانات:', connected ? 'متصل' : 'غير متصل');
    })
    .catch(error => {
      console.error('خطأ في استعادة الاتصال بقاعدة البيانات:', error);
    });
}

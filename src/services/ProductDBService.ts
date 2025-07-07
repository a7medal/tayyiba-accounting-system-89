import { Product } from '@/types/product';

const DB_NAME = 'TaybahAppDB';
const DB_VERSION = 1;
const PRODUCT_STORE_NAME = 'products';

let db: IDBDatabase | null = null;

interface ProductDBServiceType {
  openDB: () => Promise<IDBDatabase>;
  addProduct: (product: Product) => Promise<Product>;
  getProductById: (id: string) => Promise<Product | undefined>;
  getAllProducts: () => Promise<Product[]>;
  updateProduct: (product: Product) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  searchProducts: (query: string) => Promise<Product[]>;
}

const ProductDBService: ProductDBServiceType = {
  openDB: (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      if (db) {
        resolve(db);
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = (event) => {
        console.error('IndexedDB error:', request.error);
        reject('Error opening IndexedDB');
      };

      request.onsuccess = (event) => {
        db = request.result;
        resolve(db);
      };

      request.onupgradeneeded = (event) => {
        const tempDb = request.result;
        if (!tempDb.objectStoreNames.contains(PRODUCT_STORE_NAME)) {
          const productStore = tempDb.createObjectStore(PRODUCT_STORE_NAME, { keyPath: 'id' });
          productStore.createIndex('name', 'name', { unique: false });
          productStore.createIndex('sku', 'sku', { unique: true });
          productStore.createIndex('description', 'description', { unique: false });
          // يمكنك إضافة المزيد من الفهارس هنا إذا لزم الأمر
          console.log('Product object store and indexes created');
        }
      };
    });
  },

  addProduct: async (product: Product): Promise<Product> => {
    const currentDb = await ProductDBService.openDB();
    return new Promise((resolve, reject) => {
      const transaction = currentDb.transaction(PRODUCT_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(PRODUCT_STORE_NAME);
      const request = store.add(product);

      request.onerror = () => {
        console.error('Error adding product:', request.error);
        reject(request.error);
      };
      request.onsuccess = () => {
        resolve(product);
      };
    });
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    const currentDb = await ProductDBService.openDB();
    return new Promise((resolve, reject) => {
      const transaction = currentDb.transaction(PRODUCT_STORE_NAME, 'readonly');
      const store = transaction.objectStore(PRODUCT_STORE_NAME);
      const request = store.get(id);

      request.onerror = () => {
        console.error('Error getting product by ID:', request.error);
        reject(request.error);
      };
      request.onsuccess = () => {
        resolve(request.result as Product | undefined);
      };
    });
  },

  getAllProducts: async (): Promise<Product[]> => {
    const currentDb = await ProductDBService.openDB();
    return new Promise((resolve, reject) => {
      const transaction = currentDb.transaction(PRODUCT_STORE_NAME, 'readonly');
      const store = transaction.objectStore(PRODUCT_STORE_NAME);
      const request = store.getAll();

      request.onerror = () => {
        console.error('Error getting all products:', request.error);
        reject(request.error);
      };
      request.onsuccess = () => {
        resolve(request.result as Product[]);
      };
    });
  },

  updateProduct: async (product: Product): Promise<Product> => {
    const currentDb = await ProductDBService.openDB();
    return new Promise((resolve, reject) => {
      const transaction = currentDb.transaction(PRODUCT_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(PRODUCT_STORE_NAME);
      const request = store.put(product); // put会添加或更新

      request.onerror = () => {
        console.error('Error updating product:', request.error);
        reject(request.error);
      };
      request.onsuccess = () => {
        resolve(product);
      };
    });
  },

  deleteProduct: async (id: string): Promise<void> => {
    const currentDb = await ProductDBService.openDB();
    return new Promise((resolve, reject) => {
      const transaction = currentDb.transaction(PRODUCT_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(PRODUCT_STORE_NAME);
      const request = store.delete(id);

      request.onerror = () => {
        console.error('Error deleting product:', request.error);
        reject(request.error);
      };
      request.onsuccess = () => {
        resolve();
      };
    });
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    const currentDb = await ProductDBService.openDB();
    return new Promise((resolve, reject) => {
      if (!query.trim()) {
        resolve(ProductDBService.getAllProducts());
        return;
      }
      const transaction = currentDb.transaction(PRODUCT_STORE_NAME, 'readonly');
      const store = transaction.objectStore(PRODUCT_STORE_NAME);
      const products: Product[] = [];
      
      // البحث باستخدام الفهرس للاسم (مثال) - يمكن توسيعه ليشمل SKU والوصف
      // يتطلب IndexedDB نطاقات للبحث الفعال بدلاً من "includes" مباشرة
      // للحصول على بحث "يحتوي على"، غالبًا ما نحتاج إلى جلب كل شيء وتصفيته،
      // أو استخدام فهارس أكثر تعقيدًا (full-text search غير مدعوم أصلاً)
      // هنا سنقوم بتطبيق تصفية بسيطة بعد جلب الكل للتبسيط،
      // ولكن للبيانات الكبيرة، يجب تحسين هذا.
      const request = store.getAll();

      request.onerror = () => {
        console.error('Error searching products:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        const allProducts = request.result as Product[];
        const lowerCaseQuery = query.toLowerCase();
        const filteredProducts = allProducts.filter(product => 
          product.name.toLowerCase().includes(lowerCaseQuery) ||
          product.sku.toLowerCase().includes(lowerCaseQuery) ||
          (product.description && product.description.toLowerCase().includes(lowerCaseQuery))
        );
        resolve(filteredProducts);
      };
    });
  }
};

export default ProductDBService;


import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface User {
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // التحقق من حالة المصادقة عند تحميل التطبيق
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('يرجى إدخال البريد الإلكتروني وكلمة المرور');
    }

    try {
      // محاكاة لعملية تسجيل الدخول
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = { email, name: 'محمد أحمد', role: 'مدير' };
      
      // تخزين بيانات المستخدم
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      setIsAuthenticated(true);
      
      return;
    } catch (error) {
      throw new Error('حدث خطأ أثناء تسجيل الدخول');
    }
  };

  const logout = () => {
    // حذف بيانات المصادقة
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    
    setUser(null);
    setIsAuthenticated(false);
    
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل خروجك بنجاح من النظام",
    });
    
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

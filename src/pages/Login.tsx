
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/use-theme';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme } = useTheme();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // في الوضع التجريبي، نسمح بتسجيل الدخول بأي بيانات
    if (!email || !password) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "يرجى إدخال البريد الإلكتروني وكلمة المرور",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // محاكاة لعملية تسجيل الدخول
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // تخزين حالة تسجيل الدخول في localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify({ email, name: 'محمد أحمد', role: 'مدير' }));
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في نظام طيبة للمحاسبة",
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "حدث خطأ أثناء محاولة تسجيل الدخول",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-8 card-glass rounded-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">طيبة</h1>
          <p className="mt-2 text-muted-foreground">نظام المحاسبة المتكامل</p>
        </div>
        
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="أدخل البريد الإلكتروني" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="أدخل كلمة المرور" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="remember-me" className="mr-2 block text-sm text-muted-foreground">
                تذكرني
              </label>
            </div>
            
            <div className="text-sm">
              <a href="#" className="text-primary hover:underline">
                نسيت كلمة المرور؟
              </a>
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </Button>
        </form>
      </div>
    </div>
  );
}

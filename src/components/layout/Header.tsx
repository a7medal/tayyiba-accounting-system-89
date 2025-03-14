
import { useState } from 'react';
import { Bell, Search, ChevronDown, Sun, Moon, LogOut, User, Settings as SettingsIcon, Printer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we are on the invoices details page
  const isInvoiceDetails = location.pathname === '/invoices' && document.querySelector('.invoice-print-section') !== null;
  
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <div className="h-16 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-30 flex items-center justify-between px-6">
      <div className="w-full max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="البحث..."
            className="w-full rounded-md border border-input bg-background py-2 pl-10 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {isInvoiceDetails && (
          <button 
            onClick={handlePrint}
            className="p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
            aria-label="طباعة الفاتورة"
          >
            <Printer className="h-5 w-5" />
          </button>
        )}
      
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
          aria-label={theme === 'dark' ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
      
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute top-full right-0 mt-1 w-80 rounded-lg border border-border bg-card shadow-lg animate-fade-in overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="font-medium">الإشعارات</h3>
              </div>
              <div className="max-h-[300px] overflow-y-auto p-2">
                <div className="p-3 hover:bg-accent rounded-md transition-colors duration-200 cursor-pointer">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-sm">فاتورة جديدة</span>
                    <span className="text-xs text-muted-foreground">منذ ساعة</span>
                  </div>
                  <p className="text-sm text-muted-foreground">تم إنشاء فاتورة جديدة من قبل أحمد</p>
                </div>
                <div className="p-3 hover:bg-accent rounded-md transition-colors duration-200 cursor-pointer">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-sm">دفعة مستلمة</span>
                    <span className="text-xs text-muted-foreground">منذ 3 ساعات</span>
                  </div>
                  <p className="text-sm text-muted-foreground">تم استلام دفعة من شركة النور</p>
                </div>
                <div className="p-3 hover:bg-accent rounded-md transition-colors duration-200 cursor-pointer">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-sm">تقرير جديد</span>
                    <span className="text-xs text-muted-foreground">منذ يوم</span>
                  </div>
                  <p className="text-sm text-muted-foreground">تم إنشاء تقرير المبيعات الشهري</p>
                </div>
              </div>
              <div className="p-2 border-t border-border">
                <button className="w-full text-center text-sm text-primary py-1 hover:bg-accent rounded-md transition-colors duration-200">
                  عرض كل الإشعارات
                </button>
              </div>
            </div>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer p-1 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {user?.name.charAt(0) || 'م'}
                </span>
              </div>
              <div className="text-sm">
                <div className="font-medium">{user?.name || 'محمد أحمد'}</div>
                <div className="text-xs text-muted-foreground">{user?.role || 'مدير'}</div>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/profile')}>
              <User className="h-4 w-4" />
              <span>الملف الشخصي</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/settings')}>
              <SettingsIcon className="h-4 w-4" />
              <span>الإعدادات</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive" onClick={logout}>
              <LogOut className="h-4 w-4" />
              <span>تسجيل الخروج</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

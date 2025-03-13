
import { useState } from 'react';
import { Bell, Search, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  
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
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full hover:bg-accent transition-colors duration-200"
          >
            <Bell className="h-5 w-5 text-foreground" />
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

        <div className="flex items-center gap-2 cursor-pointer p-1 rounded-md hover:bg-accent transition-colors duration-200">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">م</span>
          </div>
          <div className="text-sm">
            <div className="font-medium">محمد أحمد</div>
            <div className="text-xs text-muted-foreground">مدير</div>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}

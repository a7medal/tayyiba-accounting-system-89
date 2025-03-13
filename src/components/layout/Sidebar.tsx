import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  BarChart4, 
  Wallet, 
  FileText, 
  Users, 
  Settings,
  Menu,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
}

const SidebarLink = ({ to, icon, children, isActive, onClick }: SidebarLinkProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300",
        isActive 
          ? "bg-accent text-primary" 
          : "text-foreground/70 hover:bg-accent/50 hover:text-foreground"
      )}
      onClick={onClick}
    >
      <span className="w-5 h-5">{icon}</span>
      <span>{children}</span>
    </Link>
  );
};

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const location = useLocation();
  const { logout } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div
      className={cn(
        "relative h-screen border-r border-border bg-card py-4 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="px-4 mb-8 flex items-center justify-between">
        {!collapsed && (
          <div className="text-xl font-bold text-primary animate-fade-in">
            طيبة
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-accent text-muted-foreground"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className="space-y-1 px-3">
        {!collapsed ? (
          <>
            <SidebarLink 
              to="/" 
              icon={<LayoutDashboard className="h-5 w-5" />}
              isActive={isActive("/")}
            >
              لوحة التحكم
            </SidebarLink>
            <SidebarLink 
              to="/invoices" 
              icon={<Receipt className="h-5 w-5" />}
              isActive={isActive("/invoices")}
            >
              الفواتير
            </SidebarLink>
            <SidebarLink 
              to="/transactions" 
              icon={<Wallet className="h-5 w-5" />}
              isActive={isActive("/transactions")}
            >
              المعاملات
            </SidebarLink>
            <SidebarLink 
              to="/reports" 
              icon={<BarChart4 className="h-5 w-5" />}
              isActive={isActive("/reports")}
            >
              التقارير
            </SidebarLink>
            <SidebarLink 
              to="/documents" 
              icon={<FileText className="h-5 w-5" />}
              isActive={isActive("/documents")}
            >
              المستندات
            </SidebarLink>
            <SidebarLink 
              to="/clients" 
              icon={<Users className="h-5 w-5" />}
              isActive={isActive("/clients")}
            >
              العملاء
            </SidebarLink>
            <SidebarLink 
              to="/settings" 
              icon={<Settings className="h-5 w-5" />}
              isActive={isActive("/settings")}
            >
              الإعدادات
            </SidebarLink>
          </>
        ) : (
          <>
            <div className="py-1.5 flex justify-center">
              <Link to="/" className={cn(
                "p-2 rounded-lg transition-all duration-300",
                isActive("/") ? "bg-accent text-primary" : "text-foreground/70 hover:bg-accent/50"
              )}>
                <LayoutDashboard className="h-5 w-5" />
              </Link>
            </div>
            <div className="py-1.5 flex justify-center">
              <Link to="/invoices" className={cn(
                "p-2 rounded-lg transition-all duration-300",
                isActive("/invoices") ? "bg-accent text-primary" : "text-foreground/70 hover:bg-accent/50"
              )}>
                <Receipt className="h-5 w-5" />
              </Link>
            </div>
            <div className="py-1.5 flex justify-center">
              <Link to="/transactions" className={cn(
                "p-2 rounded-lg transition-all duration-300",
                isActive("/transactions") ? "bg-accent text-primary" : "text-foreground/70 hover:bg-accent/50"
              )}>
                <Wallet className="h-5 w-5" />
              </Link>
            </div>
            <div className="py-1.5 flex justify-center">
              <Link to="/reports" className={cn(
                "p-2 rounded-lg transition-all duration-300",
                isActive("/reports") ? "bg-accent text-primary" : "text-foreground/70 hover:bg-accent/50"
              )}>
                <BarChart4 className="h-5 w-5" />
              </Link>
            </div>
            <div className="py-1.5 flex justify-center">
              <Link to="/documents" className={cn(
                "p-2 rounded-lg transition-all duration-300",
                isActive("/documents") ? "bg-accent text-primary" : "text-foreground/70 hover:bg-accent/50"
              )}>
                <FileText className="h-5 w-5" />
              </Link>
            </div>
            <div className="py-1.5 flex justify-center">
              <Link to="/clients" className={cn(
                "p-2 rounded-lg transition-all duration-300",
                isActive("/clients") ? "bg-accent text-primary" : "text-foreground/70 hover:bg-accent/50"
              )}>
                <Users className="h-5 w-5" />
              </Link>
            </div>
            <div className="py-1.5 flex justify-center">
              <Link to="/settings" className={cn(
                "p-2 rounded-lg transition-all duration-300",
                isActive("/settings") ? "bg-accent text-primary" : "text-foreground/70 hover:bg-accent/50"
              )}>
                <Settings className="h-5 w-5" />
              </Link>
            </div>
          </>
        )}
      </div>

      <div className="absolute bottom-4 w-full px-3">
        {!collapsed ? (
          <div 
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-accent/50 cursor-pointer transition-all duration-300"
            onClick={logout}
          >
            <LogOut className="h-5 w-5" />
            <span>تسجيل الخروج</span>
          </div>
        ) : (
          <div 
            className="flex justify-center"
            onClick={logout}
          >
            <div className="p-2 rounded-lg text-destructive hover:bg-accent/50 cursor-pointer transition-all duration-300">
              <LogOut className="h-5 w-5" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

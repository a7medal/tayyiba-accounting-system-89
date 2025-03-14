
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
  LogOut,
  Package,
  UserCog,
  Truck,
  ShoppingCart,
  Send
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
          ? "bg-sidebar-accent text-sidebar-foreground" 
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
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
  const { logout, user, hasPermission } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isAdmin = user?.role === 'admin';
  const canViewSuppliers = hasPermission('عرض الموردين');
  const canViewPurchases = hasPermission('عرض المشتريات');

  return (
    <div
      className={cn(
        "relative h-screen border-r border-sidebar-border bg-sidebar py-4 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="px-4 mb-8 flex items-center justify-between">
        {!collapsed ? (
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center logo-pulse">
              <span className="text-xl font-bold text-white">ط</span>
            </div>
            <div className="text-xl font-bold text-white">
              طيبة
            </div>
          </Link>
        ) : (
          <Link to="/" className="w-full flex justify-center">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center logo-pulse">
              <span className="text-xl font-bold text-white">ط</span>
            </div>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
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
              to="/gaza-telecom" 
              icon={<Send className="h-5 w-5" />}
              isActive={isActive("/gaza-telecom")}
            >
              غزة تليكوم
            </SidebarLink>
            {canViewSuppliers && (
              <SidebarLink 
                to="/suppliers" 
                icon={<Truck className="h-5 w-5" />}
                isActive={isActive("/suppliers")}
              >
                الموردين
              </SidebarLink>
            )}
            {canViewPurchases && (
              <SidebarLink 
                to="/purchases" 
                icon={<ShoppingCart className="h-5 w-5" />}
                isActive={isActive("/purchases")}
              >
                المشتريات
              </SidebarLink>
            )}
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
              to="/products" 
              icon={<Package className="h-5 w-5" />}
              isActive={isActive("/products")}
            >
              المنتجات
            </SidebarLink>
            {isAdmin && (
              <SidebarLink 
                to="/users" 
                icon={<UserCog className="h-5 w-5" />}
                isActive={isActive("/users")}
              >
                المستخدمين
              </SidebarLink>
            )}
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
              <Link to="/gaza-telecom" className={cn(
                "p-2 rounded-lg transition-all duration-300",
                isActive("/gaza-telecom") ? "bg-accent text-primary" : "text-foreground/70 hover:bg-accent/50"
              )}>
                <Send className="h-5 w-5" />
              </Link>
            </div>
            {canViewSuppliers && (
              <div className="py-1.5 flex justify-center">
                <Link to="/suppliers" className={cn(
                  "p-2 rounded-lg transition-all duration-300",
                  isActive("/suppliers") ? "bg-accent text-primary" : "text-foreground/70 hover:bg-accent/50"
                )}>
                  <Truck className="h-5 w-5" />
                </Link>
              </div>
            )}
            {canViewPurchases && (
              <div className="py-1.5 flex justify-center">
                <Link to="/purchases" className={cn(
                  "p-2 rounded-lg transition-all duration-300",
                  isActive("/purchases") ? "bg-accent text-primary" : "text-foreground/70 hover:bg-accent/50"
                )}>
                  <ShoppingCart className="h-5 w-5" />
                </Link>
              </div>
            )}
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
              <Link to="/products" className={cn(
                "p-2 rounded-lg transition-all duration-300",
                isActive("/products") ? "bg-accent text-primary" : "text-foreground/70 hover:bg-accent/50"
              )}>
                <Package className="h-5 w-5" />
              </Link>
            </div>
            {isAdmin && (
              <div className="py-1.5 flex justify-center">
                <Link to="/users" className={cn(
                  "p-2 rounded-lg transition-all duration-300",
                  isActive("/users") ? "bg-accent text-primary" : "text-foreground/70 hover:bg-accent/50"
                )}>
                  <UserCog className="h-5 w-5" />
                </Link>
              </div>
            )}
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

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
  Send,
  CreditCard,
  FileCheck,
  DollarSign  // أيقونة تعبر عن النقود
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

  const isActive = (path: string) => location.pathname === path;

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
            {/* لوحة التحكم */}
            <SidebarLink 
              to="/" 
              icon={<LayoutDashboard className="h-5 w-5" />}
              isActive={isActive("/")}
            >
              لوحة التحكم
            </SidebarLink>
            {/* الديون تظهر مباشرة تحت لوحة التحكم */}
            <SidebarLink 
              to="/debts" 
              icon={<DollarSign className="h-5 w-5" />}
              isActive={isActive("/debts")}
            >
              الديون
            </SidebarLink>
            <SidebarLink 
              to="/invoices" 
              icon={<Receipt className="h-5 w-5" />}
              isActive={isActive("/invoices")}
            >
              الفواتير
            </SidebarLink>
            <SidebarLink 
              to="/bonds" 
              icon={<FileCheck className="h-5 w-5" />}
              isActive={isActive("/bonds")}
            >
              السندات
            </SidebarLink>
            <SidebarLink 
              to="/transactions" 
              icon={<Wallet className="h-5 w-5" />}
              isActive={isActive("/transactions")}
            >
              المعاملات
            </SidebarLink>
            <SidebarLink 
              to="/accounts" 
              icon={<CreditCard className="h-5 w-5" />}
              isActive={isActive("/accounts")}
            >
              الحسابات
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
              to="/profile" 
              icon={<Users className="h-5 w-5" />}
              isActive={isActive("/profile")}
            >
              الملف الشخصي
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
              <Link 
                to="/" 
                className={cn(
                  "p-2 rounded-lg transition-all duration-300",
                  isActive("/") 
                    ? "bg-sidebar-accent text-sidebar-foreground" 
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50"
                )}
              >
                <LayoutDashboard className="h-5 w-5" />
              </Link>
            </div>
            {/* في النسخة المصغرة، رابط الديون تحت لوحة التحكم مباشرة */}
            <div className="py-1.5 flex justify-center">
              <Link 
                to="/debts" 
                className={cn(
                  "p-2 rounded-lg transition-all duration-300",
                  isActive("/debts") 
                    ? "bg-sidebar-accent text-sidebar-foreground" 
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50"
                )}
              >
                <DollarSign className="h-5 w-5" />
              </Link>
            </div>
            <div className="py-1.5 flex justify-center">
              <Link 
                to="/invoices" 
                className={cn(
                  "p-2 rounded-lg transition-all duration-300",
                  isActive("/invoices") 
                    ? "bg-sidebar-accent text-sidebar-foreground" 
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50"
                )}
              >
                <Receipt className="h-5 w-5" />
              </Link>
            </div>
            <div className="py-1.5 flex justify-center">
              <Link 
                to="/bonds" 
                className={cn(
                  "p-2 rounded-lg transition-all duration-300",
                  isActive("/bonds") 
                    ? "bg-sidebar-accent text-sidebar-foreground" 
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50"
                )}
              >
                <FileCheck className="h-5 w-5" />
              </Link>
            </div>
            <div className="py-1.5 flex justify-center">
              <Link 
                to="/transactions" 
                className={cn(
                  "p-2 rounded-lg transition-all duration-300",
                  isActive("/transactions") 
                    ? "bg-sidebar-accent text-sidebar-foreground" 
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50"
                )}
              >
                <Wallet className="h-5 w-5" />
              </Link>
            </div>
            <div className="py-1.5 flex justify-center">
              <Link 
                to="/accounts" 
                className={cn(
                  "p-2 rounded-lg transition-all duration-300",
                  isActive("/accounts") 
                    ? "bg-sidebar-accent text-sidebar-foreground" 
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50"
                )}
              >
                <CreditCard className="h-5 w-5" />
              </Link>
            </div>
            <div className="py-1.5 flex justify-center">
              <Link 
                to="/gaza-telecom" 
                className={cn(
                  "p-2 rounded-lg transition-all duration-300",
                  isActive("/gaza-telecom") 
                    ? "bg-sidebar-accent text-sidebar-foreground" 
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50"
                )}
              >
                <Send className="h-5 w-5" />
              </Link>
            </div>
            {canViewSuppliers && (
              <div className="py-1.5 flex justify-center">
                <Link 
                  to="/suppliers" 
                  className={cn(
                    "p-2 rounded-lg transition-all duration-300",
                    isActive("/suppliers") 
                      ? "bg-sidebar-accent text-sidebar-foreground" 
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50"
                  )}
                >
                  <Truck className="h-5 w-5" />
                </Link>
              </div>
            )}
            {canViewPurchases && (
              <div className="py-1.5 flex justify-center">
                <Link 
                  to="/purchases" 
                  className={cn(
                    "p-2 rounded-lg transition-all duration-300",
                    isActive("/purchases") 
                      ? "bg-sidebar-accent text-sidebar-foreground" 
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50"
                  )}
                >
                  <ShoppingCart className="h-5 w-5" />
                </Link>
              </div>
            )}
            <div className="py-1.5 flex justify-center">
              <Link 
                to="/reports" 
                className={cn(
                  "p-2 rounded-lg transition-all duration-300",
                  isActive("/reports") 
                    ? "bg-sidebar-accent text-sidebar-foreground" 
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50"
                )}
              >
                <BarChart4 className="h-5 w-5" />
              </Link>
            </div>
            <div className="py-1.5 flex justify-center">
              <Link 
                to="/documents" 
                className={cn(
                  "p-2 rounded-lg transition-all duration-300",
                  isActive("/documents") 
                    ? "bg-sidebar-accent text-sidebar-foreground" 
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50"
                )}
              >
                <FileText className="h-5 w-5" />
              </Link>
            </div>
            <div className="py-1.5 flex justify-center">
              <Link 
                to="/clients" 
                className={cn(
                  "p-2 rounded-lg transition-all duration-300",
                  isActive("/clients") 
                    ? "bg-sidebar-accent text-sidebar-foreground" 
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50"
                )}
              >
                <Users className="h-5 w-5" />
              </Link>
            </div>
            <div className="py-1.5 flex justify-center">
              <Link 
                to="/products" 
                className={cn(
                  "p-2 rounded-lg transition-all duration-300",
                  isActive("/products") 
                    ? "bg-sidebar-accent text-sidebar-foreground" 
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50"
                )}
              >
                <Package className="h-5 w-5" />
              </Link>
            </div>
            {isAdmin && (
              <div className="py-1.5 flex justify-center">
                <Link 
                  to="/users" 
                  className={cn(
                    "p-2 rounded-lg transition-all duration-300",
                    isActive("/users") 
                      ? "bg-sidebar-accent text-sidebar-foreground" 
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50"
                  )}
                >
                  <UserCog className="h-5 w-5" />
                </Link>
              </div>
            )}
            <div className="py-1.5 flex justify-center">
              <Link 
                to="/profile" 
                className={cn(
                  "p-2 rounded-lg transition-all duration-300",
                  isActive("/profile") 
                    ? "bg-sidebar-accent text-sidebar-foreground" 
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50"
                )}
              >
                <Users className="h-5 w-5" />
              </Link>
            </div>
            <div className="py-1.5 flex justify-center">
              <Link 
                to="/settings" 
                className={cn(
                  "p-2 rounded-lg transition-all duration-300",
                  isActive("/settings") 
                    ? "bg-sidebar-accent text-sidebar-foreground" 
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50"
                )}
              >
                <Settings className="h-5 w-5" />
              </Link>
            </div>
            {/* رابط الديون في النسخة المصغرة تم وضعه هنا أيضاً */}
            <div className="py-1.5 flex justify-center">
              <Link 
                to="/debts" 
                className={cn(
                  "p-2 rounded-lg transition-all duration-300",
                  isActive("/debts") 
                    ? "bg-sidebar-accent text-sidebar-foreground" 
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50"
                )}
              >
                <DollarSign className="h-5 w-5" />
              </Link>
            </div>
          </>
        )}
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <button
          onClick={logout}
          className="flex items-center justify-center p-2 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent/50"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
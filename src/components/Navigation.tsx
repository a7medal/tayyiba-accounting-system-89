
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  CreditCard, 
  BarChart, 
  Settings,
  Menu,
  FileText,
  Phone,
  Wallet,
  DollarSign,
  ShoppingBag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';
import { ScrollArea } from './ui/scroll-area';

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  active: boolean;
  onClick?: () => void;
}

const NavLink = ({ to, icon, children, active, onClick }: NavLinkProps) => {
  return (
    <Link to={to} onClick={onClick}>
      <Button 
        variant="ghost" 
        className={cn(
          'w-full justify-start', 
          active ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'
        )}
      >
        {icon}
        <span className="mr-2">{children}</span>
      </Button>
    </Link>
  );
};

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const routes = [
    { path: '/', label: 'لوحة التحكم', icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: '/products', label: 'المنتجات', icon: <Package className="h-5 w-5" /> },
    { path: '/customers', label: 'العملاء', icon: <Users className="h-5 w-5" /> },
    { path: '/orders', label: 'الطلبات', icon: <ShoppingCart className="h-5 w-5" /> },
    { path: '/sales', label: 'المبيعات', icon: <CreditCard className="h-5 w-5" /> },
    { path: '/purchases', label: 'المشتريات', icon: <ShoppingBag className="h-5 w-5" /> },
    { path: '/reports', label: 'التقارير', icon: <BarChart className="h-5 w-5" /> },
    { path: '/invoices', label: 'الفواتير', icon: <FileText className="h-5 w-5" /> },
    { path: '/gazatelecom', label: 'غزة تلكوم', icon: <Phone className="h-5 w-5" /> },
    { path: '/accounts', label: 'الحسابات', icon: <Wallet className="h-5 w-5" /> },
    { path: '/debts', label: 'الديون', icon: <DollarSign className="h-5 w-5" /> },
    { path: '/settings', label: 'الإعدادات', icon: <Settings className="h-5 w-5" /> },
  ];

  const toggleOpen = () => setOpen(!open);
  const closeMenu = () => setOpen(false);

  const navContent = (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="px-3 py-2 space-y-1">
        {routes.map(route => (
          <NavLink 
            key={route.path}
            to={route.path}
            icon={route.icon}
            active={location.pathname === route.path}
            onClick={!isDesktop ? closeMenu : undefined}
          >
            {route.label}
          </NavLink>
        ))}
      </div>
    </ScrollArea>
  );

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleOpen}
          className="rounded-full w-10 h-10"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile nav */}
      <div className={cn(
        "fixed inset-0 z-40 transform md:hidden bg-background/95 backdrop-blur-sm transition-transform duration-300",
        open ? "translate-x-0" : "translate-x-full",
      )}>
        <div className="flex flex-col h-full pt-16">
          {navContent}
        </div>
      </div>

      {/* Desktop nav */}
      <div className="hidden md:flex md:w-64 flex-col border-l dark:border-border h-screen sticky top-0 right-0">
        <div className="flex items-center h-16 px-6">
          <h2 className="text-lg font-bold">نظام إدارة المتجر</h2>
        </div>
        {navContent}
      </div>
    </>
  );
}

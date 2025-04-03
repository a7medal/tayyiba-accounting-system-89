
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Dashboard from '@/pages/Dashboard';
import Products from '@/pages/Products';
import Customers from '@/pages/Customers';
import Orders from '@/pages/Orders';
import Sales from '@/pages/Sales';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import Invoices from '@/pages/Invoices';
import GazaTelecom from '@/pages/GazaTelecom';
import Accounts from '@/pages/Accounts';
import Debts from '@/pages/Debts';
import Purchases from '@/pages/Purchases';
import Clients from '@/pages/Clients';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen dark:bg-background">
        <Navigation />
        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/gazatelecom" element={<GazaTelecom />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/debts" element={<Debts />} />
            <Route path="/purchases" element={<Purchases />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

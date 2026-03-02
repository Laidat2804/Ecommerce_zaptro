import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatCard from './components/StatCard';
import RecentOrders from './components/RecentOrders';
import ProductsPage from './pages/ProductsPage';
import AddProductForm from './components/AddProductForm';
import CustomersPage from './pages/CustomersPage';
import OrdersPage from './pages/OrdersPage';
import AnalyticsPage from './pages/AnalyticsPage';
import MessagesPage from './pages/MessagesPage';
import AdminRoute from './components/AdminRoute';
import AdminLogin from './pages/AdminLogin';
import { useAdminAuth } from './context/AdminAuthContext';
import { useSearch } from './context/SearchContext';
import {
  DollarSign,
  ShoppingCart,
  UserPlus,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

function DashboardContent() {
  const { user, token } = useAdminAuth();
  const firstName = user?.name?.split(' ')[0] || 'Admin';
  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/orders/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setDashData(await res.json());
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [token]);

  const stats = dashData
    ? [
        {
          icon: DollarSign,
          title: 'Total Revenue',
          value: `$${dashData.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
          change: 0,
          iconBg: 'bg-blue-50',
          iconColor: 'text-blue-600',
        },
        {
          icon: ShoppingCart,
          title: 'Total Orders',
          value: dashData.totalOrders.toLocaleString(),
          change: 0,
          iconBg: 'bg-emerald-50',
          iconColor: 'text-emerald-600',
        },
        {
          icon: UserPlus,
          title: 'Customers',
          value: dashData.totalCustomers.toLocaleString(),
          change: 0,
          iconBg: 'bg-violet-50',
          iconColor: 'text-violet-600',
        },
        {
          icon: AlertTriangle,
          title: 'Low Stock Items',
          value: dashData.lowStockItems.toLocaleString(),
          change: dashData.lowStockItems > 0 ? -dashData.lowStockItems : 0,
          iconBg: 'bg-amber-50',
          iconColor: 'text-amber-600',
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="px-4 sm:px-6 mt-4 flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-primary-500" />
        <span className="ml-3 text-slate-500">Đang tải dashboard...</span>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 mt-4">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">
          Welcome back, {firstName}! Here's what's happening with your store
          today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Recent Orders */}
      <RecentOrders orders={dashData?.recentOrders || []} />
    </div>
  );
}

// Layout chính cho dashboard (Sidebar + Header + Content)
function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const { setSearchQuery } = useSearch();

  // Reset search khi chuyển trang
  useEffect(() => {
    setSearchQuery('');
  }, [activePage]);
  const renderPage = () => {
    // Xử lý edit-product:productId
    if (activePage.startsWith('edit-product:')) {
      const productId = activePage.split(':')[1];
      return (
        <AddProductForm
          onCancel={() => setActivePage('products')}
          editProductId={productId}
        />
      );
    }

    switch (activePage) {
      case 'products':
        return <ProductsPage onNavigate={setActivePage} />;
      case 'add-product':
        return <AddProductForm onCancel={() => setActivePage('products')} />;
      case 'customers':
        return <CustomersPage />;
      case 'orders':
        return <OrdersPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'messages':
        return <MessagesPage />;
      case 'dashboard':
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 font-sans">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activePage={activePage}
        onNavigate={setActivePage}
      />
      <main className="lg:ml-[260px] min-h-screen pb-8">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        {renderPage()}
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<AdminLogin />} />

      {/* Protected admin routes */}
      <Route
        path="/*"
        element={
          <AdminRoute>
            <DashboardLayout />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

export default App;

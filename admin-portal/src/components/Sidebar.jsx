import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Users,
  BarChart3,
  MessageSquare,
  LogOut,
  Zap,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', key: 'dashboard' },
  { icon: ShoppingBag, label: 'Products', key: 'products' },
  { icon: ClipboardList, label: 'Orders', key: 'orders' },
  { icon: Users, label: 'Customers', key: 'customers' },
  { icon: BarChart3, label: 'Analytics', key: 'analytics' },
  { icon: MessageSquare, label: 'Messages', key: 'messages' },
];

export default function Sidebar({ isOpen, onClose, activePage, onNavigate }) {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName = user?.name || 'Admin';
  const displayRole = user?.role === 'admin' ? 'Administrator' : user?.role || 'User';

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full z-50
          w-[260px] bg-sidebar-bg
          flex flex-col
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 h-[72px] border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Zap size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Zaptro
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <p className="px-3 mb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
            Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  onNavigate(item.key);
                  onClose();
                }}
                className={`
                  nav-link w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  ${
                    isActive
                      ? 'bg-sidebar-active text-white shadow-lg shadow-blue-600/25'
                      : 'text-slate-400 hover:text-white hover:bg-sidebar-hover'
                  }
                `}
              >
                <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                {item.label}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom - User Info + Logout */}
        <div className="px-3 pb-6">
          {/* User Info Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {displayName}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {displayRole}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="nav-link w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
          >
            <LogOut size={20} strokeWidth={1.8} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

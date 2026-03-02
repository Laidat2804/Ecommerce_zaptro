import { useState, useEffect, useCallback } from 'react';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  ChevronDown,
  Package,
  Truck,
  CreditCard,
  Banknote,
  Loader2,
  Mail,
  AlertCircle,
  Timer,
} from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import OrderDetailsModal from '../components/OrderDetailsModal';
import { API_BASE_URL } from '../utils/apiConfig';

const API_URL = `${API_BASE_URL}/orders`;
const ITEMS_PER_PAGE = 10;

const statusConfig = {
  Pending:            { color: 'bg-amber-50 text-amber-600 ring-amber-500/20', dot: 'bg-amber-500', icon: Clock },
  'Awaiting Pickup':  { color: 'bg-orange-50 text-orange-600 ring-orange-500/20', dot: 'bg-orange-500', icon: Timer },
  'Out for Delivery': { color: 'bg-blue-50 text-blue-600 ring-blue-500/20', dot: 'bg-blue-500', icon: Truck },
  Delivered:          { color: 'bg-emerald-50 text-emerald-600 ring-emerald-500/20', dot: 'bg-emerald-500', icon: CheckCircle2 },
  Canceled:           { color: 'bg-red-50 text-red-500 ring-red-500/20', dot: 'bg-red-500', icon: XCircle },
};

const paymentIcons = {
  'Credit Card': CreditCard,
  'COD': Banknote,
  'Bank Transfer': CreditCard,
};

const statusFlow = ['Pending', 'Awaiting Pickup', 'Out for Delivery', 'Delivered', 'Canceled'];

/* ── Summary Card ── */
function SummaryCard({ icon: Icon, title, value, iconBg, iconColor }) {
  return (
    <div className="glass card-hover rounded-2xl p-5 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon size={22} className={iconColor} strokeWidth={2} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <p className="text-xl font-bold text-slate-800 tracking-tight">{value}</p>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function OrdersPage() {
  const { searchQuery } = useSearch();
  const { token } = useAdminAuth();

  // Server-driven state
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [statusCounts, setStatusCounts] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);
  const [patchingId, setPatchingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  // Fetch orders from server with pagination
  const fetchOrders = useCallback(async (page = 1, status = 'All', search = '') => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      });
      if (status !== 'All') params.set('status', status);
      if (search) params.set('search', search);

      const res = await fetch(`${API_URL}?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Không thể tải danh sách đơn hàng');

      const data = await res.json();
      setOrders(data.orders);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
      setTotalOrders(data.totalOrders);
      setStatusCounts(data.statusCounts || {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Initial fetch + refetch when filter/search/page changes
  useEffect(() => {
    fetchOrders(currentPage, statusFilter, searchQuery);
  }, [currentPage, statusFilter, searchQuery, fetchOrders]);

  const handleStatusFilterChange = (val) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Update order status via API
  const updateOrderStatus = async (orderId, newStatus) => {
    setPatchingId(orderId);
    try {
      const res = await fetch(`${API_URL}/${orderId}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Optimistically update in current list
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
      setUpdatingId(null);

      // Refetch to update statusCounts
      fetchOrders(currentPage, statusFilter, searchQuery);
    } catch (err) {
      alert(err.message);
    } finally {
      setPatchingId(null);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!updatingId) return;
    const handler = (e) => {
      if (!e.target.closest('[data-status-dropdown]')) setUpdatingId(null);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [updatingId]);

  // Metrics from statusCounts (server-driven)
  const totalAll = statusCounts.All || 0;
  const pendingOrders = (statusCounts.Pending || 0) + (statusCounts['Awaiting Pickup'] || 0);
  const completedOrders = statusCounts.Delivered || 0;
  const canceledOrders = statusCounts.Canceled || 0;

  // Helpers
  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const formatCurrency = (n) =>
    `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  // Pagination range helper
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  // Loading
  if (loading && orders.length === 0) {
    return (
      <div className="px-4 sm:px-6 mt-4 flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-primary-500" />
        <span className="ml-3 text-slate-500">Đang tải đơn hàng...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 mt-4">
        <div className="glass rounded-2xl p-8 text-center">
          <AlertCircle size={40} className="mx-auto text-red-400 mb-3" />
          <p className="text-sm font-medium text-slate-600 mb-4">{error}</p>
          <button onClick={() => fetchOrders(1, statusFilter, searchQuery)} className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-semibold hover:bg-primary-600 transition-colors">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Calculate showing range
  const showFrom = totalOrders > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const showTo = Math.min(currentPage * ITEMS_PER_PAGE, totalOrders);

  return (
    <div className="px-4 sm:px-6 mt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Orders</h1>
          <p className="text-sm text-slate-400 mt-1">
            Track and manage all customer orders
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <SummaryCard icon={ClipboardList} title="Total Orders" value={totalAll} iconBg="bg-blue-50" iconColor="text-blue-600" />
        <SummaryCard icon={Clock} title="Pending / Awaiting" value={pendingOrders} iconBg="bg-amber-50" iconColor="text-amber-600" />
        <SummaryCard icon={CheckCircle2} title="Completed" value={completedOrders} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <SummaryCard icon={XCircle} title="Canceled" value={canceledOrders} iconBg="bg-red-50" iconColor="text-red-500" />
      </div>

      {/* Status Filter Tabs */}
      <div className="glass rounded-2xl p-3 mb-6 shadow-sm flex items-center gap-2 overflow-x-auto">
        {['All', ...statusFlow].map((s) => {
          const isActive = statusFilter === s;
          const count = statusCounts[s] || 0;
          return (
            <button
              key={s}
              onClick={() => handleStatusFilterChange(s)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/25'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {s} ({count})
            </button>
          );
        })}
        {searchQuery && (
          <p className="ml-auto text-sm text-slate-400 whitespace-nowrap">
            Searching: <span className="font-semibold text-slate-600">"{searchQuery}"</span>
          </p>
        )}
      </div>

      {/* Orders Table */}
      <div className="glass rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full" id="orders-table">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Date</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Payment</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <Loader2 size={28} className="mx-auto animate-spin text-primary-400 mb-2" />
                    <p className="text-sm text-slate-400">Loading...</p>
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order, idx) => {
                  const sc = statusConfig[order.status] || statusConfig.Pending;
                  const PayIcon = paymentIcons[order.paymentMethod] || CreditCard;
                  const customerName = order.user?.name || 'Unknown';
                  const customerEmail = order.user?.email || '';
                  const shortId = order._id?.slice(-6).toUpperCase();
                  const itemCount = order.products?.length || 0;

                  return (
                    <tr key={order._id} className={`table-row-hover ${idx % 2 === 1 ? 'bg-slate-50/50' : ''}`}>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-primary-600">#{shortId}</span>
                        <p className="text-xs text-slate-400 mt-0.5">{itemCount} item{itemCount > 1 ? 's' : ''}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-slate-700 truncate max-w-[160px]">{customerName}</p>
                        <p className="text-xs text-slate-400 truncate max-w-[160px] flex items-center gap-1">
                          <Mail size={10} /> {customerEmail}
                        </p>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className="text-sm text-slate-600">{formatDate(order.createdAt)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-slate-800">{formatCurrency(order.totalAmount)}</span>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                          <PayIcon size={14} className="text-slate-400" />
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ring-1 ring-inset ${sc.color}`}>
                          {patchingId === order._id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          )}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1 relative">
                          {/* View Details */}
                          <button
                            className="p-2 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-500 transition-colors"
                            title="View Details"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye size={16} />
                          </button>
                          {/* Status Update Dropdown */}
                          <div className="relative" data-status-dropdown>
                            <button
                              onClick={() => setUpdatingId(updatingId === order._id ? null : order._id)}
                              className="p-2 rounded-lg text-slate-400 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                              title="Update Status"
                            >
                              <ChevronDown size={16} />
                            </button>
                            {updatingId === order._id && (
                              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50">
                                {statusFlow.map((s) => {
                                  const cfg = statusConfig[s];
                                  return (
                                    <button
                                      key={s}
                                      onClick={() => updateOrderStatus(order._id, s)}
                                      className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 flex items-center gap-2 transition-colors ${
                                        order.status === s ? 'font-bold' : ''
                                      }`}
                                    >
                                      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                                      {s}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <ClipboardList size={40} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-sm font-medium text-slate-400">No orders found</p>
                    <p className="text-xs text-slate-300 mt-1">Try adjusting your search or filter</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination — Server-driven */}
        {totalOrders > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
            <p className="text-sm text-slate-400">
              Showing <span className="font-semibold text-slate-600">{showFrom}</span>–<span className="font-semibold text-slate-600">{showTo}</span> of <span className="font-semibold text-slate-600">{totalOrders}</span> orders
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>
              {getPageNumbers().map((num) => (
                <button
                  key={num}
                  onClick={() => handlePageChange(num)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    num === currentPage
                      ? 'bg-primary-500 text-white shadow-md shadow-primary-500/25'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}

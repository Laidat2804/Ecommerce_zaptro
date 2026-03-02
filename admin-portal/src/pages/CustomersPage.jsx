import { useState, useEffect } from 'react';
import {
  Search,
  Download,
  UserPlus,
  Users,
  UserCheck,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Mail,
  Loader2,
  AlertCircle,
  X,
  Calendar,
  Power,
  UserX,
  Save,
  Eye,
  Heart,
  ShoppingBag,
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useSearch } from '../context/SearchContext';

const API_URL = 'http://localhost:5000/api/users';
const ITEMS_PER_PAGE = 5;

const avatarGradients = [
  'from-pink-500 to-rose-500',
  'from-blue-500 to-cyan-500',
  'from-violet-500 to-purple-500',
  'from-amber-500 to-orange-500',
  'from-emerald-500 to-teal-500',
  'from-indigo-500 to-blue-500',
  'from-rose-500 to-pink-500',
  'from-sky-500 to-blue-500',
  'from-fuchsia-500 to-purple-500',
  'from-lime-500 to-green-500',
];

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

/* ── Reusable Modal Shell ── */
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 transition-colors">
            <X size={18} className="text-slate-400" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function CustomersPage() {
  const { token } = useAdminAuth();
  const { searchQuery } = useSearch();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null); // customer object or null
  const [deleteModal, setDeleteModal] = useState(null);
  const [detailModal, setDetailModal] = useState(null); // Customer details modal

  // Form states
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Toggle loading per-user
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  // ── Fetch ──
  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Không thể tải danh sách khách hàng');
      setCustomers(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  // ── Add Customer ──
  const openAddModal = () => {
    setFormData({ name: '', email: '', password: '' });
    setFormError('');
    setAddModal(true);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setFormError('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    setFormLoading(true);
    setFormError('');
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setAddModal(false);
      fetchCustomers();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  // ── Edit Customer ──
  const openEditModal = (customer) => {
    setFormData({ name: customer.name, email: customer.email, password: '' });
    setFormError('');
    setEditModal(customer);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setFormError('Name và Email là bắt buộc!');
      return;
    }
    setFormLoading(true);
    setFormError('');
    try {
      const res = await fetch(`${API_URL}/${editModal._id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ name: formData.name, email: formData.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setEditModal(null);
      fetchCustomers();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  // ── Delete ──
  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE', headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setDeleteModal(null);
      fetchCustomers();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // ── Toggle Status ──
  const handleToggleStatus = async (id) => {
    setTogglingId(id);
    try {
      const res = await fetch(`${API_URL}/${id}/status`, { method: 'PATCH', headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      // Cập nhật trực tiếp trên state — không cần re-fetch
      setCustomers((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: data.user.status } : c))
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setTogglingId(null);
    }
  };

  // ── Helpers ──
  const getInitials = (name) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Filter (dùng global search)
  const filtered = customers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus =
      statusFilter === 'All' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const page = Math.min(currentPage, totalPages);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleStatusFilter = (v) => { setStatusFilter(v); setCurrentPage(1); };

  // Reset page khi search thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // ── Summary ──
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === 'Active').length;
  const disabledCustomers = customers.filter((c) => c.status === 'Disabled').length;

  // ── Loading ──
  if (loading) {
    return (
      <div className="px-4 sm:px-6 mt-4 flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-primary-500" />
        <span className="ml-3 text-slate-500">Đang tải khách hàng...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 mt-4">
        <div className="glass rounded-2xl p-8 text-center">
          <AlertCircle size={40} className="mx-auto text-red-400 mb-3" />
          <p className="text-sm font-medium text-slate-600 mb-4">{error}</p>
          <button onClick={fetchCustomers} className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-semibold hover:bg-primary-600 transition-colors">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // ── Shared input class ──
  const inputCls = 'w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all';

  return (
    <div className="px-4 sm:px-6 mt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Customers</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your customer base and relationships</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors" id="export-csv-btn">
            <Download size={16} /> Export CSV
          </button>
          <button onClick={openAddModal} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:from-primary-600 hover:to-primary-700 transition-all active:scale-[0.98]" id="add-customer-btn">
            <UserPlus size={16} /> Add Customer
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <SummaryCard icon={Users} title="Total Customers" value={totalCustomers.toLocaleString()} iconBg="bg-blue-50" iconColor="text-blue-600" />
        <SummaryCard icon={UserCheck} title="Active" value={activeCustomers.toLocaleString()} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <SummaryCard icon={UserX} title="Disabled" value={disabledCustomers.toLocaleString()} iconBg="bg-red-50" iconColor="text-red-500" />
      </div>

      {/* Status Filter */}
      <div className="glass rounded-2xl p-4 mb-6 shadow-sm flex items-center gap-3">
        <select value={statusFilter} onChange={(e) => handleStatusFilter(e.target.value)} className={`${inputCls} cursor-pointer w-auto`} id="status-filter">
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Disabled">Disabled</option>
        </select>
        {searchQuery && (
          <p className="text-sm text-slate-400">
            Searching: <span className="font-semibold text-slate-600">"{searchQuery}"</span>
          </p>
        )}
      </div>

      {/* Table */}
      <div className="glass rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full" id="customers-table">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Joined</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paged.map((customer, idx) => {
                const status = customer.status || 'Active';
                const isActive = status === 'Active';
                return (
                  <tr key={customer._id} className={`table-row-hover ${idx % 2 === 1 ? 'bg-slate-50/50' : ''}`}>
                    {/* Avatar + Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarGradients[idx % avatarGradients.length]} flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm`}>
                          {getInitials(customer.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-700 truncate">{customer.name}</p>
                          <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                            <Mail size={11} /> {customer.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    {/* Date */}
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-sm text-slate-600">{formatDate(customer.createdAt)}</span>
                    </td>
                    {/* Status toggle */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(customer._id)}
                        disabled={togglingId === customer._id}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ring-1 ring-inset transition-all cursor-pointer disabled:opacity-50 ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-600 ring-emerald-500/20 hover:bg-emerald-100'
                            : 'bg-red-50 text-red-500 ring-red-500/20 hover:bg-red-100'
                        }`}
                        title={isActive ? 'Click để vô hiệu hóa' : 'Click để kích hoạt'}
                      >
                        {togglingId === customer._id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        )}
                        {status}
                      </button>
                    </td>
                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setDetailModal(customer)} className="p-2 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-500 transition-colors" title="View Details">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => openEditModal(customer)} className="p-2 rounded-lg text-slate-400 hover:bg-primary-50 hover:text-primary-600 transition-colors" title="Edit">
                          <Edit3 size={16} />
                        </button>
                        <button onClick={() => setDeleteModal(customer)} className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <Users size={40} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-sm font-medium text-slate-400">No customers found</p>
                    <p className="text-xs text-slate-300 mt-1">Try adjusting your search or filter</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
            <p className="text-sm text-slate-400">
              Showing <span className="font-semibold text-slate-600">{(page - 1) * ITEMS_PER_PAGE + 1}</span>–<span className="font-semibold text-slate-600">{Math.min(page * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="font-semibold text-slate-600">{filtered.length}</span> customers
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button key={num} onClick={() => setCurrentPage(num)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${num === page ? 'bg-primary-500 text-white shadow-md shadow-primary-500/25' : 'text-slate-500 hover:bg-slate-100'}`}>
                  {num}
                </button>
              ))}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ════ ADD MODAL ════ */}
      {addModal && (
        <Modal title="Add New Customer" onClose={() => setAddModal(false)}>
          <form onSubmit={handleAdd} className="p-6 space-y-4">
            {formError && (
              <div className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-2 rounded-xl text-sm">
                <AlertCircle size={14} /> {formError}
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Name *</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Customer name" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Email *</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="customer@email.com" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Password *</label>
              <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Min 6 characters" className={inputCls} />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setAddModal(false)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              <button type="submit" disabled={formLoading} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl text-sm font-semibold hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {formLoading ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />} Add
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ════ EDIT MODAL ════ */}
      {editModal && (
        <Modal title="Edit Customer" onClose={() => setEditModal(null)}>
          <form onSubmit={handleEdit} className="p-6 space-y-4">
            {formError && (
              <div className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-2 rounded-xl text-sm">
                <AlertCircle size={14} /> {formError}
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Name *</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Email *</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputCls} />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setEditModal(null)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              <button type="submit" disabled={formLoading} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl text-sm font-semibold hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {formLoading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ════ CUSTOMER DETAILS MODAL ════ */}
      {detailModal && (
        <Modal title="Customer Details" onClose={() => setDetailModal(null)}>
          <div className="p-6 space-y-5">
            {/* Customer Info */}
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${avatarGradients[0]} flex items-center justify-center text-white text-lg font-bold shadow-sm`}>
                {getInitials(detailModal.name)}
              </div>
              <div>
                <p className="text-base font-bold text-slate-800">{detailModal.name}</p>
                <p className="text-sm text-slate-400 flex items-center gap-1"><Mail size={12} /> {detailModal.email}</p>
                <p className="text-xs text-slate-400 mt-0.5"><Calendar size={10} className="inline mr-1" />Joined {formatDate(detailModal.createdAt)}</p>
              </div>
            </div>

            {/* Wishlist Section */}
            <div>
              <h4 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Heart size={14} className="text-red-400" /> Wishlist
              </h4>
              {detailModal.wishlist && detailModal.wishlist.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {detailModal.wishlist.map((item) => (
                    <div key={item._id} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                      <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 overflow-hidden shrink-0">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag size={16} className="text-slate-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">{item.name}</p>
                        <p className="text-xs text-primary-500 font-semibold">${item.price?.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">No items in wishlist</p>
              )}
            </div>

            <button onClick={() => setDetailModal(null)} className="w-full px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors">
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* ════ DELETE CONFIRM ════ */}
      {deleteModal && (
        <Modal title="Xác nhận xóa" onClose={() => setDeleteModal(null)}>
          <div className="p-6">
            <p className="text-sm text-slate-500 mb-6">
              Bạn có chắc muốn xóa khách hàng <span className="font-semibold text-slate-700">"{deleteModal.name}"</span>? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal(null)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Hủy</button>
              <button onClick={() => handleDelete(deleteModal._id)} disabled={deletingId === deleteModal._id} className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {deletingId === deleteModal._id && <Loader2 size={14} className="animate-spin" />} Xóa
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

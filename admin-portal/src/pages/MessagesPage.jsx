import { useState, useEffect } from 'react';
import {
  MessageSquare,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Mail,
  Calendar,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useSearch } from '../context/SearchContext';
import { API_BASE_URL } from '../utils/apiConfig';

const API_URL = `${API_BASE_URL}/messages`;
const ITEMS_PER_PAGE = 6;

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

/* ── Message Detail Modal ── */
function MessageModal({ message, onClose }) {
  if (!message) return null;
  const date = new Date(message.createdAt).toLocaleString('vi-VN');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">Message Details</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 transition-colors">
            <X size={18} className="text-slate-400" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {message.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <p className="text-base font-bold text-slate-800">{message.name}</p>
              <p className="text-sm text-slate-400 flex items-center gap-1"><Mail size={12} /> {message.email}</p>
            </div>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <Calendar size={12} /> {date}
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
            {message.message}
          </div>
          <button onClick={onClose} className="w-full px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function MessagesPage() {
  const { token } = useAdminAuth();
  const { searchQuery } = useSearch();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const headers = { Authorization: `Bearer ${token}` };

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL, { headers });
      if (!res.ok) throw new Error('Không thể tải danh sách tin nhắn');
      setMessages(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  // Mark as read + open modal
  const handleView = async (msg) => {
    setSelectedMsg(msg);
    if (!msg.isRead) {
      try {
        await fetch(`${API_URL}/${msg._id}/read`, { method: 'PUT', headers });
        setMessages((prev) =>
          prev.map((m) => (m._id === msg._id ? { ...m, isRead: true } : m))
        );
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa tin nhắn này?')) return;
    setDeletingId(id);
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE', headers });
      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      alert('Lỗi khi xóa tin nhắn');
    } finally {
      setDeletingId(null);
    }
  };

  // Filter
  const filtered = messages.filter((m) => {
    const q = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const page = Math.min(currentPage, totalPages);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => { setCurrentPage(1); }, [searchQuery]);

  // Metrics
  const totalMessages = messages.length;
  const unreadMessages = messages.filter((m) => !m.isRead).length;
  const readMessages = messages.filter((m) => m.isRead).length;

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (loading) {
    return (
      <div className="px-4 sm:px-6 mt-4 flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-primary-500" />
        <span className="ml-3 text-slate-500">Đang tải tin nhắn...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 mt-4">
        <div className="glass rounded-2xl p-8 text-center">
          <AlertCircle size={40} className="mx-auto text-red-400 mb-3" />
          <p className="text-sm font-medium text-slate-600 mb-4">{error}</p>
          <button onClick={fetchMessages} className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-semibold hover:bg-primary-600 transition-colors">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 mt-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Messages</h1>
        <p className="text-sm text-slate-400 mt-1">Customer feedback and inquiries</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <SummaryCard icon={MessageSquare} title="Total Messages" value={totalMessages} iconBg="bg-blue-50" iconColor="text-blue-600" />
        <SummaryCard icon={Mail} title="Unread" value={unreadMessages} iconBg="bg-amber-50" iconColor="text-amber-600" />
        <SummaryCard icon={CheckCircle2} title="Read" value={readMessages} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
      </div>

      {/* Table */}
      <div className="glass rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full" id="messages-table">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Name</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Message</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Date</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paged.map((msg, idx) => (
                <tr key={msg._id} className={`table-row-hover ${idx % 2 === 1 ? 'bg-slate-50/50' : ''} ${!msg.isRead ? 'bg-blue-50/30' : ''}`}>
                  <td className="px-5 py-4">
                    <p className={`text-sm ${!msg.isRead ? 'font-bold text-slate-800' : 'font-medium text-slate-600'} truncate max-w-[140px]`}>{msg.name}</p>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <p className="text-sm text-slate-500 truncate max-w-[180px]">{msg.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-slate-500 truncate max-w-[200px]">{msg.message}</p>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className="text-sm text-slate-500">{formatDate(msg.createdAt)}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ring-1 ring-inset ${
                      msg.isRead
                        ? 'bg-slate-50 text-slate-500 ring-slate-200'
                        : 'bg-red-50 text-red-600 ring-red-500/20'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${msg.isRead ? 'bg-slate-400' : 'bg-red-500'}`} />
                      {msg.isRead ? 'Read' : 'Unread'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleView(msg)} className="p-2 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-500 transition-colors" title="View">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => handleDelete(msg._id)} disabled={deletingId === msg._id} className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-40" title="Delete">
                        {deletingId === msg._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <MessageSquare size={40} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-sm font-medium text-slate-400">No messages found</p>
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
              Showing <span className="font-semibold text-slate-600">{(page - 1) * ITEMS_PER_PAGE + 1}</span>–<span className="font-semibold text-slate-600">{Math.min(page * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="font-semibold text-slate-600">{filtered.length}</span>
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

      {/* Modal */}
      {selectedMsg && <MessageModal message={selectedMsg} onClose={() => setSelectedMsg(null)} />}
    </div>
  );
}

import { MoreHorizontal, ArrowUpRight, ClipboardList } from 'lucide-react';

const statusStyles = {
  Delivered: 'bg-emerald-50 text-emerald-600 ring-emerald-500/20',
  Processing: 'bg-blue-50 text-blue-600 ring-blue-500/20',
  Pending: 'bg-amber-50 text-amber-600 ring-amber-500/20',
  Shipped: 'bg-indigo-50 text-indigo-600 ring-indigo-500/20',
  Canceled: 'bg-red-50 text-red-500 ring-red-500/20',
  Cancelled: 'bg-red-50 text-red-500 ring-red-500/20',
};

const avatarGradients = [
  'from-pink-500 to-rose-500',
  'from-blue-500 to-cyan-500',
  'from-violet-500 to-purple-500',
  'from-amber-500 to-orange-500',
  'from-emerald-500 to-teal-500',
  'from-indigo-500 to-blue-500',
];

export default function RecentOrders({ orders = [] }) {
  const getInitials = (name) =>
    name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '??';

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const formatCurrency = (n) =>
    `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  return (
    <div className="glass rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Recent Orders</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Latest transactions from your store
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full" id="recent-orders-table">
          <thead>
            <tr className="text-left border-b border-slate-100">
              <th className="px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell">
                Date
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders.length > 0 ? (
              orders.map((order, idx) => {
                const customerName = order.user?.name || 'Unknown';
                return (
                  <tr key={order._id} className="table-row-hover">
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-primary-600">
                        #{order._id?.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg bg-gradient-to-br ${avatarGradients[idx % avatarGradients.length]} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                        >
                          {getInitials(customerName)}
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                          {customerName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-sm text-slate-500">{formatDate(order.createdAt)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-slate-800">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ring-1 ring-inset ${
                          statusStyles[order.status] || statusStyles.Pending
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <ClipboardList size={36} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-sm text-slate-400">No recent orders yet</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

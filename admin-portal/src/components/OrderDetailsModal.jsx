import { X, Package, MapPin, CreditCard, Calendar, User, Mail, Phone, ShoppingBag } from 'lucide-react';

const statusConfig = {
  Pending:            { color: 'bg-amber-50 text-amber-600 ring-amber-500/20', dot: 'bg-amber-500' },
  'Awaiting Pickup':  { color: 'bg-orange-50 text-orange-600 ring-orange-500/20', dot: 'bg-orange-500' },
  'Out for Delivery': { color: 'bg-blue-50 text-blue-600 ring-blue-500/20', dot: 'bg-blue-500' },
  Delivered:          { color: 'bg-emerald-50 text-emerald-600 ring-emerald-500/20', dot: 'bg-emerald-500' },
  Canceled:           { color: 'bg-red-50 text-red-500 ring-red-500/20', dot: 'bg-red-500' },
};

export default function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;

  const sc = statusConfig[order.status] || statusConfig.Pending;
  const shortId = order._id?.slice(-8).toUpperCase();
  const customerName = order.user?.name || 'Unknown';
  const customerEmail = order.user?.email || '—';
  const address = order.shippingAddress || {};
  const items = order.products || [];

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const formatCurrency = (n) =>
    `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 5;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl z-10">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
              <Package size={20} className="text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Order #{shortId}</h2>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-semibold ring-1 ring-inset ${sc.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                {order.status}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Customer & Payment Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Customer */}
            <div className="glass rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Customer</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User size={14} className="text-slate-400" />
                  <span className="font-medium text-slate-700">{customerName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={14} className="text-slate-400" />
                  <span className="text-slate-600">{customerEmail}</span>
                </div>
              </div>
            </div>

            {/* Payment & Date */}
            <div className="glass rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Payment</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard size={14} className="text-slate-400" />
                  <span className="font-medium text-slate-700">{order.paymentMethod || 'COD'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={14} className="text-slate-400" />
                  <span className="text-slate-600">{formatDate(order.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {(address.street || address.city) && (
            <div className="glass rounded-xl p-4 space-y-2">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <MapPin size={14} /> Shipping Address
              </h3>
              <p className="text-sm text-slate-700">
                {[address.street, address.city, address.state, address.zip, address.country].filter(Boolean).join(', ')}
              </p>
            </div>
          )}

          {/* Items */}
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
              Items ({items.length})
            </h3>
            <div className="space-y-3">
              {items.map((item, idx) => {
                const name = item.name || item.product?.name || 'Product';
                const image = item.image || item.product?.imageUrl;
                return (
                  <div key={idx} className="flex items-center gap-4 glass rounded-xl p-3">
                    <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                      {image ? (
                        <img src={image} alt={name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag size={20} className="text-slate-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700 truncate">{name}</p>
                      <p className="text-xs text-slate-400">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                    </div>
                    <span className="text-sm font-bold text-slate-800 shrink-0">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="glass rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm text-slate-500">
              <span>Subtotal</span>
              <span className="font-medium text-slate-700">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-500">
              <span>Shipping</span>
              <span className="font-medium text-slate-700">{formatCurrency(shipping)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-slate-800 pt-2 border-t border-slate-200">
              <span>Total</span>
              <span className="text-primary-600">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex justify-end rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

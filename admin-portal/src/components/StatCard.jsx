import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ icon: Icon, title, value, change, iconBg, iconColor }) {
  const isPositive = change >= 0;

  return (
    <div className="glass card-hover rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}
        >
          <Icon size={22} className={iconColor} strokeWidth={2} />
        </div>
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
            isPositive
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-red-50 text-red-500'
          }`}
        >
          {isPositive ? (
            <TrendingUp size={14} />
          ) : (
            <TrendingDown size={14} />
          )}
          {isPositive ? '+' : ''}{change}%
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-slate-800 tracking-tight">
          {value}
        </p>
      </div>

      <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${
            isPositive
              ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
              : 'bg-gradient-to-r from-red-400 to-red-500'
          }`}
          style={{ width: `${Math.min(Math.abs(change) * 5, 100)}%` }}
        />
      </div>
    </div>
  );
}

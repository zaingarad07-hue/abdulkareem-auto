import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Package, AlertTriangle, ClipboardList, TrendingUp, ArrowRight } from 'lucide-react';
import { supabase, type OrderRow } from '../../lib/supabase';

type Stats = {
  totalProducts: number;
  outOfStock: number;
  pendingOrders: number;
  monthRevenue: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const [products, oos, pending, monthOrders, recentOrders] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase
          .from('products')
          .select('id', { count: 'exact', head: true })
          .eq('is_active', true)
          .eq('pricing_mode', 'fixed')
          .eq('stock', 0),
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase
          .from('orders')
          .select('total_aed')
          .gte('created_at', monthStart.toISOString())
          .in('status', ['confirmed', 'shipped', 'completed']),
        supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      if (cancelled) return;

      const revenue =
        (monthOrders.data as { total_aed: number }[] | null)?.reduce(
          (sum, o) => sum + Number(o.total_aed),
          0
        ) ?? 0;

      setStats({
        totalProducts: products.count ?? 0,
        outOfStock: oos.count ?? 0,
        pendingOrders: pending.count ?? 0,
        monthRevenue: revenue,
      });
      setRecent((recentOrders.data as OrderRow[] | null) ?? []);
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="font-arabic text-sm text-text-secondary">لوحة التحكم</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Package}
          label="PRODUCTS"
          labelAr="منتجات"
          value={loading ? '—' : String(stats!.totalProducts)}
          to="/admin/products"
        />
        <StatCard
          icon={AlertTriangle}
          label="OUT OF STOCK"
          labelAr="نفد المخزون"
          value={loading ? '—' : String(stats!.outOfStock)}
          to="/admin/products"
          accent={stats && stats.outOfStock > 0 ? 'warning' : 'default'}
        />
        <StatCard
          icon={ClipboardList}
          label="PENDING ORDERS"
          labelAr="طلبات معلّقة"
          value={loading ? '—' : String(stats!.pendingOrders)}
          to="/admin/orders"
          accent={stats && stats.pendingOrders > 0 ? 'highlight' : 'default'}
        />
        <StatCard
          icon={TrendingUp}
          label="MONTH REVENUE"
          labelAr="إيرادات الشهر"
          value={loading ? '—' : `${stats!.monthRevenue.toLocaleString()} AED`}
        />
      </div>

      <div
        className="rounded-2xl p-6"
        style={{
          background: 'rgba(11, 14, 26, 0.6)',
          border: '1px solid rgba(244, 246, 255, 0.08)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-base font-bold text-text-primary tracking-wider">
            RECENT ORDERS
          </h2>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1 text-cyan text-xs hover:underline"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="text-text-secondary text-sm text-center py-8">
            No orders yet · لا توجد طلبات بعد
          </p>
        ) : (
          <ul className="divide-y divide-white/5">
            {recent.map((o) => (
              <li key={o.id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <Link
                    to="/admin/orders"
                    className="font-display text-sm font-bold text-text-primary hover:text-cyan"
                  >
                    #{o.order_number}
                  </Link>
                  <p className="text-xs text-text-secondary truncate">
                    {o.customer_name} · {o.customer_phone}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-display text-sm font-bold text-cyan">
                    {Number(o.total_aed).toLocaleString()} AED
                  </p>
                  <StatusBadge status={o.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  labelAr,
  value,
  to,
  accent = 'default',
}: {
  icon: React.ElementType;
  label: string;
  labelAr: string;
  value: string;
  to?: string;
  accent?: 'default' | 'warning' | 'highlight';
}) {
  const accentClass =
    accent === 'warning'
      ? 'text-orange-400 border-orange-400/30 bg-orange-400/5'
      : accent === 'highlight'
      ? 'text-cyan border-cyan/30 bg-cyan/5'
      : 'text-text-primary border-white/10';

  const body = (
    <div
      className={`p-5 rounded-xl ${accentClass}`}
      style={{
        background: 'rgba(11, 14, 26, 0.6)',
        border: '1px solid rgba(244, 246, 255, 0.08)',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <Icon className="w-5 h-5" />
      </div>
      <p className="font-mono-label text-[10px] text-text-secondary mb-1">{label}</p>
      <p className="font-display text-xl font-bold">{value}</p>
      <p className="font-arabic text-xs text-text-secondary/70 mt-1">{labelAr}</p>
    </div>
  );

  return to ? (
    <Link to={to} className="block hover:scale-[1.02] transition">
      {body}
    </Link>
  ) : (
    body
  );
}

function StatusBadge({ status }: { status: OrderRow['status'] }) {
  const colors: Record<OrderRow['status'], string> = {
    pending: 'text-orange-300 bg-orange-400/10',
    confirmed: 'text-cyan bg-cyan/10',
    shipped: 'text-blue-300 bg-blue-400/10',
    completed: 'text-green-300 bg-green-400/10',
    cancelled: 'text-red-300 bg-red-400/10',
  };
  return (
    <span
      className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-mono-label tracking-wider ${colors[status]}`}
    >
      {status.toUpperCase()}
    </span>
  );
}

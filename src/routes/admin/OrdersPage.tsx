import { useEffect, useState } from 'react';
import { Loader2, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase, type OrderRow } from '../../lib/supabase';

const STATUSES: OrderRow['status'][] = ['pending', 'confirmed', 'shipped', 'completed', 'cancelled'];

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderRow['status'] | 'all'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    setOrders((data as OrderRow[] | null) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const changeStatus = async (order: OrderRow, next: OrderRow['status']) => {
    if (order.status === next) return;
    setError(null);
    setUpdating(order.id);

    let rpcErr: { message: string } | null = null;

    if (order.status === 'pending' && next === 'confirmed') {
      const { error: e } = await supabase.rpc('confirm_order', { p_order_id: order.id });
      rpcErr = e;
    } else if (order.status === 'confirmed' && next === 'cancelled') {
      const { error: e } = await supabase.rpc('cancel_confirmed_order', { p_order_id: order.id });
      rpcErr = e;
    } else {
      const { error: e } = await supabase
        .from('orders')
        .update({ status: next })
        .eq('id', order.id);
      rpcErr = e;
    }

    if (rpcErr) {
      setError(rpcErr.message);
    } else {
      await load();
    }
    setUpdating(null);
  };

  const counts = STATUSES.reduce<Record<string, number>>((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-text-primary">Orders</h1>
        <p className="font-arabic text-sm text-text-secondary">الطلبات</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <FilterChip
          label={`ALL (${orders.length})`}
          active={filter === 'all'}
          onClick={() => setFilter('all')}
        />
        {STATUSES.map((s) => (
          <FilterChip
            key={s}
            label={`${s.toUpperCase()} (${counts[s] ?? 0})`}
            active={filter === s}
            onClick={() => setFilter(s)}
          />
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
          {error}
        </div>
      )}

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(11, 14, 26, 0.6)',
          border: '1px solid rgba(244, 246, 255, 0.08)',
        }}
      >
        {loading ? (
          <div className="p-12 flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-cyan animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-text-secondary text-sm">No orders</div>
        ) : (
          <ul className="divide-y divide-white/5">
            {filtered.map((o) => {
              const isOpen = expanded === o.id;
              const phoneDigits = o.customer_phone.replace(/\D/g, '');
              return (
                <li key={o.id}>
                  <button
                    onClick={() => setExpanded(isOpen ? null : o.id)}
                    className="w-full p-4 flex items-center justify-between gap-4 text-left hover:bg-white/[0.02] transition"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="font-display text-sm font-bold text-cyan flex-shrink-0">
                        #{o.order_number}
                      </span>
                      <div className="min-w-0">
                        <p className="text-text-primary text-sm truncate">{o.customer_name}</p>
                        <p className="text-text-secondary text-xs truncate">{o.customer_phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="font-display text-sm font-bold text-text-primary">
                        {Number(o.total_aed).toLocaleString()}
                      </span>
                      <StatusBadge status={o.status} />
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-text-secondary" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-text-secondary" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <Detail label="Customer" value={o.customer_name} />
                        <Detail label="Phone" value={o.customer_phone} />
                        {o.customer_address && (
                          <Detail label="Address" value={o.customer_address} />
                        )}
                        <Detail
                          label="Date"
                          value={new Date(o.created_at).toLocaleString('en-GB')}
                        />
                        {o.notes && <Detail label="Notes" value={o.notes} />}
                      </div>

                      <div>
                        <p className="font-mono-label text-[10px] text-text-secondary mb-2">
                          ITEMS
                        </p>
                        <ul className="space-y-1.5">
                          {o.items.map((it, idx) => (
                            <li
                              key={idx}
                              className="flex items-center justify-between text-sm py-1"
                            >
                              <span className="text-text-primary">
                                {it.product_name_en} <span className="text-text-secondary">×{it.qty}</span>
                              </span>
                              <span className="text-cyan font-display">
                                {(it.price_at_order * it.qty).toLocaleString()} AED
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        <span className="font-mono-label text-[10px] text-text-secondary mr-2">
                          UPDATE STATUS:
                        </span>
                        {STATUSES.map((s) => (
                          <button
                            key={s}
                            onClick={() => changeStatus(o, s)}
                            disabled={updating === o.id || s === o.status}
                            className={`px-3 py-1 rounded-full text-[10px] font-mono-label tracking-wider transition ${
                              s === o.status
                                ? 'bg-cyan/15 text-cyan border border-cyan/30'
                                : 'text-text-secondary border border-white/10 hover:bg-white/5'
                            } disabled:opacity-50`}
                          >
                            {updating === o.id && s !== o.status ? '...' : s.toUpperCase()}
                          </button>
                        ))}
                        <a
                          href={`https://wa.me/${phoneDigits}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30 hover:bg-[#25D366]/25 transition"
                        >
                          <MessageCircle className="w-3 h-3" />
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-[10px] font-mono-label tracking-wider transition"
      style={{
        background: active ? 'rgba(53, 184, 255, 0.15)' : 'rgba(244, 246, 255, 0.04)',
        border: active ? '1px solid rgba(53, 184, 255, 0.4)' : '1px solid rgba(244, 246, 255, 0.1)',
        color: active ? '#35B8FF' : '#A7A9B5',
      }}
    >
      {label}
    </button>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono-label text-[10px] text-text-secondary">{label}</p>
      <p className="text-text-primary">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: OrderRow['status'] }) {
  const colors: Record<OrderRow['status'], string> = {
    pending: 'text-orange-300 bg-orange-400/10 border-orange-400/30',
    confirmed: 'text-cyan bg-cyan/10 border-cyan/30',
    shipped: 'text-blue-300 bg-blue-400/10 border-blue-400/30',
    completed: 'text-green-300 bg-green-400/10 border-green-400/30',
    cancelled: 'text-red-300 bg-red-400/10 border-red-400/30',
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-mono-label tracking-wider border ${colors[status]}`}
    >
      {status.toUpperCase()}
    </span>
  );
}

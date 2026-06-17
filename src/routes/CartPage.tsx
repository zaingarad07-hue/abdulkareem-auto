import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  MessageCircle,
  Loader2,
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { supabase, supabaseConfigured } from '../lib/supabase';
import { BUSINESS } from '../config';

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', address: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-dark-bg flex items-center justify-center">
        <div className="text-center px-6">
          <div className="w-20 h-20 rounded-full bg-cyan/10 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-9 h-9 text-cyan" />
          </div>
          <h1 className="font-display text-2xl font-bold text-text-primary mb-2">
            Your Cart Is Empty
          </h1>
          <p className="font-arabic text-text-secondary mb-8">سلتك فارغة</p>
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const orderItems = items.map((i) => ({
      product_id: i.product_id,
      product_name_en: i.name_en,
      product_name_ar: i.name_ar,
      qty: i.qty,
      price_at_order: i.price_aed,
    }));

    let orderNumber: number | null = null;

    if (supabaseConfigured) {
      const { data, error: insertErr } = await supabase
        .from('orders')
        .insert({
          customer_name: form.name,
          customer_phone: form.phone,
          customer_address: form.address || null,
          items: orderItems,
          total_aed: subtotal,
          notes: form.notes || null,
          status: 'pending',
        })
        .select('order_number')
        .single();

      if (insertErr) {
        setError(insertErr.message);
        setSubmitting(false);
        return;
      }
      orderNumber = (data as { order_number: number } | null)?.order_number ?? null;
    }

    const lines = items.map(
      (i) =>
        `• ${i.name_ar} (×${i.qty}) — ${(i.price_aed * i.qty).toLocaleString()} درهم`
    );

    const message =
      `مرحباً عبد الكريم 👋\n` +
      (orderNumber ? `طلبية جديدة من الموقع #${orderNumber}\n\n` : `طلبية جديدة من الموقع\n\n`) +
      lines.join('\n') +
      `\n─────────────\n` +
      `المجموع: ${subtotal.toLocaleString()} درهم\n\n` +
      `الاسم: ${form.name}\n` +
      `الجوال: ${form.phone}` +
      (form.address ? `\nالعنوان: ${form.address}` : '') +
      (form.notes ? `\nملاحظات: ${form.notes}` : '');

    const url = `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');

    clear();
    setSubmitting(false);
    navigate('/shop');
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-dark-bg">
      <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-8">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-cyan transition mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping · متابعة التسوّق
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl sm:text-4xl font-bold text-text-primary mb-2"
        >
          Your Cart
        </motion.h1>
        <p className="font-arabic text-text-secondary mb-10">سلتك</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ul className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <li
                key={item.product_id}
                className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl"
                style={{
                  background: 'rgba(11, 14, 26, 0.6)',
                  border: '1px solid rgba(244, 246, 255, 0.08)',
                }}
              >
                <Link
                  to={`/shop/${item.slug}`}
                  className="w-full sm:w-28 h-28 rounded-lg overflow-hidden bg-dark-bg flex-shrink-0"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name_en}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </Link>

                <div className="flex-1 min-w-0">
                  <Link
                    to={`/shop/${item.slug}`}
                    className="font-display font-bold text-text-primary hover:text-cyan transition"
                  >
                    {item.name_en}
                  </Link>
                  <p className="font-arabic text-sm text-cyan/70 mb-2">{item.name_ar}</p>
                  <p className="text-text-secondary text-sm">
                    {item.price_aed.toLocaleString()} AED
                  </p>
                </div>

                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3">
                  <div
                    className="inline-flex items-center rounded-lg overflow-hidden"
                    style={{ border: '1px solid rgba(244, 246, 255, 0.15)' }}
                  >
                    <button
                      onClick={() => updateQty(item.product_id, item.qty - 1)}
                      aria-label="Decrease"
                      className="w-8 h-8 flex items-center justify-center text-text-primary hover:bg-white/5"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-text-primary">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.product_id, item.qty + 1)}
                      disabled={item.qty >= item.stock}
                      aria-label="Increase"
                      className="w-8 h-8 flex items-center justify-center text-text-primary hover:bg-white/5 disabled:opacity-30"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="font-display font-bold text-cyan">
                    {(item.price_aed * item.qty).toLocaleString()} AED
                  </span>
                  <button
                    onClick={() => removeItem(item.product_id)}
                    aria-label="Remove"
                    className="text-text-secondary/60 hover:text-red-400 transition p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <form
            onSubmit={handleSubmit}
            className="lg:sticky lg:top-24 self-start space-y-4 p-6 rounded-2xl"
            style={{
              background: 'rgba(11, 14, 26, 0.7)',
              border: '1px solid rgba(244, 246, 255, 0.1)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <h2 className="font-display text-lg font-bold text-text-primary">
              Order Details
              <span className="font-arabic text-sm text-text-secondary font-normal block">
                تفاصيل الطلب
              </span>
            </h2>

            <Field
              label="NAME / الاسم"
              name="name"
              required
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
            />
            <Field
              label="PHONE / الجوال"
              name="phone"
              type="tel"
              required
              placeholder="+971 5X XXX XXXX"
              value={form.phone}
              onChange={(v) => setForm({ ...form, phone: v })}
            />
            <Field
              label="ADDRESS / العنوان (اختياري)"
              name="address"
              value={form.address}
              onChange={(v) => setForm({ ...form, address: v })}
            />
            <div>
              <label className="font-mono-label text-[10px] text-text-secondary mb-2 block">
                NOTES / ملاحظات
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-white/10 text-text-primary text-sm focus:border-cyan/50 focus:outline-none resize-none"
              />
            </div>

            <div
              className="pt-4 space-y-2"
              style={{ borderTop: '1px solid rgba(244, 246, 255, 0.08)' }}
            >
              <div className="flex justify-between text-sm text-text-secondary">
                <span>Subtotal</span>
                <span>{subtotal.toLocaleString()} AED</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="font-display font-bold text-text-primary">TOTAL</span>
                <span className="font-display text-xl font-bold text-cyan">
                  {subtotal.toLocaleString()} AED
                </span>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full font-display text-sm tracking-wider uppercase font-bold text-white transition-all disabled:opacity-70"
              style={{
                background: 'linear-gradient(135deg, #25D366 0%, #1da851 100%)',
                boxShadow: '0 4px 20px rgba(37, 211, 102, 0.3)',
              }}
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <MessageCircle className="w-4 h-4" />
                  Complete Order on WhatsApp
                </>
              )}
            </button>
            <p className="font-arabic text-xs text-text-secondary/70 text-center">
              سنرسل تفاصيل طلبك إلى واتساب عبد الكريم لتأكيد التوفر والتركيب.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="font-mono-label text-[10px] text-text-secondary mb-2 block">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-white/10 text-text-primary text-sm focus:border-cyan/50 focus:outline-none"
      />
    </div>
  );
}

import { useState } from 'react';
import { X, Upload, Trash2, Loader2 } from 'lucide-react';
import { supabase, type CategoryRow, type ProductRow } from '../../lib/supabase';

const PRODUCT_TYPES = ['DRL', 'Headlights', 'Taillights', 'Interior', 'Accessories'];

type Props = {
  product: ProductRow | null;
  categories: CategoryRow[];
  onClose: (refresh: boolean) => void;
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || `product-${Date.now()}`;
}

export default function ProductForm({ product, categories, onClose }: Props) {
  const [form, setForm] = useState({
    name_en: product?.name_en ?? '',
    name_ar: product?.name_ar ?? '',
    description_en: product?.description_en ?? '',
    description_ar: product?.description_ar ?? '',
    price_aed: product?.price_aed?.toString() ?? '',
    stock: product?.stock?.toString() ?? '0',
    category_id: product?.category_id ?? '',
    product_type: product?.product_type ?? '',
    compatible_models: product?.compatible_models ?? '',
    is_featured: product?.is_featured ?? false,
    is_active: product?.is_active ?? true,
  });
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split('.').pop() ?? 'jpg';
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from('product-images')
          .upload(path, file, { cacheControl: '31536000', upsert: false });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from('product-images').getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
      setImages((prev) => [...prev, ...uploaded]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = {
      slug: product?.slug ?? slugify(form.name_en),
      name_en: form.name_en,
      name_ar: form.name_ar,
      description_en: form.description_en || null,
      description_ar: form.description_ar || null,
      price_aed: Number(form.price_aed) || 0,
      stock: Number(form.stock) || 0,
      category_id: form.category_id || null,
      product_type: form.product_type || null,
      compatible_models: form.compatible_models || null,
      images,
      is_featured: form.is_featured,
      is_active: form.is_active,
    };

    const op = product
      ? supabase.from('products').update(payload).eq('id', product.id)
      : supabase.from('products').insert(payload);

    const { error: opErr } = await op;
    if (opErr) {
      setError(opErr.message);
      setSaving(false);
      return;
    }
    setSaving(false);
    onClose(true);
  };

  return (
    <div className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl my-8 rounded-2xl"
        style={{
          background: 'rgba(11, 14, 26, 0.95)',
          border: '1px solid rgba(244, 246, 255, 0.1)',
        }}
      >
        <header
          className="flex items-center justify-between p-5"
          style={{ borderBottom: '1px solid rgba(244,246,255,0.08)' }}
        >
          <h2 className="font-display text-lg font-bold text-text-primary">
            {product ? 'Edit Product' : 'Add Product'}
          </h2>
          <button
            type="button"
            onClick={() => onClose(false)}
            className="w-9 h-9 rounded-full hover:bg-white/5 flex items-center justify-center"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </header>

        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="NAME (English)"
              required
              value={form.name_en}
              onChange={(v) => setForm({ ...form, name_en: v })}
            />
            <Field
              label="الاسم (Arabic)"
              required
              value={form.name_ar}
              onChange={(v) => setForm({ ...form, name_ar: v })}
              rtl
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextArea
              label="DESCRIPTION (English)"
              value={form.description_en}
              onChange={(v) => setForm({ ...form, description_en: v })}
            />
            <TextArea
              label="الوصف (Arabic)"
              value={form.description_ar}
              onChange={(v) => setForm({ ...form, description_ar: v })}
              rtl
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Field
              label="PRICE (AED)"
              required
              type="number"
              value={form.price_aed}
              onChange={(v) => setForm({ ...form, price_aed: v })}
            />
            <Field
              label="STOCK"
              required
              type="number"
              value={form.stock}
              onChange={(v) => setForm({ ...form, stock: v })}
            />
            <Select
              label="BRAND"
              value={form.category_id}
              onChange={(v) => setForm({ ...form, category_id: v })}
              options={[
                { value: '', label: '— None —' },
                ...categories.map((c) => ({ value: c.id, label: c.name_en })),
              ]}
            />
            <Select
              label="TYPE"
              value={form.product_type}
              onChange={(v) => setForm({ ...form, product_type: v })}
              options={[
                { value: '', label: '— None —' },
                ...PRODUCT_TYPES.map((t) => ({ value: t, label: t })),
              ]}
            />
          </div>

          <Field
            label="COMPATIBLE MODELS"
            placeholder="e.g., S-Class 2018-2024, E-Class 2020+"
            value={form.compatible_models}
            onChange={(v) => setForm({ ...form, compatible_models: v })}
          />

          <div>
            <label className="font-mono-label text-[10px] text-text-secondary mb-2 block">
              IMAGES
            </label>
            <div className="flex flex-wrap gap-3">
              {images.map((url, i) => (
                <div key={url} className="relative w-24 h-24 rounded-lg overflow-hidden group">
                  <img src={url} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <label
                className="w-24 h-24 rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer transition hover:border-cyan/40"
                style={{
                  background: 'rgba(244,246,255,0.03)',
                  border: '1px dashed rgba(244,246,255,0.2)',
                }}
              >
                {uploading ? (
                  <Loader2 className="w-5 h-5 text-cyan animate-spin" />
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-text-secondary" />
                    <span className="text-[10px] text-text-secondary">Upload</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-[10px] text-text-secondary mt-2">
              First image is used as the cover. JPG / PNG / WebP recommended.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Toggle
              label="Featured"
              checked={form.is_featured}
              onChange={(v) => setForm({ ...form, is_featured: v })}
            />
            <Toggle
              label="Live (visible in shop)"
              checked={form.is_active}
              onChange={(v) => setForm({ ...form, is_active: v })}
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
              {error}
            </div>
          )}
        </div>

        <footer
          className="flex items-center justify-end gap-3 p-5"
          style={{ borderTop: '1px solid rgba(244,246,255,0.08)' }}
        >
          <button
            type="button"
            onClick={() => onClose(false)}
            className="px-4 py-2 rounded-lg text-text-secondary hover:bg-white/5 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || uploading}
            className="btn-primary inline-flex items-center gap-2 disabled:opacity-70"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : product ? 'Save Changes' : 'Create Product'}
          </button>
        </footer>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
  placeholder,
  rtl,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  rtl?: boolean;
}) {
  return (
    <div>
      <label className="font-mono-label text-[10px] text-text-secondary mb-2 block">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        dir={rtl ? 'rtl' : 'ltr'}
        className={`w-full px-3 py-2 rounded-lg bg-dark-bg border border-white/10 text-text-primary text-sm focus:border-cyan/50 focus:outline-none ${
          rtl ? 'font-arabic' : ''
        }`}
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rtl,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rtl?: boolean;
}) {
  return (
    <div>
      <label className="font-mono-label text-[10px] text-text-secondary mb-2 block">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        dir={rtl ? 'rtl' : 'ltr'}
        className={`w-full px-3 py-2 rounded-lg bg-dark-bg border border-white/10 text-text-primary text-sm focus:border-cyan/50 focus:outline-none resize-none ${
          rtl ? 'font-arabic' : ''
        }`}
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="font-mono-label text-[10px] text-text-secondary mb-2 block">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-white/10 text-text-primary text-sm focus:border-cyan/50 focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <span
        className="w-9 h-5 rounded-full transition relative"
        style={{
          background: checked ? '#35B8FF' : 'rgba(244,246,255,0.15)',
        }}
      >
        <span
          className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform"
          style={{ transform: checked ? 'translateX(16px)' : 'translateX(0)' }}
        />
      </span>
      <span className="text-sm text-text-primary">{label}</span>
    </label>
  );
}

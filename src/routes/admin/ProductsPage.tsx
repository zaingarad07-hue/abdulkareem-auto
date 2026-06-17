import { useEffect, useState } from 'react';
import { Plus, Search, Pencil, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { supabase, type CategoryRow, type ProductRow } from '../../lib/supabase';
import ProductForm from '../../components/admin/ProductForm';

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('display_order'),
    ]);
    setProducts((prods as ProductRow[] | null) ?? []);
    setCategories((cats as CategoryRow[] | null) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = products.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.name_en.toLowerCase().includes(q) ||
      p.name_ar.includes(search.trim()) ||
      (p.slug.toLowerCase().includes(q))
    );
  });

  const handleDelete = async (id: string, hard: boolean) => {
    const confirmText = hard
      ? 'Permanently delete this product? This cannot be undone.'
      : 'Hide this product from the public shop?';
    if (!confirm(confirmText)) return;

    if (hard) {
      await supabase.from('products').delete().eq('id', id);
    } else {
      await supabase.from('products').update({ is_active: false }).eq('id', id);
    }
    load();
  };

  const handleToggleActive = async (p: ProductRow) => {
    await supabase.from('products').update({ is_active: !p.is_active }).eq('id', p.id);
    load();
  };

  const openCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (p: ProductRow) => {
    setEditing(p);
    setShowForm(true);
  };

  const closeForm = (refresh: boolean) => {
    setShowForm(false);
    setEditing(null);
    if (refresh) load();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Products</h1>
          <p className="font-arabic text-sm text-text-secondary">المنتجات</p>
        </div>
        <button onClick={openCreate} className="btn-primary inline-flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="mb-4 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input
          type="search"
          placeholder="Search by name or slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-text-primary text-sm focus:border-cyan/50 focus:outline-none"
        />
      </div>

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
          <div className="p-12 text-center text-text-secondary text-sm">
            {search ? 'No matches' : 'No products yet — add your first one'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="text-left font-mono-label text-[10px] text-text-secondary tracking-wider"
                  style={{ borderBottom: '1px solid rgba(244,246,255,0.08)' }}
                >
                  <th className="p-4">PRODUCT</th>
                  <th className="p-4">BRAND</th>
                  <th className="p-4">PRICE</th>
                  <th className="p-4">STOCK</th>
                  <th className="p-4">STATUS</th>
                  <th className="p-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const cat = categories.find((c) => c.id === p.category_id);
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-white/[0.02] transition"
                      style={{ borderBottom: '1px solid rgba(244,246,255,0.04)' }}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3 min-w-[200px]">
                          <div className="w-10 h-10 rounded-md bg-dark-bg overflow-hidden flex-shrink-0">
                            {p.images[0] ? (
                              <img
                                src={p.images[0]}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : null}
                          </div>
                          <div className="min-w-0">
                            <p className="text-text-primary font-medium truncate">
                              {p.name_en}
                            </p>
                            <p className="font-arabic text-xs text-text-secondary truncate">
                              {p.name_ar}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-text-secondary text-xs">
                        {cat?.name_en ?? '—'}
                      </td>
                      <td className="p-4 text-cyan font-display">
                        {Number(p.price_aed).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span
                          className={
                            p.stock === 0
                              ? 'text-red-400'
                              : p.stock <= 3
                              ? 'text-orange-400'
                              : 'text-text-primary'
                          }
                        >
                          {p.stock}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono-label tracking-wider ${
                            p.is_active
                              ? 'text-cyan bg-cyan/10'
                              : 'text-text-secondary bg-white/5'
                          }`}
                        >
                          {p.is_active ? 'LIVE' : 'HIDDEN'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleToggleActive(p)}
                            className="p-2 rounded hover:bg-white/5 text-text-secondary"
                            title={p.is_active ? 'Hide from shop' : 'Show in shop'}
                          >
                            {p.is_active ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => openEdit(p)}
                            className="p-2 rounded hover:bg-white/5 text-cyan"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, true)}
                            className="p-2 rounded hover:bg-red-500/10 text-red-400"
                            title="Delete permanently"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <ProductForm product={editing} categories={categories} onClose={closeForm} />
      )}
    </div>
  );
}

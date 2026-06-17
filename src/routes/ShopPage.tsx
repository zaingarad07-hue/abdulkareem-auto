import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { supabase, supabaseConfigured, type CategoryRow, type ProductRow } from '../lib/supabase';
import ProductCard from '../components/shop/ProductCard';

type SortKey = 'newest' | 'price-asc' | 'price-desc';

export default function ShopPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('brand') ?? 'all';
  const search = searchParams.get('q') ?? '';
  const sort = (searchParams.get('sort') as SortKey) ?? 'newest';
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);

      if (!supabaseConfigured) {
        setError('not-configured');
        setLoading(false);
        return;
      }

      const [{ data: prods, error: pErr }, { data: cats, error: cErr }] = await Promise.all([
        supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false }),
        supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('display_order'),
      ]);

      if (cancelled) return;

      if (pErr || cErr) {
        setError(pErr?.message ?? cErr?.message ?? 'Unknown error');
      } else {
        setProducts((prods as ProductRow[] | null) ?? []);
        setCategories((cats as CategoryRow[] | null) ?? []);
      }
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];

    if (activeCategory !== 'all') {
      const cat = categories.find((c) => c.slug === activeCategory);
      if (cat) list = list.filter((p) => p.category_id === cat.id);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name_en.toLowerCase().includes(q) ||
          p.name_ar.includes(search.trim()) ||
          (p.compatible_models?.toLowerCase().includes(q) ?? false)
      );
    }

    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.price_aed - b.price_aed);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price_aed - a.price_aed);
        break;
    }

    return list;
  }, [products, categories, activeCategory, search, sort]);

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value === null || value === '' || value === 'all') next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-dark-bg">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <span className="font-mono-label text-cyan block mb-3">SHOP</span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary">
            Premium Lighting
            <span className="text-cyan neon-text-glow"> Collection</span>
          </h1>
          <p className="font-arabic text-text-secondary mt-2">مجموعة الإضاءة المميزة</p>
        </motion.div>

        <div className="mb-8 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="search"
                placeholder="Search by name or model... / ابحث"
                value={search}
                onChange={(e) => setParam('q', e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-text-primary placeholder:text-text-secondary/50 focus:border-cyan/50 focus:outline-none focus:ring-1 focus:ring-cyan/30 transition"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setParam('sort', e.target.value)}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-text-primary focus:border-cyan/50 focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className="sm:hidden inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-text-primary"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Brands
            </button>
          </div>

          <div className={`${showFilters ? 'block' : 'hidden sm:block'}`}>
            <div className="flex flex-wrap gap-2">
              <BrandChip
                label="All Brands"
                labelAr="كل الماركات"
                active={activeCategory === 'all'}
                onClick={() => setParam('brand', null)}
              />
              {categories.map((c) => (
                <BrandChip
                  key={c.id}
                  label={c.name_en}
                  labelAr={c.name_ar}
                  active={activeCategory === c.slug}
                  onClick={() => setParam('brand', c.slug)}
                />
              ))}
            </div>
          </div>

          {(activeCategory !== 'all' || search) && (
            <button
              onClick={() => {
                setSearchParams({}, { replace: true });
              }}
              className="inline-flex items-center gap-1 text-cyan text-xs font-mono-label self-start"
            >
              <X className="w-3 h-3" />
              CLEAR FILTERS
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl bg-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : error === 'not-configured' ? (
          <EmptyState
            title="Shop coming soon"
            titleAr="المتجر قريباً"
            description="Our online shop is being set up. Please check back shortly or contact us on WhatsApp."
            descriptionAr="جاري إعداد المتجر الإلكتروني. تواصل معنا على واتساب للاستفسار."
          />
        ) : error ? (
          <EmptyState
            title="Couldn't load products"
            titleAr="تعذّر تحميل المنتجات"
            description={error}
            descriptionAr="حاول لاحقاً"
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No products found"
            titleAr="لا توجد منتجات"
            description="Try a different brand or search term."
            descriptionAr="جرّب ماركة أخرى أو كلمة بحث مختلفة."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BrandChip({
  label,
  labelAr,
  active,
  onClick,
}: {
  label: string;
  labelAr: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-full text-sm transition-all"
      style={{
        background: active ? 'rgba(53, 184, 255, 0.15)' : 'rgba(244, 246, 255, 0.04)',
        border: active
          ? '1px solid rgba(53, 184, 255, 0.5)'
          : '1px solid rgba(244, 246, 255, 0.1)',
        color: active ? '#35B8FF' : '#A7A9B5',
      }}
    >
      <span className="font-display tracking-wider text-xs">{label}</span>
      <span className="font-arabic text-xs opacity-70 ml-2">{labelAr}</span>
    </button>
  );
}

function EmptyState({
  title,
  titleAr,
  description,
  descriptionAr,
}: {
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
}) {
  return (
    <div className="py-20 text-center">
      <h3 className="font-display text-xl font-bold text-text-primary mb-2">{title}</h3>
      <p className="font-arabic text-cyan/70 mb-4">{titleAr}</p>
      <p className="text-text-secondary max-w-md mx-auto">{description}</p>
      <p className="font-arabic text-text-secondary/70 text-sm mt-2">{descriptionAr}</p>
    </div>
  );
}

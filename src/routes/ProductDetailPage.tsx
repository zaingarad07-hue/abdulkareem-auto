import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, Minus, Plus, ShoppingCart, MessageCircle, Tag, Car } from 'lucide-react';
import { supabase, supabaseConfigured, type CategoryRow, type ProductRow } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import { BUSINESS } from '../config';
import StockBadge from '../components/shop/StockBadge';
import ProductCard from '../components/shop/ProductCard';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addItem } = useCart();
  const [product, setProduct] = useState<ProductRow | null>(null);
  const [category, setCategory] = useState<CategoryRow | null>(null);
  const [related, setRelated] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      if (!supabaseConfigured || !slug) {
        setLoading(false);
        return;
      }
      const { data: prod } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (cancelled) return;
      if (!prod) {
        setProduct(null);
        setLoading(false);
        return;
      }

      const product = prod as ProductRow;
      setProduct(product);
      setActiveImage(0);
      setQty(1);

      const [{ data: cat }, { data: rel }] = await Promise.all([
        product.category_id
          ? supabase.from('categories').select('*').eq('id', product.category_id).maybeSingle()
          : Promise.resolve({ data: null }),
        product.category_id
          ? supabase
              .from('products')
              .select('*')
              .eq('is_active', true)
              .eq('category_id', product.category_id)
              .neq('id', product.id)
              .limit(4)
          : Promise.resolve({ data: [] }),
      ]);

      if (cancelled) return;
      setCategory((cat as CategoryRow | null) ?? null);
      setRelated((rel as ProductRow[] | null) ?? []);
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-dark-bg">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square rounded-2xl bg-white/5 animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 w-2/3 bg-white/5 rounded animate-pulse" />
              <div className="h-4 w-1/3 bg-white/5 rounded animate-pulse" />
              <div className="h-24 w-full bg-white/5 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-dark-bg flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="font-display text-2xl font-bold text-text-primary mb-2">
            Product Not Found
          </h1>
          <p className="font-arabic text-text-secondary mb-6">المنتج غير موجود</p>
          <Link to="/shop" className="btn-outline inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const isOut = product.stock === 0;
  const images = product.images.length > 0 ? product.images : [];

  const handleAddToCart = () => {
    if (isOut) return;
    addItem(
      {
        product_id: product.id,
        slug: product.slug,
        name_en: product.name_en,
        name_ar: product.name_ar,
        price_aed: product.price_aed,
        image: images[0] ?? null,
        stock: product.stock,
      },
      qty
    );
  };

  const handleOrderViaWhatsApp = () => {
    const text = encodeURIComponent(
      `مرحباً عبد الكريم 👋\n\n` +
      `أود الاستفسار عن المنتج:\n` +
      `${product.name_ar} (${product.name_en})\n` +
      `الكمية: ${qty}\n` +
      `السعر: ${(product.price_aed * qty).toLocaleString()} درهم`
    );
    window.open(
      `https://wa.me/${BUSINESS.whatsapp}?text=${text}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-dark-bg">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-8">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-cyan transition mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop · رجوع
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="relative aspect-square rounded-2xl overflow-hidden mb-4"
              style={{
                background: 'rgba(11, 14, 26, 0.6)',
                border: '1px solid rgba(244, 246, 255, 0.1)',
              }}
            >
              {images[activeImage] ? (
                <img
                  src={images[activeImage]}
                  alt={product.name_en}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-secondary/30 font-mono-label">
                  NO IMAGE AVAILABLE
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition"
                    style={{
                      border:
                        i === activeImage
                          ? '2px solid #35B8FF'
                          : '1px solid rgba(244, 246, 255, 0.1)',
                    }}
                  >
                    <img
                      src={img}
                      alt={`${product.name_en} view ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {category && (
              <Link
                to={`/shop?brand=${category.slug}`}
                className="inline-flex items-center gap-2 text-cyan text-xs font-mono-label tracking-wider mb-4 hover:underline"
              >
                <Car className="w-3 h-3" />
                {category.name_en} · {category.name_ar}
              </Link>
            )}

            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary mb-2">
              {product.name_en}
            </h1>
            <p className="font-arabic text-lg text-cyan/80 mb-6">{product.name_ar}</p>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="font-display text-3xl sm:text-4xl font-bold text-cyan">
                {product.price_aed.toLocaleString()}
                <span className="text-base text-text-secondary ml-2">AED</span>
              </span>
              <StockBadge stock={product.stock} />
            </div>

            {product.compatible_models && (
              <div
                className="flex items-start gap-3 p-4 rounded-xl mb-6"
                style={{
                  background: 'rgba(53, 184, 255, 0.05)',
                  border: '1px solid rgba(53, 184, 255, 0.15)',
                }}
              >
                <Tag className="w-4 h-4 text-cyan flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-mono-label text-[10px] text-cyan mb-1">
                    COMPATIBLE MODELS · موديلات متوافقة
                  </p>
                  <p className="text-sm text-text-primary">{product.compatible_models}</p>
                </div>
              </div>
            )}

            {(product.description_en || product.description_ar) && (
              <div className="mb-8 space-y-3">
                {product.description_en && (
                  <p className="text-text-secondary leading-relaxed">
                    {product.description_en}
                  </p>
                )}
                {product.description_ar && (
                  <p className="font-arabic text-text-secondary/80 leading-relaxed">
                    {product.description_ar}
                  </p>
                )}
              </div>
            )}

            {!isOut && (
              <div className="flex items-center gap-3 mb-6">
                <span className="font-mono-label text-xs text-text-secondary">QTY</span>
                <div
                  className="inline-flex items-center rounded-lg overflow-hidden"
                  style={{ border: '1px solid rgba(244, 246, 255, 0.15)' }}
                >
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease"
                    className="w-10 h-10 flex items-center justify-center text-text-primary hover:bg-white/5"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-display font-bold text-text-primary">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    disabled={qty >= product.stock}
                    aria-label="Increase"
                    className="w-10 h-10 flex items-center justify-center text-text-primary hover:bg-white/5 disabled:opacity-30"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOut}
                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
              <button
                onClick={handleOrderViaWhatsApp}
                className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-display text-sm tracking-wider uppercase font-bold text-white transition-all"
                style={{
                  background: 'linear-gradient(135deg, #25D366 0%, #1da851 100%)',
                  boxShadow: '0 4px 20px rgba(37, 211, 102, 0.3)',
                }}
              >
                <MessageCircle className="w-4 h-4" />
                Order via WhatsApp
              </button>
            </div>
          </motion.div>
        </div>

        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display text-2xl font-bold text-text-primary mb-2">
              Related Products
            </h2>
            <p className="font-arabic text-text-secondary mb-8">منتجات ذات صلة</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, MessageCircle } from 'lucide-react';
import type { ProductRow } from '../../lib/supabase';
import { useCart } from '../../contexts/CartContext';
import { BUSINESS } from '../../config';
import StockBadge from './StockBadge';

type Props = { product: ProductRow };

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const image = product.images[0] ?? null;
  const isQuote = product.pricing_mode === 'quote';
  const isOut = !isQuote && product.stock === 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOut || isQuote || product.price_aed == null) return;
    addItem({
      product_id: product.id,
      slug: product.slug,
      name_en: product.name_en,
      name_ar: product.name_ar,
      price_aed: product.price_aed,
      image,
      stock: product.stock,
    });
  };

  const handleQuote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const text = encodeURIComponent(
      `مرحباً عبد الكريم 👋\n\n` +
      `أود طلب عرض سعر:\n` +
      `${product.name_ar} (${product.name_en})\n` +
      `أحتاج معاينة لتحديد التكلفة.`
    );
    window.open(
      `https://wa.me/${BUSINESS.whatsapp}?text=${text}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <Link to={`/shop/${product.slug}`} className="group block h-full">
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`relative h-full rounded-2xl overflow-hidden flex flex-col ${
          isOut ? 'opacity-60' : ''
        }`}
        style={{
          background: 'rgba(11, 14, 26, 0.6)',
          border: '1px solid rgba(244, 246, 255, 0.1)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="relative aspect-square overflow-hidden bg-dark-bg">
          {image ? (
            <img
              src={image}
              alt={product.name_en}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-secondary/30 font-mono-label text-xs">
              NO IMAGE
            </div>
          )}

          {product.is_featured && (
            <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan/90 text-dark-bg text-[10px] font-display font-bold tracking-wider">
              <Star className="w-3 h-3 fill-current" />
              FEATURED
            </div>
          )}

          {!isQuote && (
            <div className="absolute top-3 right-3">
              <StockBadge stock={product.stock} />
            </div>
          )}
        </div>

        <div className="flex flex-col flex-grow p-5">
          <h3 className="font-display text-base font-bold text-text-primary line-clamp-2 mb-1">
            {product.name_en}
          </h3>
          <p className="font-arabic text-sm text-cyan/80 line-clamp-1 mb-3">
            {product.name_ar}
          </p>

          <div className="mt-auto flex items-end justify-between gap-3">
            <div>
              <span className="font-mono-label text-[9px] text-text-secondary block">
                {isQuote ? 'PRICE / السعر' : 'PRICE / السعر'}
              </span>
              {isQuote ? (
                <span className="font-display text-sm font-bold text-cyan leading-tight block">
                  Quoted on inspection
                  <span className="font-arabic text-xs text-text-secondary block mt-0.5">
                    حسب المعاينة
                  </span>
                </span>
              ) : (
                <span className="font-display text-lg font-bold text-cyan">
                  {product.price_aed?.toLocaleString() ?? '—'}{' '}
                  <span className="text-xs text-text-secondary">AED</span>
                </span>
              )}
            </div>
            {isQuote ? (
              <button
                type="button"
                onClick={handleQuote}
                aria-label="Request quote on WhatsApp"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: 'rgba(37, 211, 102, 0.15)',
                  border: '1px solid rgba(37, 211, 102, 0.5)',
                  color: '#25D366',
                }}
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAdd}
                disabled={isOut}
                aria-label="Add to cart"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:cursor-not-allowed disabled:opacity-40"
                style={{
                  background: isOut ? 'rgba(255,255,255,0.05)' : 'rgba(53, 184, 255, 0.15)',
                  border: '1px solid rgba(53, 184, 255, 0.4)',
                  color: '#35B8FF',
                }}
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

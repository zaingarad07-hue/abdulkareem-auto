import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { supabase, supabaseConfigured, type ProductRow } from '../lib/supabase';
import ProductCard from '../components/shop/ProductCard';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!supabaseConfigured) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(4);
      if (!cancelled) {
        setProducts((data as ProductRow[] | null) ?? []);
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full py-20 md:py-32 bg-dark-bg overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-cyan/10 filter blur-[120px] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="mb-12 md:mb-16"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <span className="font-mono-label text-cyan mb-4 block">SHOP</span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary">
                Featured
                <span className="text-cyan neon-text-glow"> Products</span>
              </h2>
              <p className="font-arabic text-text-secondary mt-2">منتجات مختارة</p>
            </div>
            <Link
              to="/shop"
              className="btn-outline inline-flex items-center gap-2 self-start lg:self-end"
            >
              <ShoppingBag className="w-4 h-4" />
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl bg-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {products.map((p) => (
              <motion.div
                key={p.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

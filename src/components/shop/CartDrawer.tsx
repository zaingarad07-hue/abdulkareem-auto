import { Link } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQty, removeItem, subtotal } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 z-[70] w-full sm:w-[420px] flex flex-col"
            style={{
              background: 'rgba(5, 6, 11, 0.95)',
              backdropFilter: 'blur(20px)',
              borderLeft: '1px solid rgba(244, 246, 255, 0.1)',
            }}
          >
            <header className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-cyan" />
                <div>
                  <h2 className="font-display text-base font-bold text-text-primary tracking-wider">
                    YOUR CART
                  </h2>
                  <p className="font-arabic text-xs text-text-secondary">سلتك</p>
                </div>
              </div>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/5 transition"
              >
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-6">
                  <div className="w-16 h-16 rounded-full bg-cyan/10 flex items-center justify-center mb-4">
                    <ShoppingBag className="w-7 h-7 text-cyan" />
                  </div>
                  <p className="text-text-secondary mb-1">Your cart is empty</p>
                  <p className="font-arabic text-sm text-text-secondary/70 mb-6">
                    سلتك فارغة
                  </p>
                  <Link
                    to="/shop"
                    onClick={closeCart}
                    className="btn-outline inline-flex items-center gap-2"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li
                      key={item.product_id}
                      className="flex gap-3 p-3 rounded-xl"
                      style={{
                        background: 'rgba(244, 246, 255, 0.03)',
                        border: '1px solid rgba(244, 246, 255, 0.06)',
                      }}
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-dark-bg flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name_en}
                            className="w-full h-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {item.name_en}
                        </p>
                        <p className="font-arabic text-xs text-cyan/70 truncate">
                          {item.name_ar}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => updateQty(item.product_id, item.qty - 1)}
                              aria-label="Decrease quantity"
                              className="w-6 h-6 rounded-md flex items-center justify-center text-text-secondary hover:bg-white/5"
                              style={{ border: '1px solid rgba(244,246,255,0.1)' }}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium text-text-primary min-w-[1.5rem] text-center">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => updateQty(item.product_id, item.qty + 1)}
                              disabled={item.qty >= item.stock}
                              aria-label="Increase quantity"
                              className="w-6 h-6 rounded-md flex items-center justify-center text-text-secondary hover:bg-white/5 disabled:opacity-30"
                              style={{ border: '1px solid rgba(244,246,255,0.1)' }}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-display text-sm font-bold text-cyan">
                            {(item.price_aed * item.qty).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.product_id)}
                        aria-label="Remove item"
                        className="self-start p-1.5 text-text-secondary/60 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="px-6 py-5 border-t border-white/10 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-text-secondary text-sm">
                    Subtotal · المجموع
                  </span>
                  <span className="font-display text-2xl font-bold text-cyan">
                    {subtotal.toLocaleString()}{' '}
                    <span className="text-sm text-text-secondary">AED</span>
                  </span>
                </div>
                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  Checkout via WhatsApp
                  <span className="font-arabic text-xs opacity-80">إتمام الطلب</span>
                </Link>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

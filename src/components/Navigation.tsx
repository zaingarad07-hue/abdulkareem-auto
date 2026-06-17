import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount, openCart } = useCart();

  const isHome = location.pathname === '/';

  useEffect(() => {
    if (!isHome) {
      setIsScrolled(true);
      return;
    }
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Shop', href: '/shop', type: 'route' as const },
    { label: 'Work', href: '#work', type: 'anchor' as const },
    { label: 'Services', href: '#services', type: 'anchor' as const },
    { label: 'Book', href: '#contact', type: 'anchor' as const },
  ];

  const handleAnchorClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (!isHome) {
      navigate(`/${href}`);
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: isHome ? 1.5 : 0.2 }}
        className={`fixed top-4 sm:top-6 right-4 sm:right-6 z-50 flex items-center gap-2 transition-all duration-500 ${
          isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="hidden md:flex items-center gap-1 px-2 py-2 rounded-full"
          style={{
            background: 'rgba(5, 6, 11, 0.7)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(244, 246, 255, 0.1)',
          }}
        >
          {navLinks.map((link) =>
            link.type === 'route' ? (
              <Link
                key={link.label}
                to={link.href}
                className="px-4 py-2 rounded-full text-sm font-display tracking-wider text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={link.label}
                onClick={() => handleAnchorClick(link.href)}
                className="px-4 py-2 rounded-full text-sm font-display tracking-wider text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
              >
                {link.label}
              </button>
            )
          )}
        </div>

        <button
          onClick={openCart}
          aria-label="Open cart"
          className="relative w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(5, 6, 11, 0.8)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(244, 246, 255, 0.15)',
          }}
        >
          <ShoppingBag className="w-4 h-4 text-text-primary" />
          {itemCount > 0 && (
            <span
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center"
              style={{
                background: '#35B8FF',
                color: '#05060B',
              }}
            >
              {itemCount}
            </span>
          )}
        </button>

        <motion.button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menu"
          className="md:hidden w-11 h-11 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(5, 6, 11, 0.8)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(244, 246, 255, 0.15)',
          }}
          whileTap={{ scale: 0.95 }}
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5 text-text-primary" />
          ) : (
            <Menu className="w-5 h-5 text-text-primary" />
          )}
        </motion.button>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-dark-bg/95 backdrop-blur-lg md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navLinks.map((link, index) =>
                link.type === 'route' ? (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.href}
                      className="font-display text-2xl tracking-wider text-text-primary hover:text-cyan transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ) : (
                  <motion.button
                    key={link.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleAnchorClick(link.href)}
                    className="font-display text-2xl tracking-wider text-text-primary hover:text-cyan transition-colors"
                  >
                    {link.label}
                  </motion.button>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isScrolled ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-4 sm:top-6 left-4 sm:left-6 z-50"
      >
        <Link
          to="/"
          className="font-display text-sm font-bold text-text-primary tracking-wider"
        >
          ABDULKAREEM<span className="text-cyan">AUTO</span>
        </Link>
      </motion.div>
    </>
  );
}

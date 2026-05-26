import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

/**
 * Navigation — Floating Top Nav Pill
 * Transparent when at top, becomes frosted glass on scroll.
 * Contains links to all sections.
 */
export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Work', href: '#work' },
    { label: 'Services', href: '#services' },
    { label: 'Showcase', href: '#showcase' },
    { label: 'Book', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className={`fixed top-4 sm:top-6 right-4 sm:right-6 z-50 transition-all duration-500 ${
          isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Desktop Nav Pill */}
        <div
          className="hidden md:flex items-center gap-1 px-2 py-2 rounded-full"
          style={{
            background: 'rgba(5, 6, 11, 0.7)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(244, 246, 255, 0.1)',
          }}
        >
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollToSection(link.href)}
              className="px-4 py-2 rounded-full text-sm font-display tracking-wider text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all duration-300"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden w-12 h-12 rounded-full flex items-center justify-center"
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

      {/* Mobile Menu Overlay */}
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
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => scrollToSection(link.href)}
                  className="font-display text-2xl tracking-wider text-text-primary hover:text-cyan transition-colors"
                >
                  {link.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Always-visible logo (when scrolled) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isScrolled ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-4 sm:top-6 left-4 sm:left-6 z-50 pointer-events-none"
      >
        <span className="font-display text-sm font-bold text-text-primary tracking-wider">
          ABDULKAREEM<span className="text-cyan">AUTO</span>
        </span>
      </motion.div>
    </>
  );
}

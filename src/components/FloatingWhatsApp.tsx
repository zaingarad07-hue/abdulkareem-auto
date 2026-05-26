import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { waLink } from '../config';

/**
 * FloatingWhatsApp — Persistent WhatsApp Button
 * A floating button that stays visible on the bottom-right corner.
 * Features an ongoing ambient glowing animation to draw attention.
 */
export default function FloatingWhatsApp() {
  return (
    <motion.a
      href={waLink()}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 2 }}
      className="fixed bottom-6 right-6 z-50 group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Glow rings */}
      <div className="absolute inset-0 rounded-full animate-whatsapp-pulse" />
      <div
        className="absolute -inset-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle, rgba(37, 211, 102, 0.3), transparent 70%)',
          filter: 'blur(8px)',
        }}
      />

      {/* Button */}
      <div
        className="relative w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg transition-shadow duration-300 group-hover:shadow-xl"
        style={{
          boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
        }}
      >
        <MessageCircle className="w-7 h-7 text-white" />

        {/* Notification dot */}
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan border-2 border-dark-bg" />
      </div>

      {/* Tooltip */}
      <div
        className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'rgba(5, 6, 11, 0.9)',
          border: '1px solid rgba(244, 246, 255, 0.1)',
        }}
      >
        <span className="font-arabic text-xs text-text-primary">
          راسلنا على واتساب
        </span>
      </div>
    </motion.a>
  );
}

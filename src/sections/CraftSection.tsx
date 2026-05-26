import { motion } from 'framer-motion';
import { Sparkles, Wrench, Eye } from 'lucide-react';

/**
 * CraftSection — "We Engineer Presence"
 * A cinematic section that establishes trust and explains the studio's specialty.
 * Features a full-bleed background with a centered translucent statement card.
 */
export default function CraftSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-dark-bg">
      {/* Background Image with overlay */}
      <div className="absolute inset-0">
        <img
          src="/images/hero.jpg"
          alt="Automotive lighting workshop"
          className="w-full h-full object-cover object-center"
          loading="lazy"
          style={{ filter: 'brightness(0.3) saturate(0.8)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/60 via-dark-bg/40 to-dark-bg/80" />
      </div>

      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan/15 filter blur-[120px] opacity-30 pointer-events-none" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 60, rotateX: 15, scale: 0.92 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 max-w-4xl mx-auto px-6"
        style={{ perspective: '1000px' }}
      >
        {/* Statement Card */}
        <div
          className="rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden"
          style={{
            background: 'rgba(5, 6, 11, 0.7)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(244, 246, 255, 0.1)',
            borderTop: '2px solid rgba(53, 184, 255, 0.5)',
          }}
        >
          {/* Shimmer effect on top border */}
          <div className="absolute top-0 left-0 right-0 h-[2px] animate-shimmer" />

          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 rounded-full bg-cyan/10 border border-cyan/30 flex items-center justify-center mx-auto mb-8"
          >
            <Sparkles className="w-8 h-8 text-cyan" />
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-6 leading-tight"
          >
            We Don't Just Install Lights
            <br />
            <span className="text-cyan neon-text-glow">
              We Engineer Presence
            </span>
          </motion.h2>

          {/* Arabic subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-arabic text-lg text-text-secondary mb-8"
          >
            نحن لا نكتفي بتركيب الأضواء — نحن نهندس الحضور
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            From subtle factory upgrades to full show-car builds, every project is
            designed, tested, and finished in-house. We combine precision engineering
            with artistic vision to create lighting that transforms your vehicle.
          </motion.p>

          {/* Feature badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-4 mb-10"
          >
            {[
              { icon: Eye, label: 'Precision Design', labelAr: 'تصميم دقيق' },
              { icon: Wrench, label: 'In-House Build', labelAr: 'تركيب داخلي' },
              { icon: Sparkles, label: 'Premium Finish', labelAr: 'لمسة بريميوم' },
            ].map((feature) => (
              <div
                key={feature.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full glass-card"
              >
                <feature.icon className="w-4 h-4 text-cyan" />
                <span className="font-display text-xs tracking-wider text-text-primary">
                  {feature.label}
                </span>
                <span className="font-arabic text-xs text-text-secondary/70">
                  {feature.labelAr}
                </span>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <motion.a
              href="#work"
              className="btn-primary inline-flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              See Projects
            </motion.a>
            <motion.a
              href="#contact"
              className="btn-outline inline-flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Request a Quote
              <span className="font-arabic text-xs opacity-80">اطلب عرض سعر</span>
            </motion.a>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 gradient-bottom pointer-events-none" />
    </section>
  );
}

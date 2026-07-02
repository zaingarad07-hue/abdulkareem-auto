import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Zap, Lightbulb, Palette } from 'lucide-react';

/**
 * HeroSection — The Startup Sequence
 * Full-screen cinematic showroom photograph with a slow Ken Burns zoom.
 * On page load, plays an "ignition sequence" title reveal with Framer Motion,
 * followed by a CTA with pulsing laser-glow border.
 */
export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger entrance animation after a brief delay
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  const chipVariants = {
    hidden: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  const glowVariants = {
    initial: {
      boxShadow: '0 0 20px rgba(53, 184, 255, 0.3), 0 0 40px rgba(53, 184, 255, 0.15)',
    },
    animate: {
      boxShadow: [
        '0 0 20px rgba(53, 184, 255, 0.3), 0 0 40px rgba(53, 184, 255, 0.15)',
        '0 0 30px rgba(53, 184, 255, 0.5), 0 0 60px rgba(53, 184, 255, 0.25), 0 0 90px rgba(53, 184, 255, 0.1)',
        '0 0 20px rgba(53, 184, 255, 0.3), 0 0 40px rgba(53, 184, 255, 0.15)',
      ],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  };

  const services = [
    { icon: Lightbulb, label: 'DRL DESIGN' },
    { icon: Zap, label: 'LASER RETROFITS' },
    { icon: Palette, label: 'INTERIOR MOODS' },
  ];

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen overflow-hidden bg-dark-bg"
    >
      {/* Showroom Background — slow Ken Burns zoom for a cinematic feel */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img
          src="/images/hero.jpg"
          alt="Abdulkareem Auto showroom"
          className="w-full h-full object-cover object-center"
          initial={{ scale: 1 }}
          animate={{ scale: 1.08 }}
          transition={{ duration: 25, ease: 'linear', repeat: Infinity, repeatType: 'mirror' }}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/45" />
        {/* Side vignette so the headline pops against the bright showroom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(5,6,11,0.75) 0%, rgba(5,6,11,0.35) 45%, transparent 75%)',
          }}
        />
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-[40%] gradient-bottom" />
      </div>

      {/* Scanline Overlay */}
      <div className="absolute inset-0 z-10 scanlines opacity-40 animate-scanline-drift pointer-events-none" />

      {/* Ambient Glow Blobs */}
      <div className="absolute top-[10%] right-[20%] w-[400px] h-[400px] rounded-full bg-cyan/20 filter blur-[100px] opacity-20 pointer-events-none z-10" />
      <div className="absolute top-[30%] left-[10%] w-[300px] h-[300px] rounded-full bg-cyan/15 filter blur-[80px] opacity-15 pointer-events-none z-10" />

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-center min-h-screen px-6 sm:px-12 lg:px-[6vw]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? 'visible' : 'hidden'}
          className="max-w-4xl"
        >
          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary leading-tight mb-4"
          >
            ABDULKAREEM
            <br />
            <span className="text-cyan neon-text-glow">AUTO</span>
          </motion.h1>

          {/* Arabic Subtitle */}
          <motion.p
            variants={itemVariants}
            className="font-arabic text-lg sm:text-xl md:text-2xl text-text-secondary mb-6 tracking-wide"
          >
            عبد الكريم أوتو — فن تخصيص مصابيح السيارات
          </motion.p>

          {/* Tagline */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl text-text-secondary max-w-xl mb-10 leading-relaxed"
          >
            Custom headlights, DRLs, and ambient lighting — built to stand out.
            <br />
            <span className="font-arabic text-sm opacity-80">
              مصابيح مخصصة، إضاءة محيطة، وتصميمات فريدة لسيارتك.
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4"
          >
            {/* Primary CTA with Laser Glow */}
            <motion.a
              href="#showcase"
              variants={glowVariants}
              initial="initial"
              animate="animate"
              className="btn-primary inline-flex items-center gap-2"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Zap className="w-4 h-4" />
              Explore Work
            </motion.a>

            {/* Secondary CTA */}
            <motion.a
              href="#contact"
              className="btn-outline inline-flex items-center gap-2"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Book Consultation
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Right Side Service Chips */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={isLoaded ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2, ease: 'easeOut' }}
          className="hidden lg:flex flex-col gap-3 absolute right-[5vw] top-1/2 -translate-y-1/2"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.label}
              variants={chipVariants}
              initial="hidden"
              animate={isLoaded ? 'visible' : 'hidden'}
              transition={{ delay: 1.4 + index * 0.1 }}
              className="chip flex items-center gap-3 cursor-default"
              whileHover={{
                borderColor: 'rgba(53, 184, 255, 0.5)',
                x: -5,
              }}
            >
              <service.icon className="w-4 h-4 text-cyan" />
              <span>{service.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-mono-label text-[10px] text-text-secondary">
            SCROLL TO EXPLORE
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-5 h-5 text-cyan" />
          </motion.div>
        </motion.div>
      </div>

      {/* Noise Texture */}
      <div className="noise-overlay" />
    </section>
  );
}

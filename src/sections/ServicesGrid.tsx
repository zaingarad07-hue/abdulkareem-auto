import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Zap, Palette, ArrowRight } from 'lucide-react';

/**
 * ServicesGrid — Interactive Customization Cards
 * A responsive 3-card grid for core services.
 * On hover: card scales up slightly, colored neon glow smoothly fades in behind the card,
 * mimicking a headlight turning on.
 */
interface ServiceCard {
  icon: React.ElementType;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  glowColor: string;
  gradient: string;
}

const services: ServiceCard[] = [
  {
    icon: Lightbulb,
    title: 'Custom DRL Designs',
    titleAr: 'تصميمات DRL مخصصة',
    description:
      'Daytime running lights designed to match your car\'s lines. Unique patterns that make your vehicle instantly recognizable.',
    descriptionAr: 'أضواء النهار المصممة لتتناسب مع خطوط سيارتك. أنماط فريدة تجعل سيارتك مميزة فوراً.',
    glowColor: 'rgba(53, 184, 255, 0.4)',
    gradient: 'from-cyan/20 to-transparent',
  },
  {
    icon: Zap,
    title: 'Laser & LED Retrofits',
    titleAr: 'ترقية الليزر والLED',
    description:
      'Brighter, farther, safer — without the OEM look. Premium projector upgrades for maximum visibility and style.',
    descriptionAr: 'أكثر سطوعاً، أبعد مدى، أكثر أماناً — ترقيات بريميوم لأقصى درجات الرؤية والأناقة.',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    gradient: 'from-purple-500/20 to-transparent',
  },
  {
    icon: Palette,
    title: 'Interior Mood Systems',
    titleAr: 'أنظمة الإضاءة المحيطة',
    description:
      'Zones, fades, and presets you control from the cabin. Create the perfect atmosphere with smart ambient lighting.',
    descriptionAr: 'مناطق وتدرجات وأوضاع مسبقة تتحكم بها من المقصورة. اخلق الأجواء المثالية مع الإضاءة الذكية.',
    glowColor: 'rgba(236, 72, 153, 0.4)',
    gradient: 'from-pink-500/20 to-transparent',
  },
];

export default function ServicesGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  return (
    <section
      id="services"
      className="relative w-full py-20 md:py-32 bg-dark-bg-secondary overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="mb-12 md:mb-16"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <span className="font-mono-label text-cyan mb-4 block">
                SERVICES
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary">
                Signature
                <span className="text-cyan neon-text-glow"> Upgrades</span>
              </h2>
            </div>
            <p className="text-text-secondary max-w-md lg:text-right">
              Choose a starting point — then we tailor the design to your car,
              your style, and how you drive.
              <br />
              <span className="font-arabic text-sm opacity-80">
                اختر نقطة البداية — ثم نصمم حسب سيارتك وأسلوبك.
              </span>
            </p>
          </div>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              variants={cardVariants}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative group"
            >
              {/* Glow Effect Behind Card */}
              <motion.div
                className="absolute -inset-2 rounded-2xl opacity-0 transition-opacity duration-500"
                animate={{
                  opacity: hoveredIndex === index ? 1 : 0,
                  scale: hoveredIndex === index ? 1.02 : 1,
                }}
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${service.glowColor}, transparent 70%)`,
                  filter: 'blur(20px)',
                }}
              />

              {/* Card */}
              <motion.div
                className="relative h-full rounded-2xl p-8 flex flex-col"
                style={{
                  background: 'rgba(5, 6, 11, 0.7)',
                  border: '1px solid rgba(244, 246, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                }}
                animate={{
                  scale: hoveredIndex === index ? 1.03 : 1,
                  y: hoveredIndex === index ? -8 : 0,
                  borderColor:
                    hoveredIndex === index
                      ? 'rgba(53, 184, 255, 0.4)'
                      : 'rgba(244, 246, 255, 0.1)',
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {/* Shimmer effect on hover */}
                <motion.div
                  className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
                  animate={{
                    opacity: hoveredIndex === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                </motion.div>

                {/* Icon */}
                <motion.div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{
                    background: 'rgba(53, 184, 255, 0.1)',
                    border: '1px solid rgba(53, 184, 255, 0.2)',
                  }}
                  animate={{
                    boxShadow:
                      hoveredIndex === index
                        ? `0 0 20px ${service.glowColor}, 0 0 40px ${service.glowColor}`
                        : '0 0 0px transparent',
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <service.icon className="w-7 h-7 text-cyan" />
                </motion.div>

                {/* Title */}
                <h3 className="font-display text-xl font-bold text-text-primary mb-1">
                  {service.title}
                </h3>
                <p className="font-arabic text-sm text-cyan/80 mb-4">
                  {service.titleAr}
                </p>

                {/* Description */}
                <p className="text-text-secondary text-sm leading-relaxed mb-3 flex-grow">
                  {service.description}
                </p>
                <p className="font-arabic text-text-secondary/70 text-xs leading-relaxed mb-6">
                  {service.descriptionAr}
                </p>

                {/* CTA Link */}
                <motion.a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-cyan font-display text-sm tracking-wider group/link"
                  whileHover={{ x: 5 }}
                >
                  <span>Learn More</span>
                  <motion.span
                    animate={{ x: hoveredIndex === index ? 5 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </motion.a>

                {/* Bottom gradient line */}
                <motion.div
                  className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${service.glowColor}, transparent)`,
                  }}
                  animate={{
                    opacity: hoveredIndex === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

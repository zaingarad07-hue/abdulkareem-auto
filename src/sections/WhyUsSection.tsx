import { motion } from 'framer-motion';
import { Shield, CheckCircle, Headphones, ChevronRight } from 'lucide-react';

/**
 * WhyUsSection — Trust + Credibility
 * Process steps and trust cards that build confidence.
 */
export default function WhyUsSection() {
  const steps = [
    {
      number: '01',
      title: 'Book a Consultation',
      titleAr: 'احجز استشارة',
      description: 'Share your car model and the vibe you want. We\'ll discuss options, styles, and budget.',
      descriptionAr: 'شاركنا موديل سيارتك والأسلوب الذي تريده. سنناقش الخيارات والأنماط والميزانية.',
    },
    {
      number: '02',
      title: 'Design & Preview',
      titleAr: 'التصميم والمعاينة',
      description: 'We map the layout and send a visual render before we build. No surprises, only excellence.',
      descriptionAr: 'نرسم التخطيط ونرسل لك تصوراً بصرياً قبل البناء. لا مفاجآت، فقط التميز.',
    },
    {
      number: '03',
      title: 'Install & Warranty',
      titleAr: 'التركيب والضمان',
      description: 'In-house professional install with a 2-year warranty. Drive with confidence.',
      descriptionAr: 'تركيب احترافي داخلي مع ضمان سنتين. قد بثقة.',
    },
  ];

  const trustCards = [
    {
      icon: Shield,
      title: '2-Year Warranty',
      titleAr: 'ضمان سنتين',
      description: 'Full coverage on all parts and labor.',
    },
    {
      icon: CheckCircle,
      title: 'Street-Legal Beams',
      titleAr: 'متوافق مع القانون',
      description: 'All lighting meets local regulations.',
    },
    {
      icon: Headphones,
      title: 'Support After Delivery',
      titleAr: 'دعم ما بعد التسليم',
      description: 'We\'re here for adjustments and questions.',
    },
  ];

  return (
    <section id="why" className="relative w-full py-20 md:py-32 bg-dark-bg-secondary overflow-hidden">
      {/* Top border */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="lg:max-w-md">
              <span className="font-mono-label text-cyan mb-4 block">
                WHY US
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary">
                Built Like a Factory Upgrade.
                <span className="text-cyan neon-text-glow block mt-2">
                  Finished Like a Show Car.
                </span>
              </h2>
            </div>
            <p className="text-text-secondary max-w-sm lg:text-right">
              Every step is transparent, every detail is deliberate.
              <span className="font-arabic text-sm block mt-1 opacity-80">
                كل خطوة شفافة، وكل تفصيلة مدروسة.
              </span>
            </p>
          </div>
        </motion.div>

        {/* Process Steps */}
        <div className="relative mb-20">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-cyan/30 via-cyan/20 to-cyan/30" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.7 }}
                className="relative"
              >
                {/* Step number */}
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'rgba(53, 184, 255, 0.1)',
                      border: '1px solid rgba(53, 184, 255, 0.3)',
                    }}
                  >
                    <span className="font-display text-sm font-bold text-cyan">
                      {step.number}
                    </span>
                  </div>
                  <div className="lg:hidden">
                    <ChevronRight className="w-5 h-5 text-cyan/50" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-bold text-text-primary mb-1">
                  {step.title}
                </h3>
                <p className="font-arabic text-sm text-cyan/80 mb-3">
                  {step.titleAr}
                </p>
                <p className="text-text-secondary text-sm leading-relaxed mb-2">
                  {step.description}
                </p>
                <p className="font-arabic text-text-secondary/60 text-xs">
                  {step.descriptionAr}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trust Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {trustCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -5, borderColor: 'rgba(53, 184, 255, 0.3)' }}
              className="glass-card rounded-xl p-6 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-cyan/10 flex items-center justify-center mb-4">
                <card.icon className="w-5 h-5 text-cyan" />
              </div>
              <h4 className="font-display text-lg font-bold text-text-primary mb-1">
                {card.title}
              </h4>
              <p className="font-arabic text-xs text-cyan/70 mb-2">
                {card.titleAr}
              </p>
              <p className="text-text-secondary text-sm">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

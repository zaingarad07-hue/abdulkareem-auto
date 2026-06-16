import { useState } from 'react';
import { BUSINESS, waLink } from '../config';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  MapPin,
  Clock,
  Phone,
  Send,
  Instagram,
  ArrowUp,
  Sparkles,
} from 'lucide-react';

/**
 * ContactWhatsApp — High-Converting Call To Action
 * A beautiful dark footer-banner with a dynamic WhatsApp booking button.
 * The button has an ongoing ambient glowing animation to draw the user's eye.
 */
export default function ContactWhatsApp() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    carModel: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Build a pre-filled WhatsApp message from the form and open the chat.
    // This is a real, working lead channel — no backend needed for the demo.
    const text = encodeURIComponent(
      `مرحباً عبد الكريم أوتو 👋\n\n` +
      `الاسم: ${formData.name}\n` +
      `الجوال: ${formData.phone}\n` +
      `السيارة: ${formData.carModel}\n` +
      `الطلب: ${formData.message}`
    );
    const url = `https://wa.me/${BUSINESS.whatsapp}?text=${text}`;

    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', phone: '', carModel: '', message: '' });
      }, 3000);
    }, 600);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const contactInfo = [
    {
      icon: Phone,
      label: 'WhatsApp',
      value: BUSINESS.phoneDisplay,
      href: waLink(),
    },
    {
      icon: MapPin,
      label: 'Studio',
      value: BUSINESS.location,
      href: '#',
    },
    {
      icon: Clock,
      label: 'Hours',
      value: 'Sat–Thu 10:00–20:00',
      href: '#',
    },
    {
      icon: Instagram,
      label: 'Instagram',
      value: '@' + BUSINESS.instagram,
      href: `https://instagram.com/${BUSINESS.instagram}`,
    },
  ];

  return (
    <section
      id="contact"
      className="relative w-full py-20 md:py-32 bg-dark-bg overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
      <div className="absolute bottom-[30%] left-[10%] w-[400px] h-[400px] rounded-full bg-cyan/10 filter blur-[120px] opacity-20 pointer-events-none" />
      <div className="absolute top-[20%] right-[5%] w-[300px] h-[300px] rounded-full bg-cyan/8 filter blur-[100px] opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="font-mono-label text-cyan mb-4 block">
            GET STARTED
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Book a
            <span className="text-cyan neon-text-glow"> Consultation</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Tell us your car and your vision. We'll reply with options, pricing, and next steps.
          </p>
          <p className="font-arabic text-text-secondary/70 text-sm mt-2">
            أخبرنا بسيارتك ورؤيتك. سنرد لك بالخيارات والأسعار والخطوات التالية.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="font-display text-xl font-bold text-text-primary mb-6">
              Contact Details
              <span className="font-arabic text-sm text-text-secondary block mt-1 font-normal">
                تفاصيل التواصل
              </span>
            </h3>

            {/* Contact Info Cards */}
            <div className="space-y-4 mb-8">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl glass-card hover:border-cyan/40 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-cyan/10 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan/20 transition-colors">
                    <item.icon className="w-5 h-5 text-cyan" />
                  </div>
                  <div>
                    <span className="font-mono-label text-[10px] text-text-secondary block">
                      {item.label}
                    </span>
                    <span className="text-text-primary font-medium">
                      {item.value}
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* WhatsApp CTA Banner */}
            <motion.a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="block relative overflow-hidden rounded-2xl p-6 group"
              style={{
                background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.15) 0%, rgba(5, 6, 11, 0.8) 100%)',
                border: '1px solid rgba(37, 211, 102, 0.3)',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-whatsapp-pulse rounded-2xl" />

              <div className="relative flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0 shadow-lg">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="font-display text-lg font-bold text-text-primary block">
                    Message on WhatsApp
                  </span>
                  <span className="font-arabic text-sm text-text-secondary">
                    راسلنا على واتساب للحجز
                  </span>
                </div>
                <Sparkles className="w-5 h-5 text-[#25D366] ml-auto opacity-60" />
              </div>
            </motion.a>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div
              className="rounded-2xl p-8"
              style={{
                background: 'rgba(11, 14, 26, 0.6)',
                border: '1px solid rgba(244, 246, 255, 0.1)',
                backdropFilter: 'blur(12px)',
              }}
            >
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-cyan/20 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-cyan" />
                  </div>
                  <h4 className="font-display text-xl font-bold text-text-primary mb-2">
                    WhatsApp Opened
                  </h4>
                  <p className="text-text-secondary">
                    Continue the conversation on WhatsApp to confirm your booking.
                  </p>
                  <p className="font-arabic text-text-secondary/70 text-sm mt-1">
                    أكمل المحادثة على واتساب لتأكيد الحجز.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="font-mono-label text-[10px] text-text-secondary mb-2 block">
                      NAME / الاسم
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl bg-dark-bg border border-white/10 text-text-primary placeholder:text-text-secondary/50 focus:border-cyan/50 focus:outline-none focus:ring-1 focus:ring-cyan/30 transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="font-mono-label text-[10px] text-text-secondary mb-2 block">
                      PHONE / الجوال
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+971 5X XXX XXXX"
                      className="w-full px-4 py-3 rounded-xl bg-dark-bg border border-white/10 text-text-primary placeholder:text-text-secondary/50 focus:border-cyan/50 focus:outline-none focus:ring-1 focus:ring-cyan/30 transition-all"
                    />
                  </div>

                  {/* Car Model */}
                  <div>
                    <label className="font-mono-label text-[10px] text-text-secondary mb-2 block">
                      CAR MODEL / موديل السيارة
                    </label>
                    <input
                      type="text"
                      name="carModel"
                      value={formData.carModel}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Aston Martin Vanquish"
                      className="w-full px-4 py-3 rounded-xl bg-dark-bg border border-white/10 text-text-primary placeholder:text-text-secondary/50 focus:border-cyan/50 focus:outline-none focus:ring-1 focus:ring-cyan/30 transition-all"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="font-mono-label text-[10px] text-text-secondary mb-2 block">
                      MESSAGE / الرسالة
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Tell us about your vision..."
                      className="w-full px-4 py-3 rounded-xl bg-dark-bg border border-white/10 text-text-primary placeholder:text-text-secondary/50 focus:border-cyan/50 focus:outline-none focus:ring-1 focus:ring-cyan/30 transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-70"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-dark-bg border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Inquiry
                        <span className="font-arabic text-xs opacity-80">
                          إرسال الاستفسار
                        </span>
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-20 pt-8 border-t border-white/5"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-bold text-text-primary">
                ABDULKAREEM
                <span className="text-cyan"> AUTO</span>
              </span>
            </div>

            <p className="text-text-secondary/60 text-sm text-center">
              &copy; {new Date().getFullYear()} Abdulkareem Auto. All rights reserved.
              <span className="font-arabic text-xs block sm:inline sm:ml-2 opacity-70">
                جميع الحقوق محفوظة.
              </span>
            </p>

            <motion.button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-cyan hover:border-cyan/50 transition-colors"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.footer>
      </div>
    </section>
  );
}

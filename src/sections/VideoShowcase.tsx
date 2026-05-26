import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, Clock, Shield, CheckCircle } from 'lucide-react';

/**
 * VideoShowcase — Cinematic Portfolio Display
 * Displays the uploaded videos in an immersive, cinematic layout.
 * Features auto-playing muted videos with custom controls overlay.
 */
export default function VideoShowcase() {
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [, setIsFullscreen] = useState(false);

  // Auto-play main video on mount
  useEffect(() => {
    if (mainVideoRef.current) {
      mainVideoRef.current.play().catch(() => setIsPlaying(false));
    }
  }, []);

  const togglePlay = () => {
    if (mainVideoRef.current) {
      if (isPlaying) {
        mainVideoRef.current.pause();
      } else {
        mainVideoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (mainVideoRef.current) {
      mainVideoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (mainVideoRef.current) {
      if (!document.fullscreenElement) {
        mainVideoRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const metrics = [
    { icon: Clock, label: 'DELIVERED IN', value: '5 DAYS', labelAr: 'تسليم خلال 5 أيام' },
    { icon: Shield, label: 'WARRANTY', value: '2 YEARS', labelAr: 'ضمان سنتين' },
    { icon: CheckCircle, label: 'STREET-LEGAL', value: 'BEAM', labelAr: 'متوافق مع القانون' },
  ];

  return (
    <section
      id="work"
      className="relative w-full py-20 md:py-32 bg-dark-bg overflow-hidden"
    >
      {/* Top border line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />

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
            {/* Left: Title */}
            <div>
              <span className="font-mono-label text-cyan mb-4 block">
                THE PROOF
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary">
                A Front End That
                <br />
                <span className="text-cyan neon-text-glow">Commands The Night</span>
              </h2>
            </div>

            {/* Right: Description */}
            <div className="max-w-md lg:text-right">
              <p className="text-text-secondary mb-2">
                Custom DRL layout, sequential turn signals, and a clean lens finish
                — built for daily driving, tuned for presence.
              </p>
              <p className="font-arabic text-text-secondary/70 text-sm">
                تصميم DRL مخصص، إشارات متسلسلة، وعدسات نظيفة — مبنية للقيادة اليومية، مُنغمة للحضور.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Video Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative rounded-2xl overflow-hidden neon-border shadow-card mb-8"
        >
          {/* Video */}
          <div className="relative aspect-video">
            <video
              ref={mainVideoRef}
              className="w-full h-full object-cover"
              src="/videos/lights-sequence.mp4"
              muted
              loop
              playsInline
              preload="auto"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 gradient-card" />

            {/* Custom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
              {/* Left: Title overlay */}
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="font-mono-label text-cyan mb-2 block text-xs">
                    ASTON MARTIN VANQUISH
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-text-primary mb-1">
                    Full LED Tail Light Retrofit
                  </h3>
                  <p className="font-arabic text-text-secondary text-sm">
                    ترقية كاملة لإضاءة الخلفية بشريط LED أحمر مخصص
                  </p>
                </motion.div>
              </div>

              {/* Right: Control buttons */}
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={toggleMute}
                  className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-text-primary hover:border-cyan/50 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </motion.button>

                <motion.button
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-cyan flex items-center justify-center text-dark-bg hover:shadow-neon transition-shadow"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                  )}
                </motion.button>

                <motion.button
                  onClick={toggleFullscreen}
                  className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-text-primary hover:border-cyan/50 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Maximize className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Metrics Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="glass-card rounded-xl p-6 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-lg bg-cyan/10 flex items-center justify-center flex-shrink-0">
                <metric.icon className="w-6 h-6 text-cyan" />
              </div>
              <div>
                <span className="font-mono-label text-[10px] text-text-secondary block mb-1">
                  {metric.label}
                </span>
                <span className="font-display text-lg font-bold text-text-primary">
                  {metric.value}
                </span>
                <span className="font-arabic text-text-secondary/60 text-xs block mt-0.5">
                  {metric.labelAr}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Secondary Video - The Sequence */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Text Content */}
          <div className="flex flex-col justify-center">
            <span className="font-mono-label text-cyan mb-4 block">
              THE SEQUENCE
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-text-primary mb-4">
              Watch The
              <span className="text-cyan neon-text-glow"> Transformation</span>
            </h3>
            <p className="text-text-secondary mb-3 leading-relaxed">
              See how we transform ordinary tail lights into stunning LED masterpieces.
              Every detail is crafted to perfection — from the initial design to the final install.
            </p>
            <p className="font-arabic text-text-secondary/70 text-sm mb-6">
              شاهد كيف نحول أضواء الذيل العادية إلى تحف LED مذهلة.
              كل تفصيلة مصنوعة بإتقان — من التصميم الأولي إلى التركيب النهائي.
            </p>
            <motion.a
              href="#contact"
              className="btn-primary inline-flex items-center gap-2 w-fit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Your Build
              <span className="font-arabic text-xs opacity-80">ابدأ مشروعك</span>
            </motion.a>
          </div>

          {/* Secondary Video */}
          <div className="relative rounded-2xl overflow-hidden neon-border">
            <video
              className="w-full aspect-video object-cover"
              src="/videos/hero-lights-on.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
            <div className="absolute inset-0 gradient-card" />
            <div className="absolute bottom-4 left-4">
              <span className="font-mono-label text-cyan text-xs">
                LIGHTS ON SEQUENCE
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

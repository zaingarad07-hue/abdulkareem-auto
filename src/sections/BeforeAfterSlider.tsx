import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { MoveHorizontal } from 'lucide-react';

/**
 * BeforeAfterSlider — Interactive Retrofit Slider
 * A draggable slider handle that compares "Before" (dim, yellow halogen)
 * with "After" (crisp, bright laser-LED headlights).
 * Uses Framer Motion's drag="x" constraints for smooth touch/mouse dragging.
 */
export default function BeforeAfterSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Motion value for the slider position (0 to containerWidth)
  const sliderX = useMotionValue(0);

  // Transform the slider position to a percentage for the clip path
  const clipPathValue = useTransform(sliderX, (v) => {
    if (containerWidth === 0) return '50%';
    return `${Math.max(0, Math.min(100, (v / containerWidth) * 100))}%`;
  });

  // Update container width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
        // Set initial position to 50%
        sliderX.set(containerRef.current.offsetWidth * 0.5);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [sliderX]);

  // Handle drag start
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Animate to position on click
  const handleContainerClick = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current || isDragging) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      animate(sliderX, x, {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      });
    },
    [isDragging, sliderX]
  );

  return (
    <section
      id="showcase"
      className="relative w-full py-20 md:py-32 bg-dark-bg overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan/10 filter blur-[120px] opacity-30 pointer-events-none" />

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
            SHOWCASE
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-4">
            The Proof Is In The
            <span className="text-cyan neon-text-glow"> Light</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Drag the slider to see the transformation. From dim factory lights
            to brilliant custom LED setups that turn heads.
          </p>
        </motion.div>

        {/* Slider Container */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Main container */}
          <div
            ref={containerRef}
            className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-card neon-border"
            onClick={handleContainerClick}
            style={{ touchAction: 'none' }}
          >
            {/* AFTER Image (Full width, always visible) */}
            <div className="absolute inset-0">
              {/* Using the "After" portion of the uploaded image (top half) */}
              <img
                src="/images/after.jpg"
                alt="After - Custom LED tail lights"
                className="w-full h-full object-cover object-center"
                draggable={false}
              />
              {/* After Label */}
              <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-cyan/20 backdrop-blur-sm border border-cyan/40">
                <span className="font-display text-sm font-bold text-cyan">
                  AFTER
                </span>
              </div>
            </div>

            {/* BEFORE Image (Clipped by slider position) */}
            <motion.div
              className="absolute inset-0 overflow-hidden"
              style={{
                width: clipPathValue,
              }}
            >
              {/* Before image pinned to the FULL container width so it never squishes */}
              <img
                src="/images/before.jpg"
                alt="Before - Stock tail lights"
                className="absolute top-0 left-0 h-full object-cover object-center"
                draggable={false}
                style={{
                  width: containerWidth ? `${containerWidth}px` : '100%',
                  maxWidth: 'none',
                  filter: 'brightness(0.7) saturate(0.75)',
                }}
              />
              {/* Before Label */}
              <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/30">
                <span className="font-display text-sm font-bold text-text-primary">
                  BEFORE
                </span>
              </div>
            </motion.div>

            {/* Divider Line */}
            <motion.div
              className="absolute top-0 bottom-0 w-[2px] bg-cyan z-10"
              style={{
                left: clipPathValue,
                boxShadow: '0 0 10px rgba(53, 184, 255, 0.8), 0 0 20px rgba(53, 184, 255, 0.4)',
              }}
            />

            {/* Drag Handle */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 cursor-grab active:cursor-grabbing"
              style={{ x: sliderX, left: 0 }}
              drag="x"
              dragConstraints={containerRef}
              dragElastic={0}
              dragMomentum={false}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-12 h-12 rounded-full bg-dark-bg border-2 border-cyan flex items-center justify-center shadow-neon-intense">
                <MoveHorizontal className="w-5 h-5 text-cyan" />
              </div>
            </motion.div>

            {/* Video Overlay - Plays the lights sequence */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
              <div className="glass-card rounded-full px-4 py-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
                <span className="font-mono-label text-[10px] text-text-secondary">
                  DRAG TO COMPARE
                </span>
              </div>
            </div>
          </div>

          {/* Caption */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center text-text-secondary text-sm mt-6 font-arabic"
          >
            استون مارتن فانكويش — ترقية كاملة لإضاءة الخلفية بشريط LED أحمر مخصص
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

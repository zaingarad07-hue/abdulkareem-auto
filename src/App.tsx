import Navigation from './components/Navigation';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import HeroSection from './sections/HeroSection';
import CraftSection from './sections/CraftSection';
import ServicesGrid from './sections/ServicesGrid';
import BeforeAfterSlider from './sections/BeforeAfterSlider';
import VideoShowcase from './sections/VideoShowcase';
import WhyUsSection from './sections/WhyUsSection';
import ContactWhatsApp from './sections/ContactWhatsApp';

/**
 * App.tsx — Main Application Component
 * Assembles all sections into a cohesive, cinematic single-page experience.
 * 
 * Section Order:
 * 1. HeroSection — Light Ignition (Startup sequence with video background)
 * 2. CraftSection — "We Engineer Presence" (Brand promise)
 * 3. ServicesGrid — Signature Upgrades (3-card interactive grid)
 * 4. BeforeAfterSlider — The Proof (Interactive before/after comparison)
 * 5. VideoShowcase — Portfolio display with uploaded videos
 * 6. WhyUsSection — Trust + Credibility (Process steps)
 * 7. ContactWhatsApp — Contact form + WhatsApp CTA
 * 
 * Persistent Elements:
 * - Navigation (top-right pill, appears on scroll)
 * - FloatingWhatsApp (bottom-right floating button)
 */
export default function App() {
  return (
    <div className="relative bg-dark-bg min-h-screen noise-overlay">
      {/* Persistent Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className="relative">
        {/* Section 1: Hero — Light Ignition */}
        <HeroSection />

        {/* Section 2: Our Craft */}
        <CraftSection />

        {/* Section 3: Services Grid */}
        <ServicesGrid />

        {/* Section 4: Before/After Showcase */}
        <BeforeAfterSlider />

        {/* Section 5: Video Showcase */}
        <VideoShowcase />

        {/* Section 6: Why Us */}
        <WhyUsSection />

        {/* Section 7: Contact + Footer */}
        <ContactWhatsApp />
      </main>

      {/* Persistent Floating WhatsApp Button */}
      <FloatingWhatsApp />
    </div>
  );
}

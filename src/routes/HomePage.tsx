import HeroSection from '../sections/HeroSection';
import CraftSection from '../sections/CraftSection';
import ServicesGrid from '../sections/ServicesGrid';
import BeforeAfterSlider from '../sections/BeforeAfterSlider';
import VideoShowcase from '../sections/VideoShowcase';
import FeaturedProducts from '../sections/FeaturedProducts';
import WhyUsSection from '../sections/WhyUsSection';
import ContactWhatsApp from '../sections/ContactWhatsApp';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CraftSection />
      <ServicesGrid />
      <BeforeAfterSlider />
      <VideoShowcase />
      <FeaturedProducts />
      <WhyUsSection />
      <ContactWhatsApp />
    </>
  );
}

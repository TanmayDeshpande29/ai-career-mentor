import HeroSection from "../components/landing/HeroSection";
import FeatureSection from "../components/landing/FeatureSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import CtaSection from "../components/landing/CtaSection";

function HomePage() {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CtaSection />
    </>
  );
}

export default HomePage;
import HeroSection from "@/components/homepage/HeroSection";
import FeatureSection from "@/components/homepage/FeatureSection";
import StatsSection from "@/components/homepage/StatsSection";
import HowItWorksSection from "@/components/homepage/HowItWorksSection";
import FAQSection from "@/components/homepage/FAQSection";
import CTASection from "@/components/homepage/CTASection";

export default function LandingPage() {
  return (
    <>
      <div className="grid-background"> </div>
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Feature Section */}
      <FeatureSection />

      {/* 3. Stats Section */}
      <StatsSection />

      {/* 4. How it works */}
      <HowItWorksSection />

      {/* 5. FAQ Section */}
      <FAQSection />

      {/* 6. CTA Section */}
      <CTASection />
    </>
  );
}

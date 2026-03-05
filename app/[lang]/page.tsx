import { GalleryTabs } from "@/components/landing/GalleryTabs";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { PricingSection } from "@/components/landing/PricingSection";

export default function LandingPage() {
  return (
    <div className="stack">
      <HeroSection />
      <HowItWorks />
      <GalleryTabs />
      <PricingSection />
    </div>
  );
}

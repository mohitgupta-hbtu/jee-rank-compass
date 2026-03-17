import ParticleBackground from "@/components/ParticleBackground";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import RankPredictorSection from "@/components/RankPredictorSection";
import CollegesSection from "@/components/CollegesSection";
import AnalyticsSection from "@/components/AnalyticsSection";
import PremiumSection from "@/components/PremiumSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <ParticleBackground />
      <Navbar />
      <HeroSection />
      <RankPredictorSection />
      <AnalyticsSection />
      <PremiumSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;

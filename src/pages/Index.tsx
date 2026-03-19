import ParticleBackground from "@/components/ParticleBackground";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import RankPredictorSection from "@/components/RankPredictorSection";
import AnalyticsSection from "@/components/AnalyticsSection";
import PremiumSection from "@/components/PremiumSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import AIBotWidget from "@/components/AIBotWidget";
import TargetCollegeSection from "@/components/TargetCollegeSection";
import ChoiceFillingGenerator from "@/components/ChoiceFillingGenerator";

const Index = () => {
  return (
    <div className="min-h-screen">
      <ParticleBackground />
      <Navbar />
      <HeroSection />
      <RankPredictorSection />
      <AnalyticsSection />
      <TargetCollegeSection />
      <ChoiceFillingGenerator />
      <PremiumSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
      <AIBotWidget />
    </div>
  );
};

export default Index;

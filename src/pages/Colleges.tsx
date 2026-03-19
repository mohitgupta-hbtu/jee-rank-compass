import ParticleBackground from "@/components/ParticleBackground";
import Navbar from "@/components/Navbar";
import CollegesSection from "@/components/CollegesSection";
import Footer from "@/components/Footer";

const Colleges = () => {
  return (
    <div className="min-h-screen">
      <ParticleBackground />
      <Navbar />
      <div className="pt-16">
        <CollegesSection />
      </div>
      <Footer />
    </div>
  );
};

export default Colleges;

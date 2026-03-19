import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Users, Award } from "lucide-react";

const HeroSection = () => {
  const stats = [
    { icon: Users, value: "13.2L+", label: "Candidates Analyzed" },
    { icon: TrendingUp, value: "95.4%", label: "Prediction Accuracy" },
    { icon: Award, value: "35+", label: "IIT/NIT/IIIT Covered" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 mesh-gradient overflow-hidden">
      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-secondary/10 blur-[100px] animate-pulse-glow" style={{ animationDelay: "1s" }} />

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-muted-foreground">
              ✅ Verified with Official JoSAA 2024 & 2025 Cutoff Data
            </span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
            Predict Your{" "}
            <span className="gradient-text">JEE Rank</span>
            <br />
            Instantly
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance">
            Enter your JEE Mains or JEE Advanced marks and instantly get your predicted rank, best college matches, and branch-wise admission chances.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a
              href="#predictor"
              className="gradient-btn px-8 py-4 rounded-xl text-primary-foreground font-semibold text-lg flex items-center gap-2 glow-blue"
            >
              Predict My Rank
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#analytics"
              className="glass-card-hover px-8 py-4 text-foreground font-medium text-lg"
            >
              View Analytics
            </a>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-8 md:gap-16"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-5 h-5 text-secondary mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-display font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scrolling Colleges Marquee */}
        <div className="mt-20 relative max-w-7xl mx-auto overflow-hidden opacity-80" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
          <div className="flex gap-4 animate-marquee whitespace-nowrap mb-4">
            {["IIT Bombay", "NIT Trichy", "IIIT Hyderabad", "IIT Delhi", "IIT Madras", "NIT Surathkal", "IIT Kanpur", "IIIT Allahabad", "IIT Roorkee", "NIT Warangal", "IIT Kharagpur", "DTU"].map((college, i) => (
              <div key={`row1-${i}`} className="glass-card px-6 py-3 rounded-xl flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="font-display font-semibold text-foreground">{college}</span>
              </div>
            ))}
            {/* Duplicate for infinite effect */}
            {["IIT Bombay", "NIT Trichy", "IIIT Hyderabad", "IIT Delhi", "IIT Madras", "NIT Surathkal", "IIT Kanpur", "IIIT Allahabad", "IIT Roorkee", "NIT Warangal", "IIT Kharagpur", "DTU"].map((college, i) => (
              <div key={`row1-dup-${i}`} className="glass-card px-6 py-3 rounded-xl flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="font-display font-semibold text-foreground">{college}</span>
              </div>
            ))}
          </div>
          
          <div className="flex gap-4 animate-marquee-reverse whitespace-nowrap">
            {["IIT Guwahati", "NIT Rourkela", "IIT Hyderabad", "MNNIT Allahabad", "IIIT Delhi", "IIT BHU", "NIT Calicut", "IIIT Bangalore", "IIT Indore", "MNIT Jaipur", "NSUT", "IIT Gandhinagar"].map((college, i) => (
              <div key={`row2-${i}`} className="glass-card px-6 py-3 rounded-xl flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="font-display font-semibold text-muted-foreground">{college}</span>
              </div>
            ))}
            {/* Duplicate for infinite effect */}
            {["IIT Guwahati", "NIT Rourkela", "IIT Hyderabad", "MNNIT Allahabad", "IIIT Delhi", "IIT BHU", "NIT Calicut", "IIIT Bangalore", "IIT Indore", "MNIT Jaipur", "NSUT", "IIT Gandhinagar"].map((college, i) => (
              <div key={`row2-dup-${i}`} className="glass-card px-6 py-3 rounded-xl flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="font-display font-semibold text-muted-foreground">{college}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

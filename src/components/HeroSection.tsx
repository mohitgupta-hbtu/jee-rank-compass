import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Users, Award } from "lucide-react";

const HeroSection = () => {
  const stats = [
    { icon: Users, value: "12L+", label: "Students" },
    { icon: TrendingUp, value: "94%", label: "Accuracy" },
    { icon: Award, value: "500+", label: "Colleges" },
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
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Based on JEE Main 2024 Data — Updated for 2025
            </span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
            Predict Your{" "}
            <span className="gradient-text">JEE Rank</span>
            <br />
            Instantly
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance">
            Enter your marks. Get your predicted All India Rank, top college suggestions, and branch
            probabilities — powered by historical data analysis.
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
      </div>
    </section>
  );
};

export default HeroSection;

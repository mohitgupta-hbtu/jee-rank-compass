import { useState } from "react";
import { motion } from "framer-motion";
import RankPredictorForm from "./RankPredictorForm";
import PredictionResults from "./PredictionResults";
import { predictRank, type PredictionInput, type PredictionResult } from "@/lib/rankPredictor";

const RankPredictorSection = () => {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePredict = (input: PredictionInput) => {
    setIsLoading(true);
    // Simulate API delay for UX
    setTimeout(() => {
      const prediction = predictRank(input);
      setResult(prediction);
      setIsLoading(false);
    }, 800);
  };

  return (
    <section id="predictor" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 mesh-gradient opacity-30" />
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-3 px-3 py-1 rounded-full border border-border bg-transparent text-xs font-semibold text-muted-foreground">
            AI-POWERED PREDICTOR
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Rank <span className="gradient-text">Predictor</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-lg text-balance">
            Our proprietary algorithm cross-references your score against 1.3M+ historical data points.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto relative">
          


          <div className="relative">
            {/* Subtle glow behind form */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <RankPredictorForm onPredict={handlePredict} isLoading={isLoading} />
          </div>
          
          <div>
            {result ? (
              <PredictionResults result={result} />
            ) : (
              <div className="glass-card p-10 flex flex-col items-center justify-center h-full min-h-[450px] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-50 transition-opacity group-hover:opacity-100" />
                <div className="text-center relative z-10">
                  <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6 shadow-inner border border-white/5 relative">
                    <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin opacity-20" />
                    <span className="text-4xl filter drop-shadow-lg">🔮</span>
                  </div>
                  <h3 className="text-2xl font-display font-semibold text-foreground mb-2">Awaiting Data</h3>
                  <p className="text-muted-foreground text-balance max-w-[250px] mx-auto">
                    Fill out the form on the left to generate your comprehensive rank analysis.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RankPredictorSection;

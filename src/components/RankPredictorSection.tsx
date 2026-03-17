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
    <section id="predictor" className="py-20 relative">
      <div className="absolute inset-0 mesh-gradient opacity-50" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Rank <span className="gradient-text">Predictor</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Enter your JEE Main score and details to get an instant rank prediction with college suggestions.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div>
            <RankPredictorForm onPredict={handlePredict} isLoading={isLoading} />
          </div>
          <div>
            {result ? (
              <PredictionResults result={result} />
            ) : (
              <div className="glass-card p-8 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <p className="text-muted-foreground">Your prediction results will appear here</p>
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

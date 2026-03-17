import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import type { PredictionInput } from "@/lib/rankPredictor";

interface Props {
  onPredict: (input: PredictionInput) => void;
  isLoading: boolean;
}

const RankPredictorForm = ({ onPredict, isLoading }: Props) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    score: "",
    percentile: "",
    category: "General" as PredictionInput["category"],
    session: "April" as PredictionInput["session"],
    difficulty: "Moderate" as PredictionInput["difficulty"],
  });

  const categories = ["General", "OBC", "SC", "ST", "EWS"] as const;
  const sessions = ["January", "April"] as const;
  const difficulties = ["Easy", "Moderate", "Difficult"] as const;

  const handleSubmit = () => {
    onPredict({
      score: Number(form.score) || 0,
      percentile: Number(form.percentile) || 0,
      category: form.category,
      session: form.session,
      difficulty: form.difficulty,
    });
  };

  const steps = [
    // Step 1: Scores
    <motion.div key="scores" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">JEE Main Score (out of 300)</label>
        <input
          type="number"
          min="0"
          max="300"
          value={form.score}
          onChange={(e) => setForm({ ...form, score: e.target.value })}
          placeholder="Enter your score"
          className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">Percentile (optional)</label>
        <input
          type="number"
          min="0"
          max="100"
          step="0.01"
          value={form.percentile}
          onChange={(e) => setForm({ ...form, percentile: e.target.value })}
          placeholder="e.g. 98.56"
          className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </div>
    </motion.div>,

    // Step 2: Category & Session
    <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-3">Category</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setForm({ ...form, category: cat })}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                form.category === cat
                  ? "gradient-btn text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground border border-border hover:border-primary/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-3">Attempt Session</label>
        <div className="flex gap-3">
          {sessions.map((s) => (
            <button
              key={s}
              onClick={() => setForm({ ...form, session: s })}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                form.session === s
                  ? "gradient-btn text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground border border-border hover:border-primary/50"
              }`}
            >
              {s} 2025
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-3">Paper Difficulty</label>
        <div className="flex gap-3">
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => setForm({ ...form, difficulty: d })}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                form.difficulty === d
                  ? "gradient-btn text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground border border-border hover:border-primary/50"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
    </motion.div>,
  ];

  return (
    <div className="glass-card p-6 md:p-8">
      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        {[0, 1].map((i) => (
          <div key={i} className="flex items-center gap-3 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              i <= step ? "gradient-btn text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {i + 1}
            </div>
            <span className="text-sm text-muted-foreground hidden sm:block">
              {i === 0 ? "Your Scores" : "Details"}
            </span>
            {i < 1 && <div className={`flex-1 h-px ${i < step ? "bg-primary" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {steps[step]}
      </AnimatePresence>

      <div className="flex items-center justify-between mt-8">
        {step > 0 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        ) : <div />}

        {step < steps.length - 1 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!form.score && !form.percentile}
            className="gradient-btn px-6 py-3 rounded-lg text-primary-foreground font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isLoading || (!form.score && !form.percentile)}
            className="gradient-btn px-6 py-3 rounded-lg text-primary-foreground font-medium flex items-center gap-2 disabled:opacity-50 glow-blue"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Predict Rank
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default RankPredictorForm;

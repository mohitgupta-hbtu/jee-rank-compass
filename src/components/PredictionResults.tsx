import { motion } from "framer-motion";
import { Trophy, Target, Building2, TrendingUp } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";
import type { PredictionResult } from "@/lib/rankPredictor";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell,
} from "recharts";

interface Props {
  result: PredictionResult;
}

const PredictionResults = ({ result }: Props) => {
  const branchData = result.branchProbabilities.map((b) => ({
    name: b.branch.length > 12 ? b.branch.slice(0, 12) + "…" : b.branch,
    probability: b.probability,
  }));

  const confidenceColor = result.confidence >= 90 ? "text-secondary" : result.confidence >= 80 ? "text-primary" : "text-accent";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Main rank card */}
      <div className="glass-card p-8 text-center glow-blue">
        <Trophy className="w-10 h-10 text-secondary mx-auto mb-4" />
        <p className="text-sm text-muted-foreground mb-2">Your Predicted All India Rank</p>
        <div className="text-5xl md:text-6xl font-display font-bold gradient-text mb-2">
          <AnimatedCounter target={result.predictedRank} prefix="#" />
        </div>
        <p className="text-sm text-muted-foreground">
          Range: #{result.rankRange.min.toLocaleString("en-IN")} — #{result.rankRange.max.toLocaleString("en-IN")}
        </p>
        <div className="mt-4 inline-flex items-center gap-2 glass-card px-4 py-2">
          <Target className="w-4 h-4 text-secondary" />
          <span className={`text-sm font-semibold ${confidenceColor}`}>{result.confidence}% Confidence</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-5 text-center">
          <TrendingUp className="w-5 h-5 text-primary mx-auto mb-2" />
          <p className="text-xs text-muted-foreground mb-1">Percentile</p>
          <p className="text-xl font-display font-bold text-foreground">
            {result.percentileEstimate.toFixed(2)}%
          </p>
        </div>
        <div className="glass-card p-5 text-center">
          <Building2 className="w-5 h-5 text-secondary mx-auto mb-2" />
          <p className="text-xs text-muted-foreground mb-1">Colleges Match</p>
          <p className="text-xl font-display font-bold text-foreground">
            {result.colleges.length}
          </p>
        </div>
      </div>

      {/* Branch probability chart */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-display font-semibold text-foreground mb-4">Branch Admission Probability</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={branchData} layout="vertical" margin={{ left: 0, right: 20 }}>
            <XAxis type="number" domain={[0, 100]} tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} width={100} />
            <Tooltip
              contentStyle={{ background: "hsl(217 33% 17%)", border: "1px solid hsl(217 33% 22%)", borderRadius: "8px", color: "#F8FAFC" }}
            />
            <Bar dataKey="probability" radius={[0, 4, 4, 0]}>
              {branchData.map((_, i) => (
                <Cell key={i} fill={i === 0 ? "#2563EB" : i === 1 ? "#06B6D4" : `hsl(217 ${70 - i * 10}% ${50 + i * 5}%)`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* College suggestions */}
      {result.colleges.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-display font-semibold text-foreground mb-4">Top College Matches</h3>
          <div className="space-y-3">
            {result.colleges.map((college, i) => (
              <motion.div
                key={college.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="font-medium text-foreground text-sm">{college.name}</p>
                  <p className="text-xs text-muted-foreground">Cutoff: ~#{college.cutoffRank.toLocaleString("en-IN")}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    college.probability === "High"
                      ? "bg-secondary/20 text-secondary"
                      : college.probability === "Medium"
                      ? "bg-primary/20 text-primary"
                      : "bg-accent/20 text-accent"
                  }`}>
                    {college.probability}
                  </span>
                  <span className="text-xs text-muted-foreground px-2 py-1 rounded-full bg-muted/50">{college.type}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PredictionResults;

import { motion } from "framer-motion";
import { getHistoricalData } from "@/lib/rankPredictor";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

const AnalyticsSection = () => {
  const data = getHistoricalData();

  return (
    <section id="analytics" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Score vs Rank <span className="gradient-text">Analytics</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Historical JEE Main data visualization — understand how scores map to ranks.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-6 md:p-8 max-w-4xl mx-auto"
        >
          <h3 className="text-lg font-display font-semibold text-foreground mb-6">Score → Rank Distribution (JEE Main 2024)</h3>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="rankGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="percentileGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 22%)" />
              <XAxis dataKey="score" tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={{ stroke: "hsl(217 33% 22%)" }} label={{ value: "Score", position: "insideBottom", offset: -5, fill: "#94A3B8" }} />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={{ stroke: "hsl(217 33% 22%)" }} label={{ value: "Rank", angle: -90, position: "insideLeft", fill: "#94A3B8" }} />
              <Tooltip contentStyle={{ background: "hsl(217 33% 17%)", border: "1px solid hsl(217 33% 22%)", borderRadius: "8px", color: "#F8FAFC" }} />
              <Area type="monotone" dataKey="rank" stroke="#2563EB" fill="url(#rankGradient)" strokeWidth={2} dot={{ fill: "#2563EB", r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </section>
  );
};

export default AnalyticsSection;

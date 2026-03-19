import { motion } from "framer-motion";
import { getHistoricalData } from "@/lib/rankPredictor";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, LineChart, Line
} from "recharts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 md:p-4 !bg-background/95 border-border shadow-xl">
        <p className="font-display font-semibold text-foreground mb-2 pb-2 border-b border-border/50">
          Score: {label} Marks
        </p>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 text-sm my-1.5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-muted-foreground">{entry.name}</span>
            </div>
            <span className="font-semibold text-foreground" style={{ color: entry.color }}>
              {entry.name.includes("Rank") 
                ? `#${entry.value.toLocaleString("en-IN")}`
                : `${entry.value}%ile`
              }
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const AnalyticsSection = () => {
  const data = getHistoricalData();

  return (
    <section id="analytics" className="py-20 bg-muted/20 relative overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-3 px-3 py-1 rounded-full border border-border bg-transparent text-xs font-semibold text-muted-foreground">
            Data Insights
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            JEE Main <span className="gradient-text">Trend Analytics</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Compare how marks mapped to percentiles and ranks across different years. Notice the shift in competition through our dynamic visualizations. 
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Chart 1: Score vs Percentile */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6 md:p-8 hover:border-primary/50 transition-colors group"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-display font-semibold text-foreground">Score vs Percentile</h3>
                <p className="text-sm text-muted-foreground mt-1">2024 vs 2025 Prediction</p>
              </div>
            </div>
            <div className="h-[300px] md:h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground)/0.15)" vertical={false} />
                  <XAxis 
                    dataKey="score" 
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} 
                    axisLine={false} 
                    tickLine={false}
                    label={{ value: "Marks out of 300", position: "insideBottom", offset: -5, fill: "hsl(var(--muted-foreground))" }} 
                  />
                  <YAxis 
                    domain={[40, 100]} 
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 2, strokeDasharray: '5 5' }} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  
                  <Line 
                    type="monotone" 
                    dataKey="percentile25" 
                    name="2025 (Predicted)" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3} 
                    dot={false}
                    activeDot={{ r: 6, strokeWidth: 0, fill: "hsl(var(--primary))" }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="percentile24" 
                    name="2024 (Actual)" 
                    stroke="hsl(var(--secondary))" 
                    strokeWidth={3} 
                    dot={false}
                    strokeDasharray="5 5"
                    activeDot={{ r: 6, strokeWidth: 0, fill: "hsl(var(--secondary))" }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Chart 2: Score vs Rank */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6 md:p-8 hover:border-accent/50 transition-colors group"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-display font-semibold text-foreground">Score vs Rank</h3>
                <p className="text-sm text-muted-foreground mt-1">Lower rank is better • 2024 vs 2025</p>
              </div>
            </div>
            <div className="h-[300px] md:h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="rankGradient25" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="rankGradient24" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground)/0.15)" vertical={false} />
                  <XAxis 
                    dataKey="score" 
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} 
                    axisLine={false} 
                    tickLine={false}
                    label={{ value: "Marks out of 300", position: "insideBottom", offset: -5, fill: "hsl(var(--muted-foreground))" }} 
                  />
                  {/* For rank, lower is better, so we reverse the Y axis visually so high scores = high on chart (rank 1) */}
                  <YAxis 
                    reversed={true} 
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} 
                    axisLine={false} 
                    tickLine={false} 
                    tickFormatter={(value) => value > 1000 ? `${(value/1000).toFixed(0)}k` : value}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 2, strokeDasharray: '5 5' }} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  
                  <Area 
                    type="monotone" 
                    dataKey="rank24" 
                    name="2024 Rank" 
                    stroke="hsl(var(--muted-foreground))" 
                    strokeDasharray="4 4"
                    fillOpacity={1} 
                    fill="url(#rankGradient24)" 
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="rank25" 
                    name="2025 Rank" 
                    stroke="hsl(var(--accent))" 
                    fillOpacity={1} 
                    fill="url(#rankGradient25)" 
                    strokeWidth={3}
                    activeDot={{ r: 6, strokeWidth: 0, fill: "hsl(var(--accent))" }} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsSection;

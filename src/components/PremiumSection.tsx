import { motion } from "framer-motion";
import { Lock, BarChart3, BookOpen, MessageCircle, Crown } from "lucide-react";

const features = [
  { icon: BarChart3, title: "Detailed College Probability", desc: "Get admission chances for every IIT, NIT, IIIT with branch-wise breakdown." },
  { icon: BookOpen, title: "Cutoff Analysis", desc: "Historical opening & closing ranks for all rounds of JoSAA counseling." },
  { icon: MessageCircle, title: "AI Counseling", desc: "Personalized college & branch recommendations by our AI counselor." },
  { icon: Lock, title: "Rank History Tracking", desc: "Track your mock test scores and see your predicted rank trend over time." },
];

const PremiumSection = () => {
  return (
    <section id="premium" className="py-20 relative">
      <div className="absolute inset-0 mesh-gradient opacity-30" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 gradient-btn-accent px-4 py-2 rounded-full text-sm font-semibold text-accent-foreground mb-6">
            <Crown className="w-4 h-4" /> Premium Features
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Unlock <span className="gradient-text">Premium</span> Analytics
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Go beyond basic predictions. Get detailed insights that top rankers use.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card-hover p-6"
            >
              <f.icon className="w-8 h-8 text-accent mb-4" />
              <h3 className="font-display font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <button className="gradient-btn-accent px-8 py-4 rounded-xl text-accent-foreground font-semibold text-lg">
            Upgrade to Premium — ₹199/month
          </button>
          <p className="text-xs text-muted-foreground mt-3">Cancel anytime · 7-day free trial</p>
        </div>
      </div>
    </section>
  );
};

export default PremiumSection;

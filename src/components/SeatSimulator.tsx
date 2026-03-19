import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Trophy, Shuffle, ArrowRight, ShieldCheck, Lock } from "lucide-react";
import PaymentModal from "./PaymentModal";

const SeatSimulator = () => {
  const [paymentOpen, setPaymentOpen] = useState(false);
  
  return (
    <section id="simulator" className="py-20 relative overflow-hidden bg-muted/20 border-t border-border/50">
      <PaymentModal isOpen={paymentOpen} onClose={() => setPaymentOpen(false)} />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-semibold uppercase tracking-wider mb-4">
            <Trophy className="w-3.5 h-3.5" />
            Free Feature
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Counseling Round <span className="text-secondary">Simulator</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Build your dream college list and click "Simulate". We'll use our 2025 AI prediction models to instantly tell you which exact IIT or NIT you're getting in Round 1, and what upgrade you'll secure by Round 6!
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto glass-card border border-border/80 overflow-hidden relative group">
          
          <div className="flex flex-col md:flex-row h-[500px]">
            {/* Left Box */}
            <div className="w-full md:w-1/2 p-6 border-r border-border/50 flex flex-col">
               <h4 className="font-bold text-foreground mb-4">Your Custom Preference List</h4>
               <div className="flex-1 space-y-3">
                 {[
                   { id: 1, text: "IIT Bombay - Computer Science" },
                   { id: 2, text: "IIT Delhi - Computer Science" },
                   { id: 3, text: "IIT Bombay - Electrical" },
                   { id: 4, text: "NIT Trichy - Computer Science" },
                   { id: 5, text: "IIT Roorkee - Data Science" },
                 ].map(item => (
                   <div key={item.id} className="p-3 bg-muted/40 rounded-lg border border-border/50 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <span className="w-6 h-6 rounded bg-background text-xs font-bold flex flex-col items-center justify-center">{item.id}</span>
                       <span className="text-sm font-medium">{item.text}</span>
                     </div>
                   </div>
                 ))}
               </div>
               <button className="mt-4 w-full bg-secondary/20 text-secondary py-3 rounded-lg font-semibold flex items-center justify-center gap-2">
                 <Shuffle className="w-4 h-4" /> Run 2025 Simulation AI
               </button>
            </div>

            {/* Right Box Data */}
            <div className="w-full md:w-1/2 p-6 flex flex-col items-center justify-center relative">
               <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary via-background to-background"></div>
               <ShieldCheck className="w-16 h-16 text-emerald-500 mb-6" />
               <h4 className="text-xl font-bold mb-2">Simulation Complete</h4>
               <div className="w-full space-y-4 max-w-sm mt-4">
                  <div className="p-4 rounded-xl border border-secondary/30 bg-secondary/5">
                    <p className="text-xs text-secondary font-bold uppercase tracking-wide mb-1">Round 1 Allocation</p>
                    <p className="font-semibold text-foreground">Choice #5: IIT Roorkee - Data Science</p>
                  </div>
                  <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-muted-foreground rotate-90" /></div>
                  <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                    <p className="text-xs text-emerald-500 font-bold uppercase tracking-wide mb-1">Round 6 Final Upgrade</p>
                    <p className="font-semibold text-foreground">Choice #3: IIT Bombay - Electrical</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SeatSimulator;

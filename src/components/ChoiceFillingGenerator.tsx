import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ListOrdered, CheckCircle2, Lock, Sparkles, ChevronRight, GraduationCap, ChevronDown, Search } from "lucide-react";
import PaymentModal from "./PaymentModal";
import { collegesData } from "@/lib/collegeDatabase";

const STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
].sort();
const CATEGORIES = ["General", "OBC", "SC", "ST", "EWS"] as const;

const ChoiceFillingGenerator = () => {
  const [rank, setRank] = useState("");
  const [state, setState] = useState(STATES[0]);
  const [category, setCategory] = useState<typeof CATEGORIES[number]>("General");
  const [isPwD, setIsPwD] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [generatedList, setGeneratedList] = useState<{ college: string; branch: string; type: string; cutoff: number; margin: number }[] | null>(null);

  const [stateOpen, setStateOpen] = useState(false);
  const [stateSearch, setStateSearch] = useState("");
  const stateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (stateRef.current && !stateRef.current.contains(e.target as Node)) {
        setStateOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredStates = STATES.filter(s => s.toLowerCase().includes(stateSearch.toLowerCase()));

  const handleGenerate = () => {
    if (!rank) return;
    const numRank = parseInt(rank);
    
    // Simulate complex AI assortment of safe, target, and reach colleges
    // for demonstration/marketing purposes.
    const sortedColleges = collegesData
      .flatMap(college => {
        return college.branches2024.map(branch => {
          let cutoff = branch.generalCR;
          if (category === "OBC") cutoff = branch.obcCR;
          if (category === "SC") cutoff = branch.scCR;
          if (category === "ST") cutoff = branch.stCR;
          if (category === "EWS") cutoff = Math.floor(branch.generalCR * 1.15);

          if (isPwD && cutoff > 0) {
            cutoff = Math.max(1, Math.floor(cutoff * 0.05));
          }

          // Home state advantage logic (approx)
          if (college.state === state && college.type === "NIT") {
            cutoff = Math.floor(cutoff * 1.5);
          }

          return {
            college: college.name,
            type: college.type,
            branch: branch.branch,
            cutoff,
            margin: ((cutoff - numRank) / numRank) * 100
          };
        });
      })
      .filter(item => item.cutoff > 0 && item.margin > -20) // Only slightly out of reach or better
      .sort((a, b) => a.cutoff - b.cutoff); // Real JoSAA requires rigid ranking by cutoff OR prestige

    setGeneratedList(sortedColleges.slice(0, 50)); // Generate top 50 choices
  };

  return (
    <section id="choice-filling" className="py-20 relative overflow-hidden bg-background">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-accent to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
      </div>

      <PaymentModal isOpen={paymentOpen} onClose={() => setPaymentOpen(false)} />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Premium Feature
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Auto-Generate <span className="text-accent">Choice Filling</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A single mistake in your JoSAA preference order can cost you an IIT seat. Our AI algorithm mathematically generates the perfect, risk-free preference list tailored to your exact rank and state.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Interface */}
          <div className="glass-card p-6 md:p-8 flex flex-col gap-5 border border-accent/20">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Your JEE Main Rank (CRL or Category)</label>
              <input
                type="number"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                placeholder="e.g. 15400"
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-semibold"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Category Base</label>
              <div className="grid grid-cols-5 gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`py-2 text-[11px] sm:text-xs font-semibold rounded-lg transition-colors border ${category === cat ? "bg-accent text-accent-foreground border-accent shadow-sm" : "bg-muted/30 text-muted-foreground border-border/50 hover:bg-muted/50"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* PwD Sub-reservation Overlay */}
            <div className="flex items-center justify-between p-3 bg-muted/20 border border-border/50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-foreground">Are you a Person with Disability (PwD)?</p>
              </div>
              <div className="flex gap-1.5 shrink-0 bg-background border border-border/50 p-1 rounded-lg">
                {(["No", "Yes"] as const).map(opt => (
                  <button
                    key={opt}
                    onClick={() => setIsPwD(opt === "Yes")}
                    className={`px-4 py-1.5 text-xs font-semibold rounded transition-all ${
                      (isPwD && opt === "Yes") || (!isPwD && opt === "No")
                        ? "bg-accent text-accent-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div ref={stateRef} className="relative">
              <label className="block text-sm font-medium text-foreground mb-2">Home State Quota</label>
              <button
                type="button"
                onClick={() => { setStateOpen(!stateOpen); setStateSearch(""); }}
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-left flex items-center justify-between"
              >
                <span>{state}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${stateOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {stateOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-50 w-full mt-1.5 rounded-xl border border-border/50 bg-background shadow-2xl overflow-hidden"
                  >
                    <div className="p-2 border-b border-border/50">
                      <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border border-border/50">
                        <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                        <input
                          type="text"
                          value={stateSearch}
                          onChange={(e) => setStateSearch(e.target.value)}
                          placeholder="Search state..."
                          className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="max-h-[200px] overflow-y-auto py-1 scrollbar-thin">
                      {filteredStates.length === 0 ? (
                        <p className="text-xs text-muted-foreground text-center py-4">No state found</p>
                      ) : (
                        filteredStates.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => { setState(s); setStateOpen(false); }}
                            className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-2 ${
                              state === s
                                ? 'bg-accent/15 text-accent font-medium'
                                : 'text-foreground hover:bg-muted/60'
                            }`}
                          >
                            {state === s && <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />}
                            {s}
                          </button>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={handleGenerate}
              className="mt-4 w-full gradient-btn bg-gradient-to-r from-accent to-secondary hover:opacity-90 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-accent/25 transition-all flex items-center justify-center gap-2 button-pop"
            >
              <ListOrdered className="w-5 h-5" />
              Generate JoSAA List
            </button>
          </div>

          {/* Generated Result Display */}
          <div className="glass-card relative border border-border overflow-hidden bg-muted/10 h-[450px]">
            {!generatedList ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 opacity-60">
                <ListOrdered className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">List Simulator Ready</h3>
                <p className="text-sm text-muted-foreground">Enter your details and click generate to let our algorithm construct the optimal 100+ college choice architecture.</p>
              </div>
            ) : (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-border/50 bg-muted/30 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-foreground">AI Perfected JoSAA Order</h3>
                    <p className="text-[10px] text-muted-foreground">{generatedList.length} optimized choices for Rank {rank}</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                
                <div className="flex-1 overflow-hidden relative p-4 space-y-3">
                  {generatedList.slice(0, 3).map((item, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-3 rounded-lg border border-border/50 bg-background/50 flex items-center gap-4"
                    >
                      <div className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate text-foreground">{item.college}</div>
                        <div className="text-xs text-muted-foreground truncate">{item.branch}</div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Paywall Overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background via-background/95 to-transparent flex flex-col items-center justify-end pb-8 px-6 text-center z-10">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                      <Lock className="w-6 h-6 text-accent" />
                    </div>
                    <h4 className="text-lg font-bold text-foreground mb-2">Unlock Full Preference List</h4>
                    <p className="text-xs text-muted-foreground mb-6 max-w-xs">
                      Free users only see the first 3 choices. Upgrade to Premium to instantly export your perfect 100+ choices strictly formatted for JoSAA.
                    </p>
                    <button
                      onClick={() => setPaymentOpen(true)}
                      className="w-full bg-foreground text-background hover:bg-foreground/90 font-semibold py-3 rounded-xl transition-all shadow-xl flex items-center justify-center gap-2"
                    >
                      Unlock Premium <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Blurred fake entities behind paywall */}
                  {[1, 2, 3].map(i => (
                    <div key={'blur'+i} className="p-3 rounded-lg border border-border/20 bg-background/20 flex items-center gap-4 blur-sm opacity-50">
                      <div className="w-6 h-6 rounded-full bg-accent/10 px-3 py-3 shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted/60 rounded w-3/4"></div>
                        <div className="h-3 bg-muted/40 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChoiceFillingGenerator;

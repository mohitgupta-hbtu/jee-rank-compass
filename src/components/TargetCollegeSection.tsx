import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, ArrowRight, Award, Zap, ChevronRight, School, GraduationCap, ChevronDown, Search } from "lucide-react";
import { collegesData } from "@/lib/collegeDatabase";
import { SCORE_PERCENTILE_TABLE, ADV_SCORE_RANK_TABLE } from "@/lib/rankPredictor";

const TOTAL_CANDIDATES_2025 = 1320000;

// Reverse interpolation for JEE Main (Rank -> Percentile -> Score)
const getRequiredMainScore = (targetRank: number): number => {
  const targetPercentile = 100 - ((targetRank * 100) / TOTAL_CANDIDATES_2025);
  // Find score in SCORE_PERCENTILE_TABLE (index 4 is 2025 predicted percentile)
  for (let i = 0; i < SCORE_PERCENTILE_TABLE.length - 1; i++) {
    const pTop = SCORE_PERCENTILE_TABLE[i][4];
    const pBottom = SCORE_PERCENTILE_TABLE[i + 1][4];
    if (targetPercentile <= pTop && targetPercentile >= pBottom) {
      // Linear interpolate score
      const fraction = (targetPercentile - pBottom) / (pTop - pBottom);
      const scoreDiff = SCORE_PERCENTILE_TABLE[i][0] - SCORE_PERCENTILE_TABLE[i+1][0];
      return Math.round(SCORE_PERCENTILE_TABLE[i+1][0] + (scoreDiff * fraction));
    }
  }
  return targetPercentile >= 99.99 ? 300 : 0;
};

// Reverse interpolation for JEE Advanced (Rank -> Score)
const getRequiredAdvScore = (targetRank: number): number => {
  for (let i = 0; i < ADV_SCORE_RANK_TABLE.length - 1; i++) {
    const rTop = ADV_SCORE_RANK_TABLE[i][1];
    const rBottom = ADV_SCORE_RANK_TABLE[i + 1][1];
    if (targetRank >= rTop && targetRank <= rBottom) {
      const fraction = (targetRank - rTop) / (rBottom - rTop);
      const scoreDiff = ADV_SCORE_RANK_TABLE[i][0] - ADV_SCORE_RANK_TABLE[i+1][0];
      return Math.round(ADV_SCORE_RANK_TABLE[i][0] - (scoreDiff * fraction));
    }
  }
  return targetRank <= 1 ? 360 : 0;
};

const TargetCollegeSection = () => {
  const [collegeName, setCollegeName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [category, setCategory] = useState<"General" | "OBC" | "SC" | "ST">("General");

  const [collegeOpen, setCollegeOpen] = useState(false);
  const [collegeSearch, setCollegeSearch] = useState("");
  const collegeRef = useRef<HTMLDivElement>(null);

  const [branchOpen, setBranchOpen] = useState(false);
  const [branchSearch, setBranchSearch] = useState("");
  const branchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (collegeRef.current && !collegeRef.current.contains(e.target as Node)) {
        setCollegeOpen(false);
      }
      if (branchRef.current && !branchRef.current.contains(e.target as Node)) {
        setBranchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Get unique colleges safely
  const allColleges = [...new Set(collegesData.map(c => c.name))];
  const filteredColleges = allColleges.filter(c => c.toLowerCase().includes(collegeSearch.toLowerCase()));

  const selectedCollegeObj = collegesData.find(c => c.name === collegeName);
  const allBranches = selectedCollegeObj 
    ? [...new Set(selectedCollegeObj.branches2024.map(b => b.branch))] 
    : [];
  const filteredBranches = allBranches.filter(b => b.toLowerCase().includes(branchSearch.toLowerCase()));

  const targetResult = useMemo(() => {
    if (!selectedCollegeObj || !branchName) return null;
    const branchData = selectedCollegeObj.branches2024.find(b => b.branch === branchName);
    if (!branchData) return null;

    let cr = 0;
    if (category === "General") cr = branchData.generalCR;
    if (category === "OBC") cr = branchData.obcCR;
    if (category === "SC") cr = branchData.scCR;
    if (category === "ST") cr = branchData.stCR;

    // Safety margin mechanism (aim 10% higher rank for safety)
    const safeRank = Math.round(cr * 0.9);

    // Convert Category Rank to Approximate Common Rank List (CRL)
    // JoSAA cutoffs are Category ranks, but Score/Percentile tables need CRL.
    let crlRank = safeRank;
    if (category === "OBC") crlRank = Math.round(safeRank * 4);
    if (category === "SC") crlRank = Math.round(safeRank * 18);
    if (category === "ST") crlRank = Math.round(safeRank * 50);

    let requiredScore = 0;
    const isAdv = selectedCollegeObj.type === "IIT";
    
    if (isAdv) {
      requiredScore = getRequiredAdvScore(crlRank);
    } else {
      requiredScore = getRequiredMainScore(crlRank);
    }

    return {
      rankCutoff: cr,
      safeRank: safeRank,
      score: requiredScore,
      outOf: isAdv ? 360 : 300,
      examType: isAdv ? "JEE Advanced" : "JEE Main",
      percentile: isAdv ? null : (100 - ((crlRank * 100) / TOTAL_CANDIDATES_2025)).toFixed(2)
    };
  }, [selectedCollegeObj, branchName, category]);

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-3 px-3 py-1 rounded-full border border-secondary/50 bg-secondary/10 text-xs font-semibold text-secondary">
            <Zap className="w-3 h-3 inline mr-1" /> Premium Feature (Free for now)
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Dream College <span className="gradient-text bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">Target Setter</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose your dream college and branch. RankEdge will reverse-engineer the exact marks and percentile you need to score to guarantee admission.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto bg-muted/20 border border-border/50 rounded-2xl glass-card overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Left Side: Inputs */}
          <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-border/50">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-secondary" /> Set Your Target
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Dream College</label>
                <div ref={collegeRef} className="relative">
                  <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => { setCollegeOpen(!collegeOpen); setCollegeSearch(""); }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/50 border border-border/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all text-left flex items-center justify-between"
                  >
                    <span className="truncate pr-2">{collegeName || "Select a college..."}</span>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0 ${collegeOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {collegeOpen && (
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
                              value={collegeSearch}
                              onChange={(e) => setCollegeSearch(e.target.value)}
                              placeholder="Search college..."
                              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                              autoFocus
                            />
                          </div>
                        </div>
                        <div className="max-h-[250px] overflow-y-auto py-1 scrollbar-thin">
                          {filteredColleges.length === 0 ? (
                            <p className="text-xs text-muted-foreground text-center py-4">No college found</p>
                          ) : (
                            filteredColleges.map((c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => { setCollegeName(c); setBranchName(""); setCollegeOpen(false); }}
                                className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-2 ${
                                  collegeName === c
                                    ? 'bg-secondary/15 text-secondary font-medium'
                                    : 'text-foreground hover:bg-muted/60'
                                }`}
                              >
                                {collegeName === c && <span className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />}
                                <span className="truncate">{c}</span>
                              </button>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <AnimatePresence>
                {collegeName && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Target Branch</label>
                    <div ref={branchRef} className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10 pointer-events-none" />
                      <button
                        type="button"
                        onClick={() => { setBranchOpen(!branchOpen); setBranchSearch(""); }}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/50 border border-border/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all text-left flex items-center justify-between"
                      >
                        <span className="truncate pr-2">{branchName || "Select a branch..."}</span>
                        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0 ${branchOpen ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {branchOpen && (
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
                                  value={branchSearch}
                                  onChange={(e) => setBranchSearch(e.target.value)}
                                  placeholder="Search branch..."
                                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                                  autoFocus
                                />
                              </div>
                            </div>
                            <div className="max-h-[250px] overflow-y-auto py-1 scrollbar-thin">
                              {filteredBranches.length === 0 ? (
                                <p className="text-xs text-muted-foreground text-center py-4">No branch found</p>
                              ) : (
                                filteredBranches.map((b) => (
                                  <button
                                    key={b}
                                    type="button"
                                    onClick={() => { setBranchName(b); setBranchOpen(false); }}
                                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-2 ${
                                      branchName === b
                                        ? 'bg-secondary/15 text-secondary font-medium'
                                        : 'text-foreground hover:bg-muted/60'
                                    }`}
                                  >
                                    {branchName === b && <span className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />}
                                    <span className="truncate">{b}</span>
                                  </button>
                                ))
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Your Category</label>
                <div className="flex gap-2 p-1 bg-muted/30 rounded-lg border border-border/40">
                  {(["General", "OBC", "SC", "ST"] as ReadonlyArray<"General" | "OBC" | "SC" | "ST">).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                        category === cat ? "bg-secondary text-secondary-foreground shadow-sm" : "hover:text-foreground text-muted-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Results */}
          <div className="p-6 md:p-8 bg-background/50 flex flex-col justify-center relative min-h-[300px]">
            <AnimatePresence mode="wait">
              {!targetResult ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-center text-muted-foreground flex flex-col items-center gap-3"
                >
                  <Award className="w-12 h-12 text-muted-foreground/30" />
                  <p className="text-sm max-w-[250px]">Select your dream college and branch to see the exact score needed.</p>
                </motion.div>
              ) : (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="space-y-6 w-full"
                >
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Required Score</p>
                    <div className="text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-secondary inline-block drop-shadow-lg">
                      {targetResult.score}+
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">out of {targetResult.outOf} in {targetResult.examType}</p>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-border/40">
                    {targetResult.percentile && (
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30">
                        <span className="text-sm text-muted-foreground font-medium">Safe Percentile</span>
                        <span className="text-sm font-bold text-primary">{targetResult.percentile}%ile</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30">
                      <span className="text-sm text-muted-foreground font-medium">Safe Rank To Aim For</span>
                      <span className="text-sm font-bold text-secondary">#{targetResult.safeRank.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-1">
                      <span className="text-xs text-muted-foreground">JoSAA Cutoff (2025 boundary)</span>
                      <span className="text-xs text-muted-foreground">#{targetResult.rankCutoff.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TargetCollegeSection;

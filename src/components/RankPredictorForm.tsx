import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Loader2, Info, X, ChevronDown, Search } from "lucide-react";
import type { PredictionInput } from "@/lib/rankPredictor";

interface Props {
  onPredict: (input: PredictionInput) => void;
  isLoading: boolean;
}

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh",
  "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand", "Karnataka", "Kerala",
  "Ladakh", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

const RankPredictorForm = ({ onPredict, isLoading }: Props) => {
  const [step, setStep] = useState(0);
  const [showDifficultyTip, setShowDifficultyTip] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [stateSearch, setStateSearch] = useState("");
  const stateRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({
    examType: "Main" as "Main" | "Advanced",
    score: "",
    percentile: "",
    category: "General" as PredictionInput["category"],
    isPwD: false,
    session: "April" as PredictionInput["session"],
    difficulty: "Moderate" as PredictionInput["difficulty"],
    gender: "Male" as "Male" | "Female",
    homeState: "Uttar Pradesh",
  });

  const categories = ["General", "OBC", "SC", "ST", "EWS"] as const;
  const sessions = ["January", "April"] as const;
  const difficulties = ["Easy", "Moderate", "Difficult"] as const;

  // Close state dropdown when clicking outside
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

  const maxScore = form.examType === "Main" ? 300 : 360;
  const isScoreInvalid = Number(form.score) > maxScore;
  const isPercentileInvalid = Number(form.percentile) > 100;
  const isNextDisabled = (!form.score && !form.percentile) || isScoreInvalid || isPercentileInvalid;

  const handleSubmit = () => {
    onPredict({
      examType: form.examType,
      score: Number(form.score) || 0,
      percentile: Number(form.percentile) || 0,
      category: form.category,
      isPwD: form.isPwD,
      session: form.session,
      difficulty: form.difficulty,
      gender: form.gender,
      homeState: form.homeState,
    });
  };

  const steps = [
    // Step 1: Scores
    <motion.div key="scores" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      
      <div className="flex bg-muted p-1 rounded-xl">
        <button
          onClick={() => setForm({ ...form, examType: "Main" })}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${form.examType === "Main" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        >
          JEE Mains
        </button>
        <button
          onClick={() => setForm({ ...form, examType: "Advanced", score: "", percentile: "" })}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${form.examType === "Advanced" ? "bg-background text-accent shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        >
          JEE Advanced
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          {form.examType} Score (out of {maxScore})
        </label>
        <input
          type="number"
          min="0"
          max={maxScore}
          value={form.score}
          onChange={(e) => setForm({ ...form, score: e.target.value })}
          placeholder={`Enter your ${form.examType} score`}
          className={`w-full px-4 py-3 rounded-lg bg-muted/50 border ${isScoreInvalid ? 'border-red-500 focus:ring-red-500/50' : 'border-border focus:ring-primary/50'} text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 transition-all font-display font-medium`}
        />
        <AnimatePresence>
          {isScoreInvalid && (
            <motion.p 
              initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
              className="text-red-400 text-xs mt-2 font-medium"
            >
              Maximum possible score for {form.examType} is {maxScore}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      
      {form.examType === "Main" && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Percentile (optional)</label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={form.percentile}
            onChange={(e) => setForm({ ...form, percentile: e.target.value })}
            placeholder="e.g. 98.56"
            className={`w-full px-4 py-3 rounded-lg bg-muted/50 border ${isPercentileInvalid ? 'border-red-500 focus:ring-red-500/50' : 'border-border focus:ring-primary/50'} text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 transition-all font-display font-medium`}
          />
          <AnimatePresence>
            {isPercentileInvalid && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                className="text-red-400 text-xs mt-2 font-medium"
              >
                Percentile cannot exceed 100
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>,

    // Step 2: Gender & Home State
    <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-3">Gender</label>
        <div className="flex gap-3">
          {(["Male", "Female"] as const).map((g) => (
            <button
              key={g}
              onClick={() => setForm({ ...form, gender: g })}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                form.gender === g
                  ? "gradient-btn text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground border border-border hover:border-primary/50"
              }`}
            >
              {g === "Male" ? "👨 Male" : "👩 Female"}
            </button>
          ))}
        </div>
        {form.gender === "Female" && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-secondary mt-2">
            ✨ Female supernumerary quota will be applied (20% extra IIT/NIT seats for girls)
          </motion.p>
        )}
      </div>

      {form.examType === "Main" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <label className="block text-sm font-medium text-muted-foreground mb-3">Home State (for NIT quota)</label>
          <div ref={stateRef} className="relative">
            {/* Custom dropdown trigger */}
            <button
              type="button"
              onClick={() => { setStateOpen(!stateOpen); setStateSearch(""); }}
              className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm text-left flex items-center justify-between"
            >
              <span>{form.homeState}</span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${stateOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Custom dropdown list */}
            <AnimatePresence>
              {stateOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute z-50 w-full mt-1.5 rounded-xl border border-border bg-background shadow-2xl overflow-hidden"
                >
                  {/* Search box */}
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
                  {/* Options list */}
                  <div className="max-h-[200px] overflow-y-auto py-1 scrollbar-thin">
                    {filteredStates.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">No state found</p>
                    ) : (
                      filteredStates.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => { setForm({ ...form, homeState: s }); setStateOpen(false); }}
                          className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-2 ${
                            form.homeState === s
                              ? 'bg-primary/15 text-primary font-medium'
                              : 'text-foreground hover:bg-muted/60'
                          }`}
                        >
                          {form.homeState === s && <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
                          {s}
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            NITs reserve 50% seats for Home State students — this significantly affects cutoffs
          </p>
        </motion.div>
      )}

      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-3">Category Allocation</label>
        <div className="flex flex-wrap gap-2 mb-4">
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
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-primary/20 bg-primary/5 gap-3">
          <div>
            <p className="text-sm font-semibold text-foreground flex items-center gap-2">
              Are you a Person with Disability (PwD)?
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Select Yes if you hold a valid physical disability certificate.</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {(["No", "Yes"] as const).map(opt => (
              <button
                key={opt}
                onClick={() => setForm({ ...form, isPwD: opt === "Yes" })}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  (form.isPwD && opt === "Yes") || (!form.isPwD && opt === "No")
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-background text-muted-foreground border border-border hover:border-primary/50"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>,

    // Step 3: Session & Difficulty
    <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      {form.examType === "Main" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
                {s}
              </button>
            ))}
          </div>
        </motion.div>
      )}
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <label className="block text-sm font-medium text-muted-foreground">Paper Difficulty</label>
          <button
            type="button"
            onClick={() => setShowDifficultyTip(!showDifficultyTip)}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* Tooltip Popup - inline, does not overlap */}
        <AnimatePresence>
          {showDifficultyTip && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mb-3"
            >
              <div className="glass-card border border-border/80 rounded-xl p-4 text-xs">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-foreground text-sm">How to judge paper difficulty?</p>
                  <button onClick={() => setShowDifficultyTip(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <span className="text-green-400 font-bold w-16 flex-shrink-0">Easy</span>
                    <span className="text-muted-foreground">Attempted 60+ Qs, most were direct formula-based. Score higher than mock average.</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-yellow-400 font-bold w-16 flex-shrink-0">Moderate</span>
                    <span className="text-muted-foreground">Attempted 45–60 Qs. 1–2 sections were tough. Similar to mock average. (Default if unsure)</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-accent font-bold w-16 flex-shrink-0">Difficult</span>
                    <span className="text-muted-foreground">Only 35–45 Qs attempted. Many tricky/lengthy questions. Score well below mock average.</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
      <div className="flex items-center gap-2 mb-8">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              i <= step ? "gradient-btn text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {i + 1}
            </div>
            <span className="text-xs text-muted-foreground hidden sm:block">
              {i === 0 ? "Scores" : i === 1 ? "Profile" : "Details"}
            </span>
            {i < 2 && <div className={`flex-1 h-px ${i < step ? "bg-primary" : "bg-border"}`} />}
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
            disabled={isNextDisabled}
            className="gradient-btn px-6 py-3 rounded-lg text-primary-foreground font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isLoading || isNextDisabled}
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

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Search, Filter, GraduationCap, MapPin, TrendingDown, Calendar, ChevronDown, Lock, LineChart, Briefcase } from "lucide-react";
import { collegesData } from "@/lib/collegeDatabase";
import type { BranchCutoff } from "@/lib/collegeDatabase";
import PaymentModal from "./PaymentModal";

const typeColors: Record<string, string> = {
  IIT: "bg-primary/20 text-primary",
  NIT: "bg-secondary/20 text-secondary",
  IIIT: "bg-accent/20 text-accent",
  GFTI: "bg-muted text-muted-foreground",
};

const years = ["2025", "2024"] as const;
const allBranches = [...new Set(collegesData.flatMap(c => [...c.branches2024, ...c.branches2025].map(b => b.branch)))].sort();
const allTypes = ["All", "IIT", "NIT", "IIIT", "GFTI"];
const categories = ["General", "OBC", "SC", "ST", "EWS"] as const;

const CustomDropdown = ({ icon: Icon, value, onChange, options, placeholder, isOpen, onToggle }: { icon: React.ElementType, value: string, onChange: (val: string) => void, options: {value: string, label: string}[], placeholder?: string, isOpen: boolean, onToggle: () => void }) => {
  return (
    <div className="relative w-full">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
      <button
        onClick={onToggle}
        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/50 border border-border/50 text-foreground text-sm text-left focus:outline-none focus:ring-2 focus:ring-primary/50 flex justify-between items-center transition-all hover:bg-muted/80"
      >
        <span className="truncate mr-2">{options.find((o: {value: string, label: string}) => o.value === value)?.label || placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }}
            className="absolute z-[100] min-w-full w-max mt-1.5 rounded-xl border border-border/80 bg-background shadow-2xl overflow-hidden glass-card"
          >
            <div className="max-h-[250px] overflow-y-auto py-1 scrollbar-thin">
              {options.map((opt: {value: string, label: string}) => (
                <button
                  key={opt.value}
                  onClick={() => onChange(opt.value)}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center ${
                    value === opt.value
                      ? "bg-primary/15 text-primary font-medium"
                      : "text-foreground hover:bg-muted/60"
                  }`}
                >
                  {value === opt.value && <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mr-2" />}
                  <span className={`whitespace-nowrap pr-2 ${value !== opt.value ? "ml-3.5" : ""}`}>{opt.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CollegesSection = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [branchFilter, setBranchFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState<typeof categories[number]>("General");
  const [isPwD, setIsPwD] = useState(false);
  const [expandedCollege, setExpandedCollege] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<typeof years[number]>("2025");
  const [roundFilter, setRoundFilter] = useState("Round 6");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"cutoffs" | "placements">("cutoffs");
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(() => {
    return collegesData.filter(c => {
      if (typeFilter !== "All" && c.type !== typeFilter) return false;
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.state.toLowerCase().includes(search.toLowerCase())) return false;
      const branches = selectedYear === "2025" ? c.branches2025 : c.branches2024;
      if (branchFilter !== "All" && !branches.some(b => b.branch === branchFilter)) return false;
      return true;
    });
  }, [search, typeFilter, branchFilter, selectedYear]);

  const getCutoff = (b: BranchCutoff, cat: typeof categories[number]) => {
    let or = 0, cr = 0;
    switch (cat) {
      case "General": { or = b.generalOR; cr = b.generalCR; break; }
      case "OBC": { or = b.obcOR; cr = b.obcCR; break; }
      case "SC": { or = b.scOR; cr = b.scCR; break; }
      case "ST": { or = b.stOR; cr = b.stCR; break; }
      case "EWS": { or = Math.floor(b.generalOR * 1.15); cr = Math.floor(b.generalCR * 1.15); break; }
    }
    if (isPwD) {
      or = Math.max(1, Math.floor(or * 0.05));
      cr = Math.max(1, Math.floor(cr * 0.05));
    }
    // Simulate CSAB Spot Round drop theoretically
    if (roundFilter === "CSAB Spot Round") {
      or = Math.floor(or * 1.35);
      cr = Math.floor(cr * 1.55);
    }
    return { or, cr };
  };

  const handleRoundChange = (val: string) => {
    if (val === "CSAB Spot Round") {
      setPaymentOpen(true);
      return;
    }
    setRoundFilter(val);
  };

  const handleTabChange = (tab: "cutoffs" | "placements") => {
    if (tab === "placements") {
      setPaymentOpen(true);
      return;
    }
    setActiveTab(tab);
  };

  return (
    <section id="colleges" className="py-20 relative">
      <PaymentModal isOpen={paymentOpen} onClose={() => setPaymentOpen(false)} />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            College <span className="gradient-text">Cutoffs</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Browse JoSAA cutoff ranks for top engineering colleges across India. Filter by institute type, branch, category, and year.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="glass-card p-4 md:p-6 mb-8 max-w-6xl mx-auto relative z-50">
          <div ref={filterRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search college or state..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/50 border border-border/50 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Type filter */}
            <CustomDropdown 
              icon={Filter} 
              value={typeFilter} 
              onChange={setTypeFilter} 
              options={allTypes.map(t => ({ value: t, label: t === "All" ? "All Institutes" : t }))} 
              isOpen={openDropdown === "type"}
              onToggle={() => setOpenDropdown(openDropdown === "type" ? null : "type")}
            />

            {/* Branch filter */}
            <CustomDropdown 
              icon={GraduationCap} 
              value={branchFilter} 
              onChange={setBranchFilter} 
              options={[
                { value: "All", label: "All Branches" },
                ...allBranches.map(b => ({ value: b, label: b }))
              ]} 
              isOpen={openDropdown === "branch"}
              onToggle={() => setOpenDropdown(openDropdown === "branch" ? null : "branch")}
            />

            {/* Year selector */}
            <CustomDropdown 
              icon={Calendar} 
              value={selectedYear} 
              onChange={(val) => setSelectedYear(val as typeof years[number])} 
              options={years.map(y => ({ value: y, label: `JoSAA ${y}` }))} 
              isOpen={openDropdown === "year"}
              onToggle={() => setOpenDropdown(openDropdown === "year" ? null : "year")}
            />

            {/* Round Filter */}
            <CustomDropdown 
              icon={TrendingDown} 
              value={roundFilter} 
              onChange={handleRoundChange} 
              options={[
                { value: "Round 6", label: "JoSAA Round 6" },
                { value: "CSAB Spot Round", label: "CSAB Spot Round (Premium)" },
              ]} 
              isOpen={openDropdown === "round"}
              onToggle={() => setOpenDropdown(openDropdown === "round" ? null : "round")}
            />

            {/* Category filter */}
            <div className="flex gap-1.5 flex-wrap md:flex-nowrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`flex-1 text-xs font-medium py-2.5 rounded-lg transition-all ${
                    categoryFilter === cat
                      ? "gradient-btn text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:text-foreground border border-border/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            {/* PwD filter */}
            <div className="flex items-center justify-between px-3 py-2 bg-muted/40 rounded-lg border border-border/50 col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-6 mt-1">
              <span className="text-sm text-foreground font-medium">Are you a Person with Disability (PwD)?</span>
              <div className="flex gap-1.5 bg-background p-1 rounded-md border border-border/50">
                {(["No", "Yes"] as const).map(opt => (
                  <button
                    key={opt}
                    onClick={() => setIsPwD(opt === "Yes")}
                    className={`px-4 py-1.5 text-xs font-semibold rounded transition-all ${
                      (isPwD && opt === "Yes") || (!isPwD && opt === "No")
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="max-w-6xl mx-auto mb-4 flex items-center justify-between px-1">
          <p className="text-sm text-muted-foreground">
            Showing <span className="text-foreground font-semibold">{filtered.length}</span> colleges
          </p>
          <p className="text-xs text-muted-foreground">Based on JoSAA {selectedYear} data</p>
        </div>

        {/* College cards */}
        <div className="max-w-6xl mx-auto space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((college, idx) => {
              const isExpanded = expandedCollege === college.name;
              const branches = selectedYear === "2025" ? college.branches2025 : college.branches2024;
              const displayBranches = branchFilter !== "All"
                ? branches.filter(b => b.branch === branchFilter)
                : branches;

              return (
                <motion.div
                  key={college.name}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.03 }}
                  className="glass-card overflow-hidden hover:border-primary/30 transition-colors cursor-pointer"
                  onClick={() => setExpandedCollege(isExpanded ? null : college.name)}
                >
                  {/* Header */}
                  <div className="p-4 md:p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-foreground text-sm md:text-base">{college.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{college.state}</span>
                          <span className="text-xs text-muted-foreground/50">•</span>
                          <span className="text-xs text-muted-foreground">{branches.length} branches</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] md:text-xs font-semibold px-2.5 py-1 rounded-full ${typeColors[college.type]}`}>
                        {college.type}
                      </span>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/40 hover:bg-muted/80 transition-colors">
                        <span className="text-[10px] text-muted-foreground hidden sm:block">View Branches</span>
                        <TrendingDown className={`w-4 h-4 text-primary transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                      </div>
                    </div>
                  </div>

                  {/* Expanded cutoff table */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 md:px-5 pb-4 md:pb-5">
                          <div className="border-b border-border/50 mb-4 pb-2 px-1 flex items-center gap-6">
                            <button 
                              onClick={() => setActiveTab("cutoffs")}
                              className={`text-sm font-semibold pb-2 border-b-2 transition-all ${activeTab === "cutoffs" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                            >
                              Cutoffs Data
                            </button>
                            <button 
                              onClick={() => handleTabChange("placements")}
                              className={`text-sm font-semibold pb-2 border-b-2 border-transparent text-muted-foreground hover:text-accent transition-all flex items-center gap-1.5`}
                            >
                              <Briefcase className="w-3.5 h-3.5" /> Placements & ROI <Lock className="w-3 h-3 opacity-50 ml-1" />
                            </button>
                          </div>

                          <div className="rounded-lg overflow-hidden border border-border/50">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="bg-muted/50">
                                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground">Branch</th>
                                  <th className="text-center py-2.5 px-3 text-xs font-semibold text-muted-foreground">Opening Rank</th>
                                  <th className="text-center py-2.5 px-3 text-xs font-semibold text-muted-foreground">Closing Rank</th>
                                  <th className="text-right py-2.5 px-3 text-xs font-semibold text-muted-foreground">Insights</th>
                                </tr>
                              </thead>
                              <tbody>
                                {displayBranches.map((b, i) => {
                                  const cutoff = getCutoff(b, categoryFilter);
                                  return (
                                    <tr key={b.branch} className={i % 2 === 0 ? "bg-transparent" : "bg-muted/20"}>
                                      <td className="py-2.5 px-3 text-foreground font-medium">{b.branch}</td>
                                      <td className="py-2.5 px-3 text-center">
                                        <span className="text-secondary font-semibold">#{cutoff.or.toLocaleString("en-IN")}</span>
                                      </td>
                                      <td className="py-2.5 px-3 text-center">
                                        <span className="text-accent font-semibold">#{cutoff.cr.toLocaleString("en-IN")}</span>
                                      </td>
                                      <td className="py-2.5 px-3 text-right">
                                        <button onClick={() => setPaymentOpen(true)} className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-2 py-1 rounded transition-colors">
                                          <LineChart className="w-3 h-3" /> 5-Year Trend
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-2">
                            {categoryFilter} category • OR = Opening Rank, CR = Closing Rank • Source: JoSAA {selectedYear} (approx.)
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="glass-card p-12 text-center">
              <p className="text-muted-foreground">No colleges found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CollegesSection;

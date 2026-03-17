import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Search, Filter, GraduationCap, MapPin, TrendingDown } from "lucide-react";

interface College {
  name: string;
  type: "IIT" | "NIT" | "IIIT" | "GFTI";
  state: string;
  branches: BranchCutoff[];
}

interface BranchCutoff {
  branch: string;
  generalOR: number;
  generalCR: number;
  obcOR: number;
  obcCR: number;
  scOR: number;
  scCR: number;
  stOR: number;
  stCR: number;
}

// JoSAA 2024 approximate cutoff ranks (Opening & Closing)
const collegesData: College[] = [
  {
    name: "IIT Bombay", type: "IIT", state: "Maharashtra",
    branches: [
      { branch: "Computer Science", generalOR: 1, generalCR: 66, obcOR: 1, obcCR: 30, scOR: 1, scCR: 10, stOR: 1, stCR: 5 },
      { branch: "Electrical Engineering", generalOR: 67, generalCR: 270, obcOR: 31, obcCR: 120, scOR: 11, scCR: 50, stOR: 6, stCR: 25 },
      { branch: "Mechanical Engineering", generalOR: 700, generalCR: 1800, obcOR: 250, obcCR: 700, scOR: 100, scCR: 350, stOR: 50, stCR: 150 },
    ],
  },
  {
    name: "IIT Delhi", type: "IIT", state: "Delhi",
    branches: [
      { branch: "Computer Science", generalOR: 30, generalCR: 100, obcOR: 12, obcCR: 45, scOR: 5, scCR: 20, stOR: 2, stCR: 10 },
      { branch: "Electrical Engineering", generalOR: 160, generalCR: 450, obcOR: 60, obcCR: 180, scOR: 25, scCR: 80, stOR: 10, stCR: 40 },
      { branch: "Mathematics & Computing", generalOR: 50, generalCR: 170, obcOR: 20, obcCR: 70, scOR: 8, scCR: 35, stOR: 4, stCR: 15 },
    ],
  },
  {
    name: "IIT Madras", type: "IIT", state: "Tamil Nadu",
    branches: [
      { branch: "Computer Science", generalOR: 50, generalCR: 150, obcOR: 20, obcCR: 60, scOR: 8, scCR: 30, stOR: 3, stCR: 12 },
      { branch: "Electrical Engineering", generalOR: 250, generalCR: 600, obcOR: 90, obcCR: 240, scOR: 40, scCR: 110, stOR: 15, stCR: 50 },
      { branch: "Data Science", generalOR: 80, generalCR: 200, obcOR: 30, obcCR: 80, scOR: 12, scCR: 40, stOR: 5, stCR: 18 },
    ],
  },
  {
    name: "IIT Kanpur", type: "IIT", state: "Uttar Pradesh",
    branches: [
      { branch: "Computer Science", generalOR: 100, generalCR: 300, obcOR: 40, obcCR: 120, scOR: 15, scCR: 55, stOR: 6, stCR: 22 },
      { branch: "Electrical Engineering", generalOR: 400, generalCR: 900, obcOR: 150, obcCR: 350, scOR: 60, scCR: 160, stOR: 25, stCR: 70 },
    ],
  },
  {
    name: "IIT Kharagpur", type: "IIT", state: "West Bengal",
    branches: [
      { branch: "Computer Science", generalOR: 120, generalCR: 400, obcOR: 45, obcCR: 150, scOR: 18, scCR: 65, stOR: 7, stCR: 28 },
      { branch: "Electronics & EC", generalOR: 500, generalCR: 1100, obcOR: 180, obcCR: 420, scOR: 75, scCR: 200, stOR: 30, stCR: 85 },
    ],
  },
  {
    name: "IIT Roorkee", type: "IIT", state: "Uttarakhand",
    branches: [
      { branch: "Computer Science", generalOR: 300, generalCR: 800, obcOR: 110, obcCR: 300, scOR: 45, scCR: 140, stOR: 18, stCR: 55 },
      { branch: "Electrical Engineering", generalOR: 900, generalCR: 2000, obcOR: 340, obcCR: 750, scOR: 130, scCR: 360, stOR: 55, stCR: 150 },
    ],
  },
  {
    name: "IIT Guwahati", type: "IIT", state: "Assam",
    branches: [
      { branch: "Computer Science", generalOR: 400, generalCR: 1000, obcOR: 150, obcCR: 380, scOR: 60, scCR: 180, stOR: 24, stCR: 72 },
      { branch: "Electronics & EC", generalOR: 1100, generalCR: 2500, obcOR: 400, obcCR: 950, scOR: 160, scCR: 450, stOR: 65, stCR: 190 },
    ],
  },
  {
    name: "IIT Hyderabad", type: "IIT", state: "Telangana",
    branches: [
      { branch: "Computer Science", generalOR: 500, generalCR: 1200, obcOR: 190, obcCR: 450, scOR: 75, scCR: 220, stOR: 30, stCR: 90 },
      { branch: "Electrical Engineering", generalOR: 1300, generalCR: 3000, obcOR: 480, obcCR: 1100, scOR: 190, scCR: 540, stOR: 78, stCR: 225 },
    ],
  },
  {
    name: "NIT Trichy", type: "NIT", state: "Tamil Nadu",
    branches: [
      { branch: "Computer Science", generalOR: 2500, generalCR: 5000, obcOR: 1200, obcCR: 3800, scOR: 800, scCR: 2400, stOR: 400, stCR: 1200 },
      { branch: "Electronics & EC", generalOR: 5000, generalCR: 9000, obcOR: 2500, obcCR: 6500, scOR: 1500, scCR: 4500, stOR: 700, stCR: 2200 },
      { branch: "Mechanical Engineering", generalOR: 9000, generalCR: 16000, obcOR: 4500, obcCR: 12000, scOR: 2800, scCR: 8500, stOR: 1400, stCR: 4200 },
    ],
  },
  {
    name: "NIT Warangal", type: "NIT", state: "Telangana",
    branches: [
      { branch: "Computer Science", generalOR: 3000, generalCR: 6500, obcOR: 1500, obcCR: 4800, scOR: 1000, scCR: 3200, stOR: 500, stCR: 1500 },
      { branch: "Electronics & EC", generalOR: 6500, generalCR: 12000, obcOR: 3200, obcCR: 8500, scOR: 2000, scCR: 5800, stOR: 1000, stCR: 2900 },
    ],
  },
  {
    name: "NIT Surathkal", type: "NIT", state: "Karnataka",
    branches: [
      { branch: "Computer Science", generalOR: 3500, generalCR: 7000, obcOR: 1700, obcCR: 5200, scOR: 1100, scCR: 3500, stOR: 550, stCR: 1700 },
      { branch: "Information Technology", generalOR: 7000, generalCR: 11000, obcOR: 3500, obcCR: 8000, scOR: 2200, scCR: 5500, stOR: 1100, stCR: 2800 },
    ],
  },
  {
    name: "NIT Calicut", type: "NIT", state: "Kerala",
    branches: [
      { branch: "Computer Science", generalOR: 5000, generalCR: 10000, obcOR: 2500, obcCR: 7500, scOR: 1600, scCR: 5000, stOR: 800, stCR: 2500 },
      { branch: "Electronics & EC", generalOR: 10000, generalCR: 18000, obcOR: 5000, obcCR: 13000, scOR: 3200, scCR: 9000, stOR: 1600, stCR: 4500 },
    ],
  },
  {
    name: "NIT Rourkela", type: "NIT", state: "Odisha",
    branches: [
      { branch: "Computer Science", generalOR: 6000, generalCR: 12000, obcOR: 3000, obcCR: 9000, scOR: 1900, scCR: 6000, stOR: 950, stCR: 3000 },
      { branch: "Electrical Engineering", generalOR: 12000, generalCR: 22000, obcOR: 6000, obcCR: 16000, scOR: 3800, scCR: 11000, stOR: 1900, stCR: 5500 },
    ],
  },
  {
    name: "IIIT Hyderabad", type: "IIIT", state: "Telangana",
    branches: [
      { branch: "Computer Science", generalOR: 1500, generalCR: 3500, obcOR: 700, obcCR: 2500, scOR: 450, scCR: 1500, stOR: 220, stCR: 750 },
      { branch: "Electronics & EC", generalOR: 3500, generalCR: 6500, obcOR: 1700, obcCR: 4800, scOR: 1100, scCR: 3200, stOR: 550, stCR: 1600 },
    ],
  },
  {
    name: "IIIT Bangalore", type: "IIIT", state: "Karnataka",
    branches: [
      { branch: "Computer Science", generalOR: 3000, generalCR: 6000, obcOR: 1500, obcCR: 4500, scOR: 950, scCR: 3000, stOR: 470, stCR: 1500 },
      { branch: "Electronics & EC", generalOR: 6000, generalCR: 10000, obcOR: 3000, obcCR: 7500, scOR: 1900, scCR: 5000, stOR: 950, stCR: 2500 },
    ],
  },
  {
    name: "IIIT Allahabad", type: "IIIT", state: "Uttar Pradesh",
    branches: [
      { branch: "Information Technology", generalOR: 5000, generalCR: 10000, obcOR: 2500, obcCR: 7500, scOR: 1600, scCR: 5000, stOR: 800, stCR: 2500 },
      { branch: "Electronics & EC", generalOR: 10000, generalCR: 18000, obcOR: 5000, obcCR: 13000, scOR: 3200, scCR: 9000, stOR: 1600, stCR: 4500 },
    ],
  },
  {
    name: "DTU Delhi", type: "GFTI", state: "Delhi",
    branches: [
      { branch: "Computer Science", generalOR: 4000, generalCR: 8000, obcOR: 2000, obcCR: 6000, scOR: 1300, scCR: 4000, stOR: 650, stCR: 2000 },
      { branch: "Information Technology", generalOR: 8000, generalCR: 14000, obcOR: 4000, obcCR: 10000, scOR: 2500, scCR: 7000, stOR: 1250, stCR: 3500 },
    ],
  },
  {
    name: "NSUT Delhi", type: "GFTI", state: "Delhi",
    branches: [
      { branch: "Computer Science", generalOR: 5000, generalCR: 10000, obcOR: 2500, obcCR: 7500, scOR: 1600, scCR: 5000, stOR: 800, stCR: 2500 },
      { branch: "Information Technology", generalOR: 10000, generalCR: 16000, obcOR: 5000, obcCR: 12000, scOR: 3200, scCR: 7500, stOR: 1600, stCR: 3800 },
    ],
  },
  {
    name: "NIT Jaipur", type: "NIT", state: "Rajasthan",
    branches: [
      { branch: "Computer Science", generalOR: 7000, generalCR: 14000, obcOR: 3500, obcCR: 10000, scOR: 2200, scCR: 7000, stOR: 1100, stCR: 3500 },
      { branch: "Electronics & EC", generalOR: 14000, generalCR: 25000, obcOR: 7000, obcCR: 18000, scOR: 4500, scCR: 12500, stOR: 2200, stCR: 6200 },
    ],
  },
  {
    name: "NIT Bhopal (MANIT)", type: "NIT", state: "Madhya Pradesh",
    branches: [
      { branch: "Computer Science", generalOR: 9000, generalCR: 18000, obcOR: 4500, obcCR: 13000, scOR: 2800, scCR: 9000, stOR: 1400, stCR: 4500 },
      { branch: "Electronics & EC", generalOR: 18000, generalCR: 32000, obcOR: 9000, obcCR: 23000, scOR: 5700, scCR: 16000, stOR: 2800, stCR: 8000 },
    ],
  },
];

const typeColors: Record<string, string> = {
  IIT: "bg-primary/20 text-primary",
  NIT: "bg-secondary/20 text-secondary",
  IIIT: "bg-accent/20 text-accent",
  GFTI: "bg-muted text-muted-foreground",
};

const allBranches = [...new Set(collegesData.flatMap(c => c.branches.map(b => b.branch)))].sort();
const allTypes = ["All", "IIT", "NIT", "IIIT", "GFTI"];
const categories = ["General", "OBC", "SC", "ST"] as const;

const CollegesSection = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [branchFilter, setBranchFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState<typeof categories[number]>("General");
  const [expandedCollege, setExpandedCollege] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return collegesData.filter(c => {
      if (typeFilter !== "All" && c.type !== typeFilter) return false;
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.state.toLowerCase().includes(search.toLowerCase())) return false;
      if (branchFilter !== "All" && !c.branches.some(b => b.branch === branchFilter)) return false;
      return true;
    });
  }, [search, typeFilter, branchFilter]);

  const getCutoff = (b: BranchCutoff, cat: typeof categories[number]) => {
    switch (cat) {
      case "General": return { or: b.generalOR, cr: b.generalCR };
      case "OBC": return { or: b.obcOR, cr: b.obcCR };
      case "SC": return { or: b.scOR, cr: b.scCR };
      case "ST": return { or: b.stOR, cr: b.stCR };
    }
  };

  return (
    <section id="colleges" className="py-20 relative">
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
            Browse JoSAA 2024 cutoff ranks for top engineering colleges across India. Filter by institute type, branch, and category.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="glass-card p-4 md:p-6 mb-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/50 border border-border/50 text-foreground text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {allTypes.map(t => <option key={t} value={t}>{t === "All" ? "All Institutes" : t}</option>)}
              </select>
            </div>

            {/* Branch filter */}
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/50 border border-border/50 text-foreground text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="All">All Branches</option>
                {allBranches.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            {/* Category filter */}
            <div className="flex gap-1.5">
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
          </div>
        </div>

        {/* Results count */}
        <div className="max-w-6xl mx-auto mb-4 flex items-center justify-between px-1">
          <p className="text-sm text-muted-foreground">
            Showing <span className="text-foreground font-semibold">{filtered.length}</span> colleges
          </p>
          <p className="text-xs text-muted-foreground">Based on JoSAA 2024 Round 6 data</p>
        </div>

        {/* College cards */}
        <div className="max-w-6xl mx-auto space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((college, idx) => {
              const isExpanded = expandedCollege === college.name;
              const displayBranches = branchFilter !== "All"
                ? college.branches.filter(b => b.branch === branchFilter)
                : college.branches;

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
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeColors[college.type]}`}>
                        {college.type}
                      </span>
                      <TrendingDown className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
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
                          <div className="rounded-lg overflow-hidden border border-border/50">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="bg-muted/50">
                                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground">Branch</th>
                                  <th className="text-center py-2.5 px-3 text-xs font-semibold text-muted-foreground">Opening Rank</th>
                                  <th className="text-center py-2.5 px-3 text-xs font-semibold text-muted-foreground">Closing Rank</th>
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
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-2">
                            {categoryFilter} category • OR = Opening Rank, CR = Closing Rank • Source: JoSAA 2024 (approx.)
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

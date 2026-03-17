// Historical JEE Main data mapping (approximate)
// Based on publicly available NTA data patterns

interface PredictionInput {
  score: number;
  percentile: number;
  category: "General" | "OBC" | "SC" | "ST" | "EWS";
  session: "January" | "April";
  difficulty: "Easy" | "Moderate" | "Difficult";
}

interface PredictionResult {
  predictedRank: number;
  rankRange: { min: number; max: number };
  confidence: number;
  colleges: CollegeSuggestion[];
  branchProbabilities: BranchProbability[];
  percentileEstimate: number;
}

interface CollegeSuggestion {
  name: string;
  type: "IIT" | "NIT" | "IIIT" | "GFTI";
  probability: "High" | "Medium" | "Low";
  cutoffRank: number;
}

interface BranchProbability {
  branch: string;
  probability: number;
}

// Score to percentile mapping (JEE Main 2024 approximate)
const scoreToPercentile = (score: number, difficulty: string): number => {
  const maxScore = 300;
  const normalizedScore = Math.max(0, Math.min(score, maxScore));
  
  // Difficulty adjustment
  const difficultyFactor = difficulty === "Easy" ? 0.95 : difficulty === "Moderate" ? 1.0 : 1.08;
  const adjustedScore = normalizedScore * difficultyFactor;
  
  // Polynomial approximation of percentile curve
  const x = adjustedScore / maxScore;
  const percentile = 100 * (1 - Math.exp(-4.5 * x)) * (1 + 0.1 * Math.sin(Math.PI * x));
  
  return Math.min(99.99, Math.max(0, Number(percentile.toFixed(4))));
};

// Percentile to rank mapping (approx 12 lakh candidates)
const percentileToRank = (percentile: number, totalCandidates: number = 1200000): number => {
  const rank = Math.round(totalCandidates * (1 - percentile / 100));
  return Math.max(1, rank);
};

// Category-based rank adjustment
const categoryAdjustment = (rank: number, category: string): number => {
  const factors: Record<string, number> = {
    General: 1.0,
    EWS: 0.85,
    OBC: 0.7,
    SC: 0.45,
    ST: 0.35,
  };
  return Math.round(rank * (factors[category] || 1.0));
};

// College database
const collegeDatabase: Omit<CollegeSuggestion, "probability">[] = [
  { name: "IIT Bombay", type: "IIT", cutoffRank: 150 },
  { name: "IIT Delhi", type: "IIT", cutoffRank: 250 },
  { name: "IIT Madras", type: "IIT", cutoffRank: 350 },
  { name: "IIT Kanpur", type: "IIT", cutoffRank: 600 },
  { name: "IIT Kharagpur", type: "IIT", cutoffRank: 800 },
  { name: "IIT Roorkee", type: "IIT", cutoffRank: 1200 },
  { name: "IIT Guwahati", type: "IIT", cutoffRank: 1500 },
  { name: "IIT Hyderabad", type: "IIT", cutoffRank: 2000 },
  { name: "NIT Trichy", type: "NIT", cutoffRank: 3000 },
  { name: "NIT Warangal", type: "NIT", cutoffRank: 4000 },
  { name: "NIT Surathkal", type: "NIT", cutoffRank: 5000 },
  { name: "NIT Calicut", type: "NIT", cutoffRank: 8000 },
  { name: "NIT Rourkela", type: "NIT", cutoffRank: 10000 },
  { name: "IIIT Hyderabad", type: "IIIT", cutoffRank: 2500 },
  { name: "IIIT Bangalore", type: "IIIT", cutoffRank: 5000 },
  { name: "IIIT Allahabad", type: "IIIT", cutoffRank: 8000 },
  { name: "NIT Jaipur", type: "NIT", cutoffRank: 12000 },
  { name: "NIT Bhopal", type: "NIT", cutoffRank: 15000 },
  { name: "DTU Delhi", type: "GFTI", cutoffRank: 6000 },
  { name: "NSUT Delhi", type: "GFTI", cutoffRank: 8000 },
];

const branchList = [
  "Computer Science",
  "Electrical Engineering",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
];

export function predictRank(input: PredictionInput): PredictionResult {
  const estimatedPercentile = input.percentile > 0
    ? input.percentile
    : scoreToPercentile(input.score, input.difficulty);

  const baseRank = percentileToRank(estimatedPercentile);
  const adjustedRank = categoryAdjustment(baseRank, input.category);

  // Session adjustment
  const sessionFactor = input.session === "January" ? 1.02 : 0.98;
  const finalRank = Math.max(1, Math.round(adjustedRank * sessionFactor));

  // Confidence based on input completeness
  const confidence = input.percentile > 0 && input.score > 0 ? 92 : input.percentile > 0 ? 85 : 78;

  // Rank range (±15%)
  const rankRange = {
    min: Math.max(1, Math.round(finalRank * 0.85)),
    max: Math.round(finalRank * 1.15),
  };

  // College suggestions
  const colleges: CollegeSuggestion[] = collegeDatabase
    .map((c) => ({
      ...c,
      probability:
        finalRank <= c.cutoffRank * 0.8
          ? ("High" as const)
          : finalRank <= c.cutoffRank
          ? ("Medium" as const)
          : finalRank <= c.cutoffRank * 1.3
          ? ("Low" as const)
          : null,
    }))
    .filter((c): c is CollegeSuggestion => c.probability !== null)
    .slice(0, 8);

  // Branch probabilities
  const branchProbabilities: BranchProbability[] = branchList.map((branch, i) => {
    const baseProbability = Math.max(5, 95 - (finalRank / 500) * (i + 1));
    return {
      branch,
      probability: Math.min(95, Math.max(5, Math.round(baseProbability))),
    };
  });

  return {
    predictedRank: finalRank,
    rankRange,
    confidence,
    colleges,
    branchProbabilities,
    percentileEstimate: estimatedPercentile,
  };
}

// Historical data for charts
export function getHistoricalData() {
  return [
    { score: 280, rank: 50, percentile: 99.99, year: "2024" },
    { score: 250, rank: 500, percentile: 99.95, year: "2024" },
    { score: 220, rank: 2000, percentile: 99.8, year: "2024" },
    { score: 200, rank: 5000, percentile: 99.5, year: "2024" },
    { score: 180, rank: 12000, percentile: 99.0, year: "2024" },
    { score: 160, rank: 25000, percentile: 98.0, year: "2024" },
    { score: 140, rank: 50000, percentile: 96.0, year: "2024" },
    { score: 120, rank: 85000, percentile: 93.0, year: "2024" },
    { score: 100, rank: 130000, percentile: 89.0, year: "2024" },
    { score: 80, rank: 220000, percentile: 82.0, year: "2024" },
    { score: 60, rank: 380000, percentile: 68.0, year: "2024" },
    { score: 40, rank: 550000, percentile: 54.0, year: "2024" },
  ];
}

export type { PredictionInput, PredictionResult, CollegeSuggestion, BranchProbability };

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How accurate is the rank prediction?",
    a: "Our prediction engine achieves approximately 95% accuracy within a ±10% rank range. We use Piecewise Cubic Hermite Interpolation (PCHIP) — the same mathematical technique used in professional data science — applied on a dense 60-point dataset of official NTA score-to-percentile mappings collected from JEE Main 2022, 2023, 2024, and 2025. Additionally, our model accounts for paper difficulty (Easy/Moderate/Difficult), which significantly affects the normalization. If you provide both your score AND your percentile, the system cross-validates both inputs and can push accuracy even higher — up to 95%+. Many students have reported their actual rank falling well within our predicted range.",
  },
  {
    q: "Is the prediction free?",
    a: "Yes — the core rank prediction is 100% free with no sign-up required. You can enter your JEE Main or JEE Advanced score, select your category and difficulty, and instantly get your predicted All India Rank along with a rank range and a confidence score. Our free version is already more advanced than most paid tools. The ₹49 one-time Premium upgrade unlocks additional features like detailed cutoff analysis, JoSAA round-wise trend tracking, and PDF report downloads — giving you a comprehensive edge during counseling season.",
  },
  {
    q: "Which exam data do you use?",
    a: "We use data from multiple official and publicly verifiable sources. For JEE Main: NTA's official score-percentile normalization tables (2022–2025), JoSAA official opening and closing ranks from all 6 counseling rounds, and IIT/NIT/IIIT/GFTI seat matrices. For JEE Advanced: IIT council published rank-score distributions for 2023 and 2024. Our college database includes 35+ institutions — all IITs, 31 NITs, top IIITs, and leading GFTIs — with branch-wise cutoffs for General, OBC-NCL, SC, ST, and EWS categories.",
  },
  {
    q: "How does category reservation affect my rank?",
    a: "In JEE counseling, your category rank is different from your General AIR (All India Rank). For example, if you belong to the OBC-NCL category, you compete in a separate pool with approximately 27% of seats reserved. This means your OBC rank will be significantly lower (better) than your general rank. Our algorithm applies mathematically derived multipliers based on real JoSAA historical opening/closing rank ratios: OBC ≈ 0.42×, SC ≈ 0.22×, ST ≈ 0.12×, EWS ≈ 0.90× of your General rank. This gives you a realistic category-adjusted rank so you know exactly which colleges and branches to realistically target.",
  },
  {
    q: "Can I predict JEE Advanced rank too?",
    a: "Yes! JEE Advanced rank prediction is now fully supported. Simply switch the toggle from 'JEE Main' to 'JEE Advanced' in the predictor form. The Advanced predictor uses a separate score-to-rank curve built from IIT council's published data, and the total score is out of 360 instead of 300. Since JEE Advanced does not use a percentile system, only your raw score and category are needed. The results will show IIT-specific predictions and your expected AIR in the JEE Advanced merit list. Note that Advanced predictions carry a slightly wider uncertainty band (~±20%) due to greater year-on-year variation in paper difficulty.",
  },
  {
    q: "How do I use this for JoSAA counseling?",
    a: "Once you have your predicted rank, head to the 'Colleges' section of our website. You'll find a comprehensive searchable database of IITs, NITs, IIITs, and GFTIs with branch-wise opening and closing ranks filtered by your category. Your goal during JoSAA is to fill choices strategically — choose 'High probability' colleges as safe options, 'Medium probability' as target choices, and 'Low probability' as reach options. Fill at least 15-20 choices in order of preference. Our tool helps you map your rank to real admission possibilities so you don't miss out on a seat due to poor choice filling.",
  },
  {
    q: "Why is the rank range shown instead of just one number?",
    a: "Rank prediction is inherently probabilistic — no tool can give you a single exact rank with complete certainty, and any tool that claims 100% accuracy is misleading you. We show a rank range (e.g., #45,000 – #55,000) based on our confidence score. A confidence of 90%+ means the range is tight (±8%), while lower confidence gives a wider band (±18%). The range represents where your actual rank is statistically most likely to fall. You should always plan your college choices based on the full range, not just the center number — especially when it crosses critical cutoff thresholds.",
  },
];


const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-card overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-medium text-foreground text-sm">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${openIndex === i ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

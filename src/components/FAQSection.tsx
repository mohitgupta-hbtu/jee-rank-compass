import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "How accurate is the rank prediction?", a: "Our algorithm uses historical JEE Main data from 2019-2024 and achieves 90%+ accuracy within a ±15% rank range. The more data you provide (score + percentile), the more accurate the prediction." },
  { q: "Is the prediction free?", a: "Yes! Basic rank prediction, college suggestions, and branch probability are completely free. Premium features like detailed cutoff analysis and AI counseling require a subscription." },
  { q: "Which exam data do you use?", a: "We use officially published NTA JEE Main data including score-percentile mapping, rank distributions, and JoSAA cutoff data from 2019 to 2024." },
  { q: "How does category reservation affect my rank?", a: "Category (OBC/SC/ST/EWS) significantly impacts your effective rank for counseling. Our algorithm applies the appropriate category-wise normalization to give you a realistic category rank." },
  { q: "Can I predict JEE Advanced rank too?", a: "Currently we support JEE Main rank prediction. JEE Advanced prediction is coming soon in our premium tier with separate historical data analysis." },
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

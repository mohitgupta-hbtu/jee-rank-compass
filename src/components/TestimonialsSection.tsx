import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Arjun Sharma",
    rank: "AIR 1,247",
    college: "IIT Delhi",
    text: "The prediction was within 200 ranks of my actual result! Helped me plan my JoSAA choices perfectly.",
    rating: 5,
  },
  {
    name: "Priya Patel",
    rank: "AIR 5,632",
    college: "NIT Trichy",
    text: "Best rank predictor I've used. The college suggestions were spot on and the UI is amazing.",
    rating: 5,
  },
  {
    name: "Rahul Verma",
    rank: "AIR 12,450",
    college: "IIIT Hyderabad",
    text: "Premium analytics gave me insights no coaching institute could. Worth every rupee!",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Student <span className="gradient-text">Success Stories</span>
          </h2>
          <p className="text-muted-foreground">Hear from students who predicted their future.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card-hover p-6"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">"{t.text}"</p>
              <div>
                <p className="font-display font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-secondary">{t.rank} · {t.college}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

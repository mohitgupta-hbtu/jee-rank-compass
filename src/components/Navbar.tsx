import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap, Crown } from "lucide-react";
import PaymentModal from "./PaymentModal";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const links = [
    { label: "Predictor", href: "/#predictor" },
    { label: "Colleges", href: "/colleges" },
    { label: "Analytics", href: "/#analytics" },
    { label: "FAQ", href: "/#faq" },
  ];

  return (
    <>
      <PaymentModal isOpen={paymentOpen} onClose={() => setPaymentOpen(false)} />

      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 glass-card"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 font-display font-bold text-2xl tracking-tight">
            <Zap className="w-6 h-6 text-primary" />
            <span className="gradient-text">RankEdge</span>
          </a>

          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}

            {/* Premium CTA */}
            <button
              onClick={() => setPaymentOpen(true)}
              className="flex items-center gap-2 gradient-btn-accent px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-lg hover:scale-105 transition-transform"
            >
              <Crown className="w-4 h-4" />
              Premium ₹49
            </button>

            <a href="/#predictor" className="gradient-btn px-4 py-2 rounded-lg text-sm font-medium text-primary-foreground">
              Get Started
            </a>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground">
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden glass-card border-t border-border/50 overflow-hidden"
            >
              <div className="px-4 py-4 flex flex-col gap-3">
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-sm text-muted-foreground hover:text-foreground py-2"
                  >
                    {link.label}
                  </a>
                ))}
                <button
                  onClick={() => { setIsOpen(false); setPaymentOpen(true); }}
                  className="flex items-center gap-2 gradient-btn-accent px-4 py-3 rounded-lg text-sm font-semibold text-white w-full justify-center mt-1"
                >
                  <Crown className="w-4 h-4" />
                  Get Premium — ₹49
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;

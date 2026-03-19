import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Smartphone, Copy, Check } from "lucide-react";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const UPI_ID = "6387424808@axl";
const AMOUNT = 49;
const PAYEE_NAME = "RankEdge";
const UPI_LINK = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${AMOUNT}&cu=INR&tn=${encodeURIComponent("Premium Access - RankEdge")}`;
const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(UPI_LINK)}&color=3b82f6&bgcolor=0f172a&margin=10`;

const FEATURES = [
  "Unlimited rank predictions",
  "JEE Advanced IIT branch predictions",
  "Detailed cutoff trend analysis",
  "Priority college match results",
  "PDF report download",
];

const PaymentModal = ({ isOpen, onClose }: Props) => {
  const [copied, setCopied] = useState(false);

  const copyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed z-[101] inset-0 flex items-center justify-center px-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-2xl glass-card border border-border/80 shadow-2xl overflow-hidden">
              
              {/* Header */}
              <div className="relative bg-gradient-to-r from-primary/20 to-secondary/20 px-6 py-5 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-secondary uppercase tracking-widest mb-1">One-time Payment</p>
                    <h2 className="text-2xl font-display font-bold text-foreground">
                      Get <span className="gradient-text">Premium Access</span>
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-9 h-9 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row">
                {/* Left: QR Code */}
                <div className="md:w-1/2 px-6 py-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-border/50">
                  <p className="text-sm text-muted-foreground mb-4 font-medium">Scan with any UPI app</p>

                  {/* QR Frame */}
                  <div className="relative p-3 rounded-2xl bg-white shadow-[0_0_40px_hsl(217_91%_60%/0.3)]">
                    <img
                      src={QR_URL}
                      alt="UPI QR Code"
                      width={200}
                      height={200}
                      className="rounded-lg"
                    />
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      ₹{AMOUNT}
                    </div>
                  </div>

                  {/* UPI Apps row */}
                  <div className="flex items-center gap-2 mt-8 mb-3">
                    {["GPay", "PhonePe", "Paytm", "BHIM"].map((app) => (
                      <span key={app} className="text-[10px] font-semibold px-2 py-1 rounded-md bg-muted/60 text-muted-foreground border border-border/50">
                        {app}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground/70 text-center">Supports all Indian UPI payment apps</p>

                  {/* UPI ID copy */}
                  <div className="mt-4 flex items-center gap-2 bg-muted/50 border border-border rounded-xl px-3 py-2 w-full">
                    <Smartphone className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs text-muted-foreground font-mono flex-1 truncate">{UPI_ID}</span>
                    <button onClick={copyUPI} className="text-primary hover:text-secondary transition-colors">
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {copied && <p className="text-xs text-secondary mt-1">Copied!</p>}

                  {/* Mobile pay button */}
                  <a
                    href={UPI_LINK}
                    className="mt-3 w-full gradient-btn px-4 py-2.5 rounded-xl text-center text-sm font-semibold text-primary-foreground glow-blue"
                  >
                    Pay ₹{AMOUNT} on Mobile
                  </a>
                </div>

                {/* Right: Features */}
                <div className="md:w-1/2 px-6 py-6">
                  <div className="mb-4">
                    <div className="text-4xl font-display font-bold gradient-text">₹{AMOUNT}</div>
                    <p className="text-xs text-muted-foreground mt-0.5">One-time · Lifetime access</p>
                  </div>

                  <p className="text-sm font-semibold text-foreground mb-3">What you get:</p>
                  <ul className="space-y-3 mb-6">
                    {FEATURES.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="bg-muted/30 border border-border/50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-foreground mb-1">After payment:</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Send a screenshot of your payment to our WhatsApp or email. We'll activate your premium access within minutes.
                    </p>
                    <a
                      href="https://wa.me/916387424808?text=Hi%2C%20I%20just%20paid%20%E2%82%B949%20for%20JEE%20Rank%20Predictor%20Premium!"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-green-400 hover:text-green-300 transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      Send Screenshot on WhatsApp →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;

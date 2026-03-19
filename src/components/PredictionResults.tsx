import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Target, Building2, TrendingUp, Shield, Crosshair, Flame, Download, Crown, Database, X, Eye, Info, Loader2 } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";
import type { PredictionResult, CollegeSuggestion } from "@/lib/rankPredictor";
import { useState, useEffect } from "react";
import PaymentModal from "./PaymentModal";
import { createPortal } from "react-dom";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

interface Props {
  result: PredictionResult;
}

const tagConfig = {
  Safe: { icon: Shield, color: "text-green-400", bgColor: "bg-green-400/10 border-green-400/30", label: "🟢 Safe Choices", desc: "You are very likely to get these" },
  Target: { icon: Crosshair, color: "text-yellow-400", bgColor: "bg-yellow-400/10 border-yellow-400/30", label: "🟡 Target Choices", desc: "Realistic chance with good counseling" },
  Reach: { icon: Flame, color: "text-red-400", bgColor: "bg-red-400/10 border-red-400/30", label: "🔴 Reach/Tough Choices", desc: "Possible in later JoSAA rounds" },
};

const renderCollegeGroup = (colleges: CollegeSuggestion[], tag: "Safe" | "Target" | "Reach") => {
  if (colleges.length === 0) return null;
  const config = tagConfig[tag];
  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <config.icon className={`w-5 h-5 ${config.color}`} />
        <h4 className={`text-base font-semibold ${config.color}`}>{config.label}</h4>
        <span className="text-sm text-gray-400 ml-auto hidden sm:inline">{config.desc}</span>
      </div>
      {colleges.map((college, i) => (
        <motion.div
          key={`${college.name}-${college.cutoffRank}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          className={`flex flex-col p-4 rounded-xl border ${config.bgColor} transition-colors gap-4 shadow-sm`}
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="flex-1 pr-4">
              <p className="font-bold text-white text-base leading-snug whitespace-normal break-words">{college.name}</p>
              <div className="flex items-center flex-wrap gap-2 mt-2">
                <p className="text-xs text-gray-400 font-medium">Highest Cutoff: ~#{college.cutoffRank.toLocaleString("en-IN")}</p>
                <span className="text-[10px] text-gray-300 px-2 py-0.5 rounded bg-white/10 font-medium">{college.round}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 mt-1 sm:mt-0">
              <span className={`text-[11px] sm:text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap ${
                college.probability === "High"
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : college.probability === "Medium"
                  ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}>
                {college.probability} Overall
              </span>
              <span className="text-[11px] sm:text-xs text-gray-300 font-semibold px-3 py-1.5 rounded-full bg-white/10 border border-white/5 whitespace-nowrap">{college.type}</span>
            </div>
          </div>
          
          {college.branches && college.branches.length > 0 && (
            <div className="pt-3 border-t border-white/10 space-y-2">
              <p className="text-[10px] font-bold text-indigo-300/70 uppercase tracking-widest mb-2 pl-1">Accessible Branches Preview</p>
              {college.branches.map((b, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between text-sm bg-black/40 border border-white/5 rounded-lg p-3 gap-3">
                  <span className="text-gray-200 font-semibold leading-snug whitespace-normal break-words">{b.branchName}</span>
                  <div className="flex items-center gap-4 flex-shrink-0 bg-white/5 px-3 py-1.5 rounded-md self-start sm:self-auto mt-2 sm:mt-0">
                    <span className="text-gray-400 font-medium text-xs whitespace-nowrap">~#{b.cutoff.toLocaleString("en-IN")}</span>
                    <span className={`text-[11px] font-bold uppercase tracking-wider whitespace-nowrap ${
                      b.prob === "High" ? "text-green-400" : b.prob === "Medium" ? "text-yellow-400" : "text-red-400"
                    }`}>
                      {b.prob}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

const PredictionResults = ({ result }: Props) => {
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [showAllModal, setShowAllModal] = useState(false);
  const [showTagsTip, setShowTagsTip] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const confidenceColor = result.confidence >= 90 ? "text-secondary" : result.confidence >= 80 ? "text-primary" : "text-accent";

  let aiInsightText = "";
  if (result.predictedRank <= 2000) {
    aiInsightText = "Outstanding performance! You are in the top tier globally. You have almost guaranteed admission to top-tier institutes with premium branches. Focus on choosing the best campus culture.";
  } else if (result.predictedRank <= 15000) {
    aiInsightText = "Excellent rank! You have a strong position for top NITs and mid-tier IITs. Your best strategy should focus on branch optimization rather than only college tag.";
  } else if (result.predictedRank <= 40000) {
    aiInsightText = "Great rank! You have solid chances for mid-to-lower tier IITs or top NITs in core branches (Mechanical, Civil). Prioritize your preferred branch carefully during choice filling.";
  } else if (result.predictedRank <= 80000) {
    aiInsightText = "Good competitive rank. You can secure seats in newer NITs, IIITs, or GFTIs. Core branches are highly accessible. Smart CSAB Spot round participation is highly recommended.";
  } else {
    aiInsightText = "Tough competition bracket. Focus heavily on your Home State quota, GFTIs, and state-level counseling. The CSAB special rounds will be your absolute best opportunity for central institutes.";
  }

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const element = document.getElementById("hidden-pdf-report");
      if (!element) return;
      
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#09090b', // dark theme background
        useCORS: true,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // Initial page
      pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pageHeight;

      // Subsequent pages loop mapping the taller canvas portions
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save("RankEdge_Prediction_Report.pdf");
    } catch (err) {
      console.error("PDF generation failed", err);
    } finally {
      setIsDownloading(false);
    }
  };

  // All colleges for modal
  const safeAll = result.colleges.filter(c => c.tag === "Safe");
  const targetAll = result.colleges.filter(c => c.tag === "Target");
  const reachAll = result.colleges.filter(c => c.tag === "Reach");

  return (
    <>
      <PaymentModal isOpen={paymentOpen} onClose={() => setPaymentOpen(false)} />

      {/* View All Colleges Modal - Rendered via Portal to prevent overlap */}
      {typeof window !== "undefined" && createPortal(
        <AnimatePresence>
          {showAllModal && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6" style={{ isolation: 'isolate' }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAllModal(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl max-h-[90vh] glass-card border flex flex-col shadow-2xl overflow-hidden rounded-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground text-lg">All College Matches</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Database className="w-3 h-3" /> Based on JoSAA 2025
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAllModal(false)}
                  className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content - Scrollable List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-background/50">
                {renderCollegeGroup(safeAll, "Safe")}
                {renderCollegeGroup(targetAll, "Target")}
                {renderCollegeGroup(reachAll, "Reach")}

                {result.colleges.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No matching colleges found for this rank in the database.</p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-border/50 bg-muted/20 flex justify-end">
                <button
                  onClick={() => setShowAllModal(false)}
                  className="px-6 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
        </AnimatePresence>,
        document.body
      )}

      <motion.div
        id="pdf-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6 p-4 -m-4 bg-background rounded-2xl"
      >
        {/* Main rank card */}
        <div className="glass-card p-6 md:p-8 text-center glow-blue">
          <div className={`flex flex-col ${result.crlRank && result.crlRank !== result.predictedRank ? 'md:flex-row md:divide-x divide-border/50 justify-center gap-8 md:gap-0' : 'items-center justify-center'}`}>
             
             {/* CRL RANK (ALL INDIA RANK) */}
             <div className={`flex flex-col items-center justify-center ${result.crlRank && result.crlRank !== result.predictedRank ? 'md:w-1/2 md:pr-6' : 'w-full'}`}>
                <Trophy className="w-10 h-10 text-secondary mx-auto mb-4" />
                <p className="text-sm text-foreground mb-2 font-medium">Predicted All India Rank (CRL)</p>
                <div className="text-5xl md:text-6xl font-display font-bold text-foreground mb-2 tracking-tight">
                  <AnimatedCounter target={result.crlRank || result.predictedRank} prefix="#" />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Range: #{(result.crlRankRange?.min ?? Math.round((result.crlRank || result.predictedRank) * 0.92)).toLocaleString("en-IN")} — #{(result.crlRankRange?.max ?? Math.round((result.crlRank || result.predictedRank) * 1.08)).toLocaleString("en-IN")}
                </p>
             </div>

             {/* CATEGORY RANK */}
             {result.crlRank && result.crlRank !== result.predictedRank && (
               <div className="flex flex-col items-center justify-center md:w-1/2 md:pl-6 pt-6 md:pt-0 border-t md:border-t-0 border-border/50">
                  <Shield className="w-10 h-10 text-primary mx-auto mb-4" />
                  <p className="text-[13px] text-primary mb-2 font-bold uppercase tracking-wider">Category Rank (Seat Matrix)</p>
                  <div className="text-5xl md:text-6xl font-display font-bold text-primary mb-2 tracking-tight drop-shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                    <AnimatedCounter target={result.predictedRank} prefix="#" />
                  </div>
                  <p className="text-sm text-primary/80 mt-1 mb-2">
                    Range: #{result.rankRange.min.toLocaleString("en-IN")} — #{result.rankRange.max.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[11px] text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
                    *JoSAA officially uses this rank for seat assignment
                  </p>
               </div>
             )}
          </div>
          
          <div className="mt-8 inline-flex items-center gap-2 glass-card px-4 py-2 border border-border/50">
            <Target className="w-4 h-4 text-secondary" />
            <span className={`text-sm font-semibold ${confidenceColor}`}>{result.confidence}% Final Prediction Confidence</span>
          </div>
        </div>

        {/* Stats row */}
        {result.percentileEstimate > 0 && (
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-5 text-center">
              <TrendingUp className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground mb-1">Percentile</p>
              <p className="text-xl font-display font-bold text-foreground">
                {result.percentileEstimate.toFixed(2)}%
              </p>
            </div>
            <div className="glass-card p-5 text-center border-primary/20 glow-blue cursor-pointer group" onClick={() => setShowAllModal(true)}>
              <Building2 className="w-5 h-5 text-secondary mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-xs text-muted-foreground mb-1">Total Colleges Match</p>
              <p className="text-xl font-display font-bold text-foreground group-hover:text-primary transition-colors">
                {result.colleges.length}
              </p>
            </div>
          </div>
        )}

        {/* College Matches Ready Section */}
        {result.colleges.length > 0 && (
          <div className="glass-card p-6 sm:p-8 text-center border-primary/20 bg-gradient-to-b from-transparent to-primary/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay"></div>
            
            <div className="relative z-10 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 border border-primary/30 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(var(--primary),0.3)]">
                <Database className="w-8 h-8 text-primary group-hover:rotate-12 transition-transform duration-500" />
              </div>
              
              <h3 className="text-2xl font-display font-semibold text-foreground mb-3">
                <span className="text-primary">{result.colleges.length}</span> Matches Found!
              </h3>
              
              <p className="text-sm text-muted-foreground mb-4 text-balance">
                Your ranks and percentiles have been successfully processed. We've matched you against historical JoSAA data and perfectly categorized your choices into <strong className="text-green-400 font-medium">Safe</strong>, <strong className="text-yellow-400 font-medium">Target</strong>, and <strong className="text-red-400 font-medium">Reach</strong> options.
              </p>

              <div className="flex items-center justify-center gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => setShowTagsTip(!showTagsTip)}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 bg-background/50 px-3 py-1.5 rounded-full border border-border/50"
                >
                  <Info className="w-3.5 h-3.5" /> What do these terms mean?
                </button>
              </div>

              <AnimatePresence>
                {showTagsTip && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden mb-6 text-left"
                  >
                    <div className="glass-card border border-border/80 rounded-xl p-4 text-xs space-y-3 mx-auto max-w-[450px]">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-foreground text-sm flex items-center gap-2"><Info className="w-4 h-4 text-primary" /> Category Definitions</p>
                        <button onClick={() => setShowTagsTip(false)} className="text-muted-foreground hover:text-foreground">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-primary font-bold w-16 flex-shrink-0">🔵 All</span>
                        <span className="text-muted-foreground">Every combination where you have any logical mathematical possibility based on data.</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-green-400 font-bold w-16 flex-shrink-0">🟢 Safe</span>
                        <span className="text-muted-foreground">Your rank comfortably clears the cutoff. Extremely high chance of admission.</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-yellow-400 font-bold w-16 flex-shrink-0">🟡 Target</span>
                        <span className="text-muted-foreground">Your predicted rank is close to the cutoff. Realistic chance with good counseling.</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-red-400 font-bold w-16 flex-shrink-0">🔴 Reach</span>
                        <span className="text-muted-foreground">Slightly outside usual cutoffs. A stretch/tough choice, possible in special CSAB rounds.</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAllModal(true)}
                className="w-full py-4 bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-xl text-primary-foreground font-semibold flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(var(--primary),0.4)] transition-all text-[15px] sm:text-base border border-white/10"
              >
                <Eye className="w-5 h-5" />
                View All College Matches Explorer
              </motion.button>
            </div>
          </div>
        )}

        {/* Download PDF (Premium only) */}
        <div data-html2canvas-ignore="true" className="glass-card p-5 mt-6 border-t border-border/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Download className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Download Full PDF Report</p>
                <p className="text-xs text-muted-foreground">Detailed rank analysis, college list & branch probabilities</p>
              </div>
            </div>
            <button
              onClick={() => setPaymentOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg text-sm font-semibold text-white shadow-lg hover:scale-105 transition-transform whitespace-nowrap"
            >
              <Crown className="w-4 h-4" /> Premium
            </button>
          </div>
        </div>
      </motion.div>

      {/* Hidden PDF Report Container */}
      <div 
        id="hidden-pdf-report" 
        className="absolute -left-[9999px] top-0 w-[800px] bg-[#09090b] text-foreground flex flex-col tracking-wide"
        style={{ position: 'absolute', left: '-9999px', top: '0', width: '800px', backgroundColor: '#09090b', color: 'white', fontFamily: 'sans-serif' }}
      >
        {/* Page 1: Rank Summary */}
        <div className="p-12 h-[1131px] overflow-hidden flex flex-col relative bg-[#09090b]">
          <div className="text-center mb-12 border-b border-white/10 pb-10">
            <h1 className="text-5xl font-display font-extrabold mb-4 text-white tracking-tight">RankEdge Prediction Report</h1>
            <p className="text-xl text-gray-400 font-medium tracking-widest uppercase">Based on JoSAA Historical Trends</p>
          </div>
          
          <div className="grid grid-cols-3 gap-6 mb-12">
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6 text-center shadow-lg flex flex-col justify-center">
              <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider">All India Rank (CRL)</p>
              <p className="text-4xl font-black text-[#38bdf8] mb-2">#{((result.crlRank || result.predictedRank)).toLocaleString("en-IN")}</p>
              {result.crlRank && result.crlRank !== result.predictedRank && (
                <p className="text-[10px] text-[#818cf8] font-bold uppercase tracking-[0.15em] bg-[#4338ca]/20 py-1.5 rounded-full mt-1 border border-[#4338ca]/30">Category: #{result.predictedRank.toLocaleString("en-IN")}</p>
              )}
            </div>
            <div className="bg-[#111] border border-white/5 rounded-2xl p-8 text-center shadow-lg">
              <p className="text-sm text-gray-400 mb-3 font-semibold uppercase tracking-wider">Percentile</p>
              <p className="text-4xl font-black text-[#818cf8]">{result.percentileEstimate > 0 ? `${result.percentileEstimate.toFixed(2)}%` : "N/A"}</p>
            </div>
            <div className="bg-[#111] border border-white/5 rounded-2xl p-8 text-center shadow-lg">
              <p className="text-sm text-gray-400 mb-3 font-semibold uppercase tracking-wider">Confidence Score</p>
              <p className="text-4xl font-black text-[#4ade80]">{result.confidence}%</p>
            </div>
          </div>

          <div className="bg-[#1e1b4b] border border-[#4338ca] rounded-2xl p-10 mb-12 shadow-2xl">
            <h3 className="text-2xl font-bold text-[#818cf8] mb-5 flex items-center gap-3">
              <span className="text-3xl">🎯</span> AI Insight
            </h3>
            <p className="text-xl text-indigo-100 leading-relaxed font-medium">
              {aiInsightText}
            </p>
          </div>

          <div className="bg-[#111] border border-white/5 rounded-2xl p-10 flex-1 shadow-xl">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="text-3xl">🧭</span> Category Overview
            </h3>
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 border border-green-500/30">
                  <Shield className="w-7 h-7 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-400 mb-1">🟢 Safe Zone</p>
                  <p className="text-lg text-gray-400">Strong chances (80–95%)</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 border border-yellow-500/30">
                  <Crosshair className="w-7 h-7 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-400 mb-1">🟡 Target Zone</p>
                  <p className="text-lg text-gray-400">Competitive (50–80%)</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 border border-red-500/30">
                  <Flame className="w-7 h-7 text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-400 mb-1">🔴 Dream Zone</p>
                  <p className="text-lg text-gray-400">Risky but possible (&lt;50%)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page 2: Smart College Recommendations */}
        <div className="p-12 h-[1131px] overflow-hidden border-t-2 border-white/10 bg-[#09090b]">
          <h2 className="text-4xl font-display font-extrabold mb-12 text-white text-center tracking-tight">Smart College Recommendations</h2>
          
          <div className="space-y-12">
            {safeAll.length > 0 && (
              <div className="bg-[#111] border border-green-500/20 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/5">
                  <Shield className="w-8 h-8 text-green-400" />
                  <h3 className="text-3xl font-bold text-green-400">🟢 Safe Choices</h3>
                </div>
                {renderCollegeGroup(safeAll.slice(0, 5), "Safe")}
              </div>
            )}
            
            {targetAll.length > 0 && (
              <div className="bg-[#111] border border-yellow-500/20 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/5">
                  <Crosshair className="w-8 h-8 text-yellow-400" />
                  <h3 className="text-3xl font-bold text-yellow-400">🟡 Target Choices</h3>
                </div>
                {renderCollegeGroup(targetAll.slice(0, 5), "Target")}
              </div>
            )}
            
            {reachAll.length > 0 && (
              <div className="bg-[#111] border border-red-500/20 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/5">
                  <Flame className="w-8 h-8 text-red-400" />
                  <h3 className="text-3xl font-bold text-red-400">🔴 Dream Choices</h3>
                </div>
                {renderCollegeGroup(reachAll.slice(0, 3), "Reach")}
              </div>
            )}
          </div>
        </div>

        {/* Page 3: Strategy */}
        <div className="p-12 h-[1131px] overflow-hidden flex flex-col border-t-2 border-white/10 bg-[#09090b]">
          <h2 className="text-4xl font-display font-extrabold mb-12 text-white text-center tracking-tight">Strategy (MOST IMPORTANT)</h2>
          
          <div className="flex-1 space-y-10">
            <div className="bg-[#2e1065] border border-[#7c3aed] rounded-2xl p-10 shadow-2xl">
              <h3 className="text-3xl font-bold text-white mb-8 flex items-center gap-4">
                <span className="text-4xl">🧠</span> Smart Decision Strategy
              </h3>
              <ul className="space-y-6 text-xl text-purple-100 font-medium">
                <li className="flex items-start gap-4">
                  <div className="w-3 h-3 mt-2.5 rounded-full bg-[#a78bfa] flex-shrink-0" />
                  <span>If you prefer coding/placements → choose <strong className="text-white">IIIT/NIT IT/ECE</strong></span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-3 h-3 mt-2.5 rounded-full bg-[#a78bfa] flex-shrink-0" />
                  <span>If you prefer IIT tag → go for lower branches in <strong className="text-white">IIT</strong></span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-3 h-3 mt-2.5 rounded-full bg-[#a78bfa] flex-shrink-0" />
                  <span>Avoid sacrificing branch completely for tag</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#0c4a6e] border border-[#0284c7] rounded-2xl p-10 shadow-2xl">
              <h3 className="text-3xl font-bold text-white mb-8 flex items-center gap-4">
                <span className="text-4xl">⚖️</span> Branch vs College Rule
              </h3>
              <ul className="space-y-6 text-xl text-sky-100 font-medium">
                <li className="flex items-start gap-4">
                  <div className="w-3 h-3 mt-2.5 rounded-full bg-[#38bdf8] flex-shrink-0" />
                  <span><strong className="text-white">Top Branch</strong> &gt; Mid IIT</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-3 h-3 mt-2.5 rounded-full bg-[#38bdf8] flex-shrink-0" />
                  <span><strong className="text-white">IIT Tag</strong> &gt; Low branch <em>only if flexible career</em></span>
                </li>
              </ul>
            </div>

            <div className="bg-[#4c0519] border border-[#e11d48] rounded-2xl p-10 shadow-2xl">
              <h3 className="text-3xl font-bold text-white mb-8 flex items-center gap-4">
                <span className="text-4xl">🛑</span> Risk Warning
              </h3>
              <ul className="space-y-6 text-xl text-rose-100 font-medium">
                <li className="flex items-start gap-4">
                  <div className="w-3 h-3 mt-2.5 rounded-full bg-[#fb7185] flex-shrink-0" />
                  <span>Avoid overestimating rank shift</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-3 h-3 mt-2.5 rounded-full bg-[#fb7185] flex-shrink-0" />
                  <span>Always fill <strong className="text-white">safe options</strong> in counselling</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Page 4: Action Plan */}
        <div className="p-12 h-[1131px] overflow-hidden flex flex-col border-t-2 border-white/10 bg-[#09090b]">
          <h2 className="text-4xl font-display font-extrabold mb-12 text-white text-center tracking-tight">Action Plan</h2>
          
          <div className="flex-1 space-y-10 flex flex-col">
            <div className="bg-[#111] border border-white/10 rounded-2xl p-10 shadow-xl">
              <h3 className="text-3xl font-bold text-[#818cf8] mb-8 flex items-center gap-4">
                <span className="text-4xl">📌</span> What You Should Do Next
              </h3>
              <ul className="space-y-6 text-xl text-gray-300 font-medium">
                <li className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="w-10 h-10 rounded-full bg-[#818cf8]/20 flex items-center justify-center text-[#818cf8] font-bold shrink-0">1</div>
                  Shortlist top 10 colleges
                </li>
                <li className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="w-10 h-10 rounded-full bg-[#818cf8]/20 flex items-center justify-center text-[#818cf8] font-bold shrink-0">2</div>
                  Prepare JoSAA preference list
                </li>
                <li className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="w-10 h-10 rounded-full bg-[#818cf8]/20 flex items-center justify-center text-[#818cf8] font-bold shrink-0">3</div>
                  Keep backup (State colleges / Private)
                </li>
              </ul>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-10 shadow-xl">
              <h3 className="text-3xl font-bold text-[#38bdf8] mb-8 flex items-center gap-4">
                <span className="text-4xl">📊</span> Data Source
              </h3>
              <ul className="space-y-6 text-xl text-gray-300 font-medium">
                <li className="flex items-center gap-4">
                  <Database className="w-8 h-8 text-[#38bdf8]" />
                  Based on massive JoSAA 2023–2025 historical data
                </li>
                <li className="flex items-center gap-4">
                  <Target className="w-8 h-8 text-[#38bdf8]" />
                  AI-adjusted mathematical prediction engine
                </li>
              </ul>
            </div>

            <div className="mt-auto bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-16 text-center shadow-[0_0_50px_rgba(79,70,229,0.3)]">
              <Crown className="w-20 h-20 text-white mx-auto mb-6" />
              <h3 className="text-5xl font-extrabold text-white mb-4 tracking-tight">🚀 Powered By RankEdge</h3>
              <p className="text-2xl text-white/90 font-medium">Your Smart JEE Decision Engine</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PredictionResults;

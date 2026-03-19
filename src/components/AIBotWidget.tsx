import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Crown, Lock } from "lucide-react";
import PaymentModal from "./PaymentModal";

// Number of free messages per day
const FREE_LIMIT = 10;

// Replace this with the user's actual API key via .env later
// Using a placeholder for now that they will replace
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
}

const AIBotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "bot", text: "Hi! I'm your AI Counselor. Ask me anything about JEE cutoffs, colleges, or rank prediction!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat limit from localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem("chatDate");
    const storedCount = localStorage.getItem("chatCount");
    const storedVersion = localStorage.getItem("chatVersion");
    
    // Reset if new day OR if limit version changed (force reset on upgrade)
    if (storedDate !== today || storedVersion !== "v2") {
      localStorage.setItem("chatDate", today);
      localStorage.setItem("chatCount", "0");
      localStorage.setItem("chatVersion", "v2");
      setMsgCount(0);
    } else if (storedCount) {
      setMsgCount(parseInt(storedCount, 10));
    }
  }, []);

  // Set chat count when updated
  const incrementMsgCount = () => {
    const newCount = msgCount + 1;
    setMsgCount(newCount);
    localStorage.setItem("chatCount", String(newCount));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || msgCount >= FREE_LIMIT) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: "user", text: userMessage }]);
    incrementMsgCount();
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          sender: "bot", 
          text: "⚠️ API Key missing! The owner needs to add VITE_GEMINI_API_KEY in the .env file for the AI to work." 
        }]);
        setIsLoading(false);
        return;
      }

      const response = await fetch(GEMINI_API_URL + apiKey, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `You are an expert JEE college counselor for a website named RankEdge. Be very concise, helpful, and answer in short paragraphs. Never use markdown formatting like ** or #. Keep responses under 150 words. The user is asking: ${userMessage}` }] }],
          generationConfig: { maxOutputTokens: 1024 }
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data?.error?.message || `HTTP Error ${response.status}`);
      }

      if (data.candidates && data.candidates[0]) {
        // Gemini 2.5 may return multiple parts (thinking + response)
        // We want the last text part which contains the actual answer
        const parts = data.candidates[0].content?.parts || [];
        const textParts = parts.filter((p: { text?: string, thought?: boolean }) => p.text && !p.thought);
        const botText = textParts.length > 0 
          ? textParts[textParts.length - 1].text 
          : parts[parts.length - 1]?.text || "I couldn't generate a response. Please try asking again.";
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: "bot", text: botText }]);
      } else {
        throw new Error("Invalid response format from AI");
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        sender: "bot", 
        text: `Error connecting to AI: ${error.message || "Please try again later!"}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PaymentModal isOpen={paymentOpen} onClose={() => setPaymentOpen(false)} />

      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-full gradient-btn shadow-[0_0_30px_hsl(217_91%_60%/0.4)] hover:shadow-[0_0_40px_hsl(217_91%_60%/0.6)] transition-all group"
          >
            <Bot className="w-6 h-6 text-primary-foreground group-hover:scale-110 transition-transform" />
            {msgCount < FREE_LIMIT && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-secondary border border-background"></span>
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[480px] md:w-[520px] h-[75vh] sm:h-[600px] max-h-[85vh] glass-card border flex flex-col shadow-2xl overflow-hidden rounded-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">RankEdge AI Counselor</h3>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 relative bg-background/50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-2 max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${msg.sender === "user" ? "bg-accent/20" : "bg-primary/20"}`}>
                      {msg.sender === "user" ? <User className="w-3.5 h-3.5 text-accent" /> : <Bot className="w-3.5 h-3.5 text-primary" />}
                    </div>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                      msg.sender === "user" 
                        ? "bg-accent/10 border border-accent/20 text-accent-foreground rounded-tr-sm" 
                        : "bg-muted border border-border/50 text-foreground rounded-tl-sm"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-2 max-w-[85%]">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-muted border border-border/50 rounded-tl-sm flex gap-1 items-center">
                      <motion.div className="w-1.5 h-1.5 bg-primary/50 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, delay: 0 }} />
                      <motion.div className="w-1.5 h-1.5 bg-primary/50 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, delay: 0.15 }} />
                      <motion.div className="w-1.5 h-1.5 bg-primary/50 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, delay: 0.3 }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Limit Tracker */}
            <div className="px-4 py-2 bg-muted/20 border-t border-border/50 text-xs flex justify-between items-center text-muted-foreground">
              <span>Remaining free queries:</span>
              <span className={`font-bold ${FREE_LIMIT - msgCount <= 1 ? "text-red-400" : "text-foreground"}`}>
                {FREE_LIMIT - msgCount} / {FREE_LIMIT}
              </span>
            </div>

            {/* Paywall Overlay if locked */}
            {msgCount >= FREE_LIMIT ? (
              <div className="p-4 bg-muted/80 backdrop-blur-md border-t border-border/50 flex flex-col items-center justify-center absolute bottom-0 left-0 right-0 h-32">
                <Lock className="w-5 h-5 text-accent mb-2" />
                <p className="text-xs text-foreground mb-3 text-center font-medium">Daily limit reached. Unlock unlimited AI counseling!</p>
                <button 
                  onClick={() => setPaymentOpen(true)}
                  className="w-full py-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg text-white font-bold text-sm shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                >
                  <Crown className="w-4 h-4" /> Go Premium for ₹49
                </button>
              </div>
            ) : (
              /* Normal Input Area */
              <div className="p-3 border-t border-border/50 bg-background/80 backdrop-blur-sm">
                <div className="flex items-end gap-2 bg-muted/30 border border-border/50 rounded-xl p-1 pr-2">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Ask about colleges..."
                    className="flex-1 max-h-32 min-h-[44px] bg-transparent resize-none p-3 text-sm focus:outline-none placeholder:text-muted-foreground/50"
                    rows={1}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="p-2 mb-1 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIBotWidget;

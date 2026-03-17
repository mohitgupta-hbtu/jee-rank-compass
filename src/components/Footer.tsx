import { Zap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 font-display font-bold text-lg mb-3">
              <Zap className="w-5 h-5 text-primary" />
              <span className="gradient-text">JEE Rank Predictor</span>
            </div>
            <p className="text-sm text-muted-foreground">
              India's most accurate JEE rank prediction platform. Powered by data, built for students.
            </p>
          </div>
          {[
            { title: "Product", links: ["Predictor", "College Finder", "Premium", "API"] },
            { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
            { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Refund Policy"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-display font-semibold text-foreground mb-3 text-sm">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border/50 pt-6 text-center text-xs text-muted-foreground">
          © 2025 JEE Rank Predictor. All rights reserved. Not affiliated with NTA or any government body.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

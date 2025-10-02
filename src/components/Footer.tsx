import { Code2, Github, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import FooterAnimation from "./FooterAnimation";

const Footer = () => {
  return (
    <footer className="relative border-t border-border/50 bg-black overflow-hidden">
      {/* Lightning Animation Background */}
      <div className="absolute inset-0 opacity-30">
        <FooterAnimation hue={270} speed={0.5} intensity={0.8} size={1.5} />
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Code2 className="h-6 w-6 text-violet-600" />
              <span className="text-xl font-bold text-white">CodeMentor AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Master coding with AI-powered hints and intelligent guidance.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-sm text-muted-foreground hover:text-violet-600 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-sm text-muted-foreground hover:text-violet-600 transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <Link to="/problems" className="text-sm text-muted-foreground hover:text-violet-600 transition-colors">
                  Problems
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-sm text-muted-foreground hover:text-violet-600 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#contact" className="text-sm text-muted-foreground hover:text-violet-600 transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#careers" className="text-sm text-muted-foreground hover:text-violet-600 transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#terms" className="text-sm text-muted-foreground hover:text-violet-600 transition-colors">
                  Terms
                </a>
              </li>
              <li>
                <a href="#privacy" className="text-sm text-muted-foreground hover:text-violet-600 transition-colors">
                  Privacy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 CodeMentor AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-violet-600 transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-violet-600 transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-violet-600 transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

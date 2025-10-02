import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SpotlightBackground } from "@/components/ui/spotlight-background";
import { HeroSection } from "@/components/ui/hero-section";
import { Icons } from "@/components/ui/icons";
import { useEffect, useRef } from "react";
import { 
  Lightbulb, 
  TrendingUp, 
  Briefcase, 
  Code2, 
  Users, 
  Award, 
  Zap,
  Brain,
  Target,
  Sparkles,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

const Landing = () => {
  const featuresRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    if (featuresRef.current) observer.observe(featuresRef.current);
    if (statsRef.current) observer.observe(statsRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <SpotlightBackground glowColor="purple" intensity={0.2}>
      <div className="min-h-screen flex flex-col bg-black">
        <Navbar />

      {/* Hero Section */}
      <HeroSection
        badge={{
          text: "Introducing our new AI-powered platform",
          action: {
            text: "Learn more",
            href: "#features",
          },
        }}
        title="Master Coding with Smart AI Guidance"
        description="Transform your DSA skills with intelligent, contextual hints. Get the perfect amount of help—never too much, never too little."
        actions={[
          {
            text: "Get Started",
            href: "/auth",
            variant: "hero",
          },
          {
            text: "Explore Problems",
            href: "/problems",
            variant: "default",
          },
        ]}
        image="/landing_page.png"
      />

      {/* Features Section - Enhanced cards with better shadows */}
      <section ref={featuresRef} id="features" className="py-24 bg-black opacity-0 translate-y-20 transition-all duration-1000 ease-out">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-sm shadow-lg shadow-violet-900/5">
              <Target className="h-4 w-4 text-violet-400" />
              <span className="text-violet-300 font-medium">Why Choose Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Everything You Need to{" "}
              <span className="text-white">
                Excel
              </span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Master coding interviews with our comprehensive AI-powered platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <Card className="group relative overflow-hidden border-violet-500/10 bg-black backdrop-blur-xl hover:border-violet-500/30 transition-all duration-500 hover:-translate-y-2 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-violet-900/30">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="relative p-8 space-y-6">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-700/20 border border-violet-500/20 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-violet-900/20 transition-all duration-300">
                  <Lightbulb className="h-8 w-8 text-violet-400" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-white group-hover:text-violet-300 transition-colors duration-300">
                    Smart AI Hints
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Get contextual hints that guide you without spoiling the solution. Our AI understands your progress and provides the perfect nudge at the right moment.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Feature Card 2 */}
            <Card className="group relative overflow-hidden border-violet-500/10 bg-black backdrop-blur-xl hover:border-violet-500/30 transition-all duration-500 hover:-translate-y-2 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-violet-900/30">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="relative p-8 space-y-6">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-700/20 border border-violet-500/20 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-violet-900/20 transition-all duration-300">
                  <TrendingUp className="h-8 w-8 text-violet-400" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-white group-hover:text-violet-300 transition-colors duration-300">
                    Track Your Progress
                  </h3>
                  <p className="text-white/60 leading-relaxed">
                    Visualize your improvement with detailed analytics. Monitor your growth across different problem categories and identify areas to focus on.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Feature Card 3 */}
            <Card className="group relative overflow-hidden border-violet-500/10 bg-black backdrop-blur-xl hover:border-violet-500/30 transition-all duration-500 hover:-translate-y-2 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-violet-900/30">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="relative p-8 space-y-6">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-700/20 border border-violet-500/20 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-violet-900/20 transition-all duration-300">
                  <Briefcase className="h-8 w-8 text-violet-400" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-white group-hover:text-violet-300 transition-colors duration-300">
                    Real Interview Prep
                  </h3>
                  <p className="text-white/60 leading-relaxed">
                    Practice with actual problems from FAANG interviews. Get ready for Google, Amazon, Microsoft, and other top tech companies.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Feature Card 4 */}
            <Card className="group relative overflow-hidden border-violet-500/10 bg-black backdrop-blur-xl hover:border-violet-500/30 transition-all duration-500 hover:-translate-y-2 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-violet-900/30">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="relative p-8 space-y-6">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-700/20 border border-violet-500/20 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-violet-900/20 transition-all duration-300">
                  <Brain className="h-8 w-8 text-violet-400" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-white group-hover:text-violet-300 transition-colors duration-300">
                    Adaptive Learning
                  </h3>
                  <p className="text-white/60 leading-relaxed">
                    Our AI adapts to your skill level and learning pace. Get personalized problem recommendations tailored to your growth journey.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Feature Card 5 */}
            <Card className="group relative overflow-hidden border-violet-500/10 bg-black backdrop-blur-xl hover:border-violet-500/30 transition-all duration-500 hover:-translate-y-2 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-violet-900/30">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="relative p-8 space-y-6">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-700/20 border border-violet-500/20 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-violet-900/20 transition-all duration-300">
                  <Code2 className="h-8 w-8 text-violet-400" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-white group-hover:text-violet-300 transition-colors duration-300">
                    Multi-Language Support
                  </h3>
                  <p className="text-white/60 leading-relaxed">
                    Code in Python, JavaScript, Java, or C++. Practice in your preferred language with full syntax highlighting and support.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Feature Card 6 */}
            <Card className="group relative overflow-hidden border-violet-500/10 bg-black backdrop-blur-xl hover:border-violet-500/30 transition-all duration-500 hover:-translate-y-2 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-violet-900/30">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="relative p-8 space-y-6">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-700/20 border border-violet-500/20 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-violet-900/20 transition-all duration-300">
                  <Target className="h-8 w-8 text-violet-400" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-white group-hover:text-violet-300 transition-colors duration-300">
                    Focused Practice
                  </h3>
                  <p className="text-white/60 leading-relaxed">
                    Filter by topic, difficulty, and company. Build targeted skill sets for specific interview requirements and roles.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section - Enhanced with better visual hierarchy */}
      <section ref={statsRef} className="py-24 relative overflow-hidden bg-black opacity-0 translate-y-20 transition-all duration-1000 ease-out">
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Stat 1 */}
            <div className="group text-center space-y-4">
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-700/20 border border-violet-500/20 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-violet-900/30 transition-all duration-300">
                    <Code2 className="h-8 w-8 text-violet-400" />
                  </div>
                </div>
              </div>
              <div className="text-5xl font-bold text-white">
                500+
              </div>
              <div className="text-muted-foreground font-medium">DSA Problems</div>
            </div>

            {/* Stat 2 */}
            <div className="group text-center space-y-4">
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-700/20 border border-violet-500/20 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-violet-900/30 transition-all duration-300">
                    <Users className="h-8 w-8 text-violet-400" />
                  </div>
                </div>
              </div>
              <div className="text-5xl font-bold text-white">
                10K+
              </div>
              <div className="text-muted-foreground font-medium">Active Learners</div>
            </div>

            {/* Stat 3 */}
            <div className="group text-center space-y-4">
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-700/20 border border-violet-500/20 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-violet-900/30 transition-all duration-300">
                    <Award className="h-8 w-8 text-violet-400" />
                  </div>
                </div>
              </div>
              <div className="text-5xl font-bold text-white">
                95%
              </div>
              <div className="text-muted-foreground font-medium">Success Rate</div>
            </div>

            {/* Stat 4 */}
            <div className="group text-center space-y-4">
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-700/20 border border-violet-500/20 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-violet-900/30 transition-all duration-300">
                    <Zap className="h-8 w-8 text-violet-400" />
                  </div>
                </div>
              </div>
              <div className="text-5xl font-bold text-white">
                AI
              </div>
              <div className="text-muted-foreground font-medium">Powered Hints</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-24 relative overflow-hidden bg-black opacity-0 translate-y-20 transition-all duration-1000 ease-out">
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Ready to{" "}
              <span className="text-white">
                Level Up
              </span>
              {" "}Your Skills?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of developers mastering DSA with AI-powered guidance
            </p>
            <div className="pt-6">
              <Link to="/auth">
                <Button 
                  size="lg" 
                  className="text-lg px-12 py-6 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white shadow-2xl shadow-violet-900/40 hover:shadow-violet-900/60 hover:scale-110 active:scale-95 transition-all duration-300 ease-out"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Get Started for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </SpotlightBackground>
  );
};

export default Landing;

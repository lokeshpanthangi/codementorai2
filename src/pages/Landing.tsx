import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-primary/5">
      <Navbar />

      {/* Hero Section - Compact */}
      <section className="pt-16 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Learning Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Master Coding with{" "}
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                Smart AI Guidance
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform your DSA skills with intelligent, contextual hints. Get the perfect amount of help—never too much, never too little.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Link to="/auth">
                <Button size="lg" className="text-lg px-8 group">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/problems">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Explore Problems
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mt-12 animate-slide-up delay-300">
            <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl shadow-primary/10">
              <img
                src="/landing_page.png"
                alt="CodeMentor AI Dashboard"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="py-20 opacity-0 translate-y-20 transition-all duration-1000 ease-out">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Why Choose Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Excel
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Master coding interviews with our comprehensive AI-powered platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Feature Cards */}
            {[
              { icon: Lightbulb, title: "Smart AI Hints", desc: "Get contextual hints that guide you without spoiling the solution." },
              { icon: TrendingUp, title: "Track Your Progress", desc: "Visualize your improvement with detailed analytics and insights." },
              { icon: Briefcase, title: "Real Interview Prep", desc: "Practice with actual problems from FAANG interviews." },
              { icon: Brain, title: "Adaptive Learning", desc: "AI adapts to your skill level and learning pace." },
              { icon: Code2, title: "Multi-Language Support", desc: "Code in Python, JavaScript, Java, or C++." },
              { icon: Target, title: "Focused Practice", desc: "Filter by topic, difficulty, and company." }
            ].map((feature, i) => (
              <Card 
                key={i} 
                className="group border-border/50 hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10 bg-card/50 backdrop-blur"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 opacity-0 translate-y-20 transition-all duration-1000 ease-out">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Code2, value: "500+", label: "DSA Problems" },
              { icon: Users, value: "10K+", label: "Active Learners" },
              { icon: Award, value: "95%", label: "Success Rate" },
              { icon: Zap, value: "AI", label: "Powered Hints" }
            ].map((stat, i) => (
              <div key={i} className="text-center space-y-3 group">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-foreground">{stat.value}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-20 opacity-0 translate-y-20 transition-all duration-1000 ease-out">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-3xl p-12">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Level Up
              </span>
              {" "}Your Skills?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of developers mastering DSA with AI-powered guidance
            </p>
            <Link to="/auth">
              <Button size="lg" className="text-lg px-12 group">
                <Sparkles className="mr-2 h-5 w-5" />
                Get Started for Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Lightbulb, TrendingUp, Briefcase, Code2, Users, Award, Zap } from "lucide-react";
import heroImage from "@/assets/hero-coding.jpg";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 flex-1">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Master Coding with{" "}
              <span className="text-gradient">AI-Powered Hints</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Practice DSA problems with intelligent guidance. Learn smarter, not harder.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/auth">
                <Button variant="hero" size="lg" className="text-lg px-8">
                  <Code2 className="mr-2 h-5 w-5" />
                  Start Coding
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  View Problems
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
            <img
              src={heroImage}
              alt="AI Coding Platform"
              className="relative rounded-2xl shadow-2xl border border-border/50"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Why Choose <span className="text-gradient">CodeMentor AI</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to master coding interviews
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass-effect hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8 space-y-4">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Lightbulb className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Smart AI Hints</h3>
                <p className="text-muted-foreground">
                  Get contextual hints when you're stuck without spoiling the solution. Our AI understands your progress and provides just the right nudge.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-effect hover:shadow-xl transition-all duration-300 hover:-translate-y-1" style={{ animationDelay: "0.1s" }}>
              <CardContent className="p-8 space-y-4">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Track Progress</h3>
                <p className="text-muted-foreground">
                  Monitor your improvement across different problem categories. Visualize your growth with detailed analytics and insights.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-effect hover:shadow-xl transition-all duration-300 hover:-translate-y-1" style={{ animationDelay: "0.2s" }}>
              <CardContent className="p-8 space-y-4">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Briefcase className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Real Interview Prep</h3>
                <p className="text-muted-foreground">
                  Practice with problems asked by top tech companies like Google, Amazon, and Microsoft. Get interview-ready faster.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center mb-2">
                <Code2 className="h-8 w-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-gradient">500+</div>
              <div className="text-muted-foreground">Problems</div>
            </div>

            <div className="text-center space-y-2">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-gradient">10K+</div>
              <div className="text-muted-foreground">Users</div>
            </div>

            <div className="text-center space-y-2">
              <div className="flex items-center justify-center mb-2">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-gradient">95%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </div>

            <div className="text-center space-y-2">
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-gradient">AI-Powered</div>
              <div className="text-muted-foreground">Intelligence</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;

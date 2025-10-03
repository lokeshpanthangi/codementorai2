import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import {
  Code2,
  CheckCircle2,
  Flame,
  Sparkles,
  Clock,
  Trophy,
  Target,
  Zap,
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from "recharts";

const Dashboard = () => {
  const progressData = [
    { month: "Jan", easy: 12, medium: 8, hard: 3 },
    { month: "Feb", easy: 15, medium: 10, hard: 4 },
    { month: "Mar", easy: 18, medium: 14, hard: 6 },
    { month: "Apr", easy: 20, medium: 18, hard: 9 },
  ];

  const recentActivity = [
    {
      name: "Two Sum",
      difficulty: "Easy",
      status: "Solved",
      time: "2 hours ago",
    },
    {
      name: "Longest Substring",
      difficulty: "Medium",
      status: "Attempted",
      time: "5 hours ago",
    },
    {
      name: "Binary Tree Traversal",
      difficulty: "Medium",
      status: "Solved",
      time: "1 day ago",
    },
    {
      name: "Merge K Sorted Lists",
      difficulty: "Hard",
      status: "Attempted",
      time: "2 days ago",
    },
    {
      name: "Valid Parentheses",
      difficulty: "Easy",
      status: "Solved",
      time: "3 days ago",
    },
  ];

  const categories = [
    { name: "Array", count: 2011 },
    { name: "String", count: 814 },
    { name: "Hash Table", count: 735 },
    { name: "Dynamic Programming", count: 618 },
    { name: "Math", count: 618 },
    { name: "Sorting", count: 478 },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "Hard":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar isAuthenticated username="CodeMaster" />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Card - No Background */}
        <div className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Welcome back, <span className="text-violet-500">CodeMaster</span>!
              </h1>
              <p className="text-white/70 text-lg">
                "The only way to learn a new programming language is by writing programs in it." - Dennis Ritchie
              </p>
            </div>
            <Button variant="default" size="lg">
              Continue Learning
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-effect hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Problems</p>
                  <p className="text-3xl font-bold">520</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Code2 className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Problems Solved</p>
                  <p className="text-3xl font-bold">47</p>
                  <p className="text-sm text-primary">9% completion</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current Streak</p>
                  <p className="text-3xl font-bold">5 days</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Flame className="h-6 w-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">AI Hints Used</p>
                  <p className="text-3xl font-bold">23</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid - Recommended Questions (Left) and Progress + Daily (Right) */}
        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          {/* Left: Recommended For You */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Recommended For You 🎯
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Based on your solving patterns</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  id: "15",
                  title: "3Sum",
                  difficulty: "Medium",
                  reason: "You solved 5 Array problems - try this Medium array challenge",
                  match: 92,
                  tags: ["Array", "Two Pointers", "Sorting"],
                  acceptance: 32.8,
                  frequency: "High",
                },
                {
                  id: "322",
                  title: "Coin Change",
                  difficulty: "Medium",
                  reason: "Strengthen your Dynamic Programming skills",
                  match: 85,
                  tags: ["Dynamic Programming", "BFS"],
                  acceptance: 43.2,
                  frequency: "Very High",
                },
                {
                  id: "102",
                  title: "Binary Tree Level Order",
                  difficulty: "Medium",
                  reason: "Next step after solving Binary Tree Traversal",
                  match: 88,
                  tags: ["Tree", "BFS", "Binary Tree"],
                  acceptance: 65.1,
                  frequency: "High",
                },
                {
                  id: "146",
                  title: "LRU Cache",
                  difficulty: "Medium",
                  reason: "Popular problem you haven't attempted yet",
                  match: 78,
                  tags: ["Hash Table", "Linked List", "Design"],
                  acceptance: 42.3,
                  frequency: "Very High",
                },
              ].map((problem, index) => (
                <Link
                  key={problem.id}
                  to={`/problem/${problem.id}`}
                  className="block group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-4 rounded-lg bg-card/30 hover:bg-card/60 border border-border/40 hover:border-primary/40 transition-all duration-300">
                    {/* Top Row: Title and Stats */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Problem Number */}
                        <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                          #{problem.id}
                        </span>
                        
                        {/* Title */}
                        <h3 className="font-semibold text-base group-hover:text-primary transition-colors truncate">
                          {problem.title}
                        </h3>
                        
                        {/* Difficulty Badge */}
                        <Badge 
                          className={`${getDifficultyColor(problem.difficulty)} text-xs whitespace-nowrap`}
                        >
                          {problem.difficulty}
                        </Badge>
                      </div>

                      {/* Match Score */}
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                          <Sparkles className="h-3 w-3 text-primary" />
                          <span className="text-xs font-medium text-primary">{problem.match}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Reason */}
                    <p className="text-sm text-muted-foreground mb-3 pl-8">
                      {problem.reason}
                    </p>

                    {/* Tags Row */}
                    <div className="flex items-center gap-2 flex-wrap pl-8">
                      {/* Topic Tags */}
                      {problem.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/5 text-primary/90 border border-primary/10 hover:bg-primary/10 hover:border-primary/20 transition-colors cursor-pointer"
                        >
                          {tag}
                        </span>
                      ))}
                      
                      {/* Divider */}
                      <span className="text-muted-foreground/30">•</span>
                      
                      {/* Frequency Tag */}
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-card text-muted-foreground border border-border/50">
                        {problem.frequency}
                      </span>
                      
                      {/* Acceptance Tag */}
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-card text-muted-foreground border border-border/50">
                        {problem.acceptance}% accepted
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Right: Progress Chart + Daily Question */}
          <div className="space-y-6">
            {/* Progress Chart - Area Chart */}
            <Card className="glass-effect overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target className="h-4 w-4 text-primary" />
                  Your Progress
                </CardTitle>
                <p className="text-xs text-muted-foreground">Problems solved over time</p>
              </CardHeader>
              <CardContent className="pb-4">
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={progressData}>
                    <defs>
                      <linearGradient id="colorEasy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(160 84% 39%)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(160 84% 39%)" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(45 93% 47%)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(45 93% 47%)" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorHard" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(0 84% 60%)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(0 84% 60%)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={11} 
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={11} 
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '11px' }}
                      iconType="circle"
                    />
                    <Area
                      type="monotone"
                      dataKey="easy"
                      stroke="hsl(160 84% 39%)"
                      fillOpacity={1}
                      fill="url(#colorEasy)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="medium"
                      stroke="hsl(45 93% 47%)"
                      fillOpacity={1}
                      fill="url(#colorMedium)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="hard"
                      stroke="hsl(0 84% 60%)"
                      fillOpacity={1}
                      fill="url(#colorHard)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Daily Question - Compact */}
            <Card className="glass-effect">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Zap className="h-4 w-4 text-primary" />
                  Daily Challenge
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 group">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-bold group-hover:text-primary transition-colors">Problem of the Day</h3>
                    <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-xs">
                      Medium
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 group-hover:text-foreground transition-colors">Longest Palindromic Substring</p>
                  <Button variant="hero" className="w-full group-hover:scale-[1.02] transition-transform" size="sm">
                    Start Solving
                  </Button>
                </div>

                <Button variant="outline" className="w-full hover:border-primary/40 hover:bg-primary/5 transition-all duration-300" size="sm">
                  <Trophy className="mr-2 h-4 w-4" />
                  Random Problem
                </Button>

                <div className="grid grid-cols-3 gap-2">
                  <Button variant="ghost" className="flex-col h-auto py-3 hover:bg-green-500/10 hover:border-green-500/30 border border-transparent transition-all duration-300 group">
                    <span className="text-xl font-bold text-green-500 group-hover:scale-110 transition-transform">20</span>
                    <span className="text-xs text-muted-foreground">Easy</span>
                  </Button>
                  <Button variant="ghost" className="flex-col h-auto py-3 hover:bg-yellow-500/10 hover:border-yellow-500/30 border border-transparent transition-all duration-300 group">
                    <span className="text-xl font-bold text-yellow-500 group-hover:scale-110 transition-transform">18</span>
                    <span className="text-xs text-muted-foreground">Medium</span>
                  </Button>
                  <Button variant="ghost" className="flex-col h-auto py-3 hover:bg-red-500/10 hover:border-red-500/30 border border-transparent transition-all duration-300 group">
                    <span className="text-xl font-bold text-red-500 group-hover:scale-110 transition-transform">9</span>
                    <span className="text-xs text-muted-foreground">Hard</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-card/50 hover:bg-card transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-1">
                      <h4 className="font-medium">{activity.name}</h4>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                    <Badge className={getDifficultyColor(activity.difficulty)}>
                      {activity.difficulty}
                    </Badge>
                    <Badge
                      variant={activity.status === "Solved" ? "default" : "secondary"}
                      className={activity.status === "Solved" ? "bg-primary" : ""}
                    >
                      {activity.status}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    {activity.status === "Solved" ? "Review" : "Continue"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Code2 className="h-6 w-6 text-primary" />
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card
                key={category.name}
                className="glass-effect hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{category.count} problems</p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <Code2 className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

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
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const Dashboard = () => {
  const progressData = [
    { name: "Easy", value: 20, total: 150, color: "#10b981" },
    { name: "Medium", value: 18, total: 250, color: "#f59e0b" },
    { name: "Hard", value: 9, total: 120, color: "#ef4444" },
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
        {/* Hero Card */}
        <Card className="gradient-primary text-white border-none shadow-xl">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold">Welcome back, CodeMaster!</h1>
                <p className="text-white/90 text-lg">
                  "The only way to learn a new programming language is by writing programs in it." - Dennis Ritchie
                </p>
              </div>
              <Button variant="secondary" size="lg" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                Continue Learning
              </Button>
            </div>
          </CardContent>
        </Card>

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

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Progress Chart */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={progressData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, total }) => `${name}: ${value}/${total}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {progressData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {progressData.map((item) => (
                  <div key={item.name} className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-medium">
                      {item.value}/{item.total} ({Math.round((item.value / item.total) * 100)}%)
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Start */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Quick Start
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-6 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Problem of the Day</h3>
                  <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                    Medium
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-4">Longest Palindromic Substring</p>
                <Button variant="hero" className="w-full">
                  Start Solving
                </Button>
              </div>

              <Button variant="outline" className="w-full" size="lg">
                <Trophy className="mr-2 h-5 w-5" />
                Random Problem
              </Button>

              <div className="grid grid-cols-3 gap-2 pt-2">
                <Button variant="ghost" className="flex-col h-auto py-4">
                  <span className="text-2xl font-bold text-green-500">20</span>
                  <span className="text-xs text-muted-foreground">Easy</span>
                </Button>
                <Button variant="ghost" className="flex-col h-auto py-4">
                  <span className="text-2xl font-bold text-yellow-500">18</span>
                  <span className="text-xs text-muted-foreground">Medium</span>
                </Button>
                <Button variant="ghost" className="flex-col h-auto py-4">
                  <span className="text-2xl font-bold text-red-500">9</span>
                  <span className="text-xs text-muted-foreground">Hard</span>
                </Button>
              </div>
            </CardContent>
          </Card>
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

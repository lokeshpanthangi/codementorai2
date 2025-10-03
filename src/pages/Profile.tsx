import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Flame,
  Calendar,
  Target,
  Clock,
  Code2,
  TrendingUp,
  Award,
  Star,
  CheckCircle2,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const Profile = () => {
  // User stats
  const userStats = {
    username: "CodeMaster",
    email: "codemaster@example.com",
    rank: 1234,
    totalProblems: 520,
    solvedProblems: 47,
    easyCount: 20,
    mediumCount: 18,
    hardCount: 9,
    currentStreak: 5,
    longestStreak: 12,
    totalSubmissions: 152,
    acceptanceRate: 68.4,
    joinedDate: "January 2024",
  };

  // Daily activity for the last 30 days
  const dailyActivity = Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    problems: Math.floor(Math.random() * 5),
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  // Problem distribution by topic
  const topicDistribution = [
    { topic: "Arrays", solved: 12, total: 150 },
    { topic: "Strings", solved: 8, total: 100 },
    { topic: "Trees", solved: 6, total: 80 },
    { topic: "Dynamic Programming", solved: 5, total: 120 },
    { topic: "Graphs", solved: 4, total: 90 },
    { topic: "Hash Tables", solved: 7, total: 70 },
  ];

  // Recent submissions
  const recentSubmissions = [
    {
      problem: "Two Sum",
      difficulty: "Easy",
      status: "Accepted",
      runtime: "42ms",
      memory: "14.2MB",
      date: "2 hours ago",
    },
    {
      problem: "Longest Substring",
      difficulty: "Medium",
      status: "Wrong Answer",
      runtime: "-",
      memory: "-",
      date: "5 hours ago",
    },
    {
      problem: "Binary Tree Traversal",
      difficulty: "Medium",
      status: "Accepted",
      runtime: "28ms",
      memory: "16.8MB",
      date: "1 day ago",
    },
  ];

  // Achievements
  const achievements = [
    { name: "First Blood", description: "Solved your first problem", earned: true },
    { name: "Week Warrior", description: "7-day streak achieved", earned: true },
    { name: "Speed Demon", description: "Top 10% runtime on 5 problems", earned: false },
    { name: "Problem Hunter", description: "Solved 50 problems", earned: false },
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
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated username={userStats.username} />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Profile Header */}
        <Card className="glass-effect">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                  {userStats.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-3">
                <div>
                  <h1 className="text-3xl font-bold">{userStats.username}</h1>
                  <p className="text-muted-foreground">{userStats.email}</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <Badge variant="outline" className="gap-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    Rank #{userStats.rank.toLocaleString()}
                  </Badge>
                  <Badge variant="outline" className="gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Joined {userStats.joinedDate}
                  </Badge>
                  <Badge variant="outline" className="gap-2">
                    <Flame className="h-4 w-4 text-orange-500" />
                    {userStats.currentStreak} day streak
                  </Badge>
                </div>
              </div>

              <Link to="/settings">
                <Button variant="outline">Edit Profile</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-effect">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Solved Problems</p>
                  <p className="text-3xl font-bold">{userStats.solvedProblems}</p>
                  <p className="text-sm text-primary">
                    {((userStats.solvedProblems / userStats.totalProblems) * 100).toFixed(1)}% of {userStats.totalProblems}
                  </p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Acceptance Rate</p>
                  <p className="text-3xl font-bold">{userStats.acceptanceRate}%</p>
                  <p className="text-sm text-muted-foreground">
                    {userStats.solvedProblems}/{userStats.totalSubmissions} submissions
                  </p>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current Streak</p>
                  <p className="text-3xl font-bold">{userStats.currentStreak}</p>
                  <p className="text-sm text-muted-foreground">
                    Best: {userStats.longestStreak} days
                  </p>
                </div>
                <Flame className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Global Rank</p>
                  <p className="text-3xl font-bold">#{userStats.rank.toLocaleString()}</p>
                  <p className="text-sm text-green-500">↑ 15 this week</p>
                </div>
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Problem Breakdown */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Problem Difficulty Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-green-500">Easy</span>
                  <span className="text-sm text-muted-foreground">
                    {userStats.easyCount}/150 ({((userStats.easyCount / 150) * 100).toFixed(1)}%)
                  </span>
                </div>
                <Progress value={(userStats.easyCount / 150) * 100} className="h-2 bg-muted" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-yellow-500">Medium</span>
                  <span className="text-sm text-muted-foreground">
                    {userStats.mediumCount}/250 ({((userStats.mediumCount / 250) * 100).toFixed(1)}%)
                  </span>
                </div>
                <Progress value={(userStats.mediumCount / 250) * 100} className="h-2 bg-muted" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-red-500">Hard</span>
                  <span className="text-sm text-muted-foreground">
                    {userStats.hardCount}/120 ({((userStats.hardCount / 120) * 100).toFixed(1)}%)
                  </span>
                </div>
                <Progress value={(userStats.hardCount / 120) * 100} className="h-2 bg-muted" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Daily Activity */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Daily Activity (Last 30 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={dailyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="problems"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Topic Distribution */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-primary" />
                Problems by Topic
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={topicDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="topic" stroke="hsl(var(--muted-foreground))" fontSize={11} angle={-15} textAnchor="end" height={80} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="solved" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.name}
                  className={`p-4 rounded-lg border transition-all ${
                    achievement.earned
                      ? "bg-primary/5 border-primary/20"
                      : "bg-muted/20 border-border/50 opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        achievement.earned ? "bg-primary/20" : "bg-muted"
                      }`}
                    >
                      <Star
                        className={`h-5 w-5 ${
                          achievement.earned ? "text-primary fill-primary" : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{achievement.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Submissions */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSubmissions.map((submission, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-card/50 hover:bg-card transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-1">
                      <h4 className="font-medium">{submission.problem}</h4>
                      <p className="text-sm text-muted-foreground">{submission.date}</p>
                    </div>
                    <Badge className={getDifficultyColor(submission.difficulty)}>
                      {submission.difficulty}
                    </Badge>
                    <Badge
                      className={
                        submission.status === "Accepted"
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : "bg-red-500/10 text-red-500 border-red-500/20"
                      }
                    >
                      {submission.status}
                    </Badge>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-muted-foreground">Runtime: {submission.runtime}</p>
                    <p className="text-muted-foreground">Memory: {submission.memory}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;

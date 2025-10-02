import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import {
  Search,
  CheckCircle2,
  Circle,
  Star,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Problems = () => {
  const [difficulty, setDifficulty] = useState("All");
  const [status, setStatus] = useState("All");

  const problems = [
    {
      id: 1,
      title: "Two Sum",
      acceptance: "56.4%",
      difficulty: "Easy",
      solved: true,
    },
    {
      id: 2,
      title: "Add Two Numbers",
      acceptance: "47.0%",
      difficulty: "Medium",
      solved: true,
    },
    {
      id: 3,
      title: "Longest Substring Without Repeating Characters",
      acceptance: "37.7%",
      difficulty: "Medium",
      solved: false,
    },
    {
      id: 4,
      title: "Median of Two Sorted Arrays",
      acceptance: "44.8%",
      difficulty: "Hard",
      solved: true,
    },
    {
      id: 5,
      title: "Longest Palindromic Substring",
      acceptance: "36.5%",
      difficulty: "Medium",
      solved: false,
    },
    {
      id: 6,
      title: "Zigzag Conversion",
      acceptance: "52.5%",
      difficulty: "Medium",
      solved: false,
    },
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

  const solvedCount = 216;
  const totalCount = 3700;
  const progressPercentage = (solvedCount / totalCount) * 100;

  return (
    <div className="min-h-screen">
      <Navbar isAuthenticated username="CodeMaster" />

      {/* Filter Bar */}
      <div className="sticky top-16 z-40 border-b border-border/50 glass-effect">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions"
                className="pl-10 bg-background/50"
              />
            </div>

            <Select defaultValue="all">
              <SelectTrigger className="w-[180px] bg-background/50">
                <SelectValue placeholder="All Topics" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border z-50">
                <SelectItem value="all">All Topics</SelectItem>
                <SelectItem value="array">Array</SelectItem>
                <SelectItem value="string">String</SelectItem>
                <SelectItem value="hash-table">Hash Table</SelectItem>
                <SelectItem value="dynamic-programming">
                  Dynamic Programming
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              {["All", "Easy", "Medium", "Hard"].map((diff) => (
                <Button
                  key={diff}
                  variant={difficulty === diff ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDifficulty(diff)}
                  className={
                    difficulty === diff ? "bg-primary" : "bg-background/50"
                  }
                >
                  {diff}
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              {["All", "Solved", "Attempted", "Todo"].map((stat) => (
                <Button
                  key={stat}
                  variant={status === stat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatus(stat)}
                  className={status === stat ? "bg-primary" : "bg-background/50"}
                >
                  {stat}
                </Button>
              ))}
            </div>

            <Select defaultValue="acceptance">
              <SelectTrigger className="w-[150px] bg-background/50">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border z-50">
                <SelectItem value="acceptance">Acceptance</SelectItem>
                <SelectItem value="frequency">Frequency</SelectItem>
                <SelectItem value="difficulty">Difficulty</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="ghost" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Stats Banner */}
        <div className="glass-effect p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              <span className="text-2xl font-bold">
                {solvedCount}/{totalCount} Solved
              </span>
            </div>
            <span className="text-muted-foreground">
              {progressPercentage.toFixed(1)}%
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Problems Table */}
        <div className="glass-effect rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border/50">
                <tr className="text-left">
                  <th className="p-4 font-semibold text-sm text-muted-foreground w-20">
                    Status
                  </th>
                  <th className="p-4 font-semibold text-sm text-muted-foreground">
                    Title
                  </th>
                  <th className="p-4 font-semibold text-sm text-muted-foreground w-32">
                    Acceptance
                  </th>
                  <th className="p-4 font-semibold text-sm text-muted-foreground w-32">
                    Difficulty
                  </th>
                  <th className="p-4 font-semibold text-sm text-muted-foreground w-20">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {problems.map((problem, index) => (
                  <tr
                    key={problem.id}
                    className="border-b border-border/30 hover:bg-card/50 transition-colors group"
                  >
                    <td className="p-4">
                      {problem.solved ? (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </td>
                    <td className="p-4">
                      <Link
                        to={`/problem/${problem.id}`}
                        className="hover:text-primary transition-colors font-medium"
                      >
                        {index + 1}. {problem.title}
                      </Link>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {problem.acceptance}
                    </td>
                    <td className="p-4">
                      <Badge className={getDifficultyColor(problem.difficulty)}>
                        {problem.difficulty}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 p-6 border-t border-border/50">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="default" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <span className="text-muted-foreground">...</span>
            <Button variant="outline" size="sm">
              50
            </Button>
            <Button variant="outline" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Problems;

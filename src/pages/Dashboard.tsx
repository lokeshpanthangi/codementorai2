import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import {
  Code2,
  CheckCircle2,
  Flame,
  Sparkles,
  Search,
  Circle,
  ChevronDown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Problem {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  acceptance: string;
  solved: boolean;
}

const allProblems: Problem[] = [
  { id: 1, title: "Two Sum", difficulty: "Easy", category: "Array", acceptance: "56.4%", solved: true },
  { id: 2, title: "Add Two Numbers", difficulty: "Medium", category: "Linked List", acceptance: "47.0%", solved: true },
  { id: 3, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", category: "String", acceptance: "37.7%", solved: false },
  { id: 4, title: "Median of Two Sorted Arrays", difficulty: "Hard", category: "Binary Search", acceptance: "44.8%", solved: true },
  { id: 5, title: "Longest Palindromic Substring", difficulty: "Medium", category: "String", acceptance: "36.5%", solved: false },
  { id: 6, title: "Zigzag Conversion", difficulty: "Medium", category: "String", acceptance: "52.5%", solved: false },
  { id: 7, title: "Reverse Integer", difficulty: "Easy", category: "Math", acceptance: "28.6%", solved: true },
  { id: 8, title: "String to Integer (atoi)", difficulty: "Medium", category: "String", acceptance: "17.5%", solved: false },
  { id: 9, title: "Palindrome Number", difficulty: "Easy", category: "Math", acceptance: "56.3%", solved: true },
  { id: 10, title: "Regular Expression Matching", difficulty: "Hard", category: "Dynamic Programming", acceptance: "28.6%", solved: false },
  { id: 11, title: "Container With Most Water", difficulty: "Medium", category: "Array", acceptance: "54.2%", solved: true },
  { id: 12, title: "Integer to Roman", difficulty: "Medium", category: "Math", acceptance: "64.8%", solved: false },
  { id: 13, title: "Roman to Integer", difficulty: "Easy", category: "Math", acceptance: "59.4%", solved: true },
  { id: 14, title: "Longest Common Prefix", difficulty: "Easy", category: "String", acceptance: "43.5%", solved: true },
  { id: 15, title: "3Sum", difficulty: "Medium", category: "Array", acceptance: "32.8%", solved: false },
  { id: 16, title: "3Sum Closest", difficulty: "Medium", category: "Array", acceptance: "45.8%", solved: false },
  { id: 17, title: "Letter Combinations of a Phone Number", difficulty: "Medium", category: "Backtracking", acceptance: "58.6%", solved: true },
  { id: 18, title: "4Sum", difficulty: "Medium", category: "Array", acceptance: "37.2%", solved: false },
  { id: 19, title: "Remove Nth Node From End of List", difficulty: "Medium", category: "Linked List", acceptance: "43.8%", solved: false },
  { id: 20, title: "Valid Parentheses", difficulty: "Easy", category: "String", acceptance: "41.2%", solved: true },
];

const Dashboard = () => {
  const [displayedProblems, setDisplayedProblems] = useState<Problem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const ITEMS_PER_PAGE = 10;

  const getFilteredProblems = useCallback(() => {
    return allProblems.filter(problem => {
      const matchesDifficulty = difficultyFilter === "All" || problem.difficulty === difficultyFilter;
      const matchesCategory = categoryFilter === "All" || problem.category === categoryFilter;
      const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDifficulty && matchesCategory && matchesSearch;
    });
  }, [difficultyFilter, categoryFilter, searchQuery]);

  const loadMoreProblems = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);
    setTimeout(() => {
      const filtered = getFilteredProblems();
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newProblems = filtered.slice(startIndex, endIndex);

      if (newProblems.length === 0) {
        setHasMore(false);
      } else {
        setDisplayedProblems(prev => [...prev, ...newProblems]);
        setPage(prev => prev + 1);
      }
      setLoading(false);
    }, 500);
  }, [page, loading, hasMore, getFilteredProblems]);

  useEffect(() => {
    setDisplayedProblems([]);
    setPage(1);
    setHasMore(true);
  }, [difficultyFilter, categoryFilter, searchQuery]);

  useEffect(() => {
    if (displayedProblems.length === 0) {
      loadMoreProblems();
    }
  }, [displayedProblems.length, loadMoreProblems]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        loadMoreProblems();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMoreProblems]);

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

  const categories = ["All", "Array", "String", "Hash Table", "Dynamic Programming", "Math", "Sorting", "Tree", "Graph"];

  return (
    <div className="min-h-screen w-full">
      <Navbar isAuthenticated username="CodeMaster" />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold">
                  Welcome back, <span className="text-primary">CodeMaster</span>!
                </h1>
                <p className="text-muted-foreground text-lg">
                  "The only way to learn a new programming language is by writing programs in it." - Dennis Ritchie
                </p>
              </div>
              <Button variant="default" size="lg">
                Continue Learning
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

          {/* Featured Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recommended Problems - Larger (2 columns) */}
            <Card className="glass-effect lg:col-span-2">
              <CardContent className="p-6 h-full">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                  Recommended for You
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link to="/problem/1" className="block">
                    <div className="p-5 rounded-lg bg-background/50 hover:bg-accent/10 transition-colors cursor-pointer">
                      <p className="font-medium text-lg mb-2">Two Sum</p>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Easy</Badge>
                        <span className="text-sm text-muted-foreground">Array</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Master array manipulation techniques</p>
                    </div>
                  </Link>
                  <Link to="/problem/20" className="block">
                    <div className="p-5 rounded-lg bg-background/50 hover:bg-accent/10 transition-colors cursor-pointer">
                      <p className="font-medium text-lg mb-2">Valid Parentheses</p>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Easy</Badge>
                        <span className="text-sm text-muted-foreground">Stack</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Learn stack data structure fundamentals</p>
                    </div>
                  </Link>
                  <Link to="/problem/2" className="block">
                    <div className="p-5 rounded-lg bg-background/50 hover:bg-accent/10 transition-colors cursor-pointer">
                      <p className="font-medium text-lg mb-2">Add Two Numbers</p>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Medium</Badge>
                        <span className="text-sm text-muted-foreground">Linked List</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Practice linked list operations</p>
                    </div>
                  </Link>
                  <Link to="/problem/3" className="block">
                    <div className="p-5 rounded-lg bg-background/50 hover:bg-accent/10 transition-colors cursor-pointer">
                      <p className="font-medium text-lg mb-2">Longest Substring</p>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Medium</Badge>
                        <span className="text-sm text-muted-foreground">String</span>
                      </div>
                      <p className="text-sm text-muted-foreground">String manipulation mastery</p>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Right Column - Progress and Daily Challenge */}
            <div className="space-y-6">
              {/* Progress Overview - Pie Chart with subtle hover animation */}
              <Card className="glass-effect group transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4">Progress Overview</h3>
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-full max-w-[180px] aspect-square transition-transform duration-500 group-hover:scale-105">
                      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                        {/* Easy - 60% - Violet */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="hsl(270 91% 65%)"
                          strokeWidth="20"
                          strokeDasharray="151 251"
                          strokeDashoffset="0"
                          className="transition-all duration-500"
                        />
                        {/* Medium - 30% - White/Light */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="hsl(0 0% 95%)"
                          strokeWidth="20"
                          strokeDasharray="75.4 326"
                          strokeDashoffset="-151"
                          className="transition-all duration-500"
                        />
                        {/* Hard - 10% - Black/Dark */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="hsl(0 0% 10%)"
                          strokeWidth="20"
                          strokeDasharray="25.1 226"
                          strokeDashoffset="-226.4"
                          className="transition-all duration-500"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: 'hsl(270 91% 65%)' }}></div>
                        <span className="text-sm text-muted-foreground">Easy</span>
                      </div>
                      <span className="text-sm font-medium">12/20</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: 'hsl(0 0% 95%)' }}></div>
                        <span className="text-sm text-muted-foreground">Medium</span>
                      </div>
                      <span className="text-sm font-medium">8/15</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: 'hsl(0 0% 10%)' }}></div>
                        <span className="text-sm text-muted-foreground">Hard</span>
                      </div>
                      <span className="text-sm font-medium">3/10</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Daily Challenge - Smaller */}
              <Card className="glass-effect bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-500" />
                    Daily Challenge
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">Keep your streak alive!</p>
                  <div className="p-4 rounded-lg bg-background/50 mb-4">
                    <p className="font-medium mb-2">Longest Substring</p>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Medium</Badge>
                      <span className="text-xs text-muted-foreground">String</span>
                    </div>
                  </div>
                  <Button variant="default" className="w-full">
                    Start Challenge
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Search and Filters Section */}
          <Card className="glass-effect mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                {/* Search */}
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search problems..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background/50"
                  />
                </div>

                {/* Difficulty Filter Dropdown */}
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger className="w-full md:w-[180px] bg-background/50">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Difficulties</SelectItem>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>

                {/* Category Filter Dropdown */}
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-[180px] bg-background/50">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {categories.filter(cat => cat !== "All").map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Problems List */}
          <div className="space-y-4">
            {displayedProblems.map((problem) => (
              <Link
                key={problem.id}
                to={`/problem/${problem.id}`}
                className="block group"
              >
                <Card className="glass-effect hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            {problem.solved ? (
                              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors truncate">
                                {problem.id}. {problem.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">{problem.category}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <Badge className={getDifficultyColor(problem.difficulty)}>
                              {problem.difficulty}
                            </Badge>
                            <span className="text-sm text-muted-foreground hidden sm:block">
                              {problem.acceptance}
                            </span>
                          </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}

            {loading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}

            {!hasMore && displayedProblems.length > 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No more problems to load
              </div>
            )}

            {displayedProblems.length === 0 && !loading && (
              <div className="text-center py-8 text-muted-foreground">
                No problems found matching your filters
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import * as problemsService from "@/services/problemsService";
import type { Problem } from "@/services/problemsService";
import {
  Code2,
  CheckCircle2,
  Flame,
  Sparkles,
  Search,
  Circle,
  ChevronDown,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Dashboard = () => {
  const { user } = useAuth();
  
  // State for problems
  const [allProblems, setAllProblems] = useState<Problem[]>([]);
  const [displayedProblems, setDisplayedProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [difficultyFilter, setDifficultyFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 10;

  // Fetch problems from backend
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let problems: Problem[];
        if (difficultyFilter === "All") {
          problems = await problemsService.getProblems();
        } else {
          problems = await problemsService.getProblems(difficultyFilter as 'Easy' | 'Medium' | 'Hard');
        }
        
        setAllProblems(problems);
        setDisplayedProblems([]);
        setPage(1);
        setHasMore(true);
      } catch (err: any) {
        console.error('Failed to fetch problems:', err);
        setError(err.response?.data?.detail || 'Failed to load problems');
        toast.error('Failed to load problems');
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [difficultyFilter]);

  const getFilteredProblems = useCallback(() => {
    // Apply search and topic filters
    return problemsService.filterProblems(allProblems, searchQuery, selectedTopics.length > 0 ? selectedTopics : undefined);
  }, [allProblems, searchQuery, selectedTopics]);

  const loadMoreProblems = useCallback(() => {
    if (loading || !hasMore) return;

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
  }, [page, loading, hasMore, getFilteredProblems]);

  // Reset displayed problems when filters change
  useEffect(() => {
    setDisplayedProblems([]);
    setPage(1);
    setHasMore(true);
  }, [searchQuery, selectedTopics]);

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

  // Get unique topics from all problems
  const availableTopics = problemsService.getUniqueTopics(allProblems);
  
  // Calculate stats
  const totalProblems = allProblems.length;
  const easyCount = allProblems.filter(p => p.difficulty === 'Easy').length;
  const mediumCount = allProblems.filter(p => p.difficulty === 'Medium').length;
  const hardCount = allProblems.filter(p => p.difficulty === 'Hard').length;

  return (
    <div className="min-h-screen w-full">
      <Navbar isAuthenticated username={user?.username} />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold">
                  Welcome back, <span className="text-primary">{user?.username || 'Coder'}</span>!
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
                        <p className="text-3xl font-bold">{loading ? '...' : totalProblems}</p>
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
                        <p className="text-sm text-muted-foreground mb-1">Easy Problems</p>
                        <p className="text-3xl font-bold text-green-500">{loading ? '...' : easyCount}</p>
                      </div>
                      <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Medium Problems</p>
                        <p className="text-3xl font-bold text-yellow-500">{loading ? '...' : mediumCount}</p>
                      </div>
                      <div className="h-12 w-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                        <Flame className="h-6 w-6 text-yellow-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Hard Problems</p>
                        <p className="text-3xl font-bold text-red-500">{loading ? '...' : hardCount}</p>
                      </div>
                      <div className="h-12 w-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                        <Sparkles className="h-6 w-6 text-red-500" />
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
                  {allProblems.slice(0, 4).map((problem) => (
                    <Link key={problem.id} to={`/problem/${problem.slug}`} className="block">
                      <div className="p-5 rounded-lg bg-background/50 hover:bg-accent/10 transition-colors cursor-pointer">
                        <p className="font-medium text-lg mb-2">{problem.title}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                          {problem.topics[0] && (
                            <span className="text-sm text-muted-foreground">{problem.topics[0]}</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {problem.description.substring(0, 100)}...
                        </p>
                      </div>
                    </Link>
                  ))}
                  {allProblems.length === 0 && !loading && (
                    <div className="col-span-2 text-center text-muted-foreground py-8">
                      No problems available
                    </div>
                  )}
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
                    placeholder="Search problems by title, topic, or company..."
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

                {/* Topic Filter (optional - can be added later) */}
                {availableTopics.length > 0 && (
                  <Select 
                    value={selectedTopics.length > 0 ? selectedTopics[0] : "All"}
                    onValueChange={(value) => setSelectedTopics(value === "All" ? [] : [value])}
                  >
                    <SelectTrigger className="w-full md:w-[180px] bg-background/50">
                      <SelectValue placeholder="Topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Topics</SelectItem>
                      {availableTopics.slice(0, 10).map((topic) => (
                        <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Loading State */}
          {loading && displayedProblems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading problems...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card className="glass-effect border-destructive/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Failed to load problems</p>
                    <p className="text-sm text-muted-foreground">{error}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Problems List */}
          {!loading && !error && (
            <div className="space-y-4">
              {displayedProblems.map((problem) => (
                <Link
                  key={problem.id}
                  to={`/problem/${problem.slug}`}
                  className="block group"
                >
                  <Card className="glass-effect hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors truncate">
                                  {problem.title}
                                </h3>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {problem.topics.slice(0, 3).map((topic, idx) => (
                                    <span key={idx} className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                                      {topic}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <Badge className={getDifficultyColor(problem.difficulty)}>
                                {problem.difficulty}
                              </Badge>
                            </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}

              {!loading && hasMore && displayedProblems.length > 0 && (
                <div className="flex justify-center py-8">
                  <Button onClick={loadMoreProblems} variant="outline">
                    Load More
                  </Button>
                </div>
              )}

              {!hasMore && displayedProblems.length > 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No more problems to load
                </div>
              )}

              {displayedProblems.length === 0 && !loading && (
                <Card className="glass-effect">
                  <CardContent className="p-12 text-center">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">No problems found</p>
                    <p className="text-muted-foreground">
                      Try adjusting your filters or search query
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

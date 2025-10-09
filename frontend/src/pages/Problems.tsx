import { useState, useEffect } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import { getProblems, type Problem } from "@/services/problemsService";
import { toast } from "sonner";
import {
  Search,
  CheckCircle2,
  Circle,
  Star,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Problems = () => {
  const { user } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState("All");
  const [status, setStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [sortBy, setSortBy] = useState("acceptance");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  // Fetch problems from API
  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const data = await getProblems();
      setProblems(data);
      setFilteredProblems(data);
    } catch (error: any) {
      console.error('Failed to fetch problems:', error);
      toast.error('Failed to load problems');
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  useEffect(() => {
    let filtered = [...problems];

    // Difficulty filter
    if (difficulty !== "All") {
      filtered = filtered.filter((p) => p.difficulty === difficulty);
    }

    // Topic filter
    if (selectedTopic !== "all") {
      filtered = filtered.filter((p) => 
        p.topics.some(topic => topic.toLowerCase() === selectedTopic.toLowerCase())
      );
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Sort
    if (sortBy === "difficulty") {
      const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
      filtered.sort((a, b) => difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - difficultyOrder[b.difficulty as keyof typeof difficultyOrder]);
    }

    setFilteredProblems(filtered);
    setCurrentPage(1);
  }, [difficulty, selectedTopic, searchQuery, sortBy, problems]);

  const handleReset = () => {
    setDifficulty("All");
    setStatus("All");
    setSearchQuery("");
    setSelectedTopic("all");
    setSortBy("acceptance");
    setCurrentPage(1);
  };

  // Extract unique topics from problems
  const allTopics = Array.from(
    new Set(problems.flatMap((p) => p.topics))
  ).sort();

  // Pagination
  const totalPages = Math.ceil(filteredProblems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProblems = filteredProblems.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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

  // Mock stats - TODO: Fetch from backend in future
  const solvedCount = 0; // Will be tracked with submissions
  const totalCount = problems.length;
  const progressPercentage = totalCount > 0 ? (solvedCount / totalCount) * 100 : 0;

  return (
    <div className="min-h-screen">
      <Navbar isAuthenticated username={user?.username} />

      {/* Filter Bar */}
      <div className="sticky top-16 z-40 border-b border-border/50 glass-effect">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions"
                className="pl-10 bg-background/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger className="w-[180px] bg-background/50">
                <SelectValue placeholder="All Topics" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border z-50">
                <SelectItem value="all">All Topics</SelectItem>
                {allTopics.map((topic) => (
                  <SelectItem key={topic} value={topic.toLowerCase()}>
                    {topic}
                  </SelectItem>
                ))}
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
                  disabled
                >
                  {stat}
                </Button>
              ))}
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px] bg-background/50">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border z-50">
                <SelectItem value="acceptance">Default</SelectItem>
                <SelectItem value="difficulty">Difficulty</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="ghost" size="sm" onClick={handleReset}>
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
          {filteredProblems.length !== totalCount && (
            <p className="text-sm text-muted-foreground mt-2">
              Showing {filteredProblems.length} of {totalCount} problems
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="glass-effect p-12 rounded-lg flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading problems...</p>
          </div>
        )}

        {/* No Results */}
        {!loading && filteredProblems.length === 0 && (
          <div className="glass-effect p-12 rounded-lg text-center">
            <p className="text-lg text-muted-foreground mb-2">No problems found</p>
            <p className="text-sm text-muted-foreground mb-4">
              Try adjusting your filters or search query
            </p>
            <Button onClick={handleReset} variant="outline">
              Reset Filters
            </Button>
          </div>
        )}

        {/* Problems Table */}
        {!loading && filteredProblems.length > 0 && (
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
                    <th className="p-4 font-semibold text-sm text-muted-foreground">
                      Topics
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
                  {paginatedProblems.map((problem, index) => (
                    <tr
                      key={problem.id}
                      className="border-b border-border/30 hover:bg-card/50 transition-colors group"
                    >
                      <td className="p-4">
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      </td>
                      <td className="p-4">
                        <Link
                          to={`/problem/${problem.slug}`}
                          className="hover:text-primary transition-colors font-medium"
                        >
                          {startIndex + index + 1}. {problem.title}
                        </Link>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {problem.topics.slice(0, 3).map((topic) => (
                            <Badge key={topic} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                          {problem.topics.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{problem.topics.length - 3}
                            </Badge>
                          )}
                        </div>
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
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="text-muted-foreground">...</span>
                <Button variant="outline" size="sm" onClick={() => goToPage(totalPages)}>
                  {totalPages}
                </Button>
              </>
            )}
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        )}
      </main>
    </div>
  );
};

export default Problems;

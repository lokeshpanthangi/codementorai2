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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import {
  Search,
  CheckCircle2,
  Circle,
  Star,
  Filter,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [displayedProblems, setDisplayedProblems] = useState(20);

  const allProblems = Array.from({ length: 500 }, (_, i) => ({
    id: i + 1,
    title: `Problem ${i + 1}`,
    acceptance: `${(Math.random() * 40 + 30).toFixed(1)}%`,
    difficulty: ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)],
    category: ["array", "string", "linked-list", "tree", "graph", "dynamic-programming", "hash-table", "sorting"][Math.floor(Math.random() * 8)],
    solved: Math.random() > 0.7,
  }));

  const filteredProblems = allProblems.filter(problem => {
    const matchesCategory = selectedCategory === "all" || problem.category === selectedCategory;
    const matchesDifficulty = difficulty === "all" || problem.difficulty.toLowerCase() === difficulty;
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        setDisplayedProblems(prev => Math.min(prev + 20, filteredProblems.length));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [filteredProblems.length]);

  useEffect(() => {
    setDisplayedProblems(20);
  }, [selectedCategory, difficulty, searchQuery]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "Hard": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "";
    }
  };

  const solvedCount = filteredProblems.filter(p => p.solved).length;
  const totalCount = filteredProblems.length;

  const progressData = [
    { day: "Mon", problems: 3 },
    { day: "Tue", problems: 5 },
    { day: "Wed", problems: 2 },
    { day: "Thu", problems: 7 },
    { day: "Fri", problems: 4 },
    { day: "Sat", problems: 8 },
    { day: "Sun", problems: 6 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated username="CodeMaster" />
      <div className="flex">
        <DashboardSidebar selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
        <main className="flex-1 p-6 space-y-6">
          <Card className="border-border/50">
            <CardHeader><CardTitle className="text-2xl">Your Progress</CardTitle></CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={progressData}>
                    <defs>
                      <linearGradient id="colorProblems" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(270 91% 65%)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(270 91% 65%)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="problems" stroke="hsl(270 91% 65%)" strokeWidth={2} fill="url(#colorProblems)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search problems..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                </div>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="w-[150px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 inline mr-1 text-primary" />
                  {solvedCount}/{totalCount} Solved
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border/50 bg-muted/30">
                    <tr className="text-left">
                      <th className="p-4 font-semibold text-sm text-muted-foreground w-20">Status</th>
                      <th className="p-4 font-semibold text-sm text-muted-foreground">Title</th>
                      <th className="p-4 font-semibold text-sm text-muted-foreground w-32">Acceptance</th>
                      <th className="p-4 font-semibold text-sm text-muted-foreground w-32">Difficulty</th>
                      <th className="p-4 font-semibold text-sm text-muted-foreground w-20">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProblems.slice(0, displayedProblems).map((problem, index) => (
                      <tr key={problem.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors group">
                        <td className="p-4">{problem.solved ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <Circle className="h-5 w-5 text-muted-foreground" />}</td>
                        <td className="p-4"><Link to={`/problem/${problem.id}`} className="hover:text-primary transition-colors font-medium">{index + 1}. {problem.title}</Link></td>
                        <td className="p-4 text-muted-foreground">{problem.acceptance}</td>
                        <td className="p-4"><Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge></td>
                        <td className="p-4"><Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity"><Star className="h-4 w-4" /></Button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {displayedProblems < filteredProblems.length && <div className="p-6 text-center border-t border-border/50"><p className="text-sm text-muted-foreground">Scroll down to load more problems...</p></div>}
              {displayedProblems >= filteredProblems.length && filteredProblems.length > 0 && <div className="p-6 text-center border-t border-border/50"><p className="text-sm text-muted-foreground">You've reached the end of the list</p></div>}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

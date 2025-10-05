import { 
  Code2, 
  Hash, 
  Database, 
  GitBranch, 
  Layers, 
  Network,
  Binary,
  FileSearch,
  Workflow
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: "all", name: "All Problems", icon: Code2, count: 3700 },
  { id: "array", name: "Array", icon: Layers, count: 486 },
  { id: "string", name: "String", icon: Hash, count: 423 },
  { id: "linked-list", name: "Linked List", icon: GitBranch, count: 178 },
  { id: "tree", name: "Tree", icon: Network, count: 312 },
  { id: "graph", name: "Graph", icon: Workflow, count: 245 },
  { id: "dynamic-programming", name: "Dynamic Programming", icon: Binary, count: 298 },
  { id: "hash-table", name: "Hash Table", icon: Database, count: 267 },
  { id: "sorting", name: "Sorting & Searching", icon: FileSearch, count: 189 },
];

export function DashboardSidebar({ selectedCategory, onCategoryChange }: DashboardSidebarProps) {
  return (
    <aside className="w-72 border-r border-border/50 bg-card/30 backdrop-blur p-6 space-y-2">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-foreground mb-1">Categories</h2>
        <p className="text-sm text-muted-foreground">Browse problems by topic</p>
      </div>
      
      <nav className="space-y-1">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = selectedCategory === category.id;
          
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                "hover:bg-primary/10 hover:translate-x-1",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-primary")} />
              <span className="flex-1 text-left font-medium text-sm">{category.name}</span>
              <span className={cn(
                "text-xs px-2 py-1 rounded-full",
                isActive 
                  ? "bg-primary/20 text-primary font-semibold" 
                  : "bg-muted text-muted-foreground"
              )}>
                {category.count}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

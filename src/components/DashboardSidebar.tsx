import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Hash } from "lucide-react";

const categories = [
  { name: "Array", count: 2011 },
  { name: "String", count: 814 },
  { name: "Hash Table", count: 735 },
  { name: "Dynamic Programming", count: 618 },
  { name: "Math", count: 618 },
  { name: "Sorting", count: 478 },
  { name: "Tree", count: 425 },
  { name: "Graph", count: 380 },
  { name: "Binary Search", count: 325 },
  { name: "Greedy", count: 298 },
  { name: "Backtracking", count: 245 },
  { name: "Linked List", count: 210 },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "justify-center" : ""}>
            {isCollapsed ? <Hash className="h-4 w-4" /> : "Categories"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((category) => (
                <SidebarMenuItem key={category.name}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={`/problems?category=${encodeURIComponent(category.name)}`}
                      className="w-full flex items-center justify-between hover:bg-accent/50 transition-colors"
                    >
                      <span className={isCollapsed ? "sr-only" : "flex-1 truncate"}>
                        {category.name}
                      </span>
                      {!isCollapsed && (
                        <span className="text-xs text-muted-foreground">
                          {category.count}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

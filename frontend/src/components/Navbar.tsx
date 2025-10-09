import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Code2, LogOut, User, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

interface NavbarProps {
  isAuthenticated?: boolean;
  username?: string;
}

const Navbar = ({ isAuthenticated: propIsAuthenticated, username: propUsername }: NavbarProps) => {
  const location = useLocation();
  const auth = useAuth();
  
  // Use auth context if available, otherwise fall back to props
  const isAuthenticated = auth ? auth.isAuthenticated : propIsAuthenticated;
  const username = auth?.user?.username || propUsername || "User";
  
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    if (auth) {
      auth.logout();
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 glass-effect">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-xl font-bold group transition-all duration-300"
        >
          <div className="relative">
            <Code2 className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-primary/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent group-hover:from-primary/90 group-hover:to-primary transition-all duration-300">
            CodeMentor AI
          </span>
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-all duration-300 relative group ${
                  isActive("/dashboard") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Dashboard
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                  isActive("/dashboard") ? "w-full" : "w-0 group-hover:w-full"
                }`} />
              </Link>
              <Link
                to="/problems"
                className={`text-sm font-medium transition-all duration-300 relative group ${
                  isActive("/problems") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Problems
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                  isActive("/problems") ? "w-full" : "w-0 group-hover:w-full"
                }`} />
              </Link>
              <Link
                to="/profile"
                className={`text-sm font-medium transition-all duration-300 relative group ${
                  isActive("/profile") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Profile
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                  isActive("/profile") ? "w-full" : "w-0 group-hover:w-full"
                }`} />
              </Link>
            </div>

            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-primary/50 transition-all">
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                      {username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="flex items-center gap-2 cursor-default focus:bg-transparent">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{username}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 relative group">
                Features
                <span className="absolute -bottom-1 left-0 h-0.5 bg-primary w-0 group-hover:w-full transition-all duration-300" />
              </a>
              <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 relative group">
                About
                <span className="absolute -bottom-1 left-0 h-0.5 bg-primary w-0 group-hover:w-full transition-all duration-300" />
              </a>
              <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 relative group">
                Pricing
                <span className="absolute -bottom-1 left-0 h-0.5 bg-primary w-0 group-hover:w-full transition-all duration-300" />
              </a>
            </div>

            <ThemeToggle />

            <Link to="/auth">
              <Button 
                variant="hero" 
                size="sm"
                className="hover:scale-110 active:scale-95 transition-transform duration-200 ease-out shadow-lg shadow-primary/20"
              >
                Get Started
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

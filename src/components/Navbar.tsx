import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Code2, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface NavbarProps {
  isAuthenticated?: boolean;
  username?: string;
}

const Navbar = ({ isAuthenticated = false, username = "User" }: NavbarProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 glass-effect">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold hover:opacity-80 transition-opacity">
          <Code2 className="h-6 w-6 text-violet-600" />
          <span className="text-white">CodeMentor AI</span>
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-violet-600 ${
                  isActive("/dashboard") ? "text-violet-600" : "text-muted-foreground"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/problems"
                className={`text-sm font-medium transition-colors hover:text-violet-600 ${
                  isActive("/problems") ? "text-violet-600" : "text-muted-foreground"
                }`}
              >
                Problems
              </Link>
              <Link
                to="/profile"
                className={`text-sm font-medium transition-colors hover:text-violet-600 ${
                  isActive("/profile") ? "text-violet-600" : "text-muted-foreground"
                }`}
              >
                Profile
              </Link>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarFallback className="bg-violet-600 text-white">
                      {username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{username}</span>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/" className="flex items-center gap-2 cursor-pointer">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-violet-600 transition-colors">
                Features
              </a>
              <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-violet-600 transition-colors">
                About
              </a>
              <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-violet-600 transition-colors">
                Pricing
              </a>
            </div>
            <Link to="/auth">
              <Button 
                variant="hero" 
                size="sm"
                className="hover:scale-110 active:scale-95 transition-transform duration-200 ease-out"
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

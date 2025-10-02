import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-6 animate-fade-in">
        <h1 className="text-9xl font-bold text-gradient">404</h1>
        <h2 className="text-3xl font-bold">Oops! Page not found</h2>
        <p className="text-xl text-muted-foreground max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="hero" size="lg">
            <Home className="mr-2 h-5 w-5" />
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

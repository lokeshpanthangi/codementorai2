import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2 } from "lucide-react";
import { toast } from "sonner";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(isLogin ? "Login successful!" : "Account created successfully!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>

      <Card className="relative w-full max-w-md glass-effect shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <Link to="/" className="flex items-center gap-2">
              <Code2 className="h-8 w-8 text-primary animate-draw-code" />
              <span className="text-2xl font-bold text-gradient">CodeMentor AI</span>
            </Link>
          </div>
          <div className="flex gap-2 p-1 bg-muted/50 rounded-lg transition-all duration-300">
            <Button
              type="button"
              variant={isLogin ? "default" : "ghost"}
              className="flex-1 transition-all duration-300"
              onClick={() => setIsLogin(true)}
            >
              Login
            </Button>
            <Button
              type="button"
              variant={!isLogin ? "default" : "ghost"}
              className="flex-1 transition-all duration-300"
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </Button>
          </div>
          <CardTitle className="text-2xl">
            {isLogin ? "Welcome back" : "Create your account"}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? "Enter your credentials to access your account"
              : "Start your coding journey today"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  required
                  className="bg-background/50"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                required
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                className="bg-background/50"
              />
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="bg-background/50"
                />
              </div>
            )}

            {isLogin ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <a href="#" className="text-sm text-primary hover:underline">
                  Forgot Password?
                </a>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="text-sm cursor-pointer">
                  I agree to Terms & Conditions
                </Label>
              </div>
            )}

            <Button type="submit" variant="hero" className="w-full" size="lg">
              {isLogin ? "Login" : "Sign Up"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline font-medium"
              >
                {isLogin ? "Sign up" : "Login"}
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;

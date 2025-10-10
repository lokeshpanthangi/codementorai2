import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  Settings,
  Maximize2,
  Undo2,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Lightbulb,
  MessageCircle,
  Mic,
  MicOff,
  X,
  Send,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { submitCode, runTestCases, checkJudge0Status, STATUS_DESCRIPTIONS } from "@/services/judge0Service";
import { getProblemBySlug, Problem as ProblemType } from "@/services/problemsService";
import { getPublicTestCases, getHiddenTestCases, TestCase } from "@/services/testCasesService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import MonacoEditor from "@/components/MonacoEditor";

const Problem = () => {
  const { id: slugParam } = useParams();
  const navigate = useNavigate();
  
  // Problem data state
  const [problem, setProblem] = useState<ProblemType | null>(null);
  const [isLoadingProblem, setIsLoadingProblem] = useState(true);
  const [problemError, setProblemError] = useState<string | null>(null);
  
  // Test cases state
  const [visibleTestCases, setVisibleTestCases] = useState<TestCase[]>([]);
  const [hiddenTestCases, setHiddenTestCases] = useState<TestCase[]>([]);
  const [isLoadingTestCases, setIsLoadingTestCases] = useState(false);
  
  const [showResults, setShowResults] = useState(false);
  const [language, setLanguage] = useState("python");
  const [selectedTestCase, setSelectedTestCase] = useState<number | null>(null);
  const [isBottomPanelCollapsed, setIsBottomPanelCollapsed] = useState(true); // Collapsed by default
  const [isAiInsightsPanelVisible, setIsAiInsightsPanelVisible] = useState(false); // Hidden by default
  const [aiInsights, setAiInsights] = useState<{ text: string; timestamp: Date }[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Execution states
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isJudge0Available, setIsJudge0Available] = useState(true);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("description");
  
  // Chat and Voice mode states
  const [aiMode, setAiMode] = useState<'insights' | 'chat' | 'voice'>('insights');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; message: string; timestamp: Date }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const editorRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const [code, setCode] = useState(``);

  // Language templates for different languages (only Python, Java, C++)
  const getDefaultTemplate = (lang: string): string => {
    const templates: Record<string, string> = {
      python: `# Write your solution here
def solution():
    pass`,
      java: `// Write your solution here
class Solution {
    public void solution() {
        
    }
}`,
      cpp: `// Write your solution here
#include <iostream>
using namespace std;

class Solution {
public:
    void solution() {
        
    }
};`,
    };
    return templates[lang] || templates.python;
  };

  // Fetch problem data on mount
  useEffect(() => {
    const fetchProblem = async () => {
      if (!slugParam) {
        setProblemError("No problem specified");
        setIsLoadingProblem(false);
        return;
      }

      try {
        setIsLoadingProblem(true);
        setProblemError(null);
        const data = await getProblemBySlug(slugParam);
        setProblem(data);
        
        // Set initial code from boilerplate (default to python)
        const initialLang = 'python';
        if (data.boilerplates && data.boilerplates[initialLang]) {
          setCode(data.boilerplates[initialLang]);
        } else {
          setCode(getDefaultTemplate(initialLang));
        }
      } catch (error: any) {
        console.error('Failed to fetch problem:', error);
        setProblemError(error.response?.data?.detail || 'Failed to load problem');
        toast.error('Failed to load problem', {
          description: error.response?.data?.detail || 'Please try again'
        });
      } finally {
        setIsLoadingProblem(false);
      }
    };

    fetchProblem();
  }, [slugParam]);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    
    // Use boilerplate from problem data if available, otherwise use default template
    if (problem?.boilerplates && problem.boilerplates[newLanguage]) {
      setCode(problem.boilerplates[newLanguage]);
    } else {
      setCode(getDefaultTemplate(newLanguage));
    }
    
    setAiInsights([]); // Clear insights when changing language
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    
    // Only analyze if in insights mode
    if (aiMode !== 'insights') return;
    
    setIsAnalyzing(true);
    
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set new timer for 2 seconds
    debounceTimerRef.current = setTimeout(() => {
      generateAiInsights(newCode);
      setIsAnalyzing(false);
    }, 2000);
  };

  const generateAiInsights = (currentCode: string) => {
    const insights: string[] = [];
    
    // Check for empty solution
    if (currentCode.includes("# Write your solution here") || currentCode.includes("// Write your solution here")) {
      insights.push("💡 Start by understanding the problem constraints and edge cases.");
      insights.push("🎯 Consider the data structure: How will you traverse the linked lists?");
    } else {
      // Check for common patterns
      if (currentCode.includes("while") || currentCode.includes("for")) {
        insights.push("✅ Good! You're using iteration to traverse the data structure.");
      }
      
      if (currentCode.includes("carry")) {
        insights.push("✅ Great! You're handling the carry for addition.");
      } else if (currentCode.length > 100) {
        insights.push("💭 Tip: Don't forget to handle carry when sum exceeds 9.");
      }
      
      if (currentCode.includes("dummy") || currentCode.includes("Dummy")) {
        insights.push("✅ Excellent! Using a dummy node simplifies list construction.");
      }
      
      if (currentCode.includes("return") && !currentCode.includes("pass")) {
        insights.push("✅ You have a return statement. Make sure it returns the correct node.");
      }
      
      // Code complexity hints
      const lineCount = currentCode.split("\n").length;
      if (lineCount > 30) {
        insights.push("💡 Your solution is getting long. Consider if there's a simpler approach.");
      } else if (lineCount > 10 && lineCount < 30) {
        insights.push("✨ Your solution looks well-structured!");
      }
      
      // Language-specific tips
      if (language === "python" && currentCode.includes("def")) {
        if (!currentCode.includes("self")) {
          insights.push("⚠️ Make sure you're using 'self' correctly in your method.");
        }
      }
    }
    
    if (insights.length === 0) {
      insights.push("👀 Keep writing code to get more insights...");
    }
    
    // Append new insights to existing ones with timestamps
    const newInsights = insights.map(text => ({ 
      text, 
      timestamp: new Date() 
    }));
    
    setAiInsights(prev => [...newInsights, ...prev]); // New insights at the top
  };

  // Chat functionality
  const handleChatMode = () => {
    setAiMode('chat');
    setIsAiInsightsPanelVisible(true);
    if (chatMessages.length === 0) {
      setChatMessages([{
        role: 'assistant',
        message: '👋 Hi! I\'m here to help you solve this problem. Ask me anything about the code, algorithm, or approach!',
        timestamp: new Date()
      }]);
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    const userMessage = {
      role: 'user' as const,
      message: chatInput,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's a great question! For this problem, you'll need to consider how to handle the carry value when adding two digits.",
        "Let me help you with that. Try using a while loop to iterate through both linked lists simultaneously.",
        "Good thinking! Don't forget to handle the edge case where one list is longer than the other.",
        "Here's a tip: Using a dummy node at the beginning can simplify your list construction.",
        "To optimize your solution, think about the time complexity. Can you solve it in O(max(m,n)) time?"
      ];
      
      const assistantMessage = {
        role: 'assistant' as const,
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, assistantMessage]);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 1000);
  };

  const handleVoiceMode = () => {
    setAiMode('voice');
    setIsAiInsightsPanelVisible(true);
    setIsVoiceActive(true);
    setVoiceTranscript('Listening...');
    
    // Simulate voice recognition
    setTimeout(() => {
      setVoiceTranscript('You said: "How do I handle the carry in addition?"');
      setTimeout(() => {
        setVoiceTranscript('AI: To handle the carry, create a variable to store it and add it to the next pair of digits. Update the carry for each iteration.');
      }, 2000);
    }, 2000);
  };

  const handleStopVoice = () => {
    setIsVoiceActive(false);
    setVoiceTranscript('');
    setAiMode('insights');
  };

  const handleBackToInsights = () => {
    setAiMode('insights');
  };

  // Settings dialog handler
  const handleSettings = () => {
    toast.info("Settings", {
      description: "Editor settings will open here"
    });
  };

  // Fullscreen handler
  const handleFullscreen = () => {
    if (editorRef.current) {
      const editorElement = document.querySelector('.monaco-editor');
      if (editorElement) {
        if (!document.fullscreenElement) {
          editorElement.requestFullscreen().catch(err => {
            toast.error("Fullscreen not supported");
          });
          toast.success("Entered fullscreen mode");
        } else {
          document.exitFullscreen();
          toast.success("Exited fullscreen mode");
        }
      }
    }
  };

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (aiMode === 'chat' && chatMessages.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, aiMode]);

  // Check Judge0 availability on mount - DISABLED to prevent unwanted requests
  // You can manually check when user clicks Run or Submit button
  // useEffect(() => {
  //   const checkCompiler = async () => {
  //     const available = await checkJudge0Status();
  //     setIsJudge0Available(available);
  //     if (!available) {
  //       toast.error("Compiler not available", {
  //         description: "Run 'docker-compose up -d' to start Judge0"
  //       });
  //     }
  //   };
  //   checkCompiler();
  // }, []);

  // Fetch test cases when problem is loaded
  useEffect(() => {
    const fetchTestCases = async () => {
      if (!problem?.id) return;

      try {
        setIsLoadingTestCases(true);
        const [publicCases, hidden] = await Promise.all([
          getPublicTestCases(problem.id),
          getHiddenTestCases(problem.id)
        ]);
        setVisibleTestCases(publicCases);
        setHiddenTestCases(hidden);
      } catch (error: any) {
        console.error('Failed to fetch test cases:', error);
        toast.error('Failed to load test cases', {
          description: 'Using default test cases'
        });
        // Set empty arrays if fetch fails
        setVisibleTestCases([]);
        setHiddenTestCases([]);
      } finally {
        setIsLoadingTestCases(false);
      }
    };

    fetchTestCases();
  }, [problem?.id]);

  const ensureJudge0Online = async () => {
    const available = await checkJudge0Status();
    setIsJudge0Available(available);

    if (!available) {
      toast.error("Judge0 service unavailable", {
        description: "Verify your Judge0 URL/API key or try again later"
      });
    }

    return available;
  };

  const handleRun = async () => {
    if (!(await ensureJudge0Online())) {
      return;
    }

    if (visibleTestCases.length === 0) {
      toast.error("No test cases available", {
        description: "This problem doesn't have any visible test cases yet"
      });
      return;
    }

    setIsRunning(true);
    setShowResults(true);
    setIsBottomPanelCollapsed(false);
    setSelectedTestCase(1); // Auto-select first test case

    try {
      // Convert TestCase[] to the format expected by runTestCases
      const testCasesForExecution = visibleTestCases.map(tc => ({
        input: tc.input,
        expectedOutput: tc.expected_output
      }));
      
      // Run code with all visible test cases
      const results = await runTestCases(code, language, testCasesForExecution);
      setTestResults(results);

      const passedCount = results.filter(r => r.passed).length;
      const totalCount = results.length;

      if (passedCount === totalCount) {
        toast.success("All visible test cases passed! ✓", {
          description: `${passedCount}/${totalCount} test cases passed`
        });
      } else {
        toast.error(`${passedCount}/${totalCount} test cases passed`, {
          description: "Check the failed test cases"
        });
      }
    } catch (error: any) {
      toast.error("Execution failed", {
        description: error.message
      });
      setTestResults([]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!(await ensureJudge0Online())) {
      return;
    }

    const allTestCases = [...visibleTestCases, ...hiddenTestCases];
    if (allTestCases.length === 0) {
      toast.error("No test cases available", {
        description: "This problem doesn't have any test cases yet"
      });
      return;
    }

    setIsSubmitting(true);
    setShowResults(true);
    setIsBottomPanelCollapsed(false);

    try {
      const testCasesForExecution = allTestCases.map(tc => ({
        input: tc.input,
        expectedOutput: tc.expected_output
      }));

      const results = await runTestCases(code, language, testCasesForExecution);

      const enrichedResults = results.map((result, index) => ({
        ...result,
        isHidden: allTestCases[index]?.is_hidden ?? false,
        input: allTestCases[index]?.input ?? '',
        expectedOutput: allTestCases[index]?.expected_output ?? ''
      }));

      // Update bottom panel with latest visible case results
      setTestResults(enrichedResults.slice(0, visibleTestCases.length));

      const passedCount = enrichedResults.filter(r => r.passed).length;
      const totalCount = enrichedResults.length;

      const avgTime = enrichedResults.reduce((sum, r) => sum + (parseFloat(r.time) || 0), 0) / enrichedResults.length;
      const avgMemory = enrichedResults.reduce((sum, r) => sum + (r.memory || 0), 0) / enrichedResults.length;

      setSubmissionResult({
        passedCount,
        totalCount,
        results: enrichedResults,
        avgTime: avgTime.toFixed(4),
        avgMemory: (avgMemory / 1024).toFixed(2),
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        timestamp: new Date(),
        status: passedCount === totalCount ? "Accepted" : "Wrong Answer"
      });

      setActiveTab("result");

      if (passedCount === totalCount) {
        toast.success("Accepted! All test cases passed! 🎉", {
          description: `${passedCount}/${totalCount} test cases passed`
        });
      } else {
        toast.error(`Wrong Answer`, {
          description: `${passedCount}/${totalCount} test cases passed`
        });
      }
    } catch (error: any) {
      toast.error("Submission failed", {
        description: error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (isLoadingProblem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Loading problem...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (problemError || !problem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <div className="h-20 w-20 rounded-full bg-red-500/10 flex items-center justify-center">
            <X className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold">Problem Not Found</h2>
          <p className="text-muted-foreground">
            {problemError || "The problem you're looking for doesn't exist."}
          </p>
          <Button onClick={() => navigate('/problems')} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Problems
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Minimal Header */}
      <header className="sticky top-0 z-50 h-[60px] bg-[#1a1a1a] border-b border-border/50 flex items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xl font-bold">CodeMentor AI</span>
        </Link>

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/problems">Problems</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{problem.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Link to="/problems">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Problems
          </Button>
        </Link>
      </header>

      <div className="flex-1 overflow-hidden" style={{ height: "calc(100vh - 60px)" }}>
        {/* Horizontal Resizable Panels */}
        <ResizablePanelGroup direction="horizontal">
          {/* Left Panel - Problem Description */}
          <ResizablePanel defaultSize={40} minSize={25} maxSize={60}>
            <div className="h-full flex flex-col">
              {/* Fixed Tabs */}
              <div className="border-b border-border/50 px-4 py-2">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full justify-start bg-muted/50">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="solutions">Solutions</TabsTrigger>
                    <TabsTrigger value="submissions">Submissions</TabsTrigger>
                    {submissionResult && (
                      <TabsTrigger value="result" className="text-primary">
                        Result {submissionResult.status === "Accepted" ? "✓" : "✗"}
                      </TabsTrigger>
                    )}
                  </TabsList>

              {/* Scrollable Content */}
              <TabsContent value="description" className="mt-0">
                <div className="custom-scrollbar" style={{ height: "calc(100vh - 122px)", overflowY: "auto" }}>
                  <div className="p-4 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-4">{problem.title}</h1>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className={
                      problem.difficulty === 'Easy' 
                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                        : problem.difficulty === 'Medium'
                        ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                        : "bg-red-500/10 text-red-500 border-red-500/20"
                    }>
                      {problem.difficulty}
                    </Badge>
                    {problem.topics.map((topic, idx) => (
                      <Badge key={idx} variant="outline">{topic}</Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {problem.companies.map((company, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {company}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div 
                    className="text-foreground leading-relaxed prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: problem.description.replace(/\n/g, '<br/>') }}
                  />
                </div>

                {problem.examples && problem.examples.length > 0 && (
                  <div className="space-y-4">
                    {problem.examples.map((example, idx) => (
                      <div key={idx}>
                        <h3 className="text-xl font-bold">Example {idx + 1}:</h3>
                        <div className="p-4 rounded-lg bg-muted/30 border border-border/50 space-y-2">
                          <p className="text-sm">
                            <strong>Input:</strong> {example.input}
                          </p>
                          <p className="text-sm">
                            <strong>Output:</strong> {example.output}
                          </p>
                          {example.explanation && (
                            <p className="text-sm text-muted-foreground">
                              <strong>Explanation:</strong> {example.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Input Format:</h3>
                  <p className="text-muted-foreground">{problem.input_format}</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Output Format:</h3>
                  <p className="text-muted-foreground">{problem.output_format}</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Constraints:</h3>
                  <div 
                    className="text-muted-foreground prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: problem.constraints.replace(/\n/g, '<br/>') }}
                  />
                </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="solutions" className="mt-0">
                <div className="custom-scrollbar p-4" style={{ height: "calc(100vh - 122px)", overflowY: "auto" }}>
                  <p className="text-muted-foreground">
                    Solutions will be available after you solve the problem.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="submissions" className="mt-0">
                <div className="custom-scrollbar p-4" style={{ height: "calc(100vh - 122px)", overflowY: "auto" }}>
                  <p className="text-muted-foreground">No submissions yet.</p>
                </div>
              </TabsContent>

              <TabsContent value="result" className="mt-0">
                <div className="custom-scrollbar p-4" style={{ height: "calc(100vh - 122px)", overflowY: "auto" }}>
                  {submissionResult ? (
                    <div className="space-y-6">
                      {/* Status Header */}
                      <div className="text-center pb-4 border-b border-border/50">
                        <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg text-lg font-bold ${
                          submissionResult.status === "Accepted" 
                            ? "bg-green-500/10 text-green-500 border-2 border-green-500/20"
                            : "bg-red-500/10 text-red-500 border-2 border-red-500/20"
                        }`}>
                          {submissionResult.status === "Accepted" ? "✓" : "✗"} {submissionResult.status}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {submissionResult.timestamp.toLocaleString()}
                        </p>
                      </div>

                      {/* Test Results Summary */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Test Results</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <Card className="bg-card/50">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm text-muted-foreground">Passed</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-2xl font-bold text-green-500">{submissionResult.passedCount}</p>
                            </CardContent>
                          </Card>
                          <Card className="bg-card/50">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm text-muted-foreground">Failed</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-2xl font-bold text-red-500">{submissionResult.totalCount - submissionResult.passedCount}</p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Complexity Analysis */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Complexity Analysis</h3>
                        <div className="space-y-3">
                          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Time Complexity</span>
                              <code className="text-base font-mono font-semibold text-primary">{submissionResult.timeComplexity}</code>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              Your solution runs in linear time relative to input size
                            </p>
                          </div>
                          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Space Complexity</span>
                              <code className="text-base font-mono font-semibold text-primary">{submissionResult.spaceComplexity}</code>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              Your solution uses constant extra space
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* First Failed Test Case (if any) */}
                      {submissionResult.passedCount < submissionResult.totalCount && (() => {
                        const firstFailedTest = submissionResult.results.find((r: any) => !r.passed);
                        if (!firstFailedTest) return null;

                        return (
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Why It Failed</h3>
                            <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20 space-y-4">
                              <div className="flex items-center gap-2">
                                <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                                  Test Case {firstFailedTest.testCase}
                                </Badge>
                                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                                  {firstFailedTest.isHidden ? "Hidden" : "Public"}
                                </span>
                                <span className="text-sm text-red-400">Failed</span>
                              </div>

                              {/* Expected Output */}
                              {!firstFailedTest.isHidden ? (
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground mb-1">Expected Output:</p>
                                  <pre className="text-xs bg-background/50 p-3 rounded border border-border/50">
                                    {firstFailedTest.expectedOutput || "N/A"}
                                  </pre>
                                </div>
                              ) : (
                                <div className="p-3 rounded border border-border/50 bg-background/40 text-xs text-muted-foreground">
                                  Expected output is hidden for this test case.
                                </div>
                              )}

                              {/* Your Output */}
                              <div>
                                <p className="text-sm font-medium text-red-400 mb-1">Your Output:</p>
                                {firstFailedTest.stdout ? (
                                  <pre className="text-xs bg-red-500/10 p-3 rounded border border-red-500/20 text-red-400">
                                    {firstFailedTest.stdout.trim()}
                                  </pre>
                                ) : (
                                  <pre className="text-xs bg-red-500/10 p-3 rounded border border-red-500/20 text-red-400">
                                    No output produced
                                  </pre>
                                )}
                              </div>

                              {/* Error Details */}
                              {firstFailedTest.stderr && (
                                <div>
                                  <p className="text-sm font-medium text-red-400 mb-1">Error Message:</p>
                                  <pre className="text-xs bg-background/50 p-3 rounded text-red-400 overflow-x-auto border border-red-500/20">
                                    {firstFailedTest.stderr}
                                  </pre>
                                </div>
                              )}

                              {firstFailedTest.compile_output && (
                                <div>
                                  <p className="text-sm font-medium text-red-400 mb-1">Compilation Error:</p>
                                  <pre className="text-xs bg-background/50 p-3 rounded text-red-400 overflow-x-auto border border-red-500/20">
                                    {firstFailedTest.compile_output}
                                  </pre>
                                </div>
                              )}

                              <div className="flex gap-6 text-xs text-muted-foreground pt-2 border-t border-border/50">
                                {firstFailedTest.time && (
                                  <div>
                                    <span>Runtime: </span>
                                    <span className="font-medium">{firstFailedTest.time}s</span>
                                  </div>
                                )}
                                {firstFailedTest.memory && (
                                  <div>
                                    <span>Memory: </span>
                                    <span className="font-medium">{(firstFailedTest.memory / 1024).toFixed(2)}MB</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                      <CheckCircle2 className="h-16 w-16 text-muted-foreground/50 mb-4" />
                      <p className="text-lg font-medium text-muted-foreground">No Submission Yet</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Click the Submit button to see your results here
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </ResizablePanel>

      {/* Horizontal Resize Handle */}
      <ResizableHandle withHandle className="hover:bg-primary/20 transition-colors" />

      {/* Right Panel - Code Editor & Tests & AI Insights */}
      <ResizablePanel defaultSize={60} minSize={40}>
        <ResizablePanelGroup direction="horizontal">
          {/* Code Editor & Tests Section */}
          <ResizablePanel defaultSize={75} minSize={50}>
        <div className="h-full flex flex-col">
          <ResizablePanelGroup direction="vertical">
            {/* Code Editor Panel */}
            <ResizablePanel defaultSize={60} minSize={30}>
              <div className="flex flex-col h-full">
                {/* Top Bar */}
                <div className="border-b border-border/50 px-4 py-2 flex items-center justify-between bg-card/30">
                  <div className="flex items-center gap-4">
                    <Select value={language} onValueChange={handleLanguageChange}>
                      <SelectTrigger className="w-[180px] bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border z-50 max-h-[300px]">
                        <SelectItem value="python">🐍 Python 3</SelectItem>
                        <SelectItem value="java">☕ Java</SelectItem>
                        <SelectItem value="cpp">⚙️ C++</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setIsAiInsightsPanelVisible(!isAiInsightsPanelVisible)}
                      className="text-primary"
                    >
                      <Sparkles className="h-4 w-4 mr-1" />
                      {isAiInsightsPanelVisible ? "Hide" : "Show"} AI Insights
                    </Button>
                    <Separator orientation="vertical" className="h-4" />
                    <Button variant="ghost" size="sm" onClick={handleSettings}>
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleFullscreen}>
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        if (problem?.boilerplates && problem.boilerplates[language]) {
                          setCode(problem.boilerplates[language]);
                        } else {
                          setCode(getDefaultTemplate(language));
                        }
                      }}
                    >
                      <Undo2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Monaco Editor */}
                <div className="flex-1 overflow-hidden">
                  <MonacoEditor
                    value={code}
                    onChange={handleCodeChange}
                    language={language}
                    theme="codementor-dark"
                  />
                </div>
              </div>
            </ResizablePanel>

            {/* Resize Handle - Hide when collapsed */}
            {!isBottomPanelCollapsed && (
              <ResizableHandle withHandle className="hover:bg-primary/20 transition-colors" />
            )}

            {/* Test Cases Panel - Collapsible */}
            {isBottomPanelCollapsed ? (
              // Collapsed state - Only show Run button
              <div className="h-12 bg-card/30 border-t border-border/50 flex items-center justify-between px-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Test Panel Collapsed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleRun}>
                    <Play className="h-4 w-4 mr-2" />
                    Run
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsBottomPanelCollapsed(false)}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <ResizablePanel defaultSize={40} minSize={20}>
                <div className="flex flex-col h-full bg-card/30">
                  <Tabs defaultValue="testcase" className="flex flex-col h-full">
                    <div className="flex items-center justify-between px-4 py-2 shrink-0">
                      <TabsList className="bg-transparent">
                        <TabsTrigger value="testcase">Testcase</TabsTrigger>
                      </TabsList>
                      
                      {/* Run and Submit buttons with collapse button */}
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleRun}
                          disabled={isRunning || isSubmitting}
                        >
                          {isRunning ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Running...
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Run
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="success" 
                          size="sm" 
                          onClick={handleSubmit}
                          disabled={isRunning || isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Submit
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setIsBottomPanelCollapsed(true)}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                  <TabsContent value="testcase" className="flex-1 p-3 custom-scrollbar overflow-y-auto m-0">
                    <div className="space-y-4">
                      {/* Loading state */}
                      {isLoadingTestCases && (
                        <div className="flex items-center justify-center h-32">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          <span className="ml-2 text-muted-foreground">Loading test cases...</span>
                        </div>
                      )}

                      {/* No test cases available */}
                      {!isLoadingTestCases && visibleTestCases.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-32 text-center">
                          <p className="text-muted-foreground text-sm">No visible test cases available</p>
                          <p className="text-xs text-muted-foreground mt-1">Test cases will appear here once added</p>
                        </div>
                      )}

                      {/* Test cases available */}
                      {!isLoadingTestCases && visibleTestCases.length > 0 && (
                        <>
                          <div className="flex gap-2 flex-wrap">
                            {visibleTestCases.map((_, index) => {
                              const caseNum = index + 1;
                              const result = testResults.find(r => r.testCase === caseNum);
                              const isPassed = result?.passed;
                              const hasFailed = result && !result.passed;
                              
                              return (
                                <Button 
                                  key={caseNum}
                                  variant="outline" 
                                  size="sm" 
                                  className={`relative ${selectedTestCase === caseNum ? "bg-primary/10 border-primary/30" : ""}`}
                                  onClick={() => setSelectedTestCase(selectedTestCase === caseNum ? null : caseNum)}
                                >
                                  Case {caseNum}
                                  {isPassed && (
                                    <span className="ml-2 text-green-500">✓</span>
                                  )}
                                  {hasFailed && (
                                    <span className="ml-2 text-red-500">✗</span>
                                  )}
                                </Button>
                              );
                            })}
                          </div>
                          
                          {/* Show test case details only when selected */}
                          {selectedTestCase === null ? (
                            <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                              Click on a test case to view details
                            </div>
                          ) : selectedTestCase > visibleTestCases.length ? (
                            <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                              Test case not found
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {/* Input */}
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-2">Input:</p>
                                <code className="block p-2 rounded bg-muted/50 text-sm whitespace-pre-wrap">
                                  {visibleTestCases[selectedTestCase - 1]?.input || "N/A"}
                                </code>
                              </div>

                              {/* Expected Output */}
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Expected Output:</p>
                                <code className="block p-2 rounded bg-muted/50 text-sm whitespace-pre-wrap">
                                  {visibleTestCases[selectedTestCase - 1]?.expected_output || "N/A"}
                                </code>
                              </div>

                          {/* Actual Output (if test has been run) */}
                          {testResults.length > 0 && testResults.find(r => r.testCase === selectedTestCase) && (
                            <>
                              <Separator />
                              {(() => {
                                const result = testResults.find(r => r.testCase === selectedTestCase);
                                if (!result) return null;

                                return (
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                      <Badge 
                                        className={
                                          result.passed
                                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                                            : "bg-red-500/10 text-red-500 border-red-500/20"
                                        }
                                      >
                                        {result.passed ? "Passed ✓" : "Failed ✗"}
                                      </Badge>
                                    </div>

                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground mb-1">Your Output:</p>
                                      {result.stdout ? (
                                        <code className={`block p-2 rounded text-sm ${
                                          result.passed ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"
                                        }`}>
                                          {result.stdout.trim()}
                                        </code>
                                      ) : (
                                        <code className="block p-2 rounded bg-muted/50 text-sm text-muted-foreground">
                                          No output
                                        </code>
                                      )}
                                    </div>

                                    {result.stderr && (
                                      <div>
                                        <p className="text-sm font-medium text-red-500 mb-1">Error:</p>
                                        <pre className="text-xs bg-red-500/10 p-2 rounded text-red-400 overflow-x-auto">
                                          {result.stderr}
                                        </pre>
                                      </div>
                                    )}

                                    {result.compile_output && (
                                      <div>
                                        <p className="text-sm font-medium text-red-500 mb-1">Compilation Error:</p>
                                        <pre className="text-xs bg-red-500/10 p-2 rounded text-red-400 overflow-x-auto">
                                          {result.compile_output}
                                        </pre>
                                      </div>
                                    )}

                                    <div className="flex gap-6 text-xs text-muted-foreground">
                                      {result.time && (
                                        <div>
                                          <span>Runtime: </span>
                                          <span className="font-medium">{result.time}s</span>
                                        </div>
                                      )}
                                      {result.memory && (
                                        <div>
                                          <span>Memory: </span>
                                          <span className="font-medium">{(result.memory / 1024).toFixed(2)}MB</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })()}
                            </>
                          )}
                        </div>
                      )}
                    </>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="result" className="flex-1 p-3 custom-scrollbar overflow-y-auto m-0">
                    <p className="text-muted-foreground text-sm">
                      Run your code to see test results in the Testcase tab
                    </p>
                  </TabsContent>
                </Tabs>
              </div>
            </ResizablePanel>
            )}
          </ResizablePanelGroup>
        </div>
      </ResizablePanel>

      {/* Conditional ResizableHandle and AI Insights Panel */}
      {isAiInsightsPanelVisible && (
        <>
          {/* ResizableHandle between Code Editor and AI Insights */}
          <ResizableHandle withHandle />

          {/* Right Panel - AI Insights Sidebar */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
            <div className="h-full w-full flex flex-col bg-background border-l border-border" style={{ height: "calc(100vh - 60px)", maxHeight: "calc(100vh - 60px)" }}>
              {/* Header with Mode Icons */}
              <div className="flex items-center justify-between p-3 border-b border-border shrink-0">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm">
                    {aiMode === 'chat' ? 'AI Chat' : aiMode === 'voice' ? 'Voice Assistant' : 'AI Insights'}
                  </h3>
                </div>
                <div className="flex items-center gap-1">
                  {aiMode === 'insights' ? (
                    <>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleChatMode}
                        className="h-8 w-8 p-0"
                        title="Chat with AI"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleVoiceMode}
                        className="h-8 w-8 p-0"
                        title="Voice Assistant"
                      >
                        <Mic className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleBackToInsights}
                      className="h-8 w-8 p-0"
                      title="Back to Insights"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 flex flex-col overflow-hidden" style={{ height: "calc(100vh - 120px)" }}>
                {aiMode === 'insights' && (
                  <div className="h-full w-full p-3 custom-scrollbar overflow-y-auto">
                    <div className="space-y-4">
                      {isAnalyzing && (
                        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                          <Sparkles className="h-4 w-4 animate-pulse text-primary" />
                          <span>Analyzing your code...</span>
                        </div>
                      )}
                      {aiInsights.length > 0 ? (
                        <div className="space-y-3">
                          {aiInsights.map((insight, index) => (
                            <div 
                              key={index}
                              className="p-3 rounded-lg bg-primary/5 border border-primary/10"
                            >
                              <p className="text-sm">{insight.text}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {insight.timestamp.toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit',
                                  second: '2-digit'
                                })}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : !isAnalyzing ? (
                        <div className="flex flex-col items-center justify-center h-32 text-center">
                          <Lightbulb className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground text-sm">
                            Start writing code to get AI insights
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Insights will appear 2 seconds after you stop typing
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}

                {aiMode === 'chat' && (
                  <div className="h-full w-full flex flex-col">
                    {/* Chat Messages */}
                    <div className="flex-1 p-3 custom-scrollbar overflow-y-auto scroll-smooth" style={{ height: "calc(100vh - 185px)" }}>
                      <div className="space-y-3">
                        {chatMessages.map((msg, index) => (
                          <div 
                            key={index}
                            className={`p-3 rounded-lg ${
                              msg.role === 'user' 
                                ? 'bg-primary/10 border border-primary/20 ml-4' 
                                : 'bg-muted/50 border border-border mr-4'
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {msg.timestamp.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        ))}
                        <div ref={chatEndRef} />
                      </div>
                    </div>

                    {/* Chat Input */}
                    <div className="p-3 border-t border-border shrink-0">
                      <div className="flex gap-2">
                        <Input
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Ask me anything..."
                          className="flex-1"
                        />
                        <Button 
                          size="sm" 
                          onClick={handleSendMessage}
                          disabled={!chatInput.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {aiMode === 'voice' && (
                  <div className="h-full w-full p-6 flex flex-col items-center justify-center overflow-y-auto custom-scrollbar">
                    <div className="text-center space-y-4">
                      <div className={`h-20 w-20 rounded-full flex items-center justify-center mx-auto ${
                        isVoiceActive ? 'bg-primary/20 animate-pulse' : 'bg-muted'
                      }`}>
                        {isVoiceActive ? (
                          <Mic className="h-10 w-10 text-primary" />
                        ) : (
                          <MicOff className="h-10 w-10 text-muted-foreground" />
                        )}
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-2">
                          {isVoiceActive ? 'Voice Assistant Active' : 'Voice Assistant Stopped'}
                        </p>
                        {voiceTranscript && (
                          <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg max-h-40 overflow-y-auto custom-scrollbar">
                            {voiceTranscript}
                          </p>
                        )}
                      </div>

                      {isVoiceActive ? (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={handleStopVoice}
                          className="mt-4"
                        >
                          <MicOff className="h-4 w-4 mr-2" />
                          Stop Voice Assistant
                        </Button>
                      ) : (
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={handleVoiceMode}
                          className="mt-4"
                        >
                          <Mic className="h-4 w-4 mr-2" />
                          Start Voice Assistant
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Problem;

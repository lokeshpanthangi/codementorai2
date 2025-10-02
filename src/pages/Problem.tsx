import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
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

const Problem = () => {
  const { id } = useParams();
  const [showResults, setShowResults] = useState(false);
  const [hintsExpanded, setHintsExpanded] = useState(true);
  const [currentHint, setCurrentHint] = useState(0);
  const [code, setCode] = useState(`class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        # Write your solution here
        pass`);

  const hints = [
    "Think about how you would add two numbers on paper. What do you do when the sum is greater than 9?",
    "Consider using a dummy head node to simplify edge cases when creating the result linked list.",
    "Don't forget to handle the carry at the end if it's not zero.",
  ];

  const handleRun = () => {
    setShowResults(true);
    toast.success("Code executed successfully!");
  };

  const handleSubmit = () => {
    toast.success("Solution accepted! 🎉", {
      description: "Runtime: 48ms (Beats 95.4%)",
    });
  };

  const getNextHint = () => {
    if (currentHint < hints.length - 1) {
      setCurrentHint(currentHint + 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Minimal Header */}
      <header className="sticky top-0 z-50 h-[60px] bg-[#1a1a1a] border-b border-border/50 flex items-center justify-between px-6">
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
              <BreadcrumbPage>Add Two Numbers</BreadcrumbPage>
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

      <div className="flex-1 flex overflow-hidden" style={{ height: "calc(100vh - 60px)" }}>
        {/* Left Panel - Problem Description */}
        <div className="w-full lg:w-[40%] border-r border-border/50 flex flex-col">
          {/* Fixed Tabs */}
          <div className="border-b border-border/50 p-4">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start bg-muted/50">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="solutions">Solutions</TabsTrigger>
                <TabsTrigger value="submissions">Submissions</TabsTrigger>
              </TabsList>

              {/* Scrollable Content */}
              <TabsContent value="description" className="mt-0">
                <div className="custom-scrollbar" style={{ height: "calc(100vh - 160px)", overflowY: "auto" }}>
                  <div className="p-6 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-4">2. Add Two Numbers</h1>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                      Medium
                    </Badge>
                    <Badge variant="outline">Linked List</Badge>
                    <Badge variant="outline">Math</Badge>
                    <Badge variant="outline">Recursion</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Amazon
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Microsoft
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Google
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <p className="text-foreground leading-relaxed">
                    You are given two <strong>non-empty</strong> linked lists
                    representing two non-negative integers. The digits are stored in{" "}
                    <strong>reverse order</strong>, and each of their nodes contains a
                    single digit. Add the two numbers and return the sum as a linked
                    list.
                  </p>
                  <p className="text-foreground leading-relaxed">
                    You may assume the two numbers do not contain any leading zero,
                    except the number 0 itself.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Example 1:</h3>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <div className="mb-4 p-4 bg-card/50 rounded">
                      <pre className="text-sm">
                        <code>
                          l1: 2 → 4 → 3{"\n"}
                          l2: 5 → 6 → 4{"\n"}
                          {"\n"}
                          Output: 7 → 0 → 8{"\n"}
                          Explanation: 342 + 465 = 807
                        </code>
                      </pre>
                    </div>
                    <p className="text-sm">
                      <strong>Input:</strong> l1 = [2,4,3], l2 = [5,6,4]
                    </p>
                    <p className="text-sm">
                      <strong>Output:</strong> [7,0,8]
                    </p>
                  </div>

                  <h3 className="text-xl font-bold">Example 2:</h3>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <p className="text-sm">
                      <strong>Input:</strong> l1 = [0], l2 = [0]
                    </p>
                    <p className="text-sm">
                      <strong>Output:</strong> [0]
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Constraints:</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>
                      The number of nodes in each linked list is in the range [1, 100].
                    </li>
                    <li>0 ≤ Node.val ≤ 9</li>
                    <li>
                      It is guaranteed that the list represents a number that does not
                      have leading zeros.
                    </li>
                  </ul>
                </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="solutions" className="mt-0">
                <div className="custom-scrollbar p-6" style={{ height: "calc(100vh - 160px)", overflowY: "auto" }}>
                  <p className="text-muted-foreground">
                    Solutions will be available after you solve the problem.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="submissions" className="mt-0">
                <div className="custom-scrollbar p-6" style={{ height: "calc(100vh - 160px)", overflowY: "auto" }}>
                  <p className="text-muted-foreground">No submissions yet.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right Panel - Code Editor & Tests */}
        <div className="w-full lg:w-[60%] flex flex-col">
          <ResizablePanelGroup direction="vertical">
            {/* Code Editor Panel */}
            <ResizablePanel defaultSize={60} minSize={30}>
              <div className="flex flex-col h-full">
                {/* Top Bar */}
                <div className="border-b border-border/50 p-4 flex items-center justify-between bg-card/30">
                  <div className="flex items-center gap-4">
                    <Select defaultValue="python3">
                      <SelectTrigger className="w-[150px] bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border z-50">
                        <SelectItem value="python3">Python3</SelectItem>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="cpp">C++</SelectItem>
                      </SelectContent>
                    </Select>
                    <Badge variant="secondary" className="text-xs">
                      Auto
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Undo2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Code Editor - No scroll, Monaco handles internally */}
                <div className="flex-1 bg-[#1e1e1e] p-4 overflow-hidden">
                  <div className="font-mono text-sm h-full">
                    <div className="flex h-full">
                      <div className="select-none text-muted-foreground pr-4 text-right w-12">
                        {code.split("\n").map((_, i) => (
                          <div key={i}>{i + 1}</div>
                        ))}
                      </div>
                      <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="flex-1 bg-transparent text-foreground outline-none resize-none font-mono"
                        spellCheck={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </ResizablePanel>

            {/* Resize Handle */}
            <ResizableHandle withHandle className="hover:bg-primary/20 transition-colors" />

            {/* Test Cases Panel */}
            <ResizablePanel defaultSize={40} minSize={20}>
              <div className="flex flex-col h-full bg-card/30">
                <Tabs defaultValue={showResults ? "result" : "testcase"} className="flex flex-col h-full">
                  <div className="flex items-center justify-between px-4 border-b border-border/50 shrink-0">
                    <TabsList className="bg-transparent">
                      <TabsTrigger value="testcase">Testcase</TabsTrigger>
                      <TabsTrigger value="result">Test Result</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="testcase" className="flex-1 p-4 custom-scrollbar overflow-y-auto m-0">
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="bg-primary/10">
                          Case 1
                        </Button>
                        <Button variant="outline" size="sm">
                          Case 2
                        </Button>
                        <Button variant="outline" size="sm">
                          Case 3
                        </Button>
                        <Button variant="outline" size="sm">
                          + Add Testcase
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">l1 =</p>
                          <code className="block p-2 rounded bg-muted/50 text-sm">
                            [2,4,3]
                          </code>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">l2 =</p>
                          <code className="block p-2 rounded bg-muted/50 text-sm">
                            [5,6,4]
                          </code>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="result" className="flex-1 p-4 custom-scrollbar overflow-y-auto m-0">
                    {showResults ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary">
                          <CheckCircle2 className="h-5 w-5" />
                          <span className="font-semibold">All test cases passed!</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground mb-1">Input</p>
                            <code className="text-xs">[2,4,3], [5,6,4]</code>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Output</p>
                            <code className="text-xs">[7,0,8]</code>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Expected</p>
                            <code className="text-xs">[7,0,8]</code>
                          </div>
                        </div>
                        <div className="flex gap-6 text-sm">
                          <div>
                            <span className="text-muted-foreground">Runtime: </span>
                            <span className="font-medium">48ms</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Memory: </span>
                            <span className="font-medium">14.2MB</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        Run your code to see test results
                      </p>
                    )}
                  </TabsContent>
                </Tabs>

                {/* Action Bar */}
                <div className="border-t border-border/50 p-4 flex items-center justify-between bg-card/30 shrink-0">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Ln 1, Col 1</span>
                    <span>•</span>
                    <span className="text-primary">Saved</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={handleRun}>
                      <Play className="h-4 w-4 mr-2" />
                      Run Code
                    </Button>
                    <Button variant="success" onClick={handleSubmit}>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>

      {/* AI Hints Panel - Floating */}
      <div className="fixed bottom-6 right-6 w-80 z-50">
        <Card className="glass-effect shadow-2xl border-primary/20">
          <CardHeader
            className="cursor-pointer hover:bg-card/50 transition-colors"
            onClick={() => setHintsExpanded(!hintsExpanded)}
          >
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                <span>AI Hints 🤖</span>
              </div>
              {hintsExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </CardTitle>
          </CardHeader>
          {hintsExpanded && (
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Hint {currentHint + 1} of {hints.length}
                </span>
                <span className="text-primary font-medium">
                  {3 - currentHint} hints remaining
                </span>
              </div>

              {currentHint >= 0 && (
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm leading-relaxed">{hints[currentHint]}</p>
                </div>
              )}

              <div className="space-y-2">
                {currentHint < hints.length - 1 && (
                  <Button
                    variant="hero"
                    className="w-full"
                    onClick={getNextHint}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Show Next Hint
                  </Button>
                )}
                <Button variant="outline" className="w-full">
                  Explain Error
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                2 hints used today (8 remaining)
              </p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Problem;

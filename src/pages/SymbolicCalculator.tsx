import React, { useState, useEffect } from "react";
import DeepCALHeader from "@/components/DeepCALHeader";
import { Calculator, Sigma, Braces, Infinity, Divide } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { humorToast } from "@/components/HumorToast";

const SymbolicCalculator = () => {
  const [expression, setExpression] = useState<string>("(3x^2 + 2x - 5) / (x - 1)");
  const [result, setResult] = useState<string>("");
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("symbolic");
  const [history, setHistory] = useState<Array<{expression: string, result: string}>>([]);

  const calculateSymbolic = () => {
    setIsCalculating(true);
    
    // Simulate calculation delay
    setTimeout(() => {
      try {
        // This is a placeholder for actual symbolic computation
        // In a real app, you'd use a library like math.js or call an API
        let calculatedResult = "";
        
        if (expression.includes("x^2")) {
          calculatedResult = "3x + 5 + 10/(x-1)";
        } else if (expression.includes("sin")) {
          calculatedResult = "cos(x) * derivative(g(x))";
        } else if (expression.includes("lim")) {
          calculatedResult = "∞";
        } else if (expression.includes("integrate")) {
          calculatedResult = "x^2/2 + C";
        } else {
          calculatedResult = "Expression parsed. Result would appear here.";
        }
        
        setResult(calculatedResult);
        setHistory(prev => [...prev, {expression, result: calculatedResult}]);
        humorToast("Calculation Complete", "The oracle has spoken. Numbers don't lie, but they do occasionally mislead.");
      } catch (error) {
        setResult("Error: Could not evaluate expression");
        humorToast("Calculation Error", "Even the mighty DeepCAL gets confused sometimes.", 3000, "error");
      } finally {
        setIsCalculating(false);
      }
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      calculateSymbolic();
    }
  };

  const clearHistory = () => {
    setHistory([]);
    humorToast("History Cleared", "The past is gone, but the future remains uncertain.");
  };

  const examples = [
    "differentiate(x^3 + 2x^2 - 5x + 3)",
    "integrate(sin(x) * cos(x))",
    "lim x→∞ (1 + 1/x)^x",
    "solve(x^2 - 5x + 6 = 0)",
    "expand((x+2)^3)"
  ];

  const loadExample = (example: string) => {
    setExpression(example);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white">
      <DeepCALHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Sigma className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-800">Symbolic Calculator</h1>
          </div>
          
          <Tabs defaultValue="symbolic" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="symbolic" className="flex items-center gap-2">
                <Braces className="h-4 w-4" />
                <span>Symbolic Math</span>
              </TabsTrigger>
              <TabsTrigger value="numerical" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                <span>Numerical</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <Infinity className="h-4 w-4" />
                <span>History</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="symbolic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Symbolic Computation</CardTitle>
                  <CardDescription>
                    Enter a mathematical expression using variables like x, y, z
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="expression">Expression</Label>
                      <Textarea
                        id="expression"
                        placeholder="Enter mathematical expression (e.g., differentiate(x^2 + 3x))"
                        value={expression}
                        onChange={(e) => setExpression(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="font-mono"
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="result">Result</Label>
                      <div 
                        id="result"
                        className={`p-4 bg-gray-50 border rounded-md font-mono min-h-[80px] ${isCalculating ? 'animate-pulse' : ''}`}
                      >
                        {isCalculating ? (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-purple-600 border-r-transparent"></div>
                              <p className="mt-2 text-sm text-gray-500">Computing...</p>
                            </div>
                          </div>
                        ) : result ? (
                          <div className="whitespace-pre-wrap">{result}</div>
                        ) : (
                          <div className="text-gray-400 italic">Result will appear here</div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setExpression("")}>
                      Clear
                    </Button>
                  </div>
                  <Button onClick={calculateSymbolic} disabled={isCalculating || !expression.trim()}>
                    {isCalculating ? "Computing..." : "Calculate"}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Examples</CardTitle>
                  <CardDescription>
                    Click on an example to load it into the calculator
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {examples.map((example, index) => (
                      <Button 
                        key={index} 
                        variant="outline" 
                        onClick={() => loadExample(example)}
                        className="text-xs"
                      >
                        {example}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="numerical">
              <Card>
                <CardHeader>
                  <CardTitle>Numerical Calculation</CardTitle>
                  <CardDescription>
                    Perform precise numerical calculations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-40">
                    <p className="text-muted-foreground">
                      Numerical calculator coming soon...
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Calculation History</CardTitle>
                    <CardDescription>
                      Your recent calculations
                    </CardDescription>
                  </div>
                  {history.length > 0 && (
                    <Button variant="outline" size="sm" onClick={clearHistory}>
                      Clear History
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {history.length > 0 ? (
                    <div className="space-y-4">
                      {history.map((item, index) => (
                        <div key={index} className="border-b pb-3 last:border-0">
                          <div className="font-medium flex items-center gap-2">
                            <Divide className="h-4 w-4 text-purple-500" />
                            <span className="font-mono text-sm">{item.expression}</span>
                          </div>
                          <div className="pl-6 mt-1 font-mono text-sm">
                            = {item.result}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-40">
                      <p className="text-muted-foreground">No calculations yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default SymbolicCalculator;

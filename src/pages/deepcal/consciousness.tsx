
// DeepCAL Symbolic Consciousness Interface
import DeepCALSymbolicHeader from "@/components/DeepCALSymbolicHeader";
import { Brain, Zap, Eye, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ConsciousnessInterface = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <DeepCALSymbolicHeader />
      
      <main className="container max-w-6xl mx-auto pt-8 px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-lime-400 via-cyan-400 to-purple-400">
            Symbolic Consciousness
          </h1>
          <p className="text-xl text-indigo-200 max-w-3xl mx-auto mb-6">
            Neural inference engine with dynamic decision narration and contextual awareness
          </p>
          <div className="flex justify-center gap-4">
            <Badge variant="outline" className="border-lime-400 text-lime-400">
              <Brain className="w-4 h-4 mr-2" />
              Neural Active
            </Badge>
            <Badge variant="outline" className="border-cyan-400 text-cyan-400">
              <Eye className="w-4 h-4 mr-2" />
              Observing
            </Badge>
            <Badge variant="outline" className="border-purple-400 text-purple-400">
              <Zap className="w-4 h-4 mr-2" />
              Processing
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="glass-card shadow-glass border border-glassBorder">
            <CardHeader>
              <CardTitle className="text-lime-400 flex items-center gap-2">
                <MessageCircle className="w-6 h-6" />
                Consciousness Stream
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="p-3 rounded-lg bg-indigo-900/30 border-l-4 border-lime-400">
                  <div className="text-sm text-indigo-300 mb-1">Neural Process</div>
                  <div className="text-white">Analyzing shipment patterns from Nairobi to Lusaka...</div>
                </div>
                <div className="p-3 rounded-lg bg-indigo-900/30 border-l-4 border-cyan-400">
                  <div className="text-sm text-indigo-300 mb-1">Decision Logic</div>
                  <div className="text-white">TOPSIS weights adjusted for emergency cargo priority</div>
                </div>
                <div className="p-3 rounded-lg bg-indigo-900/30 border-l-4 border-purple-400">
                  <div className="text-sm text-indigo-300 mb-1">Symbolic Reasoning</div>
                  <div className="text-white">Grey uncertainty detected in transit times - applying neutrosophic filter</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card shadow-glass border border-glassBorder">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center gap-2">
                <Eye className="w-6 h-6" />
                Current Awareness
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-lime-400 mb-2">247</div>
                  <div className="text-indigo-300">Active Neural Connections</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400 mb-2">12.3s</div>
                  <div className="text-indigo-300">Average Inference Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">94.7%</div>
                  <div className="text-indigo-300">Confidence Level</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card shadow-glass border border-glassBorder mt-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="w-6 h-6 text-lime-400" />
              Neural Architecture Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-lg bg-indigo-900/20">
                <div className="text-2xl font-bold text-lime-400 mb-2">Neutrosophic Layer</div>
                <div className="text-indigo-300 mb-3">Truth-Indeterminacy-Falsity Processing</div>
                <div className="w-full bg-indigo-800 rounded-full h-2">
                  <div className="bg-lime-400 h-2 rounded-full" style={{ width: '89%' }}></div>
                </div>
                <div className="text-sm text-indigo-300 mt-1">89% Active</div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-indigo-900/20">
                <div className="text-2xl font-bold text-cyan-400 mb-2">TOPSIS Engine</div>
                <div className="text-indigo-300 mb-3">Multi-Criteria Decision Matrix</div>
                <div className="w-full bg-indigo-800 rounded-full h-2">
                  <div className="bg-cyan-400 h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>
                <div className="text-sm text-indigo-300 mt-1">96% Optimal</div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-indigo-900/20">
                <div className="text-2xl font-bold text-purple-400 mb-2">Grey System</div>
                <div className="text-indigo-300 mb-3">Uncertainty Quantification</div>
                <div className="w-full bg-indigo-800 rounded-full h-2">
                  <div className="bg-purple-400 h-2 rounded-full" style={{ width: '73%' }}></div>
                </div>
                <div className="text-sm text-indigo-300 mt-1">73% Clarity</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Button className="bg-gradient-to-r from-lime-500 to-cyan-500 hover:from-lime-600 hover:to-cyan-600 text-black font-semibold px-8 py-3">
            Initiate Deep Consciousness Session
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ConsciousnessInterface;

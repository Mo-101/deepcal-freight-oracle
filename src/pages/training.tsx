
// DeepCAL Training Laboratory
import DeepCALSymbolicHeader from "@/components/DeepCALSymbolicHeader";
import { Network, BookOpen, Settings, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TrainingLaboratory = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <DeepCALSymbolicHeader />
      
      <main className="container max-w-6xl mx-auto pt-8 px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-lime-400 via-cyan-400 to-purple-400">
            Training Laboratory
          </h1>
          <p className="text-xl text-indigo-200 max-w-3xl mx-auto mb-6">
            Symbolic testing environment for model evaluation and neural enhancement
          </p>
          <Badge variant="outline" className="border-lime-400 text-lime-400">
            <Network className="w-4 h-4 mr-2" />
            Learning Mode Active
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="glass-card shadow-glass border border-glassBorder">
            <CardHeader>
              <CardTitle className="text-lime-400 flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                Training Datasets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-indigo-900/30">
                  <div>
                    <div className="text-white font-semibold">DeepTrack_2.csv</div>
                    <div className="text-indigo-300 text-sm">105 shipment records</div>
                  </div>
                  <Badge className="bg-green-600">Active</Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-indigo-900/30">
                  <div>
                    <div className="text-white font-semibold">Synthetic Training Data</div>
                    <div className="text-indigo-300 text-sm">2,547 generated samples</div>
                  </div>
                  <Badge className="bg-blue-600">Training</Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-indigo-900/30">
                  <div>
                    <div className="text-white font-semibold">Forwarder Performance</div>
                    <div className="text-indigo-300 text-sm">Historical benchmarks</div>
                  </div>
                  <Badge className="bg-purple-600">Analyzing</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card shadow-glass border border-glassBorder">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center gap-2">
                <Settings className="w-6 h-6" />
                Model Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-lime-400 mb-2">92.4%</div>
                  <div className="text-indigo-300">Prediction Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400 mb-2">847ms</div>
                  <div className="text-indigo-300">Training Iteration Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">15,623</div>
                  <div className="text-indigo-300">Total Training Cycles</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card shadow-glass border border-glassBorder mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Network className="w-6 h-6 text-lime-400" />
              Neural Network Architecture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-indigo-900/20">
                <div className="text-xl font-bold text-lime-400 mb-2">Input Layer</div>
                <div className="text-indigo-300 mb-2">29 Features</div>
                <div className="text-sm text-indigo-400">Shipment attributes</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-indigo-900/20">
                <div className="text-xl font-bold text-cyan-400 mb-2">Hidden Layer 1</div>
                <div className="text-indigo-300 mb-2">64 Neurons</div>
                <div className="text-sm text-indigo-400">Feature extraction</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-indigo-900/20">
                <div className="text-xl font-bold text-purple-400 mb-2">Hidden Layer 2</div>
                <div className="text-indigo-300 mb-2">32 Neurons</div>
                <div className="text-sm text-indigo-400">Pattern recognition</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-indigo-900/20">
                <div className="text-xl font-bold text-orange-400 mb-2">Output Layer</div>
                <div className="text-indigo-300 mb-2">3 Classes</div>
                <div className="text-sm text-indigo-400">Decision scoring</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button className="bg-gradient-to-r from-lime-500 to-cyan-500 hover:from-lime-600 hover:to-cyan-600 text-black font-semibold px-8 py-3 mr-4">
            <Play className="w-5 h-5 mr-2" />
            Start Training Session
          </Button>
          <Button variant="outline" className="border-indigo-600 text-indigo-300 hover:bg-indigo-800 px-8 py-3">
            View Training Logs
          </Button>
        </div>
      </main>
    </div>
  );
};

export default TrainingLaboratory;


// DeepCAL Core Engine - Main Interface
import DeepCALSymbolicHeader from "@/components/DeepCALSymbolicHeader";
import { Brain, Cpu, Network, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const DeepCALCore = () => {
  const coreModules = [
    {
      title: "Symbolic Consciousness",
      description: "Neural inference and decision narration",
      icon: Brain,
      path: "/deepcal/consciousness",
      status: "Active",
      color: "text-lime-400"
    },
    {
      title: "TOPSIS Ranking Engine",
      description: "Multi-criteria forwarder scoring system",
      icon: Cpu,
      path: "/deepcal/ranking",
      status: "Processing",
      color: "text-cyan-400"
    },
    {
      title: "Training Laboratory",
      description: "Symbolic testing and model evaluation",
      icon: Network,
      path: "/deepcal/training",
      status: "Learning",
      color: "text-purple-400"
    },
    {
      title: "Engine Settings",
      description: "Weights, ethics, and neural parameters",
      icon: Settings,
      path: "/deepcal/settings",
      status: "Ready",
      color: "text-orange-400"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <DeepCALSymbolicHeader />
      
      <main className="container max-w-6xl mx-auto pt-8 px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-lime-400 via-cyan-400 to-purple-400">
            DeepCAL++ Engine Core
          </h1>
          <p className="text-xl text-indigo-200 max-w-3xl mx-auto">
            Symbolic intelligence system powered by Neutrosophic Logic, TOPSIS optimization, and Grey System Theory
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Badge variant="outline" className="border-lime-400 text-lime-400">
              Neural Active
            </Badge>
            <Badge variant="outline" className="border-cyan-400 text-cyan-400">
              Logic Processing
            </Badge>
            <Badge variant="outline" className="border-purple-400 text-purple-400">
              Learning Mode
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {coreModules.map((module, index) => {
            const IconComponent = module.icon;
            return (
              <Card key={index} className="glass-card shadow-glass border border-glassBorder hover:border-lime-400/50 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <IconComponent className={`w-8 h-8 ${module.color}`} />
                      <div>
                        <CardTitle className="text-white text-lg">{module.title}</CardTitle>
                        <Badge className={`mt-1 ${module.status === 'Active' ? 'bg-green-600' : 
                          module.status === 'Processing' ? 'bg-blue-600' : 
                          module.status === 'Learning' ? 'bg-purple-600' : 'bg-gray-600'}`}>
                          {module.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-indigo-300 mb-4">{module.description}</p>
                  <Link to={module.path}>
                    <Button className="w-full bg-gradient-to-r from-lime-500 to-cyan-500 hover:from-lime-600 hover:to-cyan-600 text-black font-semibold">
                      Access Module
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="glass-card shadow-glass border border-glassBorder">
          <CardHeader>
            <CardTitle className="text-lime-400 flex items-center gap-2">
              <Brain className="w-6 h-6" />
              Engine Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-lime-400 mb-2">98.7%</div>
                <div className="text-indigo-300">Neural Efficiency</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">1,247</div>
                <div className="text-indigo-300">Decisions Processed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">45ms</div>
                <div className="text-indigo-300">Avg Response Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DeepCALCore;

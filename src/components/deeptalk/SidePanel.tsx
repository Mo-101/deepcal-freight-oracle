import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, MapPin, Clock, DollarSign, Shield, Zap } from "lucide-react";
interface RouteOption {
  id: string;
  carrier: string;
  route: string;
  hub: string;
  destination: string;
  transitTime: number;
  cost: number;
  reliability: number;
  riskLevel: number;
  overallScore: number;
}
interface SidePanelProps {
  routeDatabase: RouteOption[];
  trainingBufferStatus: {
    count: number;
    maxSize: number;
  };
  isProcessing: boolean;
  onQuickQuery: (query: string) => void;
}
export default function SidePanel({
  routeDatabase,
  trainingBufferStatus,
  isProcessing,
  onQuickQuery
}: SidePanelProps) {
  const quickQueries = ["What's the fastest way to ship to South Sudan?", "Compare Nairobi vs Dakar routes", "How much does it cost to ship 5 tons?", "What's the risk level for Mombasa port?", "Suggest the best route for urgent medical supplies"];
  return <aside className="w-full lg:w-96 space-y-6">
      {/* Training Buffer Status */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-md overflow-hidden border border-white/20">
        <div className="bg-slate-800/50 px-6 py-4 border-b border-white/20">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Zap className="text-yellow-400" />
            Training Buffer
          </h3>
        </div>
        <div className="p-6">
          <div className="text-center p-4 bg-white/20 rounded-lg">
            <div className="text-yellow-400 font-mono text-xl">
              {trainingBufferStatus.count}/{trainingBufferStatus.maxSize}
            </div>
            <div className="text-white text-sm">Training Samples</div>
          </div>
        </div>
      </div>

      {/* Quick Queries */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-md overflow-hidden border border-white/20">
        <div className="bg-slate-800/50 px-6 py-4 border-b border-white/20">
          <h3 className="text-lg font-semibold text-white">Quick Queries</h3>
        </div>
        <div className="p-6 space-y-2">
          {quickQueries.map((query, index) => <Button key={index} variant="outline" className="w-full text-left justify-start border-white/30 text-white hover:bg-white/20 text-xs bg-transparent" onClick={() => !isProcessing && onQuickQuery(query)} disabled={isProcessing}>
              {query}
            </Button>)}
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-md overflow-hidden border border-white/20">
        
        
      </div>

      {/* Route Status */}
      
    </aside>;
}

import React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, MapPin, Clock, DollarSign, Shield, Zap } from "lucide-react"

interface RouteOption {
  id: string
  carrier: string
  route: string
  hub: string
  destination: string
  transitTime: number
  cost: number
  reliability: number
  riskLevel: number
  overallScore: number
}

interface SidePanelProps {
  routeDatabase: RouteOption[]
  trainingBufferStatus: { count: number; maxSize: number }
  isProcessing: boolean
  onQuickQuery: (query: string) => void
}

export default function SidePanel({ routeDatabase, trainingBufferStatus, isProcessing, onQuickQuery }: SidePanelProps) {
  const quickQueries = [
    "What's the fastest way to ship to South Sudan?",
    "Compare Nairobi vs Dakar routes",
    "How much does it cost to ship 5 tons?",
    "What's the risk level for Mombasa port?",
    "Suggest the best route for urgent medical supplies",
  ]

  return (
    <aside className="w-full lg:w-96 space-y-6">
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
          {quickQueries.map((query, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full text-left justify-start border-white/30 text-white hover:bg-white/20 text-xs bg-transparent"
              onClick={() => !isProcessing && onQuickQuery(query)}
              disabled={isProcessing}
            >
              {query}
            </Button>
          ))}
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-md overflow-hidden border border-white/20">
        <div className="bg-slate-800/50 px-6 py-4 border-b border-white/20">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <BarChart3 className="text-yellow-400" />
            Live Analytics
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <Clock className="w-6 h-6 text-blue-400 mx-auto mb-1" />
              <div className="text-white text-sm font-medium">Avg Transit</div>
              <div className="text-white text-lg font-bold">7.7 days</div>
            </div>

            <div className="bg-white/20 rounded-lg p-3 text-center">
              <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-1" />
              <div className="text-white text-sm font-medium">Avg Cost</div>
              <div className="text-white text-lg font-bold">$2,167</div>
            </div>

            <div className="bg-white/20 rounded-lg p-3 text-center">
              <Shield className="w-6 h-6 text-purple-400 mx-auto mb-1" />
              <div className="text-white text-sm font-medium">Reliability</div>
              <div className="text-white text-lg font-bold">83%</div>
            </div>

            <div className="bg-white/20 rounded-lg p-3 text-center">
              <Zap className="w-6 h-6 text-red-400 mx-auto mb-1" />
              <div className="text-white text-sm font-medium">Risk Level</div>
              <div className="text-white text-lg font-bold">13%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Route Status */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-md overflow-hidden border border-white/20">
        <div className="bg-slate-800/50 px-6 py-4 border-b border-white/20">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <MapPin className="text-red-400" />
            Route Status
          </h3>
        </div>
        <div className="p-6 space-y-3">
          {routeDatabase.slice(0, 3).map((route) => (
            <div key={route.id} className="bg-white/20 rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <div className="text-white text-sm font-medium">{route.carrier}</div>
                <Badge
                  className={`text-xs ${
                    route.overallScore > 0.8
                      ? "bg-green-600"
                      : route.overallScore > 0.7
                        ? "bg-yellow-600"
                        : "bg-red-600"
                  }`}
                >
                  {route.overallScore.toFixed(2)}
                </Badge>
              </div>
              <div className="text-white/80 text-xs">{route.route}</div>
              <div className="text-white/60 text-xs mt-1">
                {route.transitTime}d • ${route.cost} • {route.reliability}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

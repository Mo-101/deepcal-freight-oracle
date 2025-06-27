
// DeepCAL TOPSIS Ranking Engine - Moved from main pages
import DeepCALSymbolicHeader from "@/components/DeepCALSymbolicHeader";
import { BarChart2, BadgeCheck, TrendingUp, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const forwarderRankings = [
  { forwarder: "DHL Global Forwarding", closeness: 0.87, efficiency: 94, cost_index: 0.82, reliability: 0.91 },
  { forwarder: "Kuehne + Nagel", closeness: 0.82, efficiency: 89, cost_index: 0.78, reliability: 0.88 },
  { forwarder: "Expeditors", closeness: 0.79, efficiency: 85, cost_index: 0.81, reliability: 0.84 },
  { forwarder: "DB Schenker", closeness: 0.76, efficiency: 82, cost_index: 0.75, reliability: 0.86 },
  { forwarder: "CEVA Logistics", closeness: 0.73, efficiency: 78, cost_index: 0.79, reliability: 0.82 },
  { forwarder: "Panalpina", closeness: 0.69, efficiency: 75, cost_index: 0.73, reliability: 0.79 },
];

const DeepCALRanking = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
    <DeepCALSymbolicHeader />
    
    <main className="container max-w-6xl mx-auto pt-8 px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-3 text-white">
          <BarChart2 className="w-8 h-8 text-lime-400" />
          TOPSIS Forwarder Ranking Engine
        </h1>
        <p className="text-indigo-200 mb-6">
          Multi-criteria decision analysis using Grey-Neutrosophic TOPSIS methodology for optimal forwarder selection
        </p>
        
        <div className="flex gap-4 mb-6">
          <Badge variant="outline" className="border-lime-400 text-lime-400">
            <TrendingUp className="w-4 h-4 mr-2" />
            Live TOPSIS Processing
          </Badge>
          <Badge variant="outline" className="border-cyan-400 text-cyan-400">
            Neutrosophic Logic Active
          </Badge>
          <Badge variant="outline" className="border-purple-400 text-purple-400">
            Grey System Integration
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="glass-card shadow-glass border border-glassBorder">
          <CardHeader>
            <CardTitle className="text-lime-400 text-lg">Criteria Weights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-indigo-300">Cost Efficiency</span>
                <span className="text-white font-semibold">35%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-300">Delivery Time</span>
                <span className="text-white font-semibold">30%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-300">Reliability</span>
                <span className="text-white font-semibold">25%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-300">Service Quality</span>
                <span className="text-white font-semibold">10%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card shadow-glass border border-glassBorder">
          <CardHeader>
            <CardTitle className="text-cyan-400 text-lg">Processing Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-indigo-300">Normalization: Complete</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-indigo-300">Weight Application: Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-indigo-300">Distance Calculation: Processing</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card shadow-glass border border-glassBorder">
          <CardHeader>
            <CardTitle className="text-purple-400 text-lg">Best Alternative</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <Award className="w-12 h-12 text-lime-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">DHL Global Forwarding</h3>
              <div className="text-2xl font-bold text-lime-400 mb-1">0.87</div>
              <div className="text-sm text-indigo-300">Closeness Coefficient</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card shadow-glass border border-glassBorder">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-lime-400" />
            Forwarder Rankings (TOPSIS Analysis)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-indigo-800">
                  <th className="py-3 px-4 text-left font-semibold text-indigo-300">Rank</th>
                  <th className="py-3 px-4 text-left font-semibold text-indigo-300">Forwarder</th>
                  <th className="py-3 px-4 text-center font-semibold text-indigo-300">Closeness (Ci)</th>
                  <th className="py-3 px-4 text-center font-semibold text-indigo-300">Efficiency %</th>
                  <th className="py-3 px-4 text-center font-semibold text-indigo-300">Cost Index</th>
                  <th className="py-3 px-4 text-center font-semibold text-indigo-300">Reliability</th>
                  <th className="py-3 px-4 text-center font-semibold text-indigo-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {forwarderRankings.map((row, i) => (
                  <tr key={row.forwarder} 
                      className={`border-b border-indigo-800/50 transition-colors hover:bg-indigo-900/30 ${
                        i === 0 ? "bg-green-900/20" : ""
                      }`}>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-bold ${i === 0 ? 'text-lime-400' : 'text-white'}`}>
                          #{i + 1}
                        </span>
                        {i === 0 && <BadgeCheck className="w-5 h-5 text-lime-400" />}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium text-white">{row.forwarder}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`font-bold ${i === 0 ? 'text-lime-400' : 'text-white'}`}>
                        {row.closeness}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center text-cyan-400">{row.efficiency}%</td>
                    <td className="py-4 px-4 text-center text-purple-400">{row.cost_index}</td>
                    <td className="py-4 px-4 text-center text-orange-400">{row.reliability}</td>
                    <td className="py-4 px-4 text-center">
                      {i === 0 ? (
                        <Badge className="bg-green-600 text-white">Optimal</Badge>
                      ) : i < 3 ? (
                        <Badge className="bg-blue-600 text-white">Viable</Badge>
                      ) : (
                        <Badge className="bg-gray-600 text-white">Consider</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <div className="text-sm text-indigo-300 px-4 py-3 rounded-lg bg-indigo-900/30 inline-block">
          <span className="font-semibold">Methodology:</span> Rankings computed via <strong>Grey-Neutrosophic AHP-TOPSIS</strong> multi-criteria decision analysis.
          <br />
          <span className="italic">"Precision through uncertainty - where logic meets intuition."</span>
        </div>
      </div>
    </main>
  </div>
);

export default DeepCALRanking;

import { useMemo, useState } from "react";
import type { CanonicalRecord, Criteria, DecisionResult } from "@/lib/types";
import InputPanel from "@/components/InputPanel";
import { buildAlternativesFromRecord, topsisRank } from "@/services/deepcalEngine";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart2, Trophy, Award, Medal } from "lucide-react";
import DeepCALHeader from "@/components/DeepCALHeader";

export default function RankingPage() {
  const [rec, setRec] = useState<CanonicalRecord>({ request_reference: "" });

  const criteria: Criteria[] = useMemo(() => [
    { name: "cost", type: "cost" },
    { name: "time", type: "cost" },
    { name: "reliability", type: "benefit" },
    { name: "risk", type: "cost" },
  ], []);

  const alts = buildAlternativesFromRecord(rec, criteria);
  const X = alts.map(a => a.metrics);
  const w = [0.4, 0.3, 0.2, 0.1]; // example weights; replace with your AHP result
  const types = criteria.map(c => c.type);

  const result = useMemo<DecisionResult | null>(() => {
    if (!alts.length) return null;
    const { C, order } = topsisRank(X, w, types);
    return {
      weights: w, cr: 0.05,
      ranking: order.map(i => ({ id: alts[i].id, label: alts[i].label, closeness: Number(C[i].toFixed(4)) }))
    };
  }, [JSON.stringify(alts)]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2: return <Award className="w-5 h-5 text-gray-400" />;
      case 3: return <Medal className="w-5 h-5 text-amber-600" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-muted-foreground">{rank}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <DeepCALHeader />
      <div className="container max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <BarChart2 className="w-8 h-8 text-lime-400" />
          <h1 className="text-3xl font-bold text-white">DeepCAL – Forwarder Ranking</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <InputPanel 
              value={rec} 
              onChange={(patch) => setRec(prev => ({
                ...prev, 
                ...patch, 
                quotes: { ...(prev.quotes || {}), ...(patch as any).quotes }
              }))} 
            />
          </div>

          <div className="space-y-6">
            {result && (
              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-lime-400" />
                    TOPSIS Ranking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.ranking.map((r, idx) => (
                      <div key={r.id} className={`flex items-center justify-between p-3 rounded-lg ${
                        idx === 0 ? 'bg-green-500/20 border border-green-500/30' : 'bg-white/5'
                      }`}>
                        <div className="flex items-center gap-3">
                          {getRankIcon(idx + 1)}
                          <div>
                            <div className="font-medium">{r.label}</div>
                            <div className="text-xs text-muted-foreground">{r.id}</div>
                          </div>
                        </div>
                        <Badge variant={idx === 0 ? "default" : "secondary"}>
                          {r.closeness.toFixed(3)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle>Criteria Weights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {criteria.map((c, idx) => (
                    <div key={c.name} className="flex justify-between">
                      <span className="capitalize">{c.name}</span>
                      <span>{(w[idx] * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {result && (
              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle>Analysis Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2">
                    <div>
                      <span className="text-muted-foreground">Best Option:</span>
                      <div className="font-medium">{result.ranking[0]?.label}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Alternatives Compared:</span>
                      <div className="font-medium">{result.ranking.length}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Methodology:</span>
                      <div className="font-medium">Grey/Neutrosophic AHP-TOPSIS</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="text-center text-indigo-200 text-sm mt-8">
          Rankings computed via <strong>Grey/Neutrosophic AHP-TOPSIS</strong> framework.
          <br />
          <em>"It's not magic—it's math, but with room for uncertainty and sarcasm."</em>
        </div>
      </div>
    </div>
  );
}
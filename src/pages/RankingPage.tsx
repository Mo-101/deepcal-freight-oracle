import { useMemo, useState } from "react";
import type { CanonicalRecord, Criteria, DecisionResult } from "@/lib/types";
import InputPanel from "@/components/InputPanel";
import { buildAlternativesFromRecord } from "@/services/deepcalEngine";

// Stub AHP/TOPSIS; wire to your existing engine service if already present
function topsisRank(X: number[][], w: number[], types: ("benefit"|"cost")[]) {
  const m = X.length, n = X[0].length;
  const denom = Array.from({length: n}, (_, j) => Math.sqrt(X.reduce((s,r)=>s+r[j]*r[j],0)) || 1);
  const R = X.map(r => r.map((x,j)=> x/denom[j]));
  const V = R.map(r => r.map((x,j)=> x*w[j]));
  const star = types.map((t,j)=> t==="benefit" ? Math.max(...V.map(r=>r[j])) : Math.min(...V.map(r=>r[j])));
  const worst = types.map((t,j)=> t==="benefit" ? Math.min(...V.map(r=>r[j])) : Math.max(...V.map(r=>r[j])));
  const dPlus = V.map(r => Math.sqrt(r.reduce((s,x,j)=> s + (x-star[j])**2, 0)));
  const dMinus= V.map(r => Math.sqrt(r.reduce((s,x,j)=> s + (x-worst[j])**2, 0)));
  const C = dMinus.map((dm,i)=> dm/((dm+dPlus[i])||1));
  const order = [...C.keys()].sort((a,b)=> C[b]-C[a]);
  return { C, order };
}

export default function RankingPage(){
  const [rec, setRec] = useState<CanonicalRecord>({ request_reference: "" });

  const criteria: Criteria[] = useMemo(()=>[
    { name: "cost", type: "cost" },
    { name: "time", type: "cost" },
    { name: "reliability", type: "benefit" },
    { name: "risk", type: "cost" },
  ],[]);

  const alts = buildAlternativesFromRecord(rec, criteria);
  const X = alts.map(a=>a.metrics);
  const w = [0.4,0.3,0.2,0.1]; // example weights; replace with your AHP result
  const types = criteria.map(c=>c.type);

  const result = useMemo<DecisionResult | null>(()=>{
    if(!alts.length) return null;
    const { C, order } = topsisRank(X, w, types);
    return {
      weights: w, cr: 0.05,
      ranking: order.map(i=>({ id: alts[i].id, label: alts[i].label, closeness: Number(C[i].toFixed(4)) }))
    };
  }, [JSON.stringify(alts)]);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold">DeepCAL – Per‑Forwarder Ranking</h1>
      <InputPanel value={rec} onChange={(patch)=> setRec(prev=> ({...prev, ...patch, quotes: {...(prev.quotes||{}), ...(patch.quotes || {})}}))} />

      {result && (
        <div>
          <h2 className="font-semibold mb-2">Ranking</h2>
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">#</th>
                <th className="p-2 text-left">Forwarder</th>
                <th className="p-2 text-right">Closeness</th>
              </tr>
            </thead>
            <tbody>
              {result.ranking.map((r, idx)=> (
                <tr key={r.id} className="border-t">
                  <td className="p-2">{idx+1}</td>
                  <td className="p-2">{r.label}</td>
                  <td className="p-2 text-right">{r.closeness.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


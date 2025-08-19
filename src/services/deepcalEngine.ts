import type { CanonicalRecord, Criteria, Alternative, DecisionInput, DecisionResult } from "@/lib/types";
import { FORWARDER_COLUMNS, FORWARDER_LABELS } from "@/services/dataIntakeService";

// Minimal AHP/TOPSIS runner (weights + ranking) – assumes judgments provided elsewhere
export function buildAlternativesFromRecord(rec: CanonicalRecord, criteria: Criteria[]): Alternative[] {
  // Use only forwarders with a numeric quote present
  const alts: Alternative[] = [];
  FORWARDER_COLUMNS.forEach((fk) => {
    const q = rec.quotes?.[fk];
    if (typeof q === "number" && Number.isFinite(q)) {
      // Example metrics vector aligned to criteria: [cost, time, reliability, risk]
      // Replace the below with your live KPI estimations.
      const estTime = estimateTimeDays(rec.mode_of_shipment, rec.origin_country, rec.destination_country);
      const reliability = estimateReliability(rec);
      const risk = estimateRisk(rec);
      const metrics = criteria.map((c) => {
        switch (c.name) {
          case "cost": return q; // USD total quote
          case "time": return estTime; // days
          case "reliability": return reliability; // 0..1
          case "risk": return risk; // 0..1 (lower is better if type=="cost")
          default: return 0;
        }
      });
      alts.push({ id: fk, label: FORWARDER_LABELS[fk], metrics });
    }
  });
  return alts;
}

function estimateTimeDays(mode?: string, o?: string, d?: string): number {
  // Simple baseline; replace with your KPI engine values.
  const base = mode === "air" ? 3 : mode === "sea" ? 21 : 7;
  return base;
}

function estimateReliability(_rec: CanonicalRecord): number { return 0.85; }
function estimateRisk(_rec: CanonicalRecord): number { return 0.10; }

// Stub AHP/TOPSIS; wire to your existing engine service if already present
export function topsisRank(X: number[][], w: number[], types: ("benefit"|"cost")[]) {
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
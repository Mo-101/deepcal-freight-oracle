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

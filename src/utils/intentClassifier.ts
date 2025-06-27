
export interface ClassifiedIntent {
  intent: string
  confidence: number
  params: any
}

export function classifyIntent(query: string): ClassifiedIntent {
  const lowerQuery = query.toLowerCase()

  // Optimization queries
  if (lowerQuery.includes("fastest") || lowerQuery.includes("quickest") || lowerQuery.includes("speed")) {
    return { intent: "optimization_time", confidence: 0.9, params: { priority: "speed" } }
  }
  if (lowerQuery.includes("cheapest") || lowerQuery.includes("lowest cost") || lowerQuery.includes("budget")) {
    return { intent: "optimization_cost", confidence: 0.9, params: { priority: "cost" } }
  }

  // Comparison queries
  if (lowerQuery.includes("compare") || lowerQuery.includes("vs") || lowerQuery.includes("versus")) {
    return { intent: "comparison", confidence: 0.85, params: { type: "route_comparison" } }
  }

  // Metric queries
  if (lowerQuery.includes("how long") || lowerQuery.includes("transit time") || lowerQuery.includes("duration")) {
    return { intent: "metrics_time", confidence: 0.8, params: { metric: "transit_time" } }
  }
  if (lowerQuery.includes("risk") || lowerQuery.includes("disruption") || lowerQuery.includes("reliable")) {
    return { intent: "metrics_risk", confidence: 0.8, params: { metric: "risk_assessment" } }
  }

  // Explanation queries
  if (lowerQuery.includes("why") || lowerQuery.includes("explain") || lowerQuery.includes("reason")) {
    return { intent: "explanation", confidence: 0.85, params: { type: "decision_rationale" } }
  }

  // General guidance
  if (lowerQuery.includes("suggest") || lowerQuery.includes("recommend") || lowerQuery.includes("best way")) {
    return { intent: "guidance", confidence: 0.8, params: { type: "general_recommendation" } }
  }

  return { intent: "general", confidence: 0.6, params: {} }
}


import { generateTimeOptimizationResponse, generateCostOptimizationResponse } from './deepcal/optimizationResponses'
import { generateComparisonResponse } from './deepcal/comparisonResponses'
import { generateTimeMetricsResponse, generateRiskMetricsResponse } from './deepcal/metricsResponses'
import { generateExplanationResponse } from './deepcal/explanationResponses'
import { generateGuidanceResponse } from './deepcal/guidanceResponses'
import { generateGeneralResponse } from './deepcal/generalResponses'

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

export function generateEnhancedResponse(
  intent: string, 
  params: any, 
  query: string, 
  routeDatabase: RouteOption[],
  context: any,
  setContext: (context: any) => void
): string {
  const responses = {
    optimization_time: () => generateTimeOptimizationResponse(routeDatabase),
    optimization_cost: () => generateCostOptimizationResponse(routeDatabase),
    comparison: () => generateComparisonResponse(routeDatabase),
    metrics_time: () => generateTimeMetricsResponse(routeDatabase),
    metrics_risk: () => generateRiskMetricsResponse(routeDatabase),
    explanation: () => generateExplanationResponse(context),
    guidance: () => generateGuidanceResponse(routeDatabase, setContext, context),
    general: () => generateGeneralResponse(),
  }

  return responses[intent as keyof typeof responses]?.() || responses.general()
}

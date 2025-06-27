
// Adapter to connect DeepTalk to Symbolic Response Generator
// Replaces all hardcoded response systems

import { symbolicResponseGenerator } from '@/services/symbolicResponseGenerator';
import { ontologicalMind } from '@/services/ontologicalMind';

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

export function generateSymbolicResponse(
  intent: string,
  params: any,
  query: string,
  routeDatabase: RouteOption[],
  context: any,
  setContext: (context: any) => void
): string {
  // Update ontological state based on the query
  ontologicalMind.updateMetaCognition(
    `Processing user query: ${intent}`,
    intent === 'explanation' ? 4 : 3,
    routeDatabase.length === 0 ? 0.8 : 0.2,
    intent.includes('optimization') || intent.includes('recommendation'),
    intent.includes('comparison') || intent.includes('analysis')
  );

  // Determine response intent
  let responseIntent: 'greeting' | 'analysis' | 'recommendation' | 'explanation' | 'reflection' | 'general';
  
  switch (intent) {
    case 'optimization_time':
    case 'optimization_cost':
      responseIntent = 'recommendation';
      break;
    case 'comparison':
    case 'metrics_time':
    case 'metrics_risk':
      responseIntent = 'analysis';
      break;
    case 'explanation':
      responseIntent = 'explanation';
      break;
    default:
      responseIntent = 'general';
  }

  // Prepare context data based on intent
  let contextData: any = { intent, params, routeDatabase };

  if (intent.startsWith('optimization_')) {
    const sortKey = intent === 'optimization_time' ? 'transitTime' : 'cost';
    const sortAsc = intent === 'optimization_time' || intent === 'optimization_cost';
    const best = [...routeDatabase].sort((a, b) => 
      sortAsc ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]
    )[0];
    
    contextData.recommendation = `${best.carrier} via ${best.hub}`;
    contextData.confidence = best.overallScore;
    contextData.analysisDetails = {
      carrier: best.carrier,
      hub: best.hub,
      cost: best.cost,
      time: best.transitTime,
      reliability: best.reliability,
      risk: best.riskLevel
    };
    
    // Update context for future reference
    setContext({ ...context, lastRecommendation: best });
  }

  if (intent === 'comparison') {
    const nairobi = routeDatabase.find(r => r.hub === "Nairobi");
    const dakar = routeDatabase.find(r => r.hub === "Dakar");
    
    contextData.comparisonData = { nairobi, dakar };
    contextData.analysisDetails = {
      timeComparison: nairobi && dakar ? `${nairobi.transitTime} vs ${dakar.transitTime} days` : 'Data unavailable',
      costComparison: nairobi && dakar ? `$${nairobi.cost} vs $${dakar.cost}` : 'Data unavailable',
      reliabilityComparison: nairobi && dakar ? `${nairobi.reliability}% vs ${dakar.reliability}%` : 'Data unavailable'
    };
  }

  if (intent === 'explanation' && context.lastRecommendation) {
    contextData.recommendation = context.lastRecommendation.carrier;
    contextData.confidence = context.lastRecommendation.overallScore;
    contextData.explainDecision = true;
  }

  // Generate response using symbolic system
  const response = symbolicResponseGenerator.generateResponse({
    query,
    intent: responseIntent,
    data: contextData
  });

  // Record this interaction for learning
  symbolicResponseGenerator.recordInteraction(query, response);

  return response;
}

// Provide a general response when no specific intent is detected
export function generateGeneralSymbolicResponse(): string {
  return symbolicResponseGenerator.generateResponse({
    query: 'general_inquiry',
    intent: 'general'
  });
}

// Handle guidance requests with symbolic reasoning
export function generateGuidanceResponse(
  routeDatabase: RouteOption[], 
  setContext: (context: any) => void, 
  context: any
): string {
  const best = routeDatabase.sort((a, b) => b.overallScore - a.overallScore)[0];
  setContext({ ...context, lastRecommendation: best });

  return symbolicResponseGenerator.generateResponse({
    query: 'guidance_request',
    intent: 'recommendation',
    data: {
      recommendation: `${best.carrier} via ${best.hub}`,
      confidence: best.overallScore,
      analysisDetails: {
        carrier: best.carrier,
        hub: best.hub,
        cost: best.cost,
        time: best.transitTime,
        reliability: best.reliability,
        risk: best.riskLevel,
        reasoning: 'Multi-criteria optimization analysis'
      }
    }
  });
}

// Handle explanation requests with symbolic reasoning
export function generateExplanationResponse(context: any): string {
  if (context.lastRecommendation) {
    return symbolicResponseGenerator.generateResponse({
      query: 'explanation_request',
      intent: 'explanation',
      data: {
        recommendation: context.lastRecommendation.carrier,
        confidence: context.lastRecommendation.overallScore,
        explainDecision: true,
        decisionFactors: {
          cost: context.lastRecommendation.cost,
          time: context.lastRecommendation.transitTime,
          reliability: context.lastRecommendation.reliability,
          risk: context.lastRecommendation.riskLevel
        }
      }
    });
  }
  
  return symbolicResponseGenerator.generateResponse({
    query: 'explanation_general',
    intent: 'explanation'
  });
}


import { userDecisionTracker, UserDecision } from './userDecisionTracker';
import { performanceMetrics, PerformanceMetrics } from './performanceMetrics';

export interface LearningInsight {
  id: string;
  type: 'pattern' | 'anomaly' | 'improvement' | 'trend';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  recommendation: string;
  confidence: number;
  timestamp: Date;
  metadata: Record<string, any>;
}

export interface WeightAdjustment {
  criterion: 'cost' | 'time' | 'reliability' | 'risk';
  currentWeight: number;
  suggestedWeight: number;
  confidence: number;
  reasoning: string;
}

class LearningInsightsAnalyzer {
  generateInsights(): LearningInsight[] {
    const decisions = userDecisionTracker.getDecisions();
    const metrics = performanceMetrics.calculateSystemMetrics();
    
    const insights: LearningInsight[] = [];
    
    insights.push(...this.analyzeUserPatterns(decisions));
    insights.push(...this.detectAnomalies(decisions));
    insights.push(...this.identifyImprovements(metrics));
    insights.push(...this.analyzeTrends(decisions));
    
    return insights.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  suggestWeightAdjustments(): WeightAdjustment[] {
    const decisions = userDecisionTracker.getDecisions();
    if (decisions.length < 10) return [];

    const adjustments: WeightAdjustment[] = [];
    
    // Analyze user priority patterns
    const avgPriorities = this.calculateAveragePriorities(decisions);
    const userOverrides = decisions.filter(d => d.recommendedForwarder !== d.selectedForwarder);
    
    if (userOverrides.length > 0) {
      const overridePriorities = this.calculateAveragePriorities(userOverrides);
      
      // Suggest adjustments based on override patterns
      Object.keys(avgPriorities).forEach(criterion => {
        const key = criterion as keyof typeof avgPriorities;
        const currentWeight = avgPriorities[key];
        const overrideWeight = overridePriorities[key];
        
        if (Math.abs(currentWeight - overrideWeight) > 0.1) {
          adjustments.push({
            criterion: key,
            currentWeight,
            suggestedWeight: (currentWeight + overrideWeight) / 2,
            confidence: Math.min(0.95, userOverrides.length / 20),
            reasoning: `Users consistently override when ${criterion} priority differs significantly`
          });
        }
      });
    }

    return adjustments;
  }

  private analyzeUserPatterns(decisions: UserDecision[]): LearningInsight[] {
    const insights: LearningInsight[] = [];
    
    if (decisions.length < 5) return insights;

    // Pattern: Consistent forwarder preference
    const forwarderCounts = new Map<string, number>();
    decisions.forEach(d => {
      forwarderCounts.set(d.selectedForwarder, (forwarderCounts.get(d.selectedForwarder) || 0) + 1);
    });

    const mostPreferred = Array.from(forwarderCounts.entries())
      .sort((a, b) => b[1] - a[1])[0];

    if (mostPreferred && mostPreferred[1] / decisions.length > 0.6) {
      insights.push({
        id: crypto.randomUUID(),
        type: 'pattern',
        priority: 'medium',
        title: 'Strong Forwarder Preference Detected',
        description: `User shows strong preference for ${mostPreferred[0]} (${((mostPreferred[1] / decisions.length) * 100).toFixed(1)}% of selections)`,
        recommendation: 'Consider adjusting weights to favor this forwarder in similar scenarios',
        confidence: 0.85,
        timestamp: new Date(),
        metadata: { forwarderId: mostPreferred[0], frequency: mostPreferred[1] }
      });
    }

    return insights;
  }

  private detectAnomalies(decisions: UserDecision[]): LearningInsight[] {
    const insights: LearningInsight[] = [];
    
    if (decisions.length < 10) return insights;

    // Anomaly: Sudden spike in overrides
    const recentDecisions = decisions.slice(-10);
    const olderDecisions = decisions.slice(-20, -10);
    
    if (olderDecisions.length > 0) {
      const recentOverrideRate = recentDecisions.filter(d => d.recommendedForwarder !== d.selectedForwarder).length / recentDecisions.length;
      const olderOverrideRate = olderDecisions.filter(d => d.recommendedForwarder !== d.selectedForwarder).length / olderDecisions.length;
      
      if (recentOverrideRate > olderOverrideRate + 0.3) {
        insights.push({
          id: crypto.randomUUID(),
          type: 'anomaly',
          priority: 'high',
          title: 'Increased Override Rate Detected',
          description: `Override rate increased from ${(olderOverrideRate * 100).toFixed(1)}% to ${(recentOverrideRate * 100).toFixed(1)}%`,
          recommendation: 'Review recent recommendations and adjust algorithm parameters',
          confidence: 0.75,
          timestamp: new Date(),
          metadata: { recentRate: recentOverrideRate, previousRate: olderOverrideRate }
        });
      }
    }

    return insights;
  }

  private identifyImprovements(metrics: PerformanceMetrics): LearningInsight[] {
    const insights: LearningInsight[] = [];

    // Improvement opportunity: Low accuracy
    if (metrics.accuracy < 70) {
      insights.push({
        id: crypto.randomUUID(),
        type: 'improvement',
        priority: 'high',
        title: 'Low Prediction Accuracy',
        description: `Current accuracy is ${metrics.accuracy.toFixed(1)}%, below optimal threshold`,
        recommendation: 'Implement additional training data and refine weight calculations',
        confidence: 0.9,
        timestamp: new Date(),
        metadata: { currentAccuracy: metrics.accuracy }
      });
    }

    // Improvement opportunity: High override rate
    if (metrics.overrideRate > 0.4) {
      insights.push({
        id: crypto.randomUUID(),
        type: 'improvement',
        priority: 'medium',
        title: 'High User Override Rate',
        description: `Users override ${(metrics.overrideRate * 100).toFixed(1)}% of recommendations`,
        recommendation: 'Analyze user decision patterns and adjust recommendation logic',
        confidence: 0.8,
        timestamp: new Date(),
        metadata: { overrideRate: metrics.overrideRate }
      });
    }

    return insights;
  }

  private analyzeTrends(decisions: UserDecision[]): LearningInsight[] {
    const insights: LearningInsight[] = [];
    
    if (decisions.length < 20) return insights;

    // Trend: Improving accuracy over time
    const firstHalf = decisions.slice(0, Math.floor(decisions.length / 2));
    const secondHalf = decisions.slice(Math.floor(decisions.length / 2));
    
    const firstAccuracy = firstHalf.filter(d => d.recommendedForwarder === d.selectedForwarder).length / firstHalf.length;
    const secondAccuracy = secondHalf.filter(d => d.recommendedForwarder === d.selectedForwarder).length / secondHalf.length;
    
    if (secondAccuracy > firstAccuracy + 0.1) {
      insights.push({
        id: crypto.randomUUID(),
        type: 'trend',
        priority: 'low',
        title: 'Improving Accuracy Trend',
        description: `Accuracy improved from ${(firstAccuracy * 100).toFixed(1)}% to ${(secondAccuracy * 100).toFixed(1)}%`,
        recommendation: 'Continue current learning approach and monitor for sustained improvement',
        confidence: 0.7,
        timestamp: new Date(),
        metadata: { previousAccuracy: firstAccuracy, currentAccuracy: secondAccuracy }
      });
    }

    return insights;
  }

  private calculateAveragePriorities(decisions: UserDecision[]) {
    if (decisions.length === 0) return { cost: 0, time: 0, reliability: 0, risk: 0 };
    
    const totals = decisions.reduce((acc, d) => ({
      cost: acc.cost + d.context.priorities.cost,
      time: acc.time + d.context.priorities.time,
      reliability: acc.reliability + d.context.priorities.reliability,
      risk: acc.risk + d.context.priorities.risk
    }), { cost: 0, time: 0, reliability: 0, risk: 0 });

    return {
      cost: totals.cost / decisions.length,
      time: totals.time / decisions.length,
      reliability: totals.reliability / decisions.length,
      risk: totals.risk / decisions.length
    };
  }
}

export const learningInsights = new LearningInsightsAnalyzer();

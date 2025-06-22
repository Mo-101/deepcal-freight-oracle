
import { userDecisionTracker, UserDecision } from './userDecisionTracker';

export interface PerformanceMetrics {
  accuracy: number;
  userSatisfaction: number;
  overrideRate: number;
  learningVelocity: number;
  predictionConfidence: number;
  forwarderReliability: Record<string, number>;
}

export interface ForwarderPerformance {
  forwarderId: string;
  recommendationAccuracy: number;
  userPreference: number;
  actualPerformance: number;
  riskAssessment: number;
}

class PerformanceMetricsCalculator {
  calculateSystemMetrics(): PerformanceMetrics {
    const decisions = userDecisionTracker.getDecisions();
    
    return {
      accuracy: this.calculateAccuracy(decisions),
      userSatisfaction: this.calculateUserSatisfaction(decisions),
      overrideRate: userDecisionTracker.getOverrideRate(),
      learningVelocity: this.calculateLearningVelocity(decisions),
      predictionConfidence: this.calculatePredictionConfidence(decisions),
      forwarderReliability: this.calculateForwarderReliability(decisions)
    };
  }

  calculateForwarderPerformance(): ForwarderPerformance[] {
    const decisions = userDecisionTracker.getDecisions();
    const forwarderMap = new Map<string, UserDecision[]>();

    // Group decisions by forwarder
    decisions.forEach(decision => {
      if (!forwarderMap.has(decision.recommendedForwarder)) {
        forwarderMap.set(decision.recommendedForwarder, []);
      }
      forwarderMap.get(decision.recommendedForwarder)!.push(decision);
    });

    return Array.from(forwarderMap.entries()).map(([forwarderId, forwarderDecisions]) => ({
      forwarderId,
      recommendationAccuracy: this.calculateForwarderAccuracy(forwarderDecisions),
      userPreference: this.calculateUserPreference(forwarderDecisions),
      actualPerformance: this.calculateActualPerformance(forwarderDecisions),
      riskAssessment: this.calculateRiskAssessment(forwarderDecisions)
    }));
  }

  private calculateAccuracy(decisions: UserDecision[]): number {
    if (decisions.length === 0) return 0;
    
    const correct = decisions.filter(d => 
      d.recommendedForwarder === d.selectedForwarder
    ).length;
    
    return (correct / decisions.length) * 100;
  }

  private calculateUserSatisfaction(decisions: UserDecision[]): number {
    // Simulate satisfaction based on decision patterns
    const recentDecisions = decisions.slice(-50);
    if (recentDecisions.length === 0) return 75;

    const overrideRate = recentDecisions.filter(d => 
      d.recommendedForwarder !== d.selectedForwarder
    ).length / recentDecisions.length;

    // Lower override rate suggests higher satisfaction
    return Math.max(0, 100 - (overrideRate * 100));
  }

  private calculateLearningVelocity(decisions: UserDecision[]): number {
    if (decisions.length < 10) return 0;

    const recent = decisions.slice(-50);
    const older = decisions.slice(-100, -50);

    const recentAccuracy = this.calculateAccuracy(recent);
    const olderAccuracy = this.calculateAccuracy(older);

    return Math.max(0, recentAccuracy - olderAccuracy);
  }

  private calculatePredictionConfidence(decisions: UserDecision[]): number {
    // Calculate confidence based on consistency of recommendations
    if (decisions.length < 5) return 50;

    const recentDecisions = decisions.slice(-20);
    const consistency = recentDecisions.filter(d => 
      d.recommendedForwarder === d.selectedForwarder
    ).length / recentDecisions.length;

    return consistency * 100;
  }

  private calculateForwarderReliability(decisions: UserDecision[]): Record<string, number> {
    const reliability: Record<string, number> = {};
    const forwarderGroups = new Map<string, UserDecision[]>();

    decisions.forEach(decision => {
      if (!forwarderGroups.has(decision.selectedForwarder)) {
        forwarderGroups.set(decision.selectedForwarder, []);
      }
      forwarderGroups.get(decision.selectedForwarder)!.push(decision);
    });

    forwarderGroups.forEach((forwarderDecisions, forwarderId) => {
      reliability[forwarderId] = this.calculateForwarderAccuracy(forwarderDecisions);
    });

    return reliability;
  }

  private calculateForwarderAccuracy(decisions: UserDecision[]): number {
    if (decisions.length === 0) return 0;
    
    const successful = decisions.filter(d => 
      d.recommendedForwarder === d.selectedForwarder
    ).length;
    
    return (successful / decisions.length) * 100;
  }

  private calculateUserPreference(decisions: UserDecision[]): number {
    return decisions.length > 0 ? (decisions.length / userDecisionTracker.getDecisions().length) * 100 : 0;
  }

  private calculateActualPerformance(decisions: UserDecision[]): number {
    // Simulate actual performance based on user selections
    return Math.random() * 20 + 80; // 80-100% range
  }

  private calculateRiskAssessment(decisions: UserDecision[]): number {
    // Calculate risk based on decision patterns
    const avgRiskPriority = decisions.reduce((sum, d) => sum + d.context.priorities.risk, 0) / decisions.length;
    return (1 - avgRiskPriority) * 100; // Invert risk priority to get risk assessment
  }
}

export const performanceMetrics = new PerformanceMetricsCalculator();

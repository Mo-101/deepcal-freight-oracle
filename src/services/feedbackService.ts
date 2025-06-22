
// Enhanced Feedback Service - Orchestrating all feedback components
import { userDecisionTracker, UserDecision } from './feedback/userDecisionTracker';
import { performanceMetrics, PerformanceMetrics, ForwarderPerformance } from './feedback/performanceMetrics';
import { learningInsights, LearningInsight, WeightAdjustment } from './feedback/learningInsights';

export interface FeedbackSystemStatus {
  isInitialized: boolean;
  totalDecisions: number;
  systemMetrics: PerformanceMetrics;
  activeInsights: LearningInsight[];
  suggestedAdjustments: WeightAdjustment[];
}

class FeedbackService {
  private initialized = false;

  async initialize() {
    if (this.initialized) return;
    
    try {
      await userDecisionTracker.initialize();
      this.initialized = true;
      console.log('Feedback service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize feedback service:', error);
      throw error;
    }
  }

  async trackUserDecision(
    shipmentId: string,
    recommendedForwarder: string,
    selectedForwarder: string,
    context: any,
    reasoning?: string
  ) {
    if (!this.initialized) {
      await this.initialize();
    }

    return await userDecisionTracker.trackDecision({
      shipmentId,
      recommendedForwarder,
      selectedForwarder,
      reasoning,
      context
    });
  }

  getSystemStatus(): FeedbackSystemStatus {
    const decisions = userDecisionTracker.getDecisions();
    const metrics = performanceMetrics.calculateSystemMetrics();
    const insights = learningInsights.generateInsights();
    const adjustments = learningInsights.suggestWeightAdjustments();

    return {
      isInitialized: this.initialized,
      totalDecisions: decisions.length,
      systemMetrics: metrics,
      activeInsights: insights.slice(0, 10), // Top 10 insights
      suggestedAdjustments: adjustments
    };
  }

  getForwarderPerformance(): ForwarderPerformance[] {
    return performanceMetrics.calculateForwarderPerformance();
  }

  getDecisionHistory(limit: number = 50): UserDecision[] {
    return userDecisionTracker.getDecisions().slice(-limit);
  }

  getOverrideRate(): number {
    return userDecisionTracker.getOverrideRate();
  }

  // Learning integration
  async applyWeightAdjustments(adjustments: WeightAdjustment[]) {
    // This would integrate with the training system
    console.log('Applying weight adjustments:', adjustments);
    
    // Trigger weight matrix update
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('weightAdjustmentSuggested', { 
          detail: adjustments 
        })
      );
    }
  }

  // Real-time learning
  async processOutcome(shipmentId: string, actualOutcome: {
    deliveryTime: number;
    actualCost: number;
    reliability: number;
    issues?: string[];
  }) {
    // This would update the learning system with actual results
    console.log('Processing shipment outcome:', shipmentId, actualOutcome);
    
    // Future: Update neural network with real performance data
    // This creates the feedback loop for continuous learning
  }
}

export const feedbackService = new FeedbackService();

// Export sub-services for direct access if needed
export { userDecisionTracker, performanceMetrics, learningInsights };
export type { UserDecision, PerformanceMetrics, ForwarderPerformance, LearningInsight, WeightAdjustment };

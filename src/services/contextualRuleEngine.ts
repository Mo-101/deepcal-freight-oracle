
// Contextual Rule Evolution for DeepCAL Symbolic Mind
// Makes rules adaptive to changing conditions and learning

import { NeutrosophicRule } from './neutrosophicEngine';

export interface ContextualRule extends NeutrosophicRule {
  context: {
    timeOfDay: 'any' | 'morning' | 'afternoon' | 'evening' | 'night';
    season: 'any' | 'spring' | 'summer' | 'fall' | 'winter';
    region: 'any' | 'africa' | 'europe' | 'asia' | 'americas' | 'oceania';
    urgency: 'any' | 'low' | 'medium' | 'high' | 'critical';
    volume: 'any' | 'small' | 'medium' | 'large' | 'bulk';
  };
  temporalWeights: {
    decay: number; // How quickly rule relevance decreases over time
    learning: number; // How quickly rule adapts to new information
    stability: number; // How resistant rule is to change
  };
  confidenceHistory: { timestamp: Date; confidence: number; outcome: 'success' | 'failure' | 'unknown' }[];
  lastUpdated: Date;
  applicationCount: number;
  successRate: number;
}

export interface LogisticsContext {
  currentTime: Date;
  region: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  volume: 'small' | 'medium' | 'large' | 'bulk';
  historicalData?: any;
}

export class ContextualRuleEngine {
  private contextualRules: ContextualRule[] = [];
  private learningRate = 0.1;
  private contextMatchThreshold = 0.7;

  // Convert static rules to contextual rules
  initializeFromStaticRules(staticRules: NeutrosophicRule[]): void {
    this.contextualRules = staticRules.map(rule => this.enhanceRuleWithContext(rule));
    console.log(`🧠 Contextual Rule Engine: Initialized ${this.contextualRules.length} contextual rules`);
  }

  // Get rules relevant to current context
  getContextualRules(context: LogisticsContext): ContextualRule[] {
    const relevantRules = this.contextualRules
      .map(rule => ({
        rule,
        relevance: this.calculateContextRelevance(rule, context)
      }))
      .filter(({ relevance }) => relevance >= this.contextMatchThreshold)
      .sort((a, b) => b.relevance - a.relevance)
      .map(({ rule }) => this.adjustRuleForContext(rule, context));

    console.log(`🎯 Context Match: ${relevantRules.length}/${this.contextualRules.length} rules relevant`);
    return relevantRules;
  }

  // Learn from rule application outcome
  learnFromOutcome(ruleId: string, context: LogisticsContext, outcome: 'success' | 'failure'): void {
    const rule = this.contextualRules.find(r => r.id === ruleId);
    if (!rule) return;

    // Record confidence history
    const currentConfidence = this.calculateRuleConfidence(rule);
    rule.confidenceHistory.push({
      timestamp: new Date(),
      confidence: currentConfidence,
      outcome
    });

    // Update success rate
    const recentOutcomes = rule.confidenceHistory
      .filter(h => h.outcome !== 'unknown')
      .slice(-10); // Last 10 applications
    
    rule.successRate = recentOutcomes.filter(h => h.outcome === 'success').length / recentOutcomes.length;

    // Adapt rule weights based on outcome
    this.adaptRuleWeights(rule, outcome, context);
    
    rule.applicationCount++;
    rule.lastUpdated = new Date();

    console.log(`📊 Rule Learning: ${ruleId} success rate now ${(rule.successRate * 100).toFixed(1)}%`);
  }

  // Evolve rules based on temporal patterns
  evolveRules(): void {
    const now = new Date();
    
    for (const rule of this.contextualRules) {
      // Apply temporal decay
      const daysSinceUpdate = (now.getTime() - rule.lastUpdated.getTime()) / (1000 * 60 * 60 * 24);
      const decayFactor = Math.exp(-rule.temporalWeights.decay * daysSinceUpdate);
      
      // Adjust truth/indeterminacy/falsity based on recent performance
      if (rule.successRate < 0.5 && rule.applicationCount > 5) {
        // Decrease truth, increase indeterminacy for poorly performing rules
        rule.truth *= (0.95 + rule.successRate * 0.05);
        rule.indeterminacy = Math.min(1, rule.indeterminacy * 1.05);
      } else if (rule.successRate > 0.8 && rule.applicationCount > 5) {
        // Increase truth for well-performing rules
        rule.truth = Math.min(1, rule.truth * 1.02);
        rule.indeterminacy *= 0.98;
      }
    }

    // Remove rules with very low confidence
    this.contextualRules = this.contextualRules.filter(rule => 
      this.calculateRuleConfidence(rule) > 0.2
    );

    console.log(`🔄 Rule Evolution: ${this.contextualRules.length} rules remain after evolution`);
  }

  // Add new rule based on observed patterns
  addLearnedRule(pattern: string, context: LogisticsContext, initialConfidence: number): void {
    const newRule: ContextualRule = {
      id: `learned_${Date.now()}`,
      rule: pattern,
      truth: initialConfidence,
      indeterminacy: 0.2,
      falsity: 1 - initialConfidence - 0.2,
      category: 'learned',
      weight: 0.5,
      context: this.extractContext(context),
      temporalWeights: {
        decay: 0.01,
        learning: 0.2,
        stability: 0.7
      },
      confidenceHistory: [],
      lastUpdated: new Date(),
      applicationCount: 0,
      successRate: 0.5
    };

    this.contextualRules.push(newRule);
    console.log(`🌟 New Rule Learned: ${pattern}`);
  }

  private enhanceRuleWithContext(staticRule: NeutrosophicRule): ContextualRule {
    return {
      ...staticRule,
      context: {
        timeOfDay: 'any',
        season: 'any',
        region: 'any',
        urgency: 'any',
        volume: 'any'
      },
      temporalWeights: {
        decay: 0.005, // Very slow decay for established rules
        learning: 0.05, // Moderate learning rate
        stability: 0.9 // High stability
      },
      confidenceHistory: [],
      lastUpdated: new Date(),
      applicationCount: 0,
      successRate: 0.7 // Assume decent initial performance
    };
  }

  private calculateContextRelevance(rule: ContextualRule, context: LogisticsContext): number {
    let relevance = 0;
    let factors = 0;

    // Time of day relevance
    const hour = context.currentTime.getHours();
    const timeOfDay = hour < 6 ? 'night' : hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
    if (rule.context.timeOfDay === 'any' || rule.context.timeOfDay === timeOfDay) {
      relevance += 1;
    }
    factors++;

    // Season relevance
    const month = context.currentTime.getMonth();
    const season = month < 3 || month === 11 ? 'winter' : month < 6 ? 'spring' : month < 9 ? 'summer' : 'fall';
    if (rule.context.season === 'any' || rule.context.season === season) {
      relevance += 1;
    }
    factors++;

    // Region relevance
    if (rule.context.region === 'any' || context.region.toLowerCase().includes(rule.context.region)) {
      relevance += 1;
    }
    factors++;

    // Urgency relevance
    if (rule.context.urgency === 'any' || rule.context.urgency === context.urgency) {
      relevance += 1;
    }
    factors++;

    // Volume relevance
    if (rule.context.volume === 'any' || rule.context.volume === context.volume) {
      relevance += 1;
    }
    factors++;

    return relevance / factors;
  }

  private adjustRuleForContext(rule: ContextualRule, context: LogisticsContext): ContextualRule {
    // Create a copy with context-adjusted values
    const adjustedRule = { ...rule };
    
    // Adjust based on success history in similar contexts
    const contextAdjustment = rule.successRate > 0.5 ? 1.1 : 0.9;
    adjustedRule.truth *= contextAdjustment;
    adjustedRule.weight = (rule.weight || 0.5) * contextAdjustment;

    return adjustedRule;
  }

  private adaptRuleWeights(rule: ContextualRule, outcome: 'success' | 'failure', context: LogisticsContext): void {
    const learningRate = rule.temporalWeights.learning;
    
    if (outcome === 'success') {
      rule.truth = Math.min(1, rule.truth + learningRate * (1 - rule.truth));
      rule.indeterminacy *= (1 - learningRate * 0.1);
      rule.falsity *= (1 - learningRate * 0.2);
    } else {
      rule.truth *= (1 - learningRate * 0.1);
      rule.indeterminacy = Math.min(1, rule.indeterminacy + learningRate * 0.1);
      rule.falsity = Math.min(1, rule.falsity + learningRate * 0.1);
    }

    // Normalize to maintain neutrosophic constraints
    const sum = rule.truth + rule.indeterminacy + rule.falsity;
    if (sum > 1.2) {
      rule.truth /= sum;
      rule.indeterminacy /= sum;
      rule.falsity /= sum;
    }
  }

  private calculateRuleConfidence(rule: ContextualRule): number {
    return rule.truth - rule.indeterminacy - rule.falsity;
  }

  private extractContext(context: LogisticsContext): ContextualRule['context'] {
    const hour = context.currentTime.getHours();
    const timeOfDay = hour < 6 ? 'night' : hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
    
    const month = context.currentTime.getMonth();
    const season = month < 3 || month === 11 ? 'winter' : month < 6 ? 'spring' : month < 9 ? 'summer' : 'fall';

    return {
      timeOfDay: timeOfDay as any,
      season: season as any,
      region: context.region.toLowerCase() as any,
      urgency: context.urgency,
      volume: context.volume
    };
  }

  getEngineStatus() {
    return {
      totalRules: this.contextualRules.length,
      averageSuccessRate: this.contextualRules.reduce((sum, r) => sum + r.successRate, 0) / this.contextualRules.length,
      learnedRulesCount: this.contextualRules.filter(r => r.category === 'learned').length,
      engineType: 'Contextual Rule Engine v1.0',
      status: 'LEARNING'
    };
  }
}

export const contextualRuleEngine = new ContextualRuleEngine();

// Enhanced Contextual Rule Engine with Learning Capabilities
// Rules evolve based on user feedback and outcomes

import { NeutrosophicRule } from './neutrosophicEngine';

interface RuleEvolution {
  ruleId: string;
  originalWeight: number;
  currentWeight: number;
  successCount: number;
  failureCount: number;
  lastUpdated: Date;
  adaptationRate: number;
}

export class ContextualRuleEngine {
  private rules: NeutrosophicRule[] = [];
  private ruleEvolution: Map<string, RuleEvolution> = new Map();
  private experienceMemory: Array<{
    query: string;
    usedRules: string[];
    outcome: 'positive' | 'negative' | 'neutral';
    timestamp: Date;
  }> = [];

  initializeFromStaticRules(staticRules: any[]): void {
    this.rules = staticRules.map(rule => ({
      id: rule.id || crypto.randomUUID(),
      rule: rule.rule || rule.description,
      truth: rule.truth || 0.8,
      indeterminacy: rule.indeterminacy || 0.1,
      falsity: rule.falsity || 0.1,
      weight: rule.weight || 0.8,
      category: rule.category || 'general'
    }));

    // Initialize evolution tracking
    this.rules.forEach(rule => {
      this.ruleEvolution.set(rule.id, {
        ruleId: rule.id,
        originalWeight: rule.weight || 0.8,
        currentWeight: rule.weight || 0.8,
        successCount: 0,
        failureCount: 0,
        lastUpdated: new Date(),
        adaptationRate: 0.05
      });
    });

    console.log(`🧠 Contextual Rule Engine: Initialized ${this.rules.length} evolving rules`);
  }

  getAllRules(): NeutrosophicRule[] {
    return this.rules.map(rule => ({
      ...rule,
      weight: this.ruleEvolution.get(rule.id)?.currentWeight || rule.weight
    }));
  }

  getRulesForContext(context: string): NeutrosophicRule[] {
    const contextKeywords = context.toLowerCase().split(/\s+/);
    
    return this.rules
      .filter(rule => {
        const ruleText = rule.rule.toLowerCase();
        return contextKeywords.some(keyword => 
          ruleText.includes(keyword) || 
          rule.category?.toLowerCase().includes(keyword.toLowerCase())
        );
      })
      .map(rule => ({
        ...rule,
        weight: this.ruleEvolution.get(rule.id)?.currentWeight || rule.weight
      }))
      .sort((a, b) => (b.weight || 0) - (a.weight || 0));
  }

  updateRuleWeights(query: string, response: string, feedback?: 'positive' | 'negative' | 'neutral'): void {
    if (!feedback) return;

    // Identify which rules were likely used based on query context
    const usedRules = this.identifyUsedRules(query, response);
    
    // Record the experience
    this.experienceMemory.push({
      query: query.substring(0, 200),
      usedRules: usedRules.map(r => r.id),
      outcome: feedback,
      timestamp: new Date()
    });

    // Update rule weights based on feedback
    usedRules.forEach(rule => {
      const evolution = this.ruleEvolution.get(rule.id);
      if (!evolution) return;

      if (feedback === 'positive') {
        evolution.successCount++;
        evolution.currentWeight = Math.min(1.0, 
          evolution.currentWeight + evolution.adaptationRate);
      } else if (feedback === 'negative') {
        evolution.failureCount++;
        evolution.currentWeight = Math.max(0.1, 
          evolution.currentWeight - evolution.adaptationRate);
      }

      evolution.lastUpdated = new Date();
      this.ruleEvolution.set(rule.id, evolution);
    });

    // Prune old experiences (keep last 1000)
    if (this.experienceMemory.length > 1000) {
      this.experienceMemory = this.experienceMemory.slice(-1000);
    }

    console.log(`🧠 Rule weights updated based on ${feedback} feedback for ${usedRules.length} rules`);
  }

  private identifyUsedRules(query: string, response: string): NeutrosophicRule[] {
    const queryTerms = this.extractKeyTerms(query.toLowerCase());
    const responseTerms = this.extractKeyTerms(response.toLowerCase());
    const allTerms = [...queryTerms, ...responseTerms];

    return this.rules.filter(rule => {
      const ruleTerms = this.extractKeyTerms(rule.rule.toLowerCase());
      return ruleTerms.some(term => allTerms.includes(term));
    });
  }

  private extractKeyTerms(text: string): string[] {
    return text
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !['this', 'that', 'with', 'from', 'they', 'have', 'been', 'will'].includes(word));
  }

  addRule(rule: Omit<NeutrosophicRule, 'id'>): string {
    const newRule: NeutrosophicRule = {
      ...rule,
      id: crypto.randomUUID()
    };

    this.rules.push(newRule);
    
    this.ruleEvolution.set(newRule.id, {
      ruleId: newRule.id,
      originalWeight: rule.weight || 0.8,
      currentWeight: rule.weight || 0.8,
      successCount: 0,
      failureCount: 0,
      lastUpdated: new Date(),
      adaptationRate: 0.05
    });

    console.log(`🧠 New rule added: ${rule.rule}`);
    return newRule.id;
  }

  getRuleEvolutionStats(): Array<{
    ruleId: string;
    rule: string;
    category?: string;
    originalWeight: number;
    currentWeight: number;
    successRate: number;
    totalInteractions: number;
    lastUpdated: Date;
  }> {
    return Array.from(this.ruleEvolution.entries()).map(([ruleId, evolution]) => {
      const rule = this.rules.find(r => r.id === ruleId);
      const totalInteractions = evolution.successCount + evolution.failureCount;
      
      return {
        ruleId,
        rule: rule?.rule || 'Unknown rule',
        category: rule?.category,
        originalWeight: evolution.originalWeight,
        currentWeight: evolution.currentWeight,
        successRate: totalInteractions > 0 ? evolution.successCount / totalInteractions : 0,
        totalInteractions,
        lastUpdated: evolution.lastUpdated
      };
    });
  }

  getExperienceMemory(): typeof this.experienceMemory {
    return [...this.experienceMemory];
  }

  // Simulate rule evolution for demonstration
  simulateRuleEvolution(steps: number = 100): void {
    console.log(`🧪 Simulating ${steps} steps of rule evolution...`);
    
    const sampleQueries = [
      'optimize route cost',
      'analyze delivery time',
      'evaluate risk factors',
      'recommend best carrier',
      'explain decision logic'
    ];

    for (let i = 0; i < steps; i++) {
      const query = sampleQueries[Math.floor(Math.random() * sampleQueries.length)];
      const feedback = Math.random() > 0.3 ? 'positive' : (Math.random() > 0.5 ? 'negative' : 'neutral');
      
      this.updateRuleWeights(query, `Response for ${query}`, feedback as any);
    }

    console.log('🧠 Rule evolution simulation complete');
  }
}

export const contextualRuleEngine = new ContextualRuleEngine();

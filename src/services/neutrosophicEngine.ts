
// Neutrosophic Logic Engine for DeepCAL Symbolic Intelligence
// Evaluates symbolic rules using Truth/Indeterminacy/Falsity thresholds

export interface NeutrosophicRule {
  id: string;
  rule: string;
  truth: number;        // 0.0 - 1.0
  indeterminacy: number; // 0.0 - 1.0  
  falsity: number;      // 0.0 - 1.0
  weight?: number;
  category?: string;
}

export interface NeutrosophicThresholds {
  truthDegreeThreshold: number;    // default: 0.80
  indeterminacyTolerance: number;  // default: 0.10
  falsityRejectionLevel: number;   // default: 0.05
}

export class NeutrosophicEngine {
  private thresholds: NeutrosophicThresholds = {
    truthDegreeThreshold: 0.80,
    indeterminacyTolerance: 0.10,
    falsityRejectionLevel: 0.05
  };

  constructor(customThresholds?: Partial<NeutrosophicThresholds>) {
    if (customThresholds) {
      this.thresholds = { ...this.thresholds, ...customThresholds };
    }
  }

  // Core neutrosophic filter - removes weak/conflicting rules
  filterRules(rules: NeutrosophicRule[]): NeutrosophicRule[] {
    console.log(`🧠 Neutrosophic Engine: Filtering ${rules.length} symbolic rules`);
    
    const validRules = rules.filter(rule => this.isRuleValid(rule));
    
    console.log(`✅ Neutrosophic Filter: ${validRules.length}/${rules.length} rules passed validation`);
    
    // Sort by confidence (truth - indeterminacy - falsity)
    return validRules.sort((a, b) => this.calculateConfidence(b) - this.calculateConfidence(a));
  }

  private isRuleValid(rule: NeutrosophicRule): boolean {
    const truthCondition = rule.truth >= this.thresholds.truthDegreeThreshold;
    const indeterminacyCondition = rule.indeterminacy <= this.thresholds.indeterminacyTolerance;
    const falsityCondition = rule.falsity <= this.thresholds.falsityRejectionLevel;
    
    // Neutrosophic constraint: T + I + F should be reasonable (allow for incomplete info)
    const sum = rule.truth + rule.indeterminacy + rule.falsity;
    const sumCondition = sum <= 1.2; // Allow slight overlap for real-world uncertainty
    
    return truthCondition && indeterminacyCondition && falsityCondition && sumCondition;
  }

  private calculateConfidence(rule: NeutrosophicRule): number {
    // Confidence = Truth - Indeterminacy - Falsity (higher is better)
    return rule.truth - rule.indeterminacy - rule.falsity;
  }

  // Generate rule weights for TOPSIS based on neutrosophic scores
  generateRuleWeights(rules: NeutrosophicRule[]): number[] {
    const validRules = this.filterRules(rules);
    const totalConfidence = validRules.reduce((sum, rule) => sum + this.calculateConfidence(rule), 0);
    
    return validRules.map(rule => this.calculateConfidence(rule) / totalConfidence);
  }

  // Update thresholds for different logistics contexts
  updateThresholds(newThresholds: Partial<NeutrosophicThresholds>): void {
    this.thresholds = { ...this.thresholds, ...newThresholds };
    console.log('🔧 Neutrosophic thresholds updated:', this.thresholds);
  }

  // Get current engine status
  getEngineStatus() {
    return {
      thresholds: this.thresholds,
      engineType: 'Neutrosophic Logic Engine v2.1',
      status: 'ACTIVE'
    };
  }
}

export const neutrosophicEngine = new NeutrosophicEngine();

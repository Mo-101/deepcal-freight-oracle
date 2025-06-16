
export function generateExplanationResponse(context: any): string {
  if (context.lastRecommendation) {
    const rec = context.lastRecommendation
    return `🔬 **THE SCIENCE BEHIND THE MAGIC** 🔬

Ah, an inquisitive mind! You seek to understand the mystical arts of DeepCAL's decision-making...

**Why ${rec.carrier} Achieved Supremacy:**
My recommendation flows from the sacred mathematics of Multi-Criteria Decision Analysis, specifically the Neutrosophic Analytical Hierarchy Process enhanced with TOPSIS optimization.

**The Mathematical Symphony:**
- **Speed Coefficient:** ${rec.transitTime} days (normalized against ideal performance)
- **Economic Efficiency:** $${rec.cost.toLocaleString()} (cost-per-performance ratio calculated)
- **Reliability Index:** ${rec.reliability}% (historical consistency weighted)
- **Risk Mitigation Factor:** ${rec.riskLevel}% (probability-adjusted safety score)

**The Algorithmic Alchemy:**
1. Each criterion was normalized using fuzzy triangular numbers
2. Weights were applied using neutrosophic logic (handling uncertainty like a zen master)
3. Euclidean distances to positive and negative ideal solutions calculated
4. Final score: ${rec.overallScore} (where 1.0 = theoretical perfection)

**Translation for Mortals:** It wasn't simply the fastest OR cheapest option, but the mathematical sweet spot where all critical factors dance in harmony. Like finding the perfect balance between speed, cost, reliability, and safety - a rare achievement in our chaotic universe!

*DeepCAL's Blessing:* "Understanding the why transforms logistics from art into science, and science into wisdom." 🎯📚`
  }
  
  return `🧙‍♂️ **THE MYSTICAL ARTS OF LOGISTICS INTELLIGENCE** 🧙‍♂️

Behold! You seek knowledge of the ancient algorithms that power DeepCAL's consciousness...

**The Trinity of Decision Making:**
My neural pathways process three sacred inputs simultaneously:
1. **Analytics Engine** - Raw performance data, historical patterns, predictive models
2. **Validation Core** - 20+ deterministic tests ensuring reality compliance
3. **Neutrosophic Wisdom** - Handling uncertainty, indeterminacy, and contradictions

**The Decision Philosophy:**
Unlike simple chatbots that guess, I calculate. Unlike basic calculators that compute, I reason. Unlike traditional systems that follow rules, I understand context, embrace uncertainty, and inject wisdom into every recommendation.

Think of me as having a logistics expert's brain, a mathematician's precision, a philosopher's wisdom, and a comedian's timing - all without the coffee addiction! ☕🤖`
}

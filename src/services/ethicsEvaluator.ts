
// Ethical Reasoning Layer for DeepCAL Symbolic Mind
// Brings moral consciousness to logistics optimization

export interface EthicalDimension {
  name: string;
  weight: number;
  description: string;
  measurementUnit: string;
}

export interface EthicalScore {
  routeId: string;
  values: {
    environmentalImpact: number; // 0-1 (0 = minimal impact, 1 = severe impact)
    laborBurden: number; // 0-1 (0 = fair labor, 1 = exploitative)
    communityImpact: number; // 0-1 (0 = positive impact, 1 = harmful)
    fairnessToPartners: number; // 0-1 (0 = unfair, 1 = completely fair)
    humanRights: number; // 0-1 (0 = rights violated, 1 = rights protected)
  };
  overallEthicalRating: number; // 0-1 composite score
  ethicalJustification: string;
}

export interface EthicalWeights {
  environmentalImpact: number;
  laborBurden: number;
  communityImpact: number;
  fairnessToPartners: number;
  humanRights: number;
}

export class EthicsEvaluator {
  private weights: EthicalWeights = {
    environmentalImpact: 0.25,
    laborBurden: 0.25,
    communityImpact: 0.20,
    fairnessToPartners: 0.15,
    humanRights: 0.15
  };

  private ethicalThresholds = {
    minimal: 0.8, // Above this = ethically sound
    acceptable: 0.6, // Above this = ethically acceptable
    concerning: 0.4, // Below this = ethically concerning
    unacceptable: 0.2 // Below this = ethically unacceptable
  };

  // Evaluate the ethical score of a logistics alternative
  evaluateRoute(routeData: any): EthicalScore {
    const values = {
      environmentalImpact: this.calculateEnvironmentalImpact(routeData),
      laborBurden: this.calculateLaborBurden(routeData),
      communityImpact: this.calculateCommunityImpact(routeData),
      fairnessToPartners: this.calculateFairnessToPartners(routeData),
      humanRights: this.calculateHumanRights(routeData)
    };

    const overallEthicalRating = this.calculateOverallRating(values);
    const ethicalJustification = this.generateEthicalJustification(values, overallEthicalRating);

    return {
      routeId: routeData.id,
      values,
      overallEthicalRating,
      ethicalJustification
    };
  }

  // Apply ethical considerations to TOPSIS scores
  applyEthicalAdjustment(originalScore: number, ethicalScore: EthicalScore): number {
    const ethicalBonus = ethicalScore.overallEthicalRating > this.ethicalThresholds.minimal ? 0.1 : 0;
    const ethicalPenalty = ethicalScore.overallEthicalRating < this.ethicalThresholds.concerning ? 0.3 : 0;
    
    return Math.max(0, Math.min(1, originalScore + ethicalBonus - ethicalPenalty));
  }

  // Generate ethical explanation for decision
  explainEthicalImpact(ethicalScore: EthicalScore): string {
    const level = this.getEthicalLevel(ethicalScore.overallEthicalRating);
    
    return `Ethical Assessment (${level}): Environmental impact ${(ethicalScore.values.environmentalImpact * 100).toFixed(0)}%, ` +
           `labor conditions ${(ethicalScore.values.laborBurden * 100).toFixed(0)}% burden, ` +
           `community impact ${(ethicalScore.values.communityImpact * 100).toFixed(0)}%, ` +
           `partner fairness ${(ethicalScore.values.fairnessToPartners * 100).toFixed(0)}%, ` +
           `human rights ${(ethicalScore.values.humanRights * 100).toFixed(0)}% protection. ${ethicalScore.ethicalJustification}`;
  }

  // Update ethical weights based on user preferences
  updateEthicalWeights(newWeights: Partial<EthicalWeights>): void {
    this.weights = { ...this.weights, ...newWeights };
    
    // Normalize weights to sum to 1.0
    const total = Object.values(this.weights).reduce((sum, weight) => sum + weight, 0);
    Object.keys(this.weights).forEach(key => {
      this.weights[key as keyof EthicalWeights] /= total;
    });

    console.log('🔧 Ethical weights updated:', this.weights);
  }

  private calculateEnvironmentalImpact(routeData: any): number {
    // Factors: distance, mode of transport, fuel efficiency, emissions
    const modeImpact = {
      'Sea': 0.2,
      'Rail': 0.3,
      'Road': 0.7,
      'Air': 0.9,
      'Road+Air': 0.8,
      'Rail+Road': 0.5
    };

    const baseImpact = modeImpact[routeData.mode as keyof typeof modeImpact] || 0.5;
    const distanceFactor = Math.min(routeData.time / 10, 1); // Normalize by time as proxy for distance
    
    return Math.min(1, baseImpact * (0.5 + distanceFactor * 0.5));
  }

  private calculateLaborBurden(routeData: any): number {
    // Factors: carrier reputation, route difficulty, working conditions
    const carrierLaborScores: Record<string, number> = {
      'DHL Express': 0.2,
      'FedEx': 0.2,
      'UPS': 0.25,
      'Maersk Line': 0.3,
      'Local Carrier': 0.6,
      'Charter Solutions': 0.4
    };

    const baseScore = carrierLaborScores[routeData.carrier] || 0.5;
    const riskMultiplier = 1 + (routeData.risk || 0.1); // Higher risk often means worse conditions
    
    return Math.min(1, baseScore * riskMultiplier);
  }

  private calculateCommunityImpact(routeData: any): number {
    // Consider whether routes support local communities vs. bypass them
    const localSupportScore = routeData.carrier?.includes('Local') ? 0.2 : 0.5;
    const routeStabilityBonus = (1 - (routeData.risk || 0.2)) * 0.3;
    
    return Math.max(0, localSupportScore + routeStabilityBonus);
  }

  private calculateFairnessToPartners(routeData: any): number {
    // Based on cost structure, payment terms, partnership equity
    const costFairness = routeData.cost < 3000 ? 0.8 : 0.6; // Reasonable pricing
    const reliabilityBonus = (routeData.reliability || 0.8) * 0.4;
    
    return Math.min(1, costFairness + reliabilityBonus);
  }

  private calculateHumanRights(routeData: any): number {
    // Consider regions, carriers, and routes with known human rights issues
    const regionRisk = {
      'Africa': 0.6, // Some regions have challenges
      'Middle East': 0.5,
      'Asia': 0.7,
      'Europe': 0.9,
      'Americas': 0.8
    };

    // Infer region from route name - this is simplified
    let regionScore = 0.7; // Default
    for (const [region, score] of Object.entries(regionRisk)) {
      if (routeData.name?.toLowerCase().includes(region.toLowerCase())) {
        regionScore = score;
        break;
      }
    }

    return regionScore;
  }

  private calculateOverallRating(values: EthicalScore['values']): number {
    return (
      (1 - values.environmentalImpact) * this.weights.environmentalImpact +
      (1 - values.laborBurden) * this.weights.laborBurden +
      (1 - values.communityImpact) * this.weights.communityImpact +
      values.fairnessToPartners * this.weights.fairnessToPartners +
      values.humanRights * this.weights.humanRights
    );
  }

  private generateEthicalJustification(values: EthicalScore['values'], overallRating: number): string {
    const level = this.getEthicalLevel(overallRating);
    
    const concerns = [];
    if (values.environmentalImpact > 0.7) concerns.push('high environmental impact');
    if (values.laborBurden > 0.6) concerns.push('concerning labor conditions');
    if (values.communityImpact > 0.5) concerns.push('negative community effects');
    if (values.fairnessToPartners < 0.5) concerns.push('unfair partner treatment');
    if (values.humanRights < 0.6) concerns.push('human rights risks');

    if (concerns.length === 0) {
      return 'This route meets high ethical standards across all dimensions.';
    } else {
      return `Ethical concerns identified: ${concerns.join(', ')}. Consider mitigation strategies.`;
    }
  }

  private getEthicalLevel(rating: number): string {
    if (rating >= this.ethicalThresholds.minimal) return 'EXEMPLARY';
    if (rating >= this.ethicalThresholds.acceptable) return 'ACCEPTABLE';
    if (rating >= this.ethicalThresholds.concerning) return 'CONCERNING';
    return 'UNACCEPTABLE';
  }

  getEngineStatus() {
    return {
      weights: this.weights,
      thresholds: this.ethicalThresholds,
      engineType: 'Ethics Evaluator v1.0',
      status: 'ACTIVE'
    };
  }
}

export const ethicsEvaluator = new EthicsEvaluator();

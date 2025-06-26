
// TOPSIS Multi-Criteria Decision Engine for DeepCAL
// Ranks logistics alternatives using mathematical optimization

export interface TOPSISAlternative {
  id: string;
  name: string;
  criteria: number[]; // normalized values for each criterion
  rawData?: any;
}

export interface TOPSISCriteria {
  name: string;
  weight: number;
  beneficial: boolean; // true = higher is better, false = lower is better
}

export interface TOPSISResult {
  alternative: TOPSISAlternative;
  score: number;
  rank: number;
  distanceToIdeal: number;
  distanceToAntiIdeal: number;
}

export class TOPSISEngine {
  private criteria: TOPSISCriteria[] = [];

  constructor(criteria: TOPSISCriteria[]) {
    this.criteria = criteria;
    this.validateWeights();
  }

  // Core TOPSIS ranking algorithm
  rankAlternatives(alternatives: TOPSISAlternative[]): TOPSISResult[] {
    console.log(`🎯 TOPSIS Engine: Ranking ${alternatives.length} alternatives using ${this.criteria.length} criteria`);

    // Step 1: Normalize decision matrix
    const normalizedMatrix = this.normalizeMatrix(alternatives);
    
    // Step 2: Apply weights
    const weightedMatrix = this.applyWeights(normalizedMatrix);
    
    // Step 3: Determine ideal and anti-ideal solutions
    const { ideal, antiIdeal } = this.findIdealSolutions(weightedMatrix);
    
    // Step 4: Calculate distances and scores
    const results = weightedMatrix.map((alt, index) => {
      const distanceToIdeal = this.calculateEuclideanDistance(alt.criteria, ideal);
      const distanceToAntiIdeal = this.calculateEuclideanDistance(alt.criteria, antiIdeal);
      
      const score = distanceToAntiIdeal / (distanceToIdeal + distanceToAntiIdeal);
      
      return {
        alternative: alternatives[index],
        score,
        rank: 0, // Will be set after sorting
        distanceToIdeal,
        distanceToAntiIdeal
      };
    });

    // Step 5: Sort and assign ranks
    results.sort((a, b) => b.score - a.score);
    results.forEach((result, index) => {
      result.rank = index + 1;
    });

    console.log(`✅ TOPSIS Complete: Best option is ${results[0].alternative.name} (score: ${results[0].score.toFixed(3)})`);
    
    return results;
  }

  private normalizeMatrix(alternatives: TOPSISAlternative[]): TOPSISAlternative[] {
    const numCriteria = this.criteria.length;
    const normalized: TOPSISAlternative[] = JSON.parse(JSON.stringify(alternatives));

    for (let j = 0; j < numCriteria; j++) {
      const columnValues = alternatives.map(alt => alt.criteria[j]);
      const norm = Math.sqrt(columnValues.reduce((sum, val) => sum + val * val, 0));
      
      normalized.forEach(alt => {
        alt.criteria[j] = alt.criteria[j] / norm;
      });
    }

    return normalized;
  }

  private applyWeights(alternatives: TOPSISAlternative[]): TOPSISAlternative[] {
    const weighted: TOPSISAlternative[] = JSON.parse(JSON.stringify(alternatives));
    
    weighted.forEach(alt => {
      alt.criteria = alt.criteria.map((value, index) => value * this.criteria[index].weight);
    });

    return weighted;
  }

  private findIdealSolutions(alternatives: TOPSISAlternative[]): { ideal: number[], antiIdeal: number[] } {
    const numCriteria = this.criteria.length;
    const ideal: number[] = [];
    const antiIdeal: number[] = [];

    for (let j = 0; j < numCriteria; j++) {
      const columnValues = alternatives.map(alt => alt.criteria[j]);
      
      if (this.criteria[j].beneficial) {
        ideal[j] = Math.max(...columnValues);
        antiIdeal[j] = Math.min(...columnValues);
      } else {
        ideal[j] = Math.min(...columnValues);
        antiIdeal[j] = Math.max(...columnValues);
      }
    }

    return { ideal, antiIdeal };
  }

  private calculateEuclideanDistance(point1: number[], point2: number[]): number {
    const sumSquares = point1.reduce((sum, val, index) => {
      return sum + Math.pow(val - point2[index], 2);
    }, 0);
    
    return Math.sqrt(sumSquares);
  }

  private validateWeights(): void {
    const totalWeight = this.criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
    
    if (Math.abs(totalWeight - 1.0) > 0.001) {
      console.warn('⚠️  TOPSIS weights do not sum to 1.0. Normalizing...');
      this.criteria.forEach(criterion => {
        criterion.weight = criterion.weight / totalWeight;
      });
    }
  }

  // Update criteria weights (from neutrosophic engine)
  updateWeights(newWeights: number[]): void {
    if (newWeights.length !== this.criteria.length) {
      throw new Error('Weight array length must match criteria count');
    }
    
    this.criteria.forEach((criterion, index) => {
      criterion.weight = newWeights[index];
    });
    
    this.validateWeights();
    console.log('🔧 TOPSIS weights updated from Neutrosophic Engine');
  }

  getCriteriaInfo() {
    return {
      criteria: this.criteria,
      engineType: 'TOPSIS Multi-Criteria Engine v2.1',
      status: 'ACTIVE'
    };
  }
}

// Default logistics criteria configuration
export const createLogisticsTOPSIS = () => {
  return new TOPSISEngine([
    { name: 'Cost', weight: 0.25, beneficial: false },      // Lower cost is better
    { name: 'Time', weight: 0.30, beneficial: false },      // Lower time is better  
    { name: 'Reliability', weight: 0.25, beneficial: true }, // Higher reliability is better
    { name: 'Risk', weight: 0.20, beneficial: false }       // Lower risk is better
  ]);
};


// Grey System Theory Engine for DeepCAL
// Handles incomplete and uncertain logistics data

export interface GreyValue {
  value?: number;
  uncertainty?: number;
  range?: [number, number];
  confidence?: number;
  type: 'complete' | 'incomplete' | 'uncertain' | 'missing';
}

export interface GreyParameters {
  greyRelationResolution: number; // default: 0.4
  alpha: number;  // linear function parameter
  beta: number;   // linear function parameter  
  lambda: number; // exponential function parameter
  base: number;   // logarithmic function base
  scale: number;  // logarithmic function scale
}

export class GreySystemEngine {
  private parameters: GreyParameters = {
    greyRelationResolution: 0.4,
    alpha: 1.0,
    beta: 0.0,
    lambda: 0.1,
    base: Math.E,
    scale: 1.0
  };

  constructor(customParameters?: Partial<GreyParameters>) {
    if (customParameters) {
      this.parameters = { ...this.parameters, ...customParameters };
    }
  }

  // Core grey whitening function - converts uncertain data to usable scores
  whiten(greyValue: GreyValue): number {
    console.log(`🌫️  Grey System: Processing ${greyValue.type} data`);

    switch (greyValue.type) {
      case 'complete':
        return this.linearWhitening(greyValue.value!);
        
      case 'uncertain':
        return this.exponentialWhitening(greyValue.uncertainty || 0.5);
        
      case 'incomplete':
        return this.processIncompleteData(greyValue);
        
      case 'missing':
        return this.logarithmicWhitening(0.5); // neutral value
        
      default:
        return 0.5; // neutral fallback
    }
  }

  // Apply fusion rule: 0.6*Linear + 0.3*Exponential + 0.1*Logarithmic
  fuseWhitening(greyValue: GreyValue): number {
    const linear = this.linearWhitening(greyValue.value || 0.5);
    const exponential = this.exponentialWhitening(greyValue.uncertainty || 0.5);
    const logarithmic = this.logarithmicWhitening(greyValue.confidence || 0.5);

    const fusedScore = 0.6 * linear + 0.3 * exponential + 0.1 * logarithmic;
    
    console.log(`🔄 Grey Fusion: L(${linear.toFixed(2)}) + E(${exponential.toFixed(2)}) + Log(${logarithmic.toFixed(2)}) = ${fusedScore.toFixed(3)}`);
    
    return Math.max(0, Math.min(1, fusedScore)); // clamp to [0,1]
  }

  // Linear whitening for fixed facts (e.g., capacity = 5)
  private linearWhitening(value: number): number {
    return this.parameters.alpha * value + this.parameters.beta;
  }

  // Exponential whitening for fuzzy rules (e.g., delivery time ≈ 3d)
  private exponentialWhitening(uncertainty: number): number {
    return 1 - Math.exp(-this.parameters.lambda * uncertainty);
  }

  // Logarithmic whitening for saturation behavior (e.g., demand overload)
  private logarithmicWhitening(saturation: number): number {
    return Math.log(saturation * this.parameters.scale + 1) / Math.log(this.parameters.base + 1);
  }

  // Process incomplete data using range information
  private processIncompleteData(greyValue: GreyValue): number {
    if (greyValue.range) {
      const [min, max] = greyValue.range;
      const midpoint = (min + max) / 2;
      const uncertainty = (max - min) / (max + min || 1);
      
      return this.fuseWhitening({
        value: midpoint,
        uncertainty,
        confidence: 1 - uncertainty,
        type: 'uncertain'
      });
    }
    
    return 0.5; // neutral fallback
  }

  // Process matrix of grey values for TOPSIS
  processMatrix(matrix: GreyValue[][]): number[][] {
    console.log(`🔢 Grey System: Processing ${matrix.length}x${matrix[0]?.length || 0} matrix`);
    
    return matrix.map(row => 
      row.map(greyValue => this.fuseWhitening(greyValue))
    );
  }

  // Calculate grey relational coefficient
  calculateGreyRelation(reference: number[], comparison: number[]): number {
    if (reference.length !== comparison.length) {
      throw new Error('Reference and comparison arrays must have same length');
    }

    const differences = reference.map((ref, i) => Math.abs(ref - comparison[i]));
    const minDiff = Math.min(...differences);
    const maxDiff = Math.max(...differences);

    const greyCoefficients = differences.map(diff => {
      return (minDiff + this.parameters.greyRelationResolution * maxDiff) / 
             (diff + this.parameters.greyRelationResolution * maxDiff);
    });

    return greyCoefficients.reduce((sum, coeff) => sum + coeff, 0) / greyCoefficients.length;
  }

  // Update parameters for different contexts
  updateParameters(newParameters: Partial<GreyParameters>): void {
    this.parameters = { ...this.parameters, ...newParameters };
    console.log('🔧 Grey System parameters updated:', this.parameters);
  }

  // Convert logistics data to grey values
  createGreyValue(data: any): GreyValue {
    if (typeof data === 'number' && !isNaN(data)) {
      return { value: data, type: 'complete' };
    }
    
    if (data && typeof data === 'object') {
      if (data.min !== undefined && data.max !== undefined) {
        return {
          range: [data.min, data.max],
          type: 'incomplete',
          uncertainty: (data.max - data.min) / (data.max + data.min || 1)
        };
      }
      
      if (data.estimate !== undefined) {
        return {
          value: data.estimate,
          uncertainty: data.uncertainty || 0.2,
          confidence: data.confidence || 0.8,
          type: 'uncertain'
        };
      }
    }
    
    return { type: 'missing' };
  }

  getEngineStatus() {
    return {
      parameters: this.parameters,
      engineType: 'Grey System Theory Engine v2.1',
      status: 'ACTIVE'
    };
  }
}

export const greySystemEngine = new GreySystemEngine();

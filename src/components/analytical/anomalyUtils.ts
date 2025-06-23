
/**
 * Utilities for detecting anomalies in forwarder KPIs.
 * Here, a value is flagged as anomalous if it is more than 1.5 standard deviations from the mean for its set.
 */

type ForwarderKPI = any; // TODO: replace after @deepcal/core-mcdm migration

type AnomalyField = 'costPerKg' | 'avgTransitDays' | 'onTimeRate';

export interface ForwarderAnomalies {
  [forwarderName: string]: {
    anomalyFields: AnomalyField[];
    reasons: string[]; // e.g. ["High cost", "Long delivery"]
  };
}

export interface PriceChanges {
  [forwarderName: string]: {
    changeType: 'increase' | 'decrease';
    percentage: number;
    reason: string;
  };
}

export function detectForwarderAnomalies(forwarderKPIs: ForwarderKPI[]): ForwarderAnomalies {
  // Compute mean and std for each metric
  const metrics: AnomalyField[] = ['costPerKg', 'avgTransitDays', 'onTimeRate'];
  const stats: Record<AnomalyField, {mean: number, std: number}> = {
    costPerKg: {mean: 0, std: 0},
    avgTransitDays: {mean: 0, std: 0},
    onTimeRate: {mean: 0, std: 0},
  };

  metrics.forEach(metric => {
    const arr = forwarderKPIs.map(fwd => fwd[metric]);
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    const std = Math.sqrt(arr.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / arr.length);
    stats[metric] = {mean, std};
  });

  // Define as an anomaly any value >1.5 std away from mean (high or low depending on metric)
  const anomalies: ForwarderAnomalies = {};

  forwarderKPIs.forEach(fwd => {
    const anomalyFields: AnomalyField[] = [];
    const reasons: string[] = [];

    // High cost
    if (fwd.costPerKg > stats.costPerKg.mean + 1.5 * stats.costPerKg.std) {
      anomalyFields.push('costPerKg');
      reasons.push('Unusually high cost per kg');
    }
    // Very low cost (optional: flag as suspicious)
    if (fwd.costPerKg < stats.costPerKg.mean - 1.5 * stats.costPerKg.std) {
      anomalyFields.push('costPerKg');
      reasons.push('Suspiciously low cost per kg');
    }
    // Long delivery
    if (fwd.avgTransitDays > stats.avgTransitDays.mean + 1.5 * stats.avgTransitDays.std) {
      anomalyFields.push('avgTransitDays');
      reasons.push('Unusually long delivery time');
    }
    if (fwd.avgTransitDays < stats.avgTransitDays.mean - 1.5 * stats.avgTransitDays.std) {
      anomalyFields.push('avgTransitDays');
      reasons.push('Suspiciously fast delivery');
    }
    // Low reliability (risk)
    if (fwd.onTimeRate < stats.onTimeRate.mean - 1.5 * stats.onTimeRate.std) {
      anomalyFields.push('onTimeRate');
      reasons.push('Delivery risk detected (low on-time rate)');
    }

    if (anomalyFields.length > 0) {
      anomalies[fwd.name] = { anomalyFields, reasons };
    }
  });

  return anomalies;
}

export function detectPriceChanges(forwarderKPIs: ForwarderKPI[], ffHistory: any): PriceChanges {
  const priceChanges: PriceChanges = {};
  
  forwarderKPIs.forEach(fwd => {
    const historicalData = ffHistory[fwd.name];
    if (historicalData && historicalData.avgCost) {
      const currentCost = fwd.costPerKg;
      const historicalCost = historicalData.avgCost;
      const changePercentage = ((currentCost - historicalCost) / historicalCost) * 100;
      
      // Flag if price change is more than 10%
      if (Math.abs(changePercentage) > 10) {
        priceChanges[fwd.name] = {
          changeType: changePercentage > 0 ? 'increase' : 'decrease',
          percentage: Math.abs(changePercentage),
          reason: `Price ${changePercentage > 0 ? 'increased' : 'decreased'} by ${Math.abs(changePercentage).toFixed(1)}%`
        };
      }
    }
  });
  
  return priceChanges;
}

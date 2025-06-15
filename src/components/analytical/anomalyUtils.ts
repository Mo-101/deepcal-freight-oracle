
/**
 * Utilities for detecting anomalies in forwarder KPIs.
 * A value is flagged as anomalous if it is more than 1.5 standard deviations from the mean.
 */
import type { ForwarderKPI } from '@/services/csvDataEngine';

export type AnomalyField = 'costPerKg' | 'avgTransitDays' | 'onTimeRate';

export interface ForwarderAnomalies {
  [forwarderName: string]: {
    anomalyFields: AnomalyField[];
    reasons: string[];
  };
}

export function detectForwarderAnomalies(forwarderKPIs: ForwarderKPI[]): ForwarderAnomalies {
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

  const anomalies: ForwarderAnomalies = {};
  forwarderKPIs.forEach(fwd => {
    const anomalyFields: AnomalyField[] = [];
    const reasons: string[] = [];
    // High cost
    if (fwd.costPerKg > stats.costPerKg.mean + 1.5 * stats.costPerKg.std) {
      anomalyFields.push('costPerKg');
      reasons.push('Unusually high cost per kg');
    }
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

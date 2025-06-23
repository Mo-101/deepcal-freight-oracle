import { CalculatorInputs, ShipmentData, ForwarderComparison } from '@/types/shipment';

export const CARGO_TYPE_OPTIONS = [
  'Emergency Health Kits',
  'Pharmaceuticals',
  'Laboratory Equipment',
  'Cold Chain Supplies',
  'PPE',
  'Field Support Material',
  'Biomedical Equipment',
  'Visibility',
  'WASH/IPC',
  'Wellbeing'
];

export const FORWARDER_OPTIONS = [
  'Kuehne + Nagel',
  'DHL Global Forwarding',
  'Siginon Logistics',
  'Scan Global Logistics',
  'Agility Logistics'
];

export const mapCountryName = (country: string): string => {
  if (!country) return '';
  const countryLower = country.toLowerCase().trim();
  
  const countryMappings: Record<string, string> = {
    'kenya': 'Kenya',
    'nairobi': 'Kenya',
    'zambia': 'Zambia',
    'lusaka': 'Zambia',
    'south africa': 'South Africa',
    'johannesburg': 'South Africa',
    'rsa': 'South Africa',
    'nigeria': 'Nigeria',
    'lagos': 'Nigeria',
    'abuja': 'Nigeria',
    'uae': 'UAE',
    'dubai': 'UAE',
    'emirates': 'UAE',
    'china': 'China',
    'shanghai': 'China',
    'beijing': 'China',
    'ethiopia': 'Ethiopia',
    'addis': 'Ethiopia',
    'uganda': 'Uganda',
    'kampala': 'Uganda',
    'tanzania': 'Tanzania',
    'dar es salaam': 'Tanzania',
    'rwanda': 'Rwanda',
    'kigali': 'Rwanda'
  };

  for (const [key, value] of Object.entries(countryMappings)) {
    if (countryLower.includes(key)) {
      return value;
    }
  }
  
  return country;
};

export const mapCargoType = (cargoType: string): string => {
  if (!cargoType) return 'Emergency Health Kits';
  const cargoLower = cargoType.toLowerCase().trim();
  
  const cargoMappings: Record<string, string> = {
    'pharmaceutical': 'Pharmaceuticals',
    'medicine': 'Pharmaceuticals',
    'drug': 'Pharmaceuticals',
    'ampicillin': 'Pharmaceuticals',
    'laboratory': 'Laboratory Equipment',
    'lab': 'Laboratory Equipment',
    'rdt': 'Laboratory Equipment',
    'cold': 'Cold Chain Supplies',
    'chain': 'Cold Chain Supplies',
    'freezer': 'Cold Chain Supplies',
    'vaccine': 'Cold Chain Supplies',
    'ppe': 'PPE',
    'glove': 'PPE',
    'mask': 'PPE',
    'gown': 'PPE',
    'tent': 'Field Support Material',
    'field': 'Field Support Material',
    'biomedical': 'Biomedical Equipment',
    'equipment': 'Biomedical Equipment',
    'vest': 'Visibility',
    'visibility': 'Visibility',
    'wash': 'WASH/IPC',
    'ipc': 'WASH/IPC',
    'wellbeing': 'Wellbeing',
    'trauma': 'Wellbeing'
  };

  for (const [key, value] of Object.entries(cargoMappings)) {
    if (cargoLower.includes(key)) {
      return value;
    }
  }
  
  return 'Emergency Health Kits';
};

export const mapShipmentToInputs = (shipment: ShipmentData): Partial<CalculatorInputs> => {
  return {
    origin: mapCountryName(shipment.origin_country || shipment.origin || ''),
    destination: mapCountryName(shipment.destination_country || shipment.destination || ''),
    weight: Number(shipment.weight_kg || shipment.weight || 0),
    volume: Number(shipment.volume_cbm || shipment.volume || 0),
    cargoType: mapCargoType(
      shipment.item_category || 
      shipment.cargo_description || 
      shipment.cargo_type || 
      shipment.item_description || 
      ''
    ),
  };
};

export const generateForwarderComparison = (shipment: ShipmentData): ForwarderComparison[] => {
  console.log('Generating forwarder comparison for shipment:', shipment.request_reference);
  
  // Extract real forwarder cost data from shipment
  const forwarderData: ForwarderComparison[] = [
    {
      name: 'Kuehne + Nagel',
      costPerKg: shipment.kuehne_nagel || shipment['kuehne+nagel'] || 0,
      avgTransitDays: shipment.frieght_in_time || shipment.transit_days || 0,
      onTimeRate: 0.92, // Historical performance metric
      topsisScore: 0,
      rank: 1,
      normalizedCost: 0,
      normalizedTime: 0,
      normalizedReliability: 0
    },
    {
      name: 'DHL Global Forwarding',
      costPerKg: shipment.dhl_global || shipment.dhl || 0,
      avgTransitDays: (shipment.frieght_in_time || shipment.transit_days || 0),
      onTimeRate: 0.88,
      topsisScore: 0,
      rank: 2,
      normalizedCost: 0,
      normalizedTime: 0,
      normalizedReliability: 0
    },
    {
      name: 'Scan Global Logistics',
      costPerKg: shipment.scan_global_logistics || shipment.scan_global || 0,
      avgTransitDays: (shipment.frieght_in_time || shipment.transit_days || 0),
      onTimeRate: 0.85,
      topsisScore: 0,
      rank: 3,
      normalizedCost: 0,
      normalizedTime: 0,
      normalizedReliability: 0
    },
    {
      name: 'Siginon Logistics',
      costPerKg: shipment.siginon || 0,
      avgTransitDays: (shipment.frieght_in_time || shipment.transit_days || 0),
      onTimeRate: 0.82,
      topsisScore: 0,
      rank: 4,
      normalizedCost: 0,
      normalizedTime: 0,
      normalizedReliability: 0
    },
    {
      name: 'Agility Logistics',
      costPerKg: shipment.agl || shipment.agility || 0,
      avgTransitDays: (shipment.frieght_in_time || shipment.transit_days || 0),
      onTimeRate: 0.80,
      topsisScore: 0,
      rank: 5,
      normalizedCost: 0,
      normalizedTime: 0,
      normalizedReliability: 0
    }
  ];

  // Filter to only include forwarders with actual cost data
  const validForwarders = forwarderData.filter(f => f.costPerKg > 0);
  
  console.log('Valid forwarders with cost data:', validForwarders.length);

  if (validForwarders.length === 0) {
    console.warn('No forwarders with valid cost data found');
    return [];
  }

  // TOPSIS Algorithm Implementation
  // Step 1: Create decision matrix and normalize
  const costs = validForwarders.map(f => f.costPerKg);
  const times = validForwarders.map(f => f.avgTransitDays);
  const reliability = validForwarders.map(f => f.onTimeRate);

  // Calculate normalization denominators (sum of squares)
  const costNorm = Math.sqrt(costs.reduce((sum, val) => sum + val * val, 0));
  const timeNorm = Math.sqrt(times.reduce((sum, val) => sum + val * val, 0));
  const reliabilityNorm = Math.sqrt(reliability.reduce((sum, val) => sum + val * val, 0));

  // Step 2: Normalize and apply weights (equal weighting: 1/3 each)
  const weights = { cost: 1/3, time: 1/3, reliability: 1/3 };

  validForwarders.forEach((forwarder) => {
    // Normalize values
    const normalizedCost = forwarder.costPerKg / costNorm;
    const normalizedTime = forwarder.avgTransitDays / timeNorm;
    const normalizedReliability = forwarder.onTimeRate / reliabilityNorm;

    // Apply weights
    const weightedCost = normalizedCost * weights.cost;
    const weightedTime = normalizedTime * weights.time;
    const weightedReliability = normalizedReliability * weights.reliability;

    // Store weighted normalized values for TOPSIS calculation
    forwarder.normalizedCost = weightedCost;
    forwarder.normalizedTime = weightedTime;
    forwarder.normalizedReliability = weightedReliability;
  });

  // Step 3: Determine Positive Ideal Solution (PIS) and Negative Ideal Solution (NIS)
  const allNormalizedCosts = validForwarders.map(f => f.normalizedCost!);
  const allNormalizedTimes = validForwarders.map(f => f.normalizedTime!);
  const allNormalizedReliability = validForwarders.map(f => f.normalizedReliability!);

  // For cost and time: lower is better (min for PIS, max for NIS)
  // For reliability: higher is better (max for PIS, min for NIS)
  const PIS = {
    cost: Math.min(...allNormalizedCosts),
    time: Math.min(...allNormalizedTimes),
    reliability: Math.max(...allNormalizedReliability)
  };

  const NIS = {
    cost: Math.max(...allNormalizedCosts),
    time: Math.max(...allNormalizedTimes),
    reliability: Math.min(...allNormalizedReliability)
  };

  console.log('PIS:', PIS);
  console.log('NIS:', NIS);

  // Step 4: Calculate distances to PIS and NIS, then TOPSIS score
  validForwarders.forEach((forwarder) => {
    // Distance to PIS
    const distanceToPIS = Math.sqrt(
      Math.pow(forwarder.normalizedCost! - PIS.cost, 2) +
      Math.pow(forwarder.normalizedTime! - PIS.time, 2) +
      Math.pow(forwarder.normalizedReliability! - PIS.reliability, 2)
    );

    // Distance to NIS
    const distanceToNIS = Math.sqrt(
      Math.pow(forwarder.normalizedCost! - NIS.cost, 2) +
      Math.pow(forwarder.normalizedTime! - NIS.time, 2) +
      Math.pow(forwarder.normalizedReliability! - PIS.reliability, 2)
    );

    // TOPSIS Score (Relative Closeness to Ideal Solution)
    forwarder.topsisScore = distanceToNIS / (distanceToPIS + distanceToNIS);

    console.log(`${forwarder.name}: PIS=${distanceToPIS.toFixed(4)}, NIS=${distanceToNIS.toFixed(4)}, TOPSIS=${forwarder.topsisScore.toFixed(4)}`);
  });

  // Step 5: Rank forwarders by TOPSIS score (highest is best)
  validForwarders.sort((a, b) => b.topsisScore - a.topsisScore);
  validForwarders.forEach((forwarder, index) => {
    forwarder.rank = index + 1;
  });

  console.log('Final TOPSIS ranking:', validForwarders.map(f => ({ name: f.name, score: f.topsisScore, rank: f.rank })));

  return validForwarders;
};

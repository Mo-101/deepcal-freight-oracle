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
  const forwarderData = [
    {
      name: 'Kuehne + Nagel',
      costPerKg: shipment.kuehne_nagel || shipment['kuehne+nagel'] || 0,
      avgTransitDays: shipment.frieght_in_time || shipment.transit_days || 0,
      onTimeRate: 0.92,
      topsisScore: 0,
      rank: 1
    },
    {
      name: 'DHL Global Forwarding',
      costPerKg: shipment.dhl_global || shipment.dhl || 0,
      avgTransitDays: (shipment.frieght_in_time || shipment.transit_days || 0) + 1,
      onTimeRate: 0.88,
      topsisScore: 0,
      rank: 2
    },
    {
      name: 'Scan Global Logistics',
      costPerKg: shipment.scan_global_logistics || shipment.scan_global || 0,
      avgTransitDays: (shipment.frieght_in_time || shipment.transit_days || 0) + 0.5,
      onTimeRate: 0.85,
      topsisScore: 0,
      rank: 3
    },
    {
      name: 'Siginon Logistics',
      costPerKg: shipment.siginon || 0,
      avgTransitDays: (shipment.frieght_in_time || shipment.transit_days || 0) + 2,
      onTimeRate: 0.82,
      topsisScore: 0,
      rank: 4
    },
    {
      name: 'Agility Logistics',
      costPerKg: shipment.agl || shipment.agility || 0,
      avgTransitDays: (shipment.frieght_in_time || shipment.transit_days || 0) + 1.5,
      onTimeRate: 0.80,
      topsisScore: 0,
      rank: 5
    }
  ].filter(f => f.costPerKg > 0);

  if (forwarderData.length > 0) {
    const costs = forwarderData.map(f => f.costPerKg);
    const times = forwarderData.map(f => f.avgTransitDays);
    
    const minCost = Math.min(...costs);
    const maxCost = Math.max(...costs);
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    
    forwarderData.forEach((f) => {
      const costScore = maxCost > minCost ? (maxCost - f.costPerKg) / (maxCost - minCost) : 0.5;
      const timeScore = maxTime > minTime ? (maxTime - f.avgTransitDays) / (maxTime - minTime) : 0.5;
      f.topsisScore = (costScore * 0.5 + timeScore * 0.5);
    });

    forwarderData.sort((a, b) => b.topsisScore - a.topsisScore);
    forwarderData.forEach((f, index) => {
      f.rank = index + 1;
    });
  }

  return forwarderData;
};

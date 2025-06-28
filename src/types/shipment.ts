
export interface CalculatorInputs {
  origin: string;
  destination: string;
  weight: number;
  volume: number;
  cargoType: string;
  modeOfShipment: 'Air' | 'Sea' | 'Road' | 'Rail';
  priorities: {
    time: number;
    cost: number;
    risk: number;
  };
  selectedForwarders: string[];
}

export interface ShipmentData {
  request_reference: string;
  origin_country?: string;
  origin?: string;
  destination_country?: string;
  destination?: string;
  weight_kg?: number; // Changed from string to number
  weight?: string;
  volume_cbm?: number; // Changed from string to number
  volume?: string;
  item_category?: string;
  cargo_description?: string;
  cargo_type?: string;
  item_description?: string;
  item_value?: number; // Changed from string to number
  date_of_collection?: string;
  date_of_arrival_destination?: string;
  shipment_date?: string;
  delivery_status?: string;
  mode_of_shipment?: string;
  final_quote_awarded_freight_forwader_carrier?: string;
  final_quote_awarded_freight_forwader_Carrier?: string;
  initial_quote_awarded?: string;
  awarded_forwarder?: string;
  'carrier+cost'?: number; // Changed from string to number
  kuehne_nagel?: number;
  'kuehne+nagel'?: number;
  dhl_global?: number;
  dhl?: number;
  scan_global_logistics?: number;
  scan_global?: number;
  siginon?: number;
  agl?: number;
  agility?: number;
  frieght_in_time?: number;
  transit_days?: number;
}

export interface ForwarderComparison {
  name: string;
  costPerKg: number;
  avgTransitDays: number;
  onTimeRate: number;
  topsisScore: number;
  rank: number;
  // TOPSIS calculation fields - now properly defined as optional since they're assigned during calculation
  normalizedCost?: number;
  normalizedTime?: number;
  normalizedReliability?: number;
}

export interface OracleResults {
  bestForwarder: string;
  routeScore: string;
  forwarderComparison: ForwarderComparison[];
  recommendation: string;
  oracleNarrative: string;
  methodology: string;
  seal: string;
  qseal: string;
  timestamp: string;
  blessing: string;
}

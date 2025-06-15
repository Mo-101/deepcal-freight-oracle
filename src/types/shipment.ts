
export interface CalculatorInputs {
  origin: string;
  destination: string;
  weight: number;
  volume: number;
  cargoType: string;
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
  weight_kg?: number;
  weight?: number;
  volume_cbm?: number;
  volume?: number;
  item_category?: string;
  cargo_description?: string;
  cargo_type?: string;
  item_description?: string;
  date_of_collection?: string;
  shipment_date?: string;
  delivery_status?: string;
  final_quote_awarded_freight_forwader_carrier?: string;
  initial_quote_awarded?: string;
  awarded_forwarder?: string;
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

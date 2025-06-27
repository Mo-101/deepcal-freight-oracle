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
  weight_kg?: number;
  weight?: number;
  volume_cbm?: number;
  volume?: number;
  item_category?: string;
  cargo_description?: string;
  cargo_type?: string;
  item_description?: string;
  date_of_collection?: string;
  date_of_arrival_destination?: string;
  pickup_date?: string;
  delivery_date?: string;
  shipment_date?: string;
  delivery_status?: string;
  mode_of_shipment?: string;
  final_quote_awarded_freight_forwader_carrier?: string;
  initial_quote_awarded?: string;
  awarded_forwarder?: string;
  carrier?: string;
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
  'carrier+cost'?: number | string;
  carrier_cost?: number | string;
  'emergency grade'?: string;
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

// Enhanced freight intelligence types
export interface RealTimeFreightData {
  forwarders: EnhancedForwarderProfile[];
  routes: RouteIntelligence[];
  market: MarketContext;
  corridors: CorridorStatus[];
}

export interface EnhancedForwarderProfile extends ForwarderComparison {
  realTimeCapacity: number;
  currentPricing: PricingStructure;
  performanceMetrics: PerformanceMetrics;
  specializations: string[];
  certifications: string[];
  coverageAreas: string[];
}

export interface RouteIntelligence {
  id: string;
  origin: string;
  destination: string;
  mode: 'Air' | 'Sea' | 'Land' | 'Rail';
  corridor: string;
  distanceKm: number;
  estimatedTransitDays: number;
  riskFactors: RiskAssessment;
  environmentalImpact: EnvironmentalMetrics;
  currentStatus: 'open' | 'congested' | 'disrupted' | 'closed';
  symbolicScore: number;
  confidence: number;
}

export interface PricingStructure {
  baseRate: number;
  fuelSurcharge: number;
  securityFee: number;
  handlingFee: number;
  documentationFee: number;
  totalRate: number;
  currency: string;
  validUntil: string;
}

export interface PerformanceMetrics {
  onTimeDelivery: number;
  damageRate: number;
  lostShipmentRate: number;
  customerSatisfaction: number;
  responseTime: number;
  lastUpdated: string;
}

export interface RiskAssessment {
    weatherRisk: number;
    politicalRisk: number;
    infrastructureRisk: number;
    securityRisk: number;
    overallRisk: number;
}

export interface EnvironmentalMetrics {
  co2EmissionPerKm: number;
  fuelEfficiency: number;
  carbonOffset: boolean;
  sustainabilityRating: string;
}

export interface MarketContext {
  fuelPrices: Record<string, number>;
  exchangeRates: Record<string, number>;
  portCongestion: Record<string, number>;
  seasonalFactors: Record<string, number>;
  demandSupplyRatio: number;
  lastUpdated: string;
}

export interface CorridorStatus {
  id: string;
  name: string;
  status: 'optimal' | 'congested' | 'disrupted' | 'closed';
  delayFactor: number;
  costMultiplier: number;
  alternativeRoutes: string[];
  expectedResolution?: string;
}

export interface SymbolicDecision {
  selectedMode: string;
  selectedForwarder: string;
  confidence: number;
  symbolicReasons: string[];
  ethicalScore: number;
  neutrosophicTruth: number;
  riskLevel: number;
  costEfficiency: number;
  timeEfficiency: number;
  environmentalScore: number;
}

// Enhanced oracle results with freight intelligence
export interface EnhancedOracleResults extends OracleResults {
  freightIntelligence: {
    modalAnalysis: RouteIntelligence[];
    forwarderComparison: EnhancedForwarderProfile[];
    marketContext: MarketContext;
    symbolicDecision: SymbolicDecision;
    realTimeFactors: string[];
    confidenceBreakdown: Record<string, number>;
  };
}

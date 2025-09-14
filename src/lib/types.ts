// Canonical types matching deeptrack_corex1.csv exactly
export type EmergencyGrade = "Grade 1" | "Grade 2" | "Grade 3" | "Grade 4" | string;

export interface ForwarderQuotes {
  kuehne_nagel?: number;
  scan_global_logistics?: number;
  dhl_express?: number;
  dhl_global?: number;
  bwosi?: number;
  agl?: number;
  siginon?: number;
  freight_in_time?: number;
}

export interface CanonicalRecord {
  request_date_from_destination_country?: string; // e.g. 01/08/2024 17:00
  request_reference: string;
  item_description?: string;
  item_category?: string;
  origin_country?: string;
  origin_latitude?: number | string;
  origin_longitude?: number | string;
  destination_country?: string;
  destination_latitude?: number | string;
  destination_longitude?: number | string;
  carrier?: string; // awarded carrier textual
  carrier_cost?: number | string;
  weight_kg?: number | string;
  volume_cbm?: number | string;
  emergency_grade?: EmergencyGrade;
  initial_quote_awarded?: number | string;
  final_quote_awarded?: number | string;
  comments?: string;
  date_of_arrival_destination?: string;
  delivery_status?: string;
  mode_of_shipment?: string; // air/sea/road/rail
  greenlight_date?: string;
  date_of_collection?: string;
  // dynamic forwarder quotes columns
  quotes?: ForwarderQuotes;
}

export interface Criteria {
  name: string;
  type: "benefit" | "cost";
}

export interface Alternative {
  id: string;            // forwarder key (e.g., "kuehne_nagel")
  label: string;         // human label (e.g., "Kuehne + Nagel")
  metrics: number[];     // aligned to criteria order
}

export interface DecisionInput {
  criteria: Criteria[];
  judgments: { i: number; j: number; T: number; I: number; F: number; }[];
  alternatives: Alternative[];
}

export interface DecisionResult {
  weights: number[];
  cr: number;
  ranking: { id: string; closeness: number; label?: string }[];
}

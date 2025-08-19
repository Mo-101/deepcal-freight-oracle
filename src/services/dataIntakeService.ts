import type { CanonicalRecord, ForwarderQuotes } from "@/lib/types";

// Forwarder columns discovered in canonical CSV
export const FORWARDER_COLUMNS = [
  "kuehne_nagel",
  "scan_global_logistics",
  "dhl_express",
  "dhl_global",
  "bwosi",
  "agl",
  "siginon",
  "freight_in_time",
] as const;
export type ForwarderKey = typeof FORWARDER_COLUMNS[number];

// Optional pretty labels for UI
export const FORWARDER_LABELS: Record<ForwarderKey, string> = {
  kuehne_nagel: "Kuehne + Nagel",
  scan_global_logistics: "Scan Global Logistics",
  dhl_express: "DHL Express",
  dhl_global: "DHL Global",
  bwosi: "Bwosi",
  agl: "AGL",
  siginon: "Siginon",
  freight_in_time: "Freight In Time",
};

// Parse numeric from string safely
const num = (v: any): number | undefined => {
  if (v === null || v === undefined || v === "") return undefined;
  const x = typeof v === "number" ? v : Number(String(v).replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(x) ? x : undefined;
};

// Transform one raw CSV row (already JSON‑parsed) into CanonicalRecord
export function normalizeRow(raw: Record<string, any>): CanonicalRecord {
  const quotes: ForwarderQuotes = {};
  FORWARDER_COLUMNS.forEach(k => {
    const val = num(raw[k]);
    if (val !== undefined) (quotes as any)[k] = val;
  });

  return {
    request_date_from_destination_country: raw["request_date_from_destination_country"],
    request_reference: String(raw["request_reference"] ?? ""),
    item_description: raw["item_description"],
    item_category: raw["item_category"],
    origin_country: raw["origin_country"],
    origin_latitude: num(raw["origin_latitude"]) ?? raw["origin_latitude"],
    origin_longitude: num(raw["origin_longitude"]) ?? raw["origin_longitude"],
    destination_country: raw["destination_country"],
    destination_latitude: num(raw["destination_latitude"]) ?? raw["destination_latitude"],
    destination_longitude: num(raw["destination_longitude"]) ?? raw["destination_longitude"],
    carrier: raw["carrier"],
    carrier_cost: num(raw["carrier_cost"]) ?? raw["carrier_cost"],
    weight_kg: num(raw["weight_kg"]) ?? raw["weight_kg"],
    volume_cbm: num(raw["volume_cbm"]) ?? raw["volume_cbm"],
    emergency_grade: raw["emergency_grade"] ?? raw["emergency grade"],
    initial_quote_awarded: num(raw["initial_quote_awarded"]) ?? raw["initial_quote_awarded"],
    final_quote_awarded: num(raw["final_quote_awarded"]) ?? raw["final_quote_awarded"],
    comments: raw["comments"],
    date_of_arrival_destination: raw["date_of_arrival_destination"],
    delivery_status: raw["delivery_status"],
    mode_of_shipment: raw["mode_of_shipment"],
    greenlight_date: raw["greenlight_date"],
    date_of_collection: raw["date_of_collection"],
    quotes,
  };
}
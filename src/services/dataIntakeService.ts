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
const num = (v: unknown): number | undefined => {
  if (v === null || v === undefined || v === "") return undefined;
  const x = typeof v === "number" ? v : Number(String(v).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(x) ? x : undefined;
};

// Transform one raw CSV row (already JSON‑parsed) into CanonicalRecord
export function normalizeRow(raw: Record<string, unknown>): CanonicalRecord {
  const quotes: ForwarderQuotes = {};
  FORWARDER_COLUMNS.forEach((k) => {
    const val = num(raw[k]);
    if (val !== undefined) {
      quotes[k] = val;
    }
  });

  return {
    request_date_from_destination_country: raw["request_date_from_destination_country"] as string | undefined,
    request_reference: String(raw["request_reference"] ?? ""),
    item_description: raw["item_description"] as string | undefined,
    item_category: raw["item_category"] as string | undefined,
    origin_country: raw["origin_country"] as string | undefined,
    origin_latitude: num(raw["origin_latitude"]) ?? (raw["origin_latitude"] as string | undefined),
    origin_longitude: num(raw["origin_longitude"]) ?? (raw["origin_longitude"] as string | undefined),
    destination_country: raw["destination_country"] as string | undefined,
    destination_latitude: num(raw["destination_latitude"]) ?? (raw["destination_latitude"] as string | undefined),
    destination_longitude: num(raw["destination_longitude"]) ?? (raw["destination_longitude"] as string | undefined),
    carrier: raw["carrier"] as string | undefined,
    carrier_cost: num(raw["carrier_cost"]) ?? (raw["carrier_cost"] as string | undefined),
    weight_kg: num(raw["weight_kg"]) ?? (raw["weight_kg"] as string | undefined),
    volume_cbm: num(raw["volume_cbm"]) ?? (raw["volume_cbm"] as string | undefined),
    emergency_grade: (raw["emergency_grade"] ?? raw["emergency grade"]) as string | undefined,
    initial_quote_awarded: num(raw["initial_quote_awarded"]) ?? (raw["initial_quote_awarded"] as string | undefined),
    final_quote_awarded: num(raw["final_quote_awarded"]) ?? (raw["final_quote_awarded"] as string | undefined),
    comments: raw["comments"] as string | undefined,
    date_of_arrival_destination: raw["date_of_arrival_destination"] as string | undefined,
    delivery_status: raw["delivery_status"] as string | undefined,
    mode_of_shipment: raw["mode_of_shipment"] as string | undefined,
    greenlight_date: raw["greenlight_date"] as string | undefined,
    date_of_collection: raw["date_of_collection"] as string | undefined,
    quotes,
  };
}

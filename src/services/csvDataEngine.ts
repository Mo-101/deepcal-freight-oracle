// CSV Data Loader Engine – loads, parses, and persists shipment records to IndexedDB (no calculations)
import { humorToast } from "@/components/HumorToast";
import { set, get, del } from "idb-keyval";

export interface ShipmentRecord {
  request_reference: string;
  date_of_collection: string;
  cargo_description: string;
  item_category: string;
  origin_country: string;
  origin_latitude: number;
  origin_longitude: number;
  destination_country: string;
  destination_latitude: number;
  destination_longitude: number;
  carrier: string;
  freight_carrier_cost: number;
  kuehne_nagel: number;
  scan_global_logistics: number;
  dhl_express: number;
  dhl_global: number;
  bwosi: number;
  agl: number;
  siginon: number;
  frieght_in_time: number;
  weight_kg: number;
  volume_cbm: number;
  initial_quote_awarded: string;
  final_quote_awarded_freight_forwader_carrier: string;
  comments: string;
  date_of_arrival_destination: string;
  delivery_status: string;
  mode_of_shipment: string;
}

export interface LineageMeta {
  file: string;
  sha256: string;
  records: number;
  timestamp: string;
  source: 'uploaded' | 'embedded' | 'sample';
}

// IndexedDB key for base shipments
const SHIPMENT_BASE_KEY = "shipments_base_v1";

export interface FreightCalculatorResult {
  lineageMeta: {
    records: number;
    sha256: string;
    timestamp: string;
    source: string;
  };
  forwarderComparison: any[];
  rulesFired: string[];
  recommendation?: string;
  routeScore?: number;
}

class CSVDataLoader {
  private lineageMeta: LineageMeta | null = null;

  // **Loader only, no calculations.**
  async autoLoadEmbeddedData(): Promise<void> {
    const hasBase = await get(SHIPMENT_BASE_KEY);
    if (hasBase && Array.isArray(hasBase.rows) && hasBase.rows.length > 0) {
      this.lineageMeta = hasBase.meta;
      return;
    }

    try {
      console.log("🔄 Auto-loading embedded dataset...");
      const response = await fetch('/embedded_shipments.csv');
      if (!response.ok) {
        throw new Error(`Failed to load embedded data: ${response.status}`);
      }
      const csvText = await response.text();
      await this.loadCSVData(csvText, 'embedded');
    } catch (error) {
      console.error("❌ Failed to auto-load embedded data:", error);
      throw new Error("Embedded dataset not available - system locked.");
    }
  }

  async loadCSVData(csvText: string, source: 'uploaded' | 'embedded' | 'sample' = 'uploaded'): Promise<void> {
    console.log("🔄 Loading CSV data into DeepCAL loader (IndexedDB) ...");

    const dataHash = await this.generateDataHash(csvText);
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split('\t');

    const rows: ShipmentRecord[] = lines.slice(1).map(line => {
      const values = line.split('\t');
      const record: any = {};
      headers.forEach((header, index) => {
        const value = values[index]?.trim() || '';
        record[this.normalizeHeader(header)] = this.parseValue(header, value);
      });
      return record as ShipmentRecord;
    }).filter(record => record.request_reference && record.origin_country);

    this.lineageMeta = {
      file: source === 'embedded' ? 'embedded_shipments.csv' : 'uploaded_data.csv',
      sha256: dataHash,
      records: rows.length,
      timestamp: new Date().toISOString(),
      source
    };

    await set(SHIPMENT_BASE_KEY, { rows, meta: this.lineageMeta });

    const sourceEmoji = source === 'embedded' ? '📦' : source === 'uploaded' ? '📤' : '🧪';
    humorToast(
      `${sourceEmoji} Loader: Data Persisted`, 
      `Saved ${rows.length} shipment records to local IndexedDB. Hash: ${dataHash.substring(0, 8)}...`,
      3000
    );
    console.log(`✅ Loader: ${rows.length} shipment records persisted (${source})`);
  }

  async clearShipments(): Promise<void> {
    await del(SHIPMENT_BASE_KEY);
    this.lineageMeta = null;
  }

  getLineageMeta(): LineageMeta | null {
    return this.lineageMeta;
  }

  private normalizeHeader(header: string): string {
    return header.toLowerCase()
      .replace(/\+/g, '_')
      .replace(/[^a-z0-9_]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  }

  private parseValue(header: string, value: string): any {
    if (!value || value === '0' || value === '') return 0;
    if (
      header.includes('cost') || header.includes('weight') || header.includes('volume') || 
      header.includes('latitude') || header.includes('longitude') ||
      ['kuehne_nagel', 'scan_global_logistics', 'dhl_express', 'dhl_global', 'bwosi', 'agl', 'siginon', 'frieght_in_time'].includes(header)) {
      const numValue = parseFloat(value.replace(/[,$]/g, ''));
      return isNaN(numValue) ? 0 : numValue;
    }
    return value;
  }

  private async generateDataHash(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // ADD THESE loader utility methods (so TS sees them!)
  async isDataLoaded(): Promise<boolean> {
    const dbPayload = await get(SHIPMENT_BASE_KEY);
    return !!(dbPayload && Array.isArray(dbPayload.rows) && dbPayload.rows.length > 0);
  }

  async listShipments(): Promise<ShipmentRecord[]> {
    const dbPayload = await get(SHIPMENT_BASE_KEY);
    return dbPayload && Array.isArray(dbPayload.rows) ? dbPayload.rows : [];
  }
}

export const csvDataEngine = new CSVDataLoader();

import type { ChangeEvent } from "react";
import type { CanonicalRecord } from "@/lib/types";
import { FORWARDER_COLUMNS, FORWARDER_LABELS, ForwarderKey } from "@/services/dataIntakeService";

interface Props {
  value: CanonicalRecord;
  onChange: (patch: Partial<CanonicalRecord>) => void;
}

export default function InputPanel({ value, onChange }: Props) {
  const forwarderKeys = FORWARDER_COLUMNS;

  const onField = (k: keyof CanonicalRecord) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const v = e.target.type === "number" ? (e.target as HTMLInputElement).valueAsNumber : e.target.value;
    onChange({ [k]: v });
  };

  const onQuote = (k: ForwarderKey) => (e: ChangeEvent<HTMLInputElement>) => {
    const v = (e.target as HTMLInputElement).valueAsNumber;
    onChange({ quotes: { ...(value.quotes || {}), [k]: Number.isFinite(v) ? v : undefined } });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Core canonical fields */}
      <div>
        <label className="block text-sm">Request Reference</label>
        <input className="w-full border p-2 rounded" value={value.request_reference || ""} onChange={onField("request_reference")} />
      </div>
      <div>
        <label className="block text-sm">Item Description</label>
        <input className="w-full border p-2 rounded" value={value.item_description || ""} onChange={onField("item_description")} />
      </div>
      <div>
        <label className="block text-sm">Item Category</label>
        <input className="w-full border p-2 rounded" value={value.item_category || ""} onChange={onField("item_category")} />
      </div>

      <div>
        <label className="block text-sm">Origin Country</label>
        <input className="w-full border p-2 rounded" value={value.origin_country || ""} onChange={onField("origin_country")} />
      </div>
      <div>
        <label className="block text-sm">Destination Country</label>
        <input className="w-full border p-2 rounded" value={value.destination_country || ""} onChange={onField("destination_country")} />
      </div>
      <div>
        <label className="block text-sm">Mode of Shipment</label>
        <select className="w-full border p-2 rounded" value={value.mode_of_shipment || ""} onChange={onField("mode_of_shipment")}>
          <option value="">Select…</option>
          <option value="air">Air</option>
          <option value="sea">Sea</option>
          <option value="road">Road</option>
          <option value="rail">Rail</option>
        </select>
      </div>

      <div>
        <label className="block text-sm">Weight (kg)</label>
        <input type="number" className="w-full border p-2 rounded" value={(value.weight_kg as number) ?? 0} onChange={onField("weight_kg")} />
      </div>
      <div>
        <label className="block text-sm">Volume (cbm)</label>
        <input type="number" className="w-full border p-2 rounded" value={(value.volume_cbm as number) ?? 0} onChange={onField("volume_cbm")} />
      </div>
      <div>
        <label className="block text-sm">Emergency Grade</label>
        <input className="w-full border p-2 rounded" value={(value.emergency_grade as string) || ""} onChange={onField("emergency_grade")} />
      </div>

      {/* Dates */}
      <div>
        <label className="block text-sm">Cargo Ready (greenlight_date)</label>
        <input type="date" className="w-full border p-2 rounded" value={value.greenlight_date || ""} onChange={onField("greenlight_date")} />
      </div>
      <div>
        <label className="block text-sm">Collection Date</label>
        <input type="date" className="w-full border p-2 rounded" value={value.date_of_collection || ""} onChange={onField("date_of_collection")} />
      </div>
      <div>
        <label className="block text-sm">Required Delivery (dest arrival)</label>
        <input type="date" className="w-full border p-2 rounded" value={value.date_of_arrival_destination || ""} onChange={onField("date_of_arrival_destination")} />
      </div>

      {/* Forwarder quote slots (dynamic, complete) */}
      <div className="md:col-span-3">
        <h4 className="font-semibold mb-2">Forwarder Quotes (match canonical columns)</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {forwarderKeys.map((k) => (
            <div key={k} className="border rounded p-2">
              <label className="block text-xs text-gray-600">{FORWARDER_LABELS[k]} <span className="text-[10px] text-gray-400">({k})</span></label>
              <input type="number" step="0.01" className="w-full border p-2 rounded"
                     value={value.quotes?.[k] ?? ""} onChange={onQuote(k)} placeholder="Enter quote (USD)"/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


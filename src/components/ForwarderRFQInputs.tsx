
import React from "react";
import { Input } from "@/components/ui/input";

export interface ForwarderRFQData {
  rate: number | "";
  days: number | "";
  comments: string;
}

interface ForwarderRFQInputsProps {
  selectedForwarders: string[];
  rfqData: Record<string, ForwarderRFQData>;
  onChange: (forwarder: string, data: ForwarderRFQData) => void;
}

const ForwarderRFQInputs: React.FC<ForwarderRFQInputsProps> = ({
  selectedForwarders,
  rfqData,
  onChange
}) => {
  return (
    <div className="space-y-4 mt-3">
      {selectedForwarders.length === 0 && (
        <div className="text-xs text-slate-400">Select at least one forwarder to enter RFQ details.</div>
      )}
      {selectedForwarders.map((forwarder) => (
        <div
          key={forwarder}
          className="border rounded-lg p-4 mb-2 bg-slate-800 border-slate-700"
        >
          <div className="font-semibold text-sm mb-3">{forwarder}</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
            <div>
              <label className="block text-xs mb-1">Total Rate (USD)</label>
              <Input
                type="number"
                min="0"
                value={rfqData[forwarder]?.rate ?? ""}
                placeholder="e.g. 520.00"
                onChange={(e) =>
                  onChange(forwarder, {
                    ...rfqData[forwarder],
                    rate: e.target.value === "" ? "" : parseFloat(e.target.value)
                  })
                }
                className="bg-slate-900 border-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Delivery Days</label>
              <Input
                type="number"
                min="1"
                value={rfqData[forwarder]?.days ?? ""}
                placeholder="e.g. 7"
                onChange={(e) =>
                  onChange(forwarder, {
                    ...rfqData[forwarder],
                    days: e.target.value === "" ? "" : parseInt(e.target.value)
                  })
                }
                className="bg-slate-900 border-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Comments</label>
              <Input
                type="text"
                value={rfqData[forwarder]?.comments ?? ""}
                placeholder="Special remarks"
                onChange={(e) =>
                  onChange(forwarder, {
                    ...rfqData[forwarder],
                    comments: e.target.value
                  })
                }
                className="bg-slate-900 border-slate-700"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ForwarderRFQInputs;


import React from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from '@/components/ui/select';

interface ShipmentRecord {
  request_reference: string;
  origin_country?: string;
  destination_country?: string;
}

interface ReferenceShipmentSelectorProps {
  selectedReference: string | null;
  oldShipments: ShipmentRecord[];
  refreshingData: boolean;
  dataStale: boolean;
  onReferenceChange: (value: string) => void;
  onRefresh: () => void;
}

const ReferenceShipmentSelector: React.FC<ReferenceShipmentSelectorProps> = ({
  selectedReference,
  oldShipments,
  refreshingData,
  dataStale,
  onReferenceChange,
  onRefresh
}) => {
  const handleSelectionChange = (value: string) => {
    if (value !== "__no_shipments__") {
      onReferenceChange(value);
    }
  };

  return (
    <Card className="mb-8 p-4 flex flex-col gap-2 bg-white/20 border border-deepcal-light rounded-xl shadow transition">
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="font-semibold text-purple-300">
          Reference Shipment:
        </div>
        <Select
          value={selectedReference || ""}
          onValueChange={handleSelectionChange}
          disabled={oldShipments.length === 0}
        >
          <SelectTrigger className="w-80 min-w-[240px] bg-slate-800/80 border-slate-600 text-slate-200">
            <SelectValue placeholder="Select Shipment" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600">
            {oldShipments.length > 0 ?
              oldShipments.map(sh => (
                <SelectItem 
                  value={sh.request_reference}
                  key={sh.request_reference}
                  className="text-slate-200 hover:bg-slate-700 py-2"
                >
                  <span className="font-mono text-purple-400">{sh.request_reference}</span>
                  <span className="ml-2 text-slate-400">{sh.origin_country || "?"}→{sh.destination_country || "?"}</span>
                </SelectItem>
              )) : (
                <SelectItem value="__no_shipments__" disabled className="text-slate-500">
                  No shipments available
                </SelectItem>
              )
            }
          </SelectContent>
        </Select>
        {!dataStale && (
          <button
            onClick={onRefresh}
            disabled={refreshingData}
            className="px-3 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded border border-slate-600 transition-colors disabled:opacity-50"
            title="Force refresh data from CSV"
          >
            {refreshingData ? '⟳' : '↻'} Refresh
          </button>
        )}
      </div>
    </Card>
  );
};

export default ReferenceShipmentSelector;

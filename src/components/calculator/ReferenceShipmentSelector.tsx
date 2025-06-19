
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from '@/components/ui/select';
import { Package } from 'lucide-react';

interface ShipmentRecord {
  request_reference: string;
  origin_country?: string;
  destination_country?: string;
  item_category?: string;
}

interface ReferenceShipmentSelectorProps {
  selectedReference: string | null;
  oldShipments: ShipmentRecord[];
  onReferenceChange: (value: string) => void;
  onClear: () => void;
}

export const ReferenceShipmentSelector: React.FC<ReferenceShipmentSelectorProps> = ({
  selectedReference,
  oldShipments,
  onReferenceChange,
  onClear
}) => {
  return (
    <Card className="glass-card border-2 border-white/30 bg-white/10 shadow-lg mb-6">
      <CardHeader className="flex flex-row items-center gap-3 pb-1">
        <Package className="w-6 h-6 text-accent" />
        <CardTitle className="text-lg font-semibold tracking-tight text-white">
          Select an Existing Shipment (Reference)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          <div className="w-full md:w-96">
            <Label htmlFor="old-shipment-select" className="block text-sm font-bold mb-2 text-white">
              Load by Request Reference
            </Label>
            <Select
              value={selectedReference || ""}
              onValueChange={onReferenceChange}
              disabled={oldShipments.length === 0}
            >
              <SelectTrigger
                id="old-shipment-select"
                className="border-2 border-accent/50 rounded-lg px-4 py-2 text-base font-medium bg-white/20 text-white focus:ring-accent shadow transition-all"
              >
                <SelectValue placeholder="Select previous shipment..." />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 shadow-2xl border border-accent/40 z-50">
                {oldShipments.length > 0 ? (
                  oldShipments.map((s) => (
                    <SelectItem
                      value={s.request_reference}
                      key={s.request_reference}
                      className="hover:bg-accent/10 text-white font-normal"
                    >
                      <span className="font-mono font-medium text-primary">{s.request_reference}</span>
                      <span className="ml-2 text-gray-300">
                        {s.origin_country} → {s.destination_country} <span className="text-xs text-gray-400">({s.item_category})</span>
                      </span>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="__no_shipments__" disabled>
                    <span className="italic text-gray-400">No shipments available</span>
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          {selectedReference && (
            <Button onClick={onClear} variant="outline" className="border-primary text-white px-3">
              Clear Selection
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

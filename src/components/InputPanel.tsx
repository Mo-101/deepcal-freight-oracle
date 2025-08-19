import { useMemo } from "react";
import type { CanonicalRecord } from "@/lib/types";
import { FORWARDER_COLUMNS, FORWARDER_LABELS } from "@/services/dataIntakeService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  value: CanonicalRecord;
  onChange: (patch: Partial<CanonicalRecord>) => void;
}

export default function InputPanel({ value, onChange }: Props) {
  const forwarderKeys = FORWARDER_COLUMNS;

  const onField = (k: keyof CanonicalRecord) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const v: any = e.target.type === "number" ? (e.target as HTMLInputElement).valueAsNumber : e.target.value;
    onChange({ [k]: v });
  };

  const onSelectField = (k: keyof CanonicalRecord) => (value: string) => {
    onChange({ [k]: value });
  };

  const onQuote = (k: (typeof FORWARDER_COLUMNS)[number]) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = (e.target as HTMLInputElement).valueAsNumber;
    onChange({ quotes: { ...(value.quotes || {}), [k]: Number.isFinite(v) ? v : undefined } });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Shipment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="request_reference">Request Reference</Label>
              <Input 
                id="request_reference"
                value={value.request_reference || ""} 
                onChange={onField("request_reference")} 
                placeholder="REQ-2024-001"
              />
            </div>
            <div>
              <Label htmlFor="item_description">Item Description</Label>
              <Input 
                id="item_description"
                value={value.item_description || ""} 
                onChange={onField("item_description")} 
                placeholder="Emergency medical supplies"
              />
            </div>
            <div>
              <Label htmlFor="item_category">Item Category</Label>
              <Input 
                id="item_category"
                value={value.item_category || ""} 
                onChange={onField("item_category")} 
                placeholder="Healthcare"
              />
            </div>

            <div>
              <Label htmlFor="origin_country">Origin Country</Label>
              <Input 
                id="origin_country"
                value={value.origin_country || ""} 
                onChange={onField("origin_country")} 
                placeholder="United States"
              />
            </div>
            <div>
              <Label htmlFor="destination_country">Destination Country</Label>
              <Input 
                id="destination_country"
                value={value.destination_country || ""} 
                onChange={onField("destination_country")} 
                placeholder="Kenya"
              />
            </div>
            <div>
              <Label htmlFor="mode_of_shipment">Mode of Shipment</Label>
              <Select value={value.mode_of_shipment || ""} onValueChange={onSelectField("mode_of_shipment")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mode..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="air">Air</SelectItem>
                  <SelectItem value="sea">Sea</SelectItem>
                  <SelectItem value="road">Road</SelectItem>
                  <SelectItem value="rail">Rail</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="weight_kg">Weight (kg)</Label>
              <Input 
                id="weight_kg"
                type="number" 
                value={(value.weight_kg as number) ?? ""} 
                onChange={onField("weight_kg")} 
                placeholder="1000"
              />
            </div>
            <div>
              <Label htmlFor="volume_cbm">Volume (cbm)</Label>
              <Input 
                id="volume_cbm"
                type="number" 
                step="0.01"
                value={(value.volume_cbm as number) ?? ""} 
                onChange={onField("volume_cbm")} 
                placeholder="2.5"
              />
            </div>
            <div>
              <Label htmlFor="emergency_grade">Emergency Grade</Label>
              <Select value={(value.emergency_grade as string) || ""} onValueChange={onSelectField("emergency_grade")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Grade 1">Grade 1</SelectItem>
                  <SelectItem value="Grade 2">Grade 2</SelectItem>
                  <SelectItem value="Grade 3">Grade 3</SelectItem>
                  <SelectItem value="Grade 4">Grade 4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="greenlight_date">Cargo Ready Date</Label>
              <Input 
                id="greenlight_date"
                type="date" 
                value={value.greenlight_date || ""} 
                onChange={onField("greenlight_date")} 
              />
            </div>
            <div>
              <Label htmlFor="date_of_collection">Collection Date</Label>
              <Input 
                id="date_of_collection"
                type="date" 
                value={value.date_of_collection || ""} 
                onChange={onField("date_of_collection")} 
              />
            </div>
            <div>
              <Label htmlFor="date_of_arrival_destination">Required Delivery Date</Label>
              <Input 
                id="date_of_arrival_destination"
                type="date" 
                value={value.date_of_arrival_destination || ""} 
                onChange={onField("date_of_arrival_destination")} 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Forwarder Quotes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {forwarderKeys.map((k) => (
              <div key={k} className="space-y-2">
                <Label htmlFor={k} className="text-sm font-medium">
                  {FORWARDER_LABELS[k]}
                  <span className="text-xs text-muted-foreground ml-1">({k})</span>
                </Label>
                <Input 
                  id={k}
                  type="number" 
                  step="0.01" 
                  value={value.quotes?.[k] ?? ""} 
                  onChange={onQuote(k)} 
                  placeholder="Enter quote (USD)"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="comments">Comments</Label>
              <Textarea 
                id="comments"
                value={value.comments || ""} 
                onChange={onField("comments")} 
                placeholder="Additional notes or special requirements..."
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
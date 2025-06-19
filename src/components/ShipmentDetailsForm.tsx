
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';

interface CalculatorInputs {
  origin: string;
  destination: string;
  weight: number;
  volume: number;
  urgency: 'medium' | 'high';
  cargoType: string;
}

interface ShipmentDetailsFormProps {
  inputs: CalculatorInputs;
  setInputs: (inputs: CalculatorInputs) => void;
  calculating: boolean;
  dataLoaded: boolean;
  onCalculate: () => void;
  onClearForm: () => void;
}

export const ShipmentDetailsForm: React.FC<ShipmentDetailsFormProps> = ({
  inputs,
  setInputs,
  calculating,
  dataLoaded,
  onCalculate,
  onClearForm
}) => {
  return (
    <Card className="glass-card border-2 border-white/30 bg-white/10 shadow-glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <MapPin className="w-5 h-5" />
          Shipment Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={e => {
            e.preventDefault();
            onCalculate();
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            <div>
              <Label htmlFor="origin" className="input-label text-white">Origin Country</Label>
              <Input
                id="origin"
                className="elegant-input mt-1 bg-white/20 border-white/30 text-white placeholder:text-white/70"
                placeholder="e.g., Kenya"
                value={inputs.origin}
                onChange={(e) => setInputs({...inputs, origin: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="destination" className="input-label text-white">Destination Country</Label>
              <Input
                id="destination"
                className="elegant-input mt-1 bg-white/20 border-white/30 text-white placeholder:text-white/70"
                placeholder="e.g., Burundi"
                value={inputs.destination}
                onChange={(e) => setInputs({...inputs, destination: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="cargoType" className="input-label text-white">Item Category</Label>
              <Input
                id="cargoType"
                className="elegant-input mt-1 bg-white/20 border-white/30 text-white placeholder:text-white/70"
                placeholder="e.g., Emergency Health Kits"
                value={inputs.cargoType}
                onChange={(e) => setInputs({...inputs, cargoType: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="weight" className="input-label text-white">Weight (kg)</Label>
              <Input
                id="weight"
                className="elegant-input mt-1 bg-white/20 border-white/30 text-white placeholder:text-white/70"
                type="number"
                min="0"
                step="any"
                placeholder="0"
                value={inputs.weight || ''}
                onChange={(e) => setInputs({...inputs, weight: parseFloat(e.target.value) || 0})}
                required
              />
            </div>
            <div>
              <Label htmlFor="volume" className="input-label text-white">Volume (cbm)</Label>
              <Input
                id="volume"
                className="elegant-input mt-1 bg-white/20 border-white/30 text-white placeholder:text-white/70"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={inputs.volume || ''}
                onChange={(e) => setInputs({...inputs, volume: parseFloat(e.target.value) || 0})}
                required
              />
            </div>
            <div>
              <Label htmlFor="urgency" className="input-label text-white">Priority Level</Label>
              <Select value={inputs.urgency} onValueChange={(value: 'medium' | 'high') => setInputs({...inputs, urgency: value})}>
                <SelectTrigger className="elegant-input mt-1 bg-white/20 border-white/30 text-white">
                  <SelectValue placeholder="Choose priority" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/30">
                  <SelectItem value="medium" className="text-white">Standard</SelectItem>
                  <SelectItem value="high" className="text-white">High - Speed priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-2 justify-end">
            <Button 
              type="submit"
              className="glass-button bg-primary/20 border-2 border-primary text-white hover:bg-primary/30"
              disabled={calculating || !dataLoaded}
            >
              {calculating ? "Calculating..." : "Calculate Best Route"}
            </Button>
            <Button type="button" variant="outline" onClick={onClearForm} className="border-primary/60 text-white hover:bg-white/10">
              Clear
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, TrendingUp, Clock, DollarSign, Shield, MapPin, Database } from 'lucide-react';
import { csvDataEngine } from '@/services/csvDataEngine';
import { humorToast } from '@/components/HumorToast';

interface CalculatorInputs {
  origin: string;
  destination: string;
  weight: number;
  volume: number;
  urgency: 'medium' | 'high';
  cargoType: string;
}

const FreightCalculator = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    origin: '',
    destination: '',
    weight: 0,
    volume: 0,
    urgency: 'medium',
    cargoType: ''
  });

  const [calculating, setCalculating] = useState(false);

  const [dataLoaded, setDataLoaded] = useState(false);
  React.useEffect(() => {
    (async () => {
      const shipments = await csvDataEngine.listShipments();
      setDataLoaded(Array.isArray(shipments) && shipments.length > 0);
    })();
  }, []);

  const handleCalculate = async () => {
    humorToast("❌ Calculation Engine Disabled", "Calculation methods have been decoupled from loader; scoring coming via @deepcal/core-mcdm.", 3000);
  };

  const clearForm = () => {
    setInputs({
      origin: '',
      destination: '',
      weight: 0,
      volume: 0,
      urgency: 'medium',
      cargoType: ''
    });
  };

  const lineageMeta = csvDataEngine.getLineageMeta?.();

  return (
    <div className="max-w-6xl mx-auto space-y-8 page-transition font-elegant">
      <div className="text-center mb-3">
        <h1 className="section-title flex items-center justify-center gap-3 mb-2">
          <Calculator className="w-8 h-8 text-primary" />
          DeepCAL™ Advanced Freight Calculator
        </h1>
        <p className="subtle-text">
          Neutrosophic AHP-TOPSIS Decision Framework for multi-carrier optimization powered by real data.
        </p>
        {lineageMeta && (
          <div className="mt-2 text-xs text-accent flex items-center justify-center gap-2">
            <Database className="w-4 h-4" />
            {lineageMeta.records} real records • {lineageMeta.source} • Hash: {lineageMeta.sha256.substring(0, 8)}
          </div>
        )}
      </div>

      {/* INPUT GRID */}
      <Card className="glass-card shadow-glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <MapPin className="w-5 h-5" />
            Shipment Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={e => {
              e.preventDefault();
              handleCalculate();
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              <div>
                <Label htmlFor="origin" className="input-label">Origin Country</Label>
                <Input
                  id="origin"
                  className="elegant-input mt-1"
                  placeholder="e.g., Kenya"
                  value={inputs.origin}
                  onChange={(e) => setInputs({...inputs, origin: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="destination" className="input-label">Destination Country</Label>
                <Input
                  id="destination"
                  className="elegant-input mt-1"
                  placeholder="e.g., Burundi"
                  value={inputs.destination}
                  onChange={(e) => setInputs({...inputs, destination: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cargoType" className="input-label">Item Category</Label>
                <Input
                  id="cargoType"
                  className="elegant-input mt-1"
                  placeholder="e.g., Emergency Health Kits"
                  value={inputs.cargoType}
                  onChange={(e) => setInputs({...inputs, cargoType: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="weight" className="input-label">Weight (kg)</Label>
                <Input
                  id="weight"
                  className="elegant-input mt-1"
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
                <Label htmlFor="volume" className="input-label">Volume (cbm)</Label>
                <Input
                  id="volume"
                  className="elegant-input mt-1"
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
                <Label htmlFor="urgency" className="input-label">Priority Level</Label>
                <Select value={inputs.urgency} onValueChange={(value: 'medium' | 'high') => setInputs({...inputs, urgency: value})}>
                  <SelectTrigger className="elegant-input mt-1">
                    <SelectValue placeholder="Choose priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medium">Standard</SelectItem>
                    <SelectItem value="high">High - Speed priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2 justify-end">
              <Button 
                type="submit"
                className="glass-button"
                disabled={calculating || !dataLoaded}
              >
                {calculating ? "Calculating..." : "Calculate Best Route"}
              </Button>
              <Button type="button" variant="outline" onClick={clearForm} className="border-primary/60">
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ENGINE OUTPUT - Results Section */}
      <div className="w-full">
        <Card className="glass-card shadow-cosmic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gradient-green">
              <TrendingUp className="w-5 h-5" />
              DeepCAL™ Engine Output
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Enter shipment details and click Calculate to see recommendations</p>
              <p className="text-xs mt-2">All calculations use real data - no mock values!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FreightCalculator;

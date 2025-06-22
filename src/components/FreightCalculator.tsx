import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ButtonProps } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, TrendingUp, Clock, DollarSign, Shield, MapPin, Database, Package } from 'lucide-react';
import { csvDataEngine, ShipmentRecord } from '@/services/csvDataEngine';
import { humorToast } from '@/components/HumorToast';
import { fire } from "@/moscripts/engine";
import { EagleEyeTracker } from './tracker/EagleEyeTracker';
import { FieldIntelComm } from './fieldintel/FieldIntelComm';
import { WeatherBrain } from './weather/WeatherBrain';

interface CalculatorInputs {
  origin: string;
  destination: string;
  weight: number;
  volume: number;
  urgency: 'medium' | 'high';
  cargoType: string;
}

const FreightCalculator = () => {
  const [inputs, setInputs] = React.useState<CalculatorInputs>({
    origin: '',
    destination: '',
    weight: 0,
    volume: 0,
    urgency: 'medium',
    cargoType: ''
  });
  const [calculating, setCalculating] = React.useState(false);
  const [dataLoaded, setDataLoaded] = React.useState(false);

  // All old shipments for reference selection
  const [oldShipments, setOldShipments] = React.useState<ShipmentRecord[]>([]);
  const [selectedReference, setSelectedReference] = React.useState<string | null>(null);

  const [weatherRisk, setWeatherRisk] = React.useState<'low' | 'medium' | 'high'>('low');

  React.useEffect(() => {
    (async () => {
      const shipments = await csvDataEngine.listShipments();
      setDataLoaded(Array.isArray(shipments) && shipments.length > 0);
      setOldShipments(shipments);
    })();
  }, []);

  // Handle selecting an old shipment by reference
  React.useEffect(() => {
    if (selectedReference) {
      const found = oldShipments.find(s => s.request_reference === selectedReference);
      if (found) {
        setInputs({
          origin: found.origin_country ?? "",
          destination: found.destination_country ?? "",
          weight: found.weight_kg ?? 0,
          volume: found.volume_cbm ?? 0,
          urgency: 'medium', // No urgency field on ShipmentRecord; use default or infer logic if needed
          cargoType: found.item_category ?? "",
        });
      }
    }
  }, [selectedReference, oldShipments]);

  const handleCalculate = async () => {
    fire("onBeforeSaveShipment", {
      shipment: {
        ...inputs,
      },
    });
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
    setSelectedReference(null);
  };

  const lineageMeta = csvDataEngine.getLineageMeta?.();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 bg-slate-950 min-h-screen">
      {/* Left Column - Calculator Input */}
      <div className="space-y-6">
        <Card className="border-0 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
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
                <Button 
                  type="button" 
                  variant="outline" asChild
                  onClick={clearForm} 
                  className="border-primary/60"
                >
                  <span>Clear</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        {/* Field Intel */}
        <FieldIntelComm 
          shipmentId={selectedReference || 'new'}
          onMessageSent={(msg) => console.log('Message sent:', msg)}
        />
      </div>
      
      {/* Middle Column - Results */}
      <div className="space-y-6">
        {/* Power Analytical Engine */}
        <Card className="border-0 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gradient-green">
              <TrendingUp className="w-5 h-5" />
              DeepCAL Engine Output
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
        
        {/* Weather Brain */}
        <WeatherBrain 
          onWeatherRisk={setWeatherRisk}
        />
      </div>
      
      {/* Right Column - Tracking */}
      <div className="space-y-6">
        {/* Eagle-Eye Tracker */}
        <EagleEyeTracker 
          routeId={selectedReference || 'new'}
          onCheckIn={(location) => console.log('Check-in at:', location)}
        />
        
        {/* Real Analytics */}
        <Card className="border-0 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Database className="w-5 h-5" />
              Real Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>Real-time analytics coming soon...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FreightCalculator;

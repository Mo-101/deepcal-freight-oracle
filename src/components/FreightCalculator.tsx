
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, TrendingUp, Clock, DollarSign, Shield, MapPin, Database, Package } from 'lucide-react';
import { csvDataEngine, ShipmentRecord } from '@/services/csvDataEngine';
import { humorToast } from '@/components/HumorToast';
import { fire } from "@/moscripts/engine";

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

  // All old shipments for reference selection
  const [oldShipments, setOldShipments] = useState<ShipmentRecord[]>([]);
  const [selectedReference, setSelectedReference] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const shipments = await csvDataEngine.listShipments();
      setDataLoaded(Array.isArray(shipments) && shipments.length > 0);
      setOldShipments(shipments);
    })();
  }, []);

  // Handle selecting an old shipment by reference
  useEffect(() => {
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
    <div className="max-w-6xl mx-auto space-y-8 page-transition font-elegant">
      <div className="text-center mb-3">
        <h1 className="section-title flex items-center justify-center gap-3 mb-2 text-white">
          <Calculator className="w-8 h-8 text-primary" />
          DeepCAL™ Advanced Freight Calculator
        </h1>
        <p className="subtle-text text-white">
          Neutrosophic AHP-TOPSIS Decision Framework for multi-carrier optimization powered by real data.
        </p>
        {lineageMeta && (
          <div className="mt-2 text-xs text-accent flex items-center justify-center gap-2">
            <Database className="w-4 h-4" />
            {lineageMeta.records} real records • {lineageMeta.source} • Hash: {lineageMeta.sha256.substring(0, 8)}
          </div>
        )}
      </div>

      {/* OLD SHIPMENT SELECTION - DASHBOARD STYLE */}
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
                onValueChange={val => setSelectedReference(val)}
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
                    // Use a non-empty value; this item is disabled and will never be selected.
                    <SelectItem value="__no_shipments__" disabled>
                      <span className="italic text-gray-400">No shipments available</span>
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            {selectedReference && (
              <Button onClick={clearForm} variant="outline" className="border-primary text-white px-3">
                Clear Selection
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* INPUT GRID */}
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
              handleCalculate();
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

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2 justify-end">
              <Button 
                type="submit"
                className="glass-button bg-primary/20 border-2 border-primary text-white hover:bg-primary/30"
                disabled={calculating || !dataLoaded}
              >
                {calculating ? "Calculating..." : "Calculate Best Route"}
              </Button>
              <Button type="button" variant="outline" onClick={clearForm} className="border-primary/60 text-white hover:bg-white/10">
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ENGINE OUTPUT - Results Section */}
      <div className="w-full">
        <Card className="glass-card border-2 border-white/30 bg-white/10 shadow-cosmic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="w-5 h-5" />
              DeepCAL™ Engine Output
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-white/70">
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

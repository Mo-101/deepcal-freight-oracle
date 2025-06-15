import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, TrendingUp, Clock, DollarSign, Shield, MapPin, Database } from 'lucide-react';
import { csvDataEngine, type FreightCalculatorResult } from '@/services/csvDataEngine';
import { humorToast } from '@/components/HumorToast';

interface CalculatorInputs {
  origin: string;
  destination: string;
  weight: number;
  volume: number;
  urgency: 'low' | 'medium' | 'high';
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

  const [result, setResult] = useState<FreightCalculatorResult | null>(null);
  const [calculating, setCalculating] = useState(false);

  const handleCalculate = async () => {
    try {
      if (!csvDataEngine.isDataLoaded()) {
        humorToast("⚠️ No Data, No Magic", "Load the CSV data first - system is locked without the core!", 3000);
        return;
      }

      setCalculating(true);
      humorToast("🧮 DeepCAL Engine Running", "Crunching real data with AHP-TOPSIS methodology...", 2000);

      // Simulate processing time for dramatic effect
      await new Promise(resolve => setTimeout(resolve, 1500));

      const calculationResult = csvDataEngine.calculateFreightOptions(
        inputs.origin,
        inputs.destination,
        inputs.weight,
        inputs.volume
      );

      setResult(calculationResult);
      humorToast("✨ Calculation Complete", calculationResult.recommendation, 4000);
    } catch (error) {
      humorToast("❌ Calculation Failed", (error as Error).message, 3000);
    } finally {
      setCalculating(false);
    }
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
    setResult(null);
  };

  const lineageMeta = csvDataEngine.getLineageMeta();

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
                <Select value={inputs.urgency} onValueChange={(value: 'low' | 'medium' | 'high') => setInputs({...inputs, urgency: value})}>
                  <SelectTrigger className="elegant-input mt-1">
                    <SelectValue placeholder="Choose priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Cost priority</SelectItem>
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
                disabled={calculating || !csvDataEngine.isDataLoaded()}
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
            {result ? (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 bg-green-800/20 rounded-lg border border-green-600/30">
                  <h3 className="font-semibold text-green-300 mb-1">🏆 Best Forwarder</h3>
                  <p className="text-2xl font-bold text-green-100">{result.bestForwarder}</p>
                  <p className="text-sm text-green-200 mt-1">Route Score: {result.routeScore}</p>
                </div>

                <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-700/30">
                  <h4 className="font-semibold text-blue-200 mb-2">💡 Recommendation</h4>
                  <p className="text-blue-100">{result.recommendation}</p>
                </div>

                {/* Data Lineage Badge */}
                <div className="p-3 bg-purple-900/20 rounded-lg border border-purple-700/30">
                  <h4 className="font-semibold text-purple-200 mb-2 flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Data Lineage
                  </h4>
                  <div className="text-sm text-purple-100">
                    <div>Source: {result.lineageMeta.source} • Records: {result.lineageMeta.records}</div>
                    <div>Hash: {result.lineageMeta.sha256.substring(0, 16)}... • {new Date(result.lineageMeta.timestamp).toLocaleString()}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">📊 Forwarder Comparison</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {result.forwarderComparison.slice(0, 5).map((forwarder, index) => (
                      <div key={forwarder.name} className="flex justify-between items-center p-2 bg-gray-900/50 rounded">
                        <span className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-blue-900 rounded-full flex items-center justify-center text-xs font-bold text-white/80">
                            #{forwarder.rank}
                          </span>
                          {forwarder.name}
                        </span>
                        <div className="text-right text-xs">
                          <div className="text-blue-200">${forwarder.costPerKg.toFixed(2)}/kg</div>
                          <div className="text-green-400">{(forwarder.onTimeRate * 100).toFixed(0)}% on-time</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">🔬 Explanation</h4>
                  <ul className="text-sm space-y-1">
                    {result.explanation.map((exp, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        {exp}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">⚖️ Rules Fired</h4>
                  <div className="flex flex-wrap gap-1">
                    {result.rulesFired.map((rule, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-900 text-purple-300 rounded text-xs">
                        {rule}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Enter shipment details and click Calculate to see recommendations</p>
                <p className="text-xs mt-2">All calculations use real data - no mock values!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FreightCalculator;

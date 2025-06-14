
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, TrendingUp, Clock, DollarSign, Shield, MapPin } from 'lucide-react';
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
      humorToast("🧮 DeepCAL Engine Running", "Crunching numbers with AHP-TOPSIS methodology...", 2000);

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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-3 mb-2">
          <Calculator className="w-8 h-8 text-blue-600" />
          DeepCAL Freight Calculator
        </h1>
        <p className="text-muted-foreground">
          Multi-criteria freight forwarder analysis powered by real shipment data
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Shipment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="origin">Origin Country</Label>
                <Input
                  id="origin"
                  placeholder="e.g., Kenya"
                  value={inputs.origin}
                  onChange={(e) => setInputs({...inputs, origin: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="destination">Destination Country</Label>
                <Input
                  id="destination"
                  placeholder="e.g., Zimbabwe"
                  value={inputs.destination}
                  onChange={(e) => setInputs({...inputs, destination: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="0"
                  value={inputs.weight || ''}
                  onChange={(e) => setInputs({...inputs, weight: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="volume">Volume (cbm)</Label>
                <Input
                  id="volume"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={inputs.volume || ''}
                  onChange={(e) => setInputs({...inputs, volume: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="urgency">Urgency Level</Label>
              <Select value={inputs.urgency} onValueChange={(value: 'low' | 'medium' | 'high') => setInputs({...inputs, urgency: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Cost priority</SelectItem>
                  <SelectItem value="medium">Medium - Balanced</SelectItem>
                  <SelectItem value="high">High - Speed priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="cargoType">Cargo Type</Label>
              <Input
                id="cargoType"
                placeholder="e.g., Emergency Health Kits"
                value={inputs.cargoType}
                onChange={(e) => setInputs({...inputs, cargoType: e.target.value})}
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleCalculate} 
                disabled={calculating || !csvDataEngine.isDataLoaded()}
                className="flex-1"
              >
                {calculating ? "Calculating..." : "Calculate Best Route"}
              </Button>
              <Button variant="outline" onClick={clearForm}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">🏆 Best Forwarder</h3>
                  <p className="text-xl font-bold text-green-900">{result.bestForwarder}</p>
                  <p className="text-sm text-green-700 mt-1">Route Score: {result.routeScore}</p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">💡 Recommendation</h4>
                  <p className="text-blue-900">{result.recommendation}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">📊 Forwarder Comparison</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {result.forwarderComparison.slice(0, 5).map((forwarder, index) => (
                      <div key={forwarder.name} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold">
                            #{forwarder.rank}
                          </span>
                          {forwarder.name}
                        </span>
                        <div className="text-right text-xs">
                          <div>${forwarder.costPerKg.toFixed(2)}/kg</div>
                          <div className="text-green-600">{(forwarder.onTimeRate * 100).toFixed(0)}% on-time</div>
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
                        <span className="text-blue-500">•</span>
                        {exp}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">⚖️ Rules Fired</h4>
                  <div className="flex flex-wrap gap-1">
                    {result.rulesFired.map((rule, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FreightCalculator;

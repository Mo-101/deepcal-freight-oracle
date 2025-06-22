
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ButtonProps } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, TrendingUp, Clock, DollarSign, Shield, MapPin, Database, Package, Brain, Zap } from 'lucide-react';
import { csvDataEngine, ShipmentRecord } from '@/services/csvDataEngine';
import { humorToast } from '@/components/HumorToast';
import { fire } from "@/moscripts/engine";
import { EagleEyeTracker } from './tracker/EagleEyeTracker';
import { FieldIntelComm } from './fieldintel/FieldIntelComm';
import { WeatherBrain } from './weather/WeatherBrain';
import { EnhancedAnalytics } from './analytics/EnhancedAnalytics';
import { EnhancedVoiceEngine } from './voice/EnhancedVoiceEngine';
import { TerminalCard, TerminalHeader, TerminalTitle, TerminalContent } from './ui/terminal-card';

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
  const [oldShipments, setOldShipments] = React.useState<ShipmentRecord[]>([]);
  const [selectedReference, setSelectedReference] = React.useState<string | null>(null);
  const [weatherRisk, setWeatherRisk] = React.useState<'low' | 'medium' | 'high'>('low');
  const [activeView, setActiveView] = React.useState<'calculator' | 'analytics' | 'tracking'>('calculator');

  React.useEffect(() => {
    (async () => {
      const shipments = await csvDataEngine.listShipments();
      setDataLoaded(Array.isArray(shipments) && shipments.length > 0);
      setOldShipments(shipments);
    })();
  }, []);

  React.useEffect(() => {
    if (selectedReference) {
      const found = oldShipments.find(s => s.request_reference === selectedReference);
      if (found) {
        setInputs({
          origin: found.origin_country ?? "",
          destination: found.destination_country ?? "",
          weight: found.weight_kg ?? 0,
          volume: found.volume_cbm ?? 0,
          urgency: 'medium',
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
    humorToast("🧠 DeepCAL++ Processing", "Neutrosophic analysis initiated. Real calculations using live data.", 3000);
  };

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('calculate') || lowerCommand.includes('analyze')) {
      handleCalculate();
    } else if (lowerCommand.includes('clear') || lowerCommand.includes('reset')) {
      clearForm();
    } else if (lowerCommand.includes('analytics')) {
      setActiveView('analytics');
    } else if (lowerCommand.includes('tracking')) {
      setActiveView('tracking');
    } else if (lowerCommand.includes('calculator')) {
      setActiveView('calculator');
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
    setSelectedReference(null);
  };

  const lineageMeta = csvDataEngine.getLineageMeta?.();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-4">
      {/* Header Navigation */}
      <div className="mb-6">
        <TerminalCard variant="cyberpunk" glowing>
          <TerminalHeader>
            <TerminalTitle>DEEPCAL++ COMMAND CENTER</TerminalTitle>
          </TerminalHeader>
          <TerminalContent>
            <div className="flex space-x-4">
              {[
                { id: 'calculator', label: 'Calculator', icon: Calculator },
                { id: 'analytics', label: 'Analytics', icon: TrendingUp },
                { id: 'tracking', label: 'Tracking', icon: MapPin }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveView(id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded transition-all ${
                    activeView === id 
                      ? 'bg-cyan-600/30 text-cyan-400 border border-cyan-500/50' 
                      : 'bg-slate-800/50 text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </TerminalContent>
        </TerminalCard>
      </div>

      {activeView === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Calculator Input */}
          <div className="space-y-6">
            <TerminalCard variant="tactical" glowing>
              <TerminalHeader>
                <TerminalTitle>SHIPMENT_CONFIG</TerminalTitle>
              </TerminalHeader>
              <TerminalContent>
                <form onSubmit={e => { e.preventDefault(); handleCalculate(); }}>
                  <div className="grid grid-cols-1 gap-4 mb-6">
                    <div>
                      <Label htmlFor="origin" className="text-green-400 font-mono">Origin_Country</Label>
                      <Input
                        id="origin"
                        className="bg-slate-900/50 border-green-500/30 text-green-300 font-mono mt-1"
                        placeholder="Kenya"
                        value={inputs.origin}
                        onChange={(e) => setInputs({...inputs, origin: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="destination" className="text-green-400 font-mono">Destination_Country</Label>
                      <Input
                        id="destination"
                        className="bg-slate-900/50 border-green-500/30 text-green-300 font-mono mt-1"
                        placeholder="Burundi"
                        value={inputs.destination}
                        onChange={(e) => setInputs({...inputs, destination: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cargoType" className="text-green-400 font-mono">Cargo_Classification</Label>
                      <Input
                        id="cargoType"
                        className="bg-slate-900/50 border-green-500/30 text-green-300 font-mono mt-1"
                        placeholder="Emergency Health Kits"
                        value={inputs.cargoType}
                        onChange={(e) => setInputs({...inputs, cargoType: e.target.value})}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="weight" className="text-green-400 font-mono">Weight_KG</Label>
                        <Input
                          id="weight"
                          className="bg-slate-900/50 border-green-500/30 text-green-300 font-mono mt-1"
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
                        <Label htmlFor="volume" className="text-green-400 font-mono">Volume_CBM</Label>
                        <Input
                          id="volume"
                          className="bg-slate-900/50 border-green-500/30 text-green-300 font-mono mt-1"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={inputs.volume || ''}
                          onChange={(e) => setInputs({...inputs, volume: parseFloat(e.target.value) || 0})}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="urgency" className="text-green-400 font-mono">Priority_Level</Label>
                      <Select value={inputs.urgency} onValueChange={(value: 'medium' | 'high') => setInputs({...inputs, urgency: value})}>
                        <SelectTrigger className="bg-slate-900/50 border-green-500/30 text-green-300 font-mono mt-1">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="medium">STANDARD</SelectItem>
                          <SelectItem value="high">URGENT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <Button 
                      type="submit"
                      className="bg-cyan-600 hover:bg-cyan-500 text-black font-mono"
                      disabled={calculating || !dataLoaded}
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      {calculating ? "PROCESSING..." : "EXECUTE_ANALYSIS"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={clearForm} 
                      className="border-red-500/60 text-red-400 hover:bg-red-500/10 font-mono"
                    >
                      RESET
                    </Button>
                  </div>
                </form>
              </TerminalContent>
            </TerminalCard>
            
            <FieldIntelComm 
              shipmentId={selectedReference || 'new'}
              onMessageSent={(msg) => console.log('Field message:', msg)}
            />

            <EnhancedVoiceEngine 
              onVoiceCommand={handleVoiceCommand}
              contextData={{ shipmentsCount: oldShipments.length }}
            />
          </div>
          
          {/* Middle Column - Results */}
          <div className="space-y-6">
            <TerminalCard variant="cyberpunk" glowing>
              <TerminalHeader>
                <TerminalTitle>DEEPCAL_ENGINE_OUTPUT</TerminalTitle>
              </TerminalHeader>
              <TerminalContent>
                <div className="text-center py-8 text-muted-foreground">
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <Calculator className="w-12 h-12 opacity-50" />
                      <div className="absolute inset-0 w-12 h-12 border-2 border-cyan-500/30 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <p className="font-mono text-cyan-400">AWAITING_INPUT_PARAMETERS</p>
                  <p className="text-xs mt-2 font-mono text-gray-500">Neural networks standing by for calculation</p>
                </div>
              </TerminalContent>
            </TerminalCard>
            
            <WeatherBrain onWeatherRisk={setWeatherRisk} />
          </div>
          
          {/* Right Column - Tracking */}
          <div className="space-y-6">
            <EagleEyeTracker 
              routeId={selectedReference || 'new'}
              onCheckIn={(location) => console.log('Position update:', location)}
            />
            
            <TerminalCard variant="tactical">
              <TerminalHeader>
                <TerminalTitle>SYSTEM_STATUS</TerminalTitle>
              </TerminalHeader>
              <TerminalContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-green-400 font-mono">Data_Engine</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-sm">ONLINE</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-400 font-mono">Weather_Brain</span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full animate-pulse ${
                        weatherRisk === 'high' ? 'bg-red-400' : 
                        weatherRisk === 'medium' ? 'bg-amber-400' : 'bg-green-400'
                      }`}></div>
                      <span className={`text-sm ${
                        weatherRisk === 'high' ? 'text-red-400' : 
                        weatherRisk === 'medium' ? 'text-amber-400' : 'text-green-400'
                      }`}>
                        {weatherRisk.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-400 font-mono">Active_Shipments</span>
                    <span className="text-cyan-400 font-mono">{oldShipments.length}</span>
                  </div>
                </div>
              </TerminalContent>
            </TerminalCard>
          </div>
        </div>
      )}

      {activeView === 'analytics' && (
        <div className="space-y-6">
          <EnhancedAnalytics shipmentData={oldShipments} />
        </div>
      )}

      {activeView === 'tracking' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EagleEyeTracker 
            routeId={selectedReference || 'tracking-view'}
            onCheckIn={(location) => console.log('Tracking view check-in:', location)}
          />
          <div className="space-y-6">
            <FieldIntelComm 
              shipmentId={selectedReference || 'tracking-comms'}
              onMessageSent={(msg) => console.log('Tracking comms:', msg)}
            />
            <WeatherBrain onWeatherRisk={setWeatherRisk} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FreightCalculator;

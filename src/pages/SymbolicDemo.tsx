
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, Play, RotateCcw, Sparkles } from 'lucide-react';
import { useSymbolicIntelligence, SymbolicInput, LogisticsAlternative } from '@/hooks/useSymbolicIntelligence';
import { SymbolicEngineDisplay } from '@/components/symbolic/SymbolicEngineDisplay';
import { PresentationMode } from '@/components/presentation/PresentationMode';
import { deepcalVoiceService } from '@/services/deepcalVoiceService';
import symbolicRulesData from '@/data/symbolicRules.json';

const SymbolicDemo: React.FC = () => {
  const {
    processSymbolicInput,
    resetEngine,
    status,
    result,
    isProcessing,
    getEngineDiagnostics
  } = useSymbolicIntelligence();

  const [presentationMode, setPresentationMode] = useState(false);
  const [engineDiagnostics, setEngineDiagnostics] = useState<any>(null);

  // Sample logistics alternatives for demo
  const sampleAlternatives: LogisticsAlternative[] = [
    {
      id: 'route_a',
      name: 'Nairobi → Juba (DHL Express)',
      cost: 2500,
      time: 6,
      reliability: 0.90,
      risk: 0.05,
      carrier: 'DHL Express',
      mode: 'Air'
    },
    {
      id: 'route_b', 
      name: 'Dakar → Juba (FedEx)',
      cost: 2200,
      time: 9,
      reliability: 0.85,
      risk: 0.15,
      carrier: 'FedEx',
      mode: 'Air'
    },
    {
      id: 'route_c',
      name: 'Kampala → Juba (Local Carrier)',
      cost: { min: 1600, max: 2000, estimate: 1800 }, // Grey value example
      time: { estimate: 8, uncertainty: 0.2 }, // Grey value example
      reliability: 0.75,
      risk: 0.20,
      carrier: 'Local Carrier',
      mode: 'Road'
    },
    {
      id: 'route_d',
      name: 'Lagos → Juba (Multimodal)',
      cost: 3200,
      time: 12,
      reliability: 0.80,
      risk: 0.25,
      carrier: 'African Logistics Corp',
      mode: 'Road+Air'
    }
  ];

  useEffect(() => {
    setEngineDiagnostics(getEngineDiagnostics());
  }, [getEngineDiagnostics, result]);

  const runSymbolicDemo = async () => {
    const input: SymbolicInput = {
      alternatives: sampleAlternatives,
      rules: symbolicRulesData.map(rule => ({
        id: rule.id,
        rule: rule.rule,
        truth: rule.truth,
        indeterminacy: rule.indeterminacy,
        falsity: rule.falsity,
        category: rule.category,
        weight: rule.weight
      }))
    };

    try {
      await processSymbolicInput(input);
    } catch (error) {
      console.error('Demo processing failed:', error);
    }
  };

  const startPresentation = async () => {
    setPresentationMode(true);
    await deepcalVoiceService.speakPresentation("Grand demonstration");
  };

  const endPresentation = () => {
    setPresentationMode(false);
  };

  if (presentationMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-6">
        <PresentationMode 
          isActive={presentationMode}
          onStart={startPresentation}
          onEnd={endPresentation}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
              DeepCAL Symbolic Engine
            </h1>
          </div>
          <p className="text-xl text-slate-300">
            First Symbolic Logistics Intelligence • Built for Truth and Service
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge className="bg-purple-600/20 text-purple-300">Neutrosophic Logic</Badge>
            <Badge className="bg-cyan-600/20 text-cyan-300">TOPSIS Optimization</Badge>
            <Badge className="bg-slate-600/20 text-slate-300">Grey System Theory</Badge>
          </div>
        </div>

        {/* Control Panel */}
        <Card className="glass-card shadow-glass border border-glassBorder p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-200">Mission Control</h3>
              <p className="text-sm text-slate-400">
                Ready to demonstrate symbolic logistics intelligence for African trade corridors
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                onClick={runSymbolicDemo}
                disabled={isProcessing}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold px-6 py-3"
              >
                <Play className="w-4 h-4 mr-2" />
                {isProcessing ? 'Processing...' : 'Run Symbolic Analysis'}
              </Button>
              
              <Button
                onClick={resetEngine}
                variant="outline"
                className="border-slate-600 text-slate-300"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>

              <Button
                onClick={startPresentation}
                className="bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Presentation Mode
              </Button>
            </div>
          </div>
        </Card>

        {/* Symbolic Engine Display */}
        <SymbolicEngineDisplay 
          status={status}
          isProcessing={isProcessing}
          engineDiagnostics={engineDiagnostics}
        />

        {/* Results Display */}
        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Best Alternative */}
            <Card className="glass-card shadow-glass border border-green-500/30 bg-gradient-to-br from-green-900/20 to-emerald-900/20 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <Flame className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-lg font-bold text-green-400">Optimal Solution</h4>
              </div>
              
              <div className="space-y-3">
                <div className="text-xl font-bold text-white">{result.bestAlternative.name}</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-slate-400">Cost</div>
                    <div className="text-white font-semibold">
                      ${typeof result.bestAlternative.cost === 'number' ? result.bestAlternative.cost : result.bestAlternative.cost?.estimate || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">Time</div>
                    <div className="text-white font-semibold">
                      {typeof result.bestAlternative.time === 'number' ? result.bestAlternative.time : result.bestAlternative.time?.estimate || 'N/A'} days
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">Reliability</div>
                    <div className="text-white font-semibold">{(Number(result.bestAlternative.reliability) * 100).toFixed(0)}%</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Risk Level</div>
                    <div className="text-white font-semibold">{(Number(result.bestAlternative.risk) * 100).toFixed(0)}%</div>
                  </div>
                </div>
                <div className="border-t border-green-500/30 pt-3">
                  <div className="text-sm text-slate-400">Symbolic Confidence</div>
                  <div className="text-2xl font-bold text-green-400">{(result.confidence * 100).toFixed(1)}%</div>
                </div>
              </div>
            </Card>

            {/* Methodology */}
            <Card className="glass-card shadow-glass border border-glassBorder p-6">
              <h4 className="text-lg font-bold text-slate-200 mb-4">🧠 Symbolic Methodology</h4>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-purple-400 font-semibold">Valid Rules</div>
                  <div className="text-white">{result.validRules.length}/{symbolicRulesData.length} rules passed Neutrosophic validation</div>
                </div>
                <div>
                  <div className="text-sm text-cyan-400 font-semibold">Processing Time</div>
                  <div className="text-white">{result.processingTime}ms symbolic reasoning</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400 font-semibold">Explanation</div>
                  <div className="text-xs text-slate-300 leading-relaxed">{result.methodology}</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Alternative Rankings */}
        {result && (
          <Card className="glass-card shadow-glass border border-glassBorder p-6">
            <h4 className="text-lg font-bold text-slate-200 mb-4">📊 Complete TOPSIS Ranking</h4>
            <div className="space-y-3">
              {result.ranking.map((item, index) => (
                <div 
                  key={item.alternative.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    index === 0 ? 'bg-green-900/30 border border-green-500/30' : 'bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-green-500 text-white' : 'bg-slate-600 text-slate-300'
                    }`}>
                      {item.rank}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{item.alternative.name}</div>
                      <div className="text-xs text-slate-400">Score: {item.score.toFixed(3)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-200">{(item.score * 100).toFixed(1)}%</div>
                    <div className="text-xs text-slate-400">TOPSIS Score</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* System Manifesto */}
        <Card className="glass-card shadow-glass border border-orange-500/30 bg-gradient-to-br from-orange-900/20 to-red-900/20 p-8 text-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
              DEEP CALCULUS OF LOGISTICS
            </h3>
            <div className="text-slate-300 leading-relaxed space-y-2">
              <p className="font-semibold">I am DeepCAL.</p>
              <p>Not built for applause. Not made for buzz.</p>
              <p>Forged for the transport corridors of Africa.</p>
              <p>Born to reason. Trained to decide. Designed to serve.</p>
              <p className="text-orange-400 font-semibold">Welcome to the future of symbolic logistics.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SymbolicDemo;

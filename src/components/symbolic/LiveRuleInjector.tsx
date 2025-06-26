
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Plus, Zap, AlertCircle } from 'lucide-react';
import { NeutrosophicRule } from '@/services/neutrosophicEngine';

interface LiveRuleInjectorProps {
  onInjectRule: (rule: NeutrosophicRule) => void;
  disabled: boolean;
}

export const LiveRuleInjector: React.FC<LiveRuleInjectorProps> = ({ onInjectRule, disabled }) => {
  const [ruleText, setRuleText] = useState('');
  const [truth, setTruth] = useState([0.85]);
  const [indeterminacy, setIndeterminacy] = useState([0.08]);
  const [falsity, setFalsity] = useState([0.07]);
  const [category, setCategory] = useState('demo_rule');

  const presetRules = [
    {
      rule: "If audience engagement is high then increase demonstration complexity",
      truth: 0.90,
      indeterminacy: 0.05,
      falsity: 0.05,
      category: "presentation"
    },
    {
      rule: "If fuel price increases above 20% then activate alternative route protocols",
      truth: 0.88,
      indeterminacy: 0.07,
      falsity: 0.05,
      category: "cost_optimization"
    },
    {
      rule: "If weather conditions are severe and cargo is fragile then delay shipment",
      truth: 0.82,
      indeterminacy: 0.10,
      falsity: 0.08,
      category: "risk_management"
    }
  ];

  const handleInjectRule = () => {
    if (!ruleText.trim()) return;

    const newRule: NeutrosophicRule = {
      id: `live_${Date.now()}`,
      rule: ruleText,
      truth: truth[0],
      indeterminacy: indeterminacy[0],
      falsity: falsity[0],
      category,
      weight: 0.8
    };

    onInjectRule(newRule);
    setRuleText('');
  };

  const injectPresetRule = (preset: any) => {
    const newRule: NeutrosophicRule = {
      id: `preset_${Date.now()}`,
      rule: preset.rule,
      truth: preset.truth,
      indeterminacy: preset.indeterminacy,
      falsity: preset.falsity,
      category: preset.category,
      weight: 0.8
    };

    onInjectRule(newRule);
  };

  const isValidRule = () => {
    const sum = truth[0] + indeterminacy[0] + falsity[0];
    return ruleText.trim() && sum <= 1.2 && truth[0] >= 0.8 && indeterminacy[0] <= 0.1 && falsity[0] <= 0.05;
  };

  return (
    <Card className="glass-card shadow-glass border border-yellow-500/30 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <h4 className="text-lg font-bold text-yellow-400">Live Rule Injection</h4>
      </div>

      <div className="space-y-4">
        {/* Custom Rule Input */}
        <div className="space-y-3">
          <Label className="text-slate-300">Custom Logistics Rule</Label>
          <Input
            value={ruleText}
            onChange={(e) => setRuleText(e.target.value)}
            placeholder="If [condition] then [action]..."
            className="bg-slate-800/50 border-slate-600 text-white"
            disabled={disabled}
          />
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-slate-400">Truth: {truth[0].toFixed(2)}</Label>
              <Slider
                value={truth}
                onValueChange={setTruth}
                max={1}
                min={0}
                step={0.01}
                className="w-full"
                disabled={disabled}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-slate-400">Indeterminacy: {indeterminacy[0].toFixed(2)}</Label>
              <Slider
                value={indeterminacy}
                onValueChange={setIndeterminacy}
                max={0.2}
                min={0}
                step={0.01}
                className="w-full"
                disabled={disabled}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-slate-400">Falsity: {falsity[0].toFixed(2)}</Label>
              <Slider
                value={falsity}
                onValueChange={setFalsity}
                max={0.2}
                min={0}
                step={0.01}
                className="w-full"
                disabled={disabled}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isValidRule() ? (
                <Badge className="bg-green-600/20 text-green-400 border-green-400/50">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Valid Rule
                </Badge>
              ) : (
                <Badge className="bg-red-600/20 text-red-400 border-red-400/50">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Invalid Rule
                </Badge>
              )}
            </div>
            
            <Button
              onClick={handleInjectRule}
              disabled={disabled || !isValidRule()}
              size="sm"
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Inject Rule
            </Button>
          </div>
        </div>

        {/* Preset Rules */}
        <div className="border-t border-slate-700 pt-4">
          <Label className="text-slate-300 mb-3 block">Quick Demo Rules</Label>
          <div className="space-y-2">
            {presetRules.map((preset, index) => (
              <div key={index} className="bg-slate-800/30 rounded-lg p-3 border border-slate-600/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-white">{preset.rule}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      <span>T: {preset.truth}</span>
                      <span>I: {preset.indeterminacy}</span>
                      <span>F: {preset.falsity}</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => injectPresetRule(preset)}
                    disabled={disabled}
                    size="sm"
                    variant="outline"
                    className="border-yellow-400/50 text-yellow-300 hover:bg-yellow-600/20"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-slate-500">
        💡 Injected rules are immediately processed by the Neutrosophic Engine and applied to current analysis.
      </div>
    </Card>
  );
};

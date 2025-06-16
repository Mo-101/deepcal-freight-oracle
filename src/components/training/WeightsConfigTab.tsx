
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Sliders } from 'lucide-react';
import { WeightVector } from '@/pages/Training';

interface WeightsConfigTabProps {
  weights: WeightVector;
  setWeights: React.Dispatch<React.SetStateAction<WeightVector>>;
}

export function WeightsConfigTab({ weights, setWeights }: WeightsConfigTabProps) {
  const handleSlider = (k: keyof WeightVector, v: number) => {
    const next = { ...weights, [k]: v / 100 } as WeightVector;
    const sum = Object.values(next).reduce((a, b) => a + b, 0);
    if (Math.abs(sum - 1) > 0.0001) return;
    setWeights(next);
  };

  return (
    <Card className="glass-card shadow-glass border border-glassBorder">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-lime-400 flex items-center gap-2">
          <Sliders className="w-5 h-5" />
          Criteria Weights Configuration
        </CardTitle>
        <p className="text-indigo-300 mt-2">
          Adjust the importance of each criterion in the decision-making process. All weights must total 100%.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(['cost', 'time', 'reliability', 'risk'] as (keyof WeightVector)[]).map((criterion) => (
            <div key={criterion} className="space-y-3">
              <Label className="text-indigo-300 text-lg capitalize">
                {criterion} Priority
              </Label>
              <input
                type="range"
                min={0}
                max={100}
                value={weights[criterion] * 100}
                onChange={(e) => handleSlider(criterion, Number(e.target.value))}
                className="w-full accent-lime-400 h-2"
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-indigo-300">Weight</span>
                <Badge className="bg-lime-400/20 text-lime-400 font-mono">
                  {(weights[criterion] * 100).toFixed(1)}%
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <h4 className="text-white font-semibold mb-2">Current Configuration Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lime-400 font-mono text-lg">{(weights.cost * 100).toFixed(0)}%</div>
              <div className="text-indigo-300">Cost</div>
            </div>
            <div className="text-center">
              <div className="text-lime-400 font-mono text-lg">{(weights.time * 100).toFixed(0)}%</div>
              <div className="text-indigo-300">Time</div>
            </div>
            <div className="text-center">
              <div className="text-lime-400 font-mono text-lg">{(weights.reliability * 100).toFixed(0)}%</div>
              <div className="text-indigo-300">Reliability</div>
            </div>
            <div className="text-center">
              <div className="text-lime-400 font-mono text-lg">{(weights.risk * 100).toFixed(0)}%</div>
              <div className="text-indigo-300">Risk</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

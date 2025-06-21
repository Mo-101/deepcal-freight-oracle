
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

// Define the WeightVector interface locally
interface WeightVector {
  cost: number;
  speed: number;
  reliability: number;
  carbon: number;
}

const WeightsConfigTab: React.FC = () => {
  const [weights, setWeights] = useState<WeightVector>({
    cost: 0.25,
    speed: 0.25,
    reliability: 0.25,
    carbon: 0.25
  });

  const totalWeight = Object.values(weights).reduce((sum: number, weight: number) => sum + weight, 0);
  const isNormalized = Math.abs(totalWeight - 1.0) < 0.01;

  const handleWeightChange = (criterion: keyof WeightVector, value: number[]) => {
    setWeights(prev => ({
      ...prev,
      [criterion]: value[0] / 100
    }));
  };

  const normalizeWeights = () => {
    const currentTotal = Object.values(weights).reduce((sum: number, weight: number) => sum + weight, 0);
    if (currentTotal > 0) {
      const normalizedWeights = Object.fromEntries(
        (Object.keys(weights) as Array<keyof WeightVector>).map(key => [
          key, 
          weights[key] / currentTotal
        ])
      ) as WeightVector;
      setWeights(normalizedWeights);
    }
  };

  const resetToDefault = () => {
    setWeights({
      cost: 0.25,
      speed: 0.25,
      reliability: 0.25,
      carbon: 0.25
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-yellow-300">Weight Configuration</CardTitle>
          <p className="text-slate-400 text-sm">
            Configure the importance weights for different criteria in the decision engine.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {(Object.keys(weights) as Array<keyof WeightVector>).map((criterion) => (
            <div key={criterion} className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-slate-300 capitalize font-medium">
                  {criterion}
                </label>
                <Badge variant="outline" className="text-yellow-300 border-yellow-500/30">
                  {(weights[criterion] * 100).toFixed(1)}%
                </Badge>
              </div>
              <Slider
                value={[weights[criterion] * 100]}
                onValueChange={(value) => handleWeightChange(criterion, value)}
                max={100}
                step={0.1}
                className="w-full"
              />
            </div>
          ))}
          
          <div className="pt-4 border-t border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-300">Total Weight:</span>
              <Badge 
                variant={isNormalized ? "default" : "destructive"}
                className={isNormalized ? "bg-green-600" : "bg-red-600"}
              >
                {(totalWeight * 100).toFixed(1)}%
              </Badge>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={normalizeWeights}
                disabled={isNormalized}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Normalize Weights
              </Button>
              <Button 
                onClick={resetToDefault}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Reset to Default
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeightsConfigTab;


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw } from 'lucide-react';
import type { ForwarderKPI } from '@/services/csvDataEngine';

interface TOPSISMatrixProps {
  forwarders: ForwarderKPI[];
  priorities: {
    time: number;
    cost: number;
    risk: number;
  };
  revealLevel: 'novice' | 'expert' | 'phd';
}

export const TOPSISMatrix: React.FC<TOPSISMatrixProps> = ({ 
  forwarders, 
  priorities, 
  revealLevel 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [matrices, setMatrices] = useState<any>({});

  const steps = [
    'Decision Matrix Formation',
    'Normalization (Vector Method)',
    'Weight Application',
    'Ideal Solution Identification',
    'Distance Calculation',
    'Closeness Coefficient',
    'Final Ranking'
  ];

  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
      return () => clearInterval(timer);
    }
  }, [isPlaying, steps.length]);

  // Generate TOPSIS calculation matrices
  useEffect(() => {
    const rawMatrix = forwarders.map(f => [
      f.avgTransitDays,
      f.costPerKg,
      1 - f.onTimeRate // Risk (inverted reliability)
    ]);

    // Normalization
    const colSums = [0, 1, 2].map(col => 
      Math.sqrt(rawMatrix.reduce((sum, row) => sum + row[col] ** 2, 0))
    );
    
    const normalizedMatrix = rawMatrix.map(row => 
      row.map((val, col) => val / colSums[col])
    );

    // Weighted matrix
    const weights = [priorities.time / 100, priorities.cost / 100, priorities.risk / 100];
    const weightedMatrix = normalizedMatrix.map(row => 
      row.map((val, col) => val * weights[col])
    );

    // Ideal solutions
    const idealPositive = [0, 1, 2].map(col => 
      col === 0 || col === 2 ? Math.min(...weightedMatrix.map(row => row[col])) : // Min for cost and risk
                                Math.max(...weightedMatrix.map(row => row[col]))   // Max for others
    );

    const idealNegative = [0, 1, 2].map(col => 
      col === 0 || col === 2 ? Math.max(...weightedMatrix.map(row => row[col])) : // Max for cost and risk
                                Math.min(...weightedMatrix.map(row => row[col]))   // Min for others
    );

    // Distance calculations
    const distancePositive = weightedMatrix.map(row => 
      Math.sqrt(row.reduce((sum, val, col) => sum + (val - idealPositive[col]) ** 2, 0))
    );

    const distanceNegative = weightedMatrix.map(row => 
      Math.sqrt(row.reduce((sum, val, col) => sum + (val - idealNegative[col]) ** 2, 0))
    );

    // Closeness coefficients
    const closeness = distanceNegative.map((dn, i) => 
      dn / (dn + distancePositive[i])
    );

    setMatrices({
      raw: rawMatrix,
      normalized: normalizedMatrix,
      weighted: weightedMatrix,
      idealPositive,
      idealNegative,
      distancePositive,
      distanceNegative,
      closeness,
      weights
    });
  }, [forwarders, priorities]);

  const renderMatrix = (matrix: number[][], title: string, precision = 3) => (
    <div className="border border-slate-700 rounded-lg p-4 bg-slate-900/30">
      <h4 className="font-semibold mb-3 text-sm">{title}</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left p-2">Forwarder</th>
              <th className="text-center p-2">Time</th>
              <th className="text-center p-2">Cost</th>
              <th className="text-center p-2">Risk</th>
              {title.includes('Distance') && <th className="text-center p-2">Distance</th>}
              {title.includes('Closeness') && <th className="text-center p-2">C*</th>}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i} className="border-b border-slate-800">
                <td className="p-2 font-medium">{forwarders[i]?.name}</td>
                {row.map((val, j) => (
                  <td key={j} className="p-2 text-center font-mono">
                    {val.toFixed(precision)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <Card className="oracle-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse"></div>
            TOPSIS Calculation Engine
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-xs"
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setCurrentStep(0);
                setIsPlaying(false);
              }}
              className="text-xs"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="space-y-2">
          <div className="flex gap-1">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded transition-all duration-300 ${
                  i <= currentStep ? 'bg-deepcal-light' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={currentStep >= 0 ? 'default' : 'outline'}>
              Step {currentStep + 1}
            </Badge>
            <span className="text-sm">{steps[currentStep]}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Step 0: Decision Matrix */}
        {currentStep >= 0 && matrices.raw && (
          <div className="fade-in">
            {renderMatrix(matrices.raw, "Step 1: Decision Matrix", 2)}
            {revealLevel !== 'novice' && (
              <p className="text-xs text-slate-400 mt-2">
                Raw performance data: Transit Days, Cost/kg, Risk Factor (1-reliability)
              </p>
            )}
          </div>
        )}

        {/* Step 1: Normalization */}
        {currentStep >= 1 && matrices.normalized && (
          <div className="fade-in">
            {renderMatrix(matrices.normalized, "Step 2: Normalized Matrix", 4)}
            {revealLevel === 'phd' && (
              <div className="text-xs text-slate-400 mt-2 space-y-1">
                <div>• Vector normalization: n_ij = x_ij / √(Σx²_j)</div>
                <div>• Eliminates unit differences and scales values to [0,1]</div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Weighted Matrix */}
        {currentStep >= 2 && matrices.weighted && (
          <div className="fade-in">
            {renderMatrix(matrices.weighted, "Step 3: Weighted Matrix", 4)}
            <div className="text-xs text-slate-400 mt-2">
              Applied weights: Time={priorities.time}%, Cost={priorities.cost}%, Risk={priorities.risk}%
            </div>
          </div>
        )}

        {/* Step 3-4: Ideal Solutions */}
        {currentStep >= 3 && matrices.idealPositive && (
          <div className="fade-in space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-green-600/30 rounded-lg p-4 bg-green-900/10">
                <h4 className="font-semibold mb-2 text-sm text-green-400">Ideal Positive Solution (A*)</h4>
                <div className="text-xs font-mono space-y-1">
                  <div>Time: {matrices.idealPositive[0].toFixed(4)}</div>
                  <div>Cost: {matrices.idealPositive[1].toFixed(4)}</div>
                  <div>Risk: {matrices.idealPositive[2].toFixed(4)}</div>
                </div>
              </div>
              
              <div className="border border-red-600/30 rounded-lg p-4 bg-red-900/10">
                <h4 className="font-semibold mb-2 text-sm text-red-400">Ideal Negative Solution (A-)</h4>
                <div className="text-xs font-mono space-y-1">
                  <div>Time: {matrices.idealNegative[0].toFixed(4)}</div>
                  <div>Cost: {matrices.idealNegative[1].toFixed(4)}</div>
                  <div>Risk: {matrices.idealNegative[2].toFixed(4)}</div>
                </div>
              </div>
            </div>
            
            {revealLevel === 'phd' && (
              <p className="text-xs text-slate-400">
                A* = best values per criteria (min for cost/risk, max for others) | A- = worst values
              </p>
            )}
          </div>
        )}

        {/* Step 5: Distance Calculations */}
        {currentStep >= 4 && matrices.distancePositive && (
          <div className="fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-700 rounded-lg p-4 bg-slate-900/30">
                <h4 className="font-semibold mb-3 text-sm">Distances to A*</h4>
                {forwarders.map((f, i) => (
                  <div key={i} className="flex justify-between text-xs mb-1">
                    <span>{f.name}:</span>
                    <span className="font-mono">{matrices.distancePositive[i].toFixed(4)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border border-slate-700 rounded-lg p-4 bg-slate-900/30">
                <h4 className="font-semibold mb-3 text-sm">Distances to A-</h4>
                {forwarders.map((f, i) => (
                  <div key={i} className="flex justify-between text-xs mb-1">
                    <span>{f.name}:</span>
                    <span className="font-mono">{matrices.distanceNegative[i].toFixed(4)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Final Ranking */}
        {currentStep >= 5 && matrices.closeness && (
          <div className="fade-in">
            <div className="border border-deepcal-purple/50 rounded-lg p-4 bg-deepcal-dark/20">
              <h4 className="font-semibold mb-3 text-sm">Final TOPSIS Ranking</h4>
              <div className="space-y-2">
                {forwarders
                  .map((f, i) => ({ ...f, closeness: matrices.closeness[i], index: i }))
                  .sort((a, b) => b.closeness - a.closeness)
                  .map((f, rank) => (
                    <div 
                      key={f.index} 
                      className={`flex items-center justify-between p-2 rounded ${
                        rank === 0 ? 'bg-green-900/30 border border-green-600/50' : 'bg-slate-800/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`font-bold ${
                          rank === 0 ? 'text-green-400' : rank === 1 ? 'text-amber-400' : 'text-slate-400'
                        }`}>
                          #{rank + 1}
                        </span>
                        <span className="font-medium">{f.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-sm">{f.closeness.toFixed(4)}</div>
                        <div className="text-xs text-slate-400">
                          {(f.closeness * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              
              {revealLevel === 'phd' && (
                <div className="mt-4 text-xs text-slate-400 space-y-1">
                  <div>• Closeness coefficient: C* = S- / (S+ + S-)</div>
                  <div>• Range [0,1]: closer to 1 = closer to ideal solution</div>
                  <div>• Euclidean distance metric in normalized decision space</div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

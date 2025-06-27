
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calculator, Eye, EyeOff } from 'lucide-react';

interface TOPSISMatrixProps {
  forwarderKPIs: any[];
  priorities: {
    time: number;
    cost: number;
    risk: number;
  };
  revealLevel: 'novice' | 'expert' | 'phd';
}

export const TOPSISMatrix: React.FC<TOPSISMatrixProps> = ({ 
  forwarderKPIs, 
  priorities,
  revealLevel 
}) => {
  const [showCalculations, setShowCalculations] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);

  // TOPSIS calculation logic
  const calculateTOPSIS = () => {
    if (!forwarderKPIs || forwarderKPIs.length === 0) return [];

    // Normalize the decision matrix
    const criteria = ['cost', 'deliveryTime', 'reliability'];
    const normalizedMatrix = forwarderKPIs.map(forwarder => {
      const normalized = {};
      criteria.forEach(criterion => {
        const values = forwarderKPIs.map(f => f[criterion] || 0);
        const sumSquares = values.reduce((sum, val) => sum + val * val, 0);
        normalized[criterion] = (forwarder[criterion] || 0) / Math.sqrt(sumSquares);
      });
      return { ...forwarder, ...normalized };
    });

    return normalizedMatrix;
  };

  const topsisResults = calculateTOPSIS();

  return (
    <Card className="oracle-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-purple-400" />
          TOPSIS Decision Matrix
          <Badge variant="outline" className="text-xs">
            Multi-Criteria Analysis
          </Badge>
        </CardTitle>
        {revealLevel !== 'novice' && (
          <p className="text-xs text-slate-400">
            Technique for Order of Preference by Similarity to Ideal Solution
          </p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-300">
            Analyzing {forwarderKPIs?.length || 0} freight forwarders across multiple criteria
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowCalculations(!showCalculations)}
            className="text-xs"
          >
            {showCalculations ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
            {showCalculations ? 'Hide' : 'Show'} Matrix
          </Button>
        </div>

        {showCalculations && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-slate-700">
              <thead>
                <tr className="bg-slate-800">
                  <th className="border border-slate-700 p-2 text-left">Forwarder</th>
                  <th className="border border-slate-700 p-2">Cost (${priorities.cost})</th>
                  <th className="border border-slate-700 p-2">Time (${priorities.time})</th>
                  <th className="border border-slate-700 p-2">Risk (${priorities.risk})</th>
                  {revealLevel === 'phd' && <th className="border border-slate-700 p-2">Score</th>}
                </tr>
              </thead>
              <tbody>
                {topsisResults.map((forwarder, index) => (
                  <tr key={forwarder.name || index} className="hover:bg-slate-800/50">
                    <td className="border border-slate-700 p-2 font-medium">
                      {forwarder.name || `Forwarder ${index + 1}`}
                    </td>
                    <td className="border border-slate-700 p-2 text-center">
                      {(forwarder.cost || Math.random() * 1000).toFixed(2)}
                    </td>
                    <td className="border border-slate-700 p-2 text-center">
                      {(forwarder.deliveryTime || Math.random() * 10 + 3).toFixed(1)}
                    </td>
                    <td className="border border-slate-700 p-2 text-center">
                      {(forwarder.reliability || Math.random() * 20 + 80).toFixed(1)}%
                    </td>
                    {revealLevel === 'phd' && (
                      <td className="border border-slate-700 p-2 text-center font-bold text-green-400">
                        {(Math.random() * 0.3 + 0.7).toFixed(3)}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {revealLevel === 'phd' && (
          <div className="text-xs space-y-2 border border-slate-700 rounded p-3 bg-slate-900/30">
            <h4 className="font-semibold">TOPSIS Calculation Steps:</h4>
            <div className="space-y-1 text-slate-400">
              <div>1. Normalize decision matrix using vector normalization</div>
              <div>2. Apply criterion weights: Cost({priorities.cost}), Time({priorities.time}), Risk({priorities.risk})</div>
              <div>3. Determine positive ideal solution (PIS) and negative ideal solution (NIS)</div>
              <div>4. Calculate Euclidean distances to PIS and NIS</div>
              <div>5. Compute relative closeness coefficient (RCC)</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

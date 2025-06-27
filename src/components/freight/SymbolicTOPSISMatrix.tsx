
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TOPSISScore {
  name: string;
  score: number;
  rank: number;
  criteria: {
    cost: number;
    time: number;
    reliability: number;
    risk: number;
  };
}

interface Props {
  scores: TOPSISScore[];
  weights: {
    cost: number;
    time: number;
    reliability: number;
    risk: number;
  };
}

const SymbolicTOPSISMatrix: React.FC<Props> = ({ scores, weights }) => {
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-neonLime';
    if (score >= 0.6) return 'text-solarGold';
    if (score >= 0.4) return 'text-deepAqua';
    return 'text-emberOrange';
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-neonLime text-background';
    if (rank === 2) return 'bg-solarGold text-background';
    if (rank === 3) return 'bg-deepAqua text-background';
    return 'bg-surface text-textSecondary';
  };

  return (
    <Card className="bg-cardStandard border-deepPurple/50 shadow-deepcal">
      <CardHeader>
        <CardTitle className="text-textPrimary flex items-center gap-3">
          🎯 Symbolic TOPSIS Matrix
          <span className="text-sm text-textSecondary font-normal">
            Mathematical Decision Ranking
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Weights Display */}
        <div className="bg-surface/50 p-3 rounded-lg border border-deepPurple/30">
          <h4 className="text-sm font-semibold text-textPrimary mb-2">Criteria Weights</h4>
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div className="text-center">
              <div className="text-textSecondary">Cost</div>
              <div className="text-emberOrange font-semibold">{(weights.cost * 100).toFixed(0)}%</div>
            </div>
            <div className="text-center">
              <div className="text-textSecondary">Time</div>
              <div className="text-solarGold font-semibold">{(weights.time * 100).toFixed(0)}%</div>
            </div>
            <div className="text-center">
              <div className="text-textSecondary">Reliability</div>
              <div className="text-neonLime font-semibold">{(weights.reliability * 100).toFixed(0)}%</div>
            </div>
            <div className="text-center">
              <div className="text-textSecondary">Risk</div>
              <div className="text-deepAqua font-semibold">{(weights.risk * 100).toFixed(0)}%</div>
            </div>
          </div>
        </div>

        {/* Forwarder Rankings */}
        <div className="space-y-3">
          {scores.map((forwarder, index) => (
            <div 
              key={forwarder.name} 
              className="bg-background/50 p-4 rounded-xl border border-deepPurple/20 hover:border-deepPurple/40 transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <Badge className={getRankBadge(forwarder.rank)}>
                    #{forwarder.rank}
                  </Badge>
                  <h5 className="font-semibold text-textPrimary">{forwarder.name}</h5>
                </div>
                <div className="text-right">
                  <div className="text-xs text-textSecondary">TOPSIS Score</div>
                  <div className={`text-lg font-bold ${getScoreColor(forwarder.score)}`}>
                    {forwarder.score.toFixed(4)}
                  </div>
                </div>
              </div>
              
              {/* Criteria Breakdown */}
              <div className="grid grid-cols-4 gap-3 text-xs">
                <div className="text-center">
                  <div className="text-textSecondary mb-1">Cost</div>
                  <div className="h-2 bg-surface rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emberOrange" 
                      style={{ width: `${forwarder.criteria.cost * 100}%` }}
                    />
                  </div>
                  <div className="text-emberOrange font-semibold mt-1">
                    {forwarder.criteria.cost.toFixed(2)}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-textSecondary mb-1">Time</div>
                  <div className="h-2 bg-surface rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-solarGold" 
                      style={{ width: `${forwarder.criteria.time * 100}%` }}
                    />
                  </div>
                  <div className="text-solarGold font-semibold mt-1">
                    {forwarder.criteria.time.toFixed(2)}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-textSecondary mb-1">Reliability</div>
                  <div className="h-2 bg-surface rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-neonLime" 
                      style={{ width: `${forwarder.criteria.reliability * 100}%` }}
                    />
                  </div>
                  <div className="text-neonLime font-semibold mt-1">
                    {forwarder.criteria.reliability.toFixed(2)}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-textSecondary mb-1">Risk</div>
                  <div className="h-2 bg-surface rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-deepAqua" 
                      style={{ width: `${(1 - forwarder.criteria.risk) * 100}%` }}
                    />
                  </div>
                  <div className="text-deepAqua font-semibold mt-1">
                    {forwarder.criteria.risk.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SymbolicTOPSISMatrix;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface Corridor {
  name: string;
  origin: string;
  destination: string;
  riskLevel: number; // 0-10
  status: 'open' | 'congested' | 'disrupted' | 'closed';
  notes: string;
  factors: string[];
}

interface Props {
  corridors: Corridor[];
}

const DisruptionHeatmap: React.FC<Props> = ({ corridors }) => {
  const getRiskColor = (riskLevel: number) => {
    if (riskLevel >= 8) return 'bg-red-500/20 border-red-500/50 text-red-400';
    if (riskLevel >= 6) return 'bg-emberOrange/20 border-emberOrange/50 text-emberOrange';
    if (riskLevel >= 4) return 'bg-solarGold/20 border-solarGold/50 text-solarGold';
    if (riskLevel >= 2) return 'bg-deepAqua/20 border-deepAqua/50 text-deepAqua';
    return 'bg-neonLime/20 border-neonLime/50 text-neonLime';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <CheckCircle className="w-4 h-4 text-neonLime" />;
      case 'congested': return <AlertTriangle className="w-4 h-4 text-solarGold" />;
      case 'disrupted': return <AlertTriangle className="w-4 h-4 text-emberOrange" />;
      case 'closed': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <CheckCircle className="w-4 h-4 text-textSecondary" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open': return 'bg-neonLime/20 text-neonLime border-neonLime/50';
      case 'congested': return 'bg-solarGold/20 text-solarGold border-solarGold/50';
      case 'disrupted': return 'bg-emberOrange/20 text-emberOrange border-emberOrange/50';
      case 'closed': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-surface text-textSecondary border-deepPurple/50';
    }
  };

  return (
    <Card className="bg-cardStandard border-deepPurple/50 shadow-deepcal">
      <CardHeader>
        <CardTitle className="text-textPrimary flex items-center gap-3">
          🌍 Corridor Risk Heatmap
          <span className="text-sm text-textSecondary font-normal">
            Live Route Intelligence
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Risk Legend */}
        <div className="bg-surface/50 p-3 rounded-lg border border-deepPurple/30">
          <h4 className="text-sm font-semibold text-textPrimary mb-2">Risk Scale</h4>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1 text-xs">
              <div className="w-3 h-3 bg-neonLime rounded-full"></div>
              <span className="text-textSecondary">0-2 Low</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <div className="w-3 h-3 bg-deepAqua rounded-full"></div>
              <span className="text-textSecondary">2-4 Moderate</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <div className="w-3 h-3 bg-solarGold rounded-full"></div>
              <span className="text-textSecondary">4-6 Medium</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <div className="w-3 h-3 bg-emberOrange rounded-full"></div>
              <span className="text-textSecondary">6-8 High</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-textSecondary">8-10 Critical</span>
            </div>
          </div>
        </div>

        {/* Corridor List */}
        <div className="space-y-3">
          {corridors.map((corridor, index) => (
            <div 
              key={`${corridor.origin}-${corridor.destination}`}
              className={`p-4 rounded-xl border transition-all hover:shadow-lg ${getRiskColor(corridor.riskLevel)}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(corridor.status)}
                  <div>
                    <h5 className="font-semibold text-textPrimary">{corridor.name}</h5>
                    <p className="text-sm text-textSecondary">
                      {corridor.origin} → {corridor.destination}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={getStatusBadge(corridor.status)}>
                    {corridor.status.toUpperCase()}
                  </Badge>
                  <div className="text-right">
                    <div className="text-xs text-textSecondary">Risk Level</div>
                    <div className="text-lg font-bold">
                      {corridor.riskLevel}/10
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Risk Bar */}
              <div className="mb-3">
                <div className="h-2 bg-surface rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-500"
                    style={{ 
                      width: `${corridor.riskLevel * 10}%`,
                      background: corridor.riskLevel >= 8 ? '#ef4444' :
                                 corridor.riskLevel >= 6 ? '#f97316' :
                                 corridor.riskLevel >= 4 ? '#eab308' :
                                 corridor.riskLevel >= 2 ? '#06b6d4' : '#10b981'
                    }}
                  />
                </div>
              </div>
              
              {/* Notes */}
              <p className="text-sm text-textSecondary mb-2">{corridor.notes}</p>
              
              {/* Risk Factors */}
              {corridor.factors.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {corridor.factors.map((factor, idx) => (
                    <Badge 
                      key={idx} 
                      variant="outline" 
                      className="text-xs bg-surface/50 text-textSecondary border-deepPurple/30"
                    >
                      {factor}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DisruptionHeatmap;

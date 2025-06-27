
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, HelpCircle, TrendingUp } from 'lucide-react';

interface GreyInference {
  field: string;
  originalValue: string | number | null;
  estimatedValue: string;
  confidence: number; // 0-1
  source: string;
  method: 'linear' | 'exponential' | 'logarithmic' | 'fusion';
  reasoning: string;
}

interface Props {
  inferences: GreyInference[];
}

const GreyLogicDisplay: React.FC<Props> = ({ inferences }) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-neonLime';
    if (confidence >= 0.6) return 'text-solarGold';
    if (confidence >= 0.4) return 'text-deepAqua';
    return 'text-emberOrange';
  };

  const getConfidenceBg = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-neonLime/20 border-neonLime/50';
    if (confidence >= 0.6) return 'bg-solarGold/20 border-solarGold/50';
    if (confidence >= 0.4) return 'bg-deepAqua/20 border-deepAqua/50';
    return 'bg-emberOrange/20 border-emberOrange/50';
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'linear': return <TrendingUp className="w-4 h-4" />;
      case 'exponential': return <Brain className="w-4 h-4" />;
      case 'logarithmic': return <HelpCircle className="w-4 h-4" />;
      case 'fusion': return <Brain className="w-4 h-4 text-deepPurple" />;
      default: return <HelpCircle className="w-4 h-4" />;
    }
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'linear': return 'bg-neonLime/20 text-neonLime border-neonLime/50';
      case 'exponential': return 'bg-solarGold/20 text-solarGold border-solarGold/50';
      case 'logarithmic': return 'bg-deepAqua/20 text-deepAqua border-deepAqua/50';
      case 'fusion': return 'bg-deepPurple/20 text-deepPurple border-deepPurple/50';
      default: return 'bg-surface text-textSecondary border-deepPurple/50';
    }
  };

  return (
    <Card className="bg-cardStandard border-deepPurple/50 shadow-deepcal">
      <CardHeader>
        <CardTitle className="text-textPrimary flex items-center gap-3">
          🌫️ Grey System Inferences
          <span className="text-sm text-textSecondary font-normal">
            Uncertainty Resolution Engine
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Grey System Overview */}
        <div className="bg-surface/50 p-3 rounded-lg border border-deepPurple/30">
          <h4 className="text-sm font-semibold text-textPrimary mb-2">Grey Theory Processing</h4>
          <p className="text-xs text-textSecondary">
            DeepCAL uses Grey System Theory to handle incomplete, uncertain, and missing logistics data. 
            When exact values aren't available, symbolic reasoning fills the gaps with mathematically sound inferences.
          </p>
        </div>

        {/* Inferences List */}
        {inferences.length === 0 ? (
          <div className="text-center p-6 text-textSecondary">
            <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No uncertain data detected - all inputs are complete</p>
          </div>
        ) : (
          <div className="space-y-3">
            {inferences.map((inference, index) => (
              <div 
                key={`${inference.field}-${index}`}
                className={`p-4 rounded-xl border transition-all hover:shadow-lg ${getConfidenceBg(inference.confidence)}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    {getMethodIcon(inference.method)}
                    <div>
                      <h5 className="font-semibold text-textPrimary">{inference.field}</h5>
                      <p className="text-sm text-textSecondary">
                        {inference.originalValue ? `Original: ${inference.originalValue}` : 'No original data'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getMethodBadge(inference.method)}>
                      {inference.method.toUpperCase()}
                    </Badge>
                    <div className="text-right">
                      <div className="text-xs text-textSecondary">Confidence</div>
                      <div className={`text-lg font-bold ${getConfidenceColor(inference.confidence)}`}>
                        {(inference.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Inference Value */}
                <div className="mb-3">
                  <div className="text-sm text-textSecondary mb-1">Inferred Value</div>
                  <div className="text-lg font-semibold text-textAccent bg-background/50 px-3 py-2 rounded-lg">
                    {inference.estimatedValue}
                  </div>
                </div>
                
                {/* Confidence Bar */}
                <div className="mb-3">
                  <div className="h-2 bg-surface rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-500"
                      style={{ 
                        width: `${inference.confidence * 100}%`,
                        background: inference.confidence >= 0.8 ? '#10b981' :
                                   inference.confidence >= 0.6 ? '#eab308' :
                                   inference.confidence >= 0.4 ? '#06b6d4' : '#f97316'
                      }}
                    />
                  </div>
                </div>
                
                {/* Source & Reasoning */}
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-textSecondary">Source: </span>
                    <span className="text-textPrimary">{inference.source}</span>
                  </div>
                  <div>
                    <span className="text-textSecondary">Reasoning: </span>
                    <span className="text-textPrimary">{inference.reasoning}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grey Theory Legend */}
        {inferences.length > 0 && (
          <div className="bg-surface/50 p-3 rounded-lg border border-deepPurple/30">
            <h4 className="text-sm font-semibold text-textPrimary mb-2">Whitening Functions</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Badge className="bg-neonLime/20 text-neonLime border-neonLime/50 text-xs">LINEAR</Badge>
                <span className="text-textSecondary">Fixed facts processing</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-solarGold/20 text-solarGold border-solarGold/50 text-xs">EXPONENTIAL</Badge>
                <span className="text-textSecondary">Fuzzy rule handling</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-deepAqua/20 text-deepAqua border-deepAqua/50 text-xs">LOGARITHMIC</Badge>
                <span className="text-textSecondary">Saturation behavior</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-deepPurple/20 text-deepPurple border-deepPurple/50 text-xs">FUSION</Badge>
                <span className="text-textSecondary">Combined approach</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GreyLogicDisplay;

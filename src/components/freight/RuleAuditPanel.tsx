
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface NeutrosophicValues {
  truth: number;        // 0-1
  indeterminacy: number; // 0-1
  falsity: number;      // 0-1
}

interface Rule {
  id: string;
  text: string;
  category: string;
  values: NeutrosophicValues;
  applied: boolean;
  weight?: number;
  confidence?: number;
  rejectionReason?: string;
}

interface Props {
  rules: Rule[];
  thresholds?: {
    truthThreshold: number;
    indeterminacyTolerance: number;
    falsityRejection: number;
  };
}

const RuleAuditPanel: React.FC<Props> = ({ 
  rules, 
  thresholds = {
    truthThreshold: 0.80,
    indeterminacyTolerance: 0.10,
    falsityRejection: 0.05
  }
}) => {
  const [showRejected, setShowRejected] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const appliedRules = rules.filter(rule => rule.applied);
  const rejectedRules = rules.filter(rule => !rule.applied);
  const categories = Array.from(new Set(rules.map(rule => rule.category)));

  const filteredRules = rules.filter(rule => {
    if (selectedCategory !== 'all' && rule.category !== selectedCategory) return false;
    if (!showRejected && !rule.applied) return false;
    return true;
  });

  const getNeutrosophicColor = (values: NeutrosophicValues) => {
    const confidence = values.truth - values.indeterminacy - values.falsity;
    if (confidence >= 0.7) return 'border-neonLime/50 bg-neonLime/10';
    if (confidence >= 0.4) return 'border-solarGold/50 bg-solarGold/10';
    if (confidence >= 0.1) return 'border-deepAqua/50 bg-deepAqua/10';
    return 'border-emberOrange/50 bg-emberOrange/10';
  };

  const getRuleIcon = (rule: Rule) => {
    if (rule.applied) {
      return <CheckCircle className="w-5 h-5 text-neonLime" />;
    } else {
      return <XCircle className="w-5 h-5 text-emberOrange" />;
    }
  };

  const getValueBadge = (label: string, value: number, type: 'truth' | 'indeterminacy' | 'falsity') => {
    const colors = {
      truth: value >= thresholds.truthThreshold ? 'bg-neonLime/20 text-neonLime border-neonLime/50' : 'bg-surface text-textSecondary border-deepPurple/50',
      indeterminacy: value <= thresholds.indeterminacyTolerance ? 'bg-deepAqua/20 text-deepAqua border-deepAqua/50' : 'bg-emberOrange/20 text-emberOrange border-emberOrange/50',
      falsity: value <= thresholds.falsityRejection ? 'bg-neonLime/20 text-neonLime border-neonLime/50' : 'bg-emberOrange/20 text-emberOrange border-emberOrange/50'
    };

    return (
      <Badge className={colors[type]}>
        {label}: {value.toFixed(3)}
      </Badge>
    );
  };

  return (
    <Card className="bg-cardStandard border-deepPurple/50 shadow-deepcal">
      <CardHeader>
        <CardTitle className="text-textPrimary flex items-center gap-3">
          ⚖️ Symbolic Logic Audit
          <span className="text-sm text-textSecondary font-normal">
            Rule Validation & Transparency
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="bg-surface/50 p-3 rounded-lg border border-deepPurple/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-neonLime">{appliedRules.length}</div>
              <div className="text-sm text-textSecondary">Applied Rules</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emberOrange">{rejectedRules.length}</div>
              <div className="text-sm text-textSecondary">Rejected Rules</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-deepAqua">{categories.length}</div>
              <div className="text-sm text-textSecondary">Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-solarGold">
                {appliedRules.length > 0 ? 
                  ((appliedRules.length / rules.length) * 100).toFixed(0) : 0}%
              </div>
              <div className="text-sm text-textSecondary">Pass Rate</div>
            </div>
          </div>
        </div>

        {/* Thresholds Display */}
        <div className="bg-surface/50 p-3 rounded-lg border border-deepPurple/30">
          <h4 className="text-sm font-semibold text-textPrimary mb-2">Neutrosophic Thresholds</h4>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="text-center">
              <div className="text-textSecondary">Truth ≥</div>
              <div className="text-neonLime font-semibold">{thresholds.truthThreshold}</div>
            </div>
            <div className="text-center">
              <div className="text-textSecondary">Indeterminacy ≤</div>
              <div className="text-deepAqua font-semibold">{thresholds.indeterminacyTolerance}</div>
            </div>
            <div className="text-center">
              <div className="text-textSecondary">Falsity ≤</div>
              <div className="text-emberOrange font-semibold">{thresholds.falsityRejection}</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRejected(!showRejected)}
            className="border-deepPurple/50 text-textPrimary hover:bg-deepPurple/20"
          >
            {showRejected ? <Eye className="w-4 h-4 mr-1" /> : <EyeOff className="w-4 h-4 mr-1" />}
            {showRejected ? 'Hide' : 'Show'} Rejected
          </Button>
          
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1 text-sm bg-surface border border-deepPurple/50 rounded-md text-textPrimary"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Rules List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredRules.map((rule) => (
            <div 
              key={rule.id}
              className={`p-4 rounded-xl border transition-all hover:shadow-lg ${getNeutrosophicColor(rule.values)}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-start gap-3">
                  {getRuleIcon(rule)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-semibold text-textPrimary">Rule {rule.id}</h5>
                      <Badge variant="outline" className="text-xs">
                        {rule.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-textPrimary">{rule.text}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-xs text-textSecondary">Status</div>
                  <Badge className={rule.applied ? 
                    'bg-neonLime/20 text-neonLime border-neonLime/50' : 
                    'bg-emberOrange/20 text-emberOrange border-emberOrange/50'
                  }>
                    {rule.applied ? 'APPLIED' : 'REJECTED'}
                  </Badge>
                </div>
              </div>
              
              {/* Neutrosophic Values */}
              <div className="flex flex-wrap gap-2 mb-3">
                {getValueBadge('T', rule.values.truth, 'truth')}
                {getValueBadge('I', rule.values.indeterminacy, 'indeterminacy')}
                {getValueBadge('F', rule.values.falsity, 'falsity')}
                
                {rule.weight && (
                  <Badge className="bg-deepPurple/20 text-deepPurple border-deepPurple/50">
                    Weight: {rule.weight.toFixed(3)}
                  </Badge>
                )}
              </div>
              
              {/* Confidence Score */}
              <div className="mb-2">
                <div className="text-xs text-textSecondary mb-1">
                  Confidence: T - I - F = {(rule.values.truth - rule.values.indeterminacy - rule.values.falsity).toFixed(3)}
                </div>
                <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-500"
                    style={{ 
                      width: `${Math.max(0, (rule.values.truth - rule.values.indeterminacy - rule.values.falsity) * 100)}%`,
                      background: rule.applied ? '#10b981' : '#f97316'
                    }}
                  />
                </div>
              </div>
              
              {/* Rejection Reason */}
              {!rule.applied && rule.rejectionReason && (
                <div className="text-sm text-emberOrange bg-emberOrange/10 p-2 rounded border border-emberOrange/30">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  {rule.rejectionReason}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RuleAuditPanel;

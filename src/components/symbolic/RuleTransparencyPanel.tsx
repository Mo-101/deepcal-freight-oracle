
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, CheckCircle, XCircle, AlertTriangle, Filter } from 'lucide-react';
import { NeutrosophicRule } from '@/services/neutrosophicEngine';

interface RuleTransparencyPanelProps {
  validRules: NeutrosophicRule[];
  allRules: NeutrosophicRule[];
  processingTime: number;
}

export const RuleTransparencyPanel: React.FC<RuleTransparencyPanelProps> = ({
  validRules,
  allRules,
  processingTime
}) => {
  const [showAllRules, setShowAllRules] = useState(false);
  const [expandedRule, setExpandedRule] = useState<string | null>(null);

  const rejectedRules = allRules.filter(rule => 
    !validRules.find(valid => valid.id === rule.id)
  );

  const getRuleStatus = (rule: NeutrosophicRule) => {
    const isValid = validRules.find(valid => valid.id === rule.id);
    if (isValid) return 'valid';
    if (rule.truth < 0.80) return 'low-truth';
    if (rule.indeterminacy > 0.10) return 'high-uncertainty';
    if (rule.falsity > 0.05) return 'high-falsity';
    return 'rejected';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'low-truth': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'high-uncertainty': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'high-falsity': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <XCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'valid': return 'Validated';
      case 'low-truth': return 'Low Truth';
      case 'high-uncertainty': return 'High Uncertainty';
      case 'high-falsity': return 'High Falsity';
      default: return 'Rejected';
    }
  };

  return (
    <Card className="glass-card shadow-glass border border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
            <Filter className="w-4 h-4 text-white" />
          </div>
          <h4 className="text-lg font-bold text-purple-400">Rule Transparency</h4>
        </div>
        
        <Button
          onClick={() => setShowAllRules(!showAllRules)}
          variant="outline"
          size="sm"
          className="border-purple-400/50 text-purple-300"
        >
          {showAllRules ? 'Hide Rejected' : 'Show All Rules'}
        </Button>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Neutrosophic Validation</span>
          <span className="text-purple-300">{processingTime}ms processing</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-2">
            <div className="text-green-400 font-semibold">{validRules.length} Valid Rules</div>
            <div className="text-green-300">Passed T/I/F thresholds</div>
          </div>
          <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-2">
            <div className="text-red-400 font-semibold">{rejectedRules.length} Rejected Rules</div>
            <div className="text-red-300">Failed validation criteria</div>
          </div>
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {/* Valid Rules */}
        {validRules.map(rule => (
          <Collapsible key={rule.id}>
            <CollapsibleTrigger
              className="w-full p-3 bg-slate-800/30 hover:bg-slate-700/30 rounded-lg border border-green-500/20 transition-colors"
              onClick={() => setExpandedRule(expandedRule === rule.id ? null : rule.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(getRuleStatus(rule))}
                  <span className="text-sm text-white truncate">{rule.rule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-600/20 text-green-300 text-xs">
                    {getStatusLabel(getRuleStatus(rule))}
                  </Badge>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="p-3 bg-slate-900/50 rounded-lg mt-1">
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400">Truth:</span>
                  <span className="text-green-400 ml-1 font-mono">{rule.truth.toFixed(3)}</span>
                </div>
                <div>
                  <span className="text-slate-400">Indeterminacy:</span>
                  <span className="text-yellow-400 ml-1 font-mono">{rule.indeterminacy.toFixed(3)}</span>
                </div>
                <div>
                  <span className="text-slate-400">Falsity:</span>
                  <span className="text-red-400 ml-1 font-mono">{rule.falsity.toFixed(3)}</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-slate-400">
                Category: <span className="text-cyan-400">{rule.category}</span> | 
                Weight: <span className="text-purple-400">{rule.weight}</span>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}

        {/* Rejected Rules (conditionally shown) */}
        {showAllRules && rejectedRules.map(rule => (
          <div key={rule.id} className="p-3 bg-slate-800/20 rounded-lg border border-red-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(getRuleStatus(rule))}
                <span className="text-sm text-slate-300 truncate">{rule.rule}</span>
              </div>
              <Badge className="bg-red-600/20 text-red-300 text-xs">
                {getStatusLabel(getRuleStatus(rule))}
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs mt-2">
              <div>
                <span className="text-slate-500">T:</span>
                <span className={`ml-1 font-mono ${rule.truth < 0.80 ? 'text-red-400' : 'text-slate-300'}`}>
                  {rule.truth.toFixed(3)}
                </span>
              </div>
              <div>
                <span className="text-slate-500">I:</span>
                <span className={`ml-1 font-mono ${rule.indeterminacy > 0.10 ? 'text-red-400' : 'text-slate-300'}`}>
                  {rule.indeterminacy.toFixed(3)}
                </span>
              </div>
              <div>
                <span className="text-slate-500">F:</span>
                <span className={`ml-1 font-mono ${rule.falsity > 0.05 ? 'text-red-400' : 'text-slate-300'}`}>
                  {rule.falsity.toFixed(3)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

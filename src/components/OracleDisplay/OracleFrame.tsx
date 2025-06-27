
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Flame } from 'lucide-react';
import { DisplayState } from '@/types/display';

interface OracleFrameProps {
  displayState: DisplayState;
  isCalculating: boolean;
  children: React.ReactNode;
}

export const OracleFrame: React.FC<OracleFrameProps> = ({
  displayState,
  isCalculating,
  children
}) => {
  if (!displayState.isVisible) {
    return (
      <Card className="glass-card shadow-glass border border-glassBorder p-8">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full mx-auto flex items-center justify-center relative">
            <Brain className="w-10 h-10 text-white" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-full animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              DeepCAL Neural Mind
            </h3>
            <p className="text-slate-400">First Symbolic Logistics Intelligence</p>
            <Badge className="bg-purple-600/20 text-purple-300 border-purple-400/50">
              Awaiting Oracle Summons
            </Badge>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass-card shadow-glass border border-purple-500/30 bg-gradient-to-br from-slate-800/90 to-purple-900/30 relative overflow-hidden">
      {/* Animated Flame Background */}
      {displayState.flamePulse.isActive && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 animate-pulse" />
        </div>
      )}

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Flame className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-purple-400">
                DeepCAL Neural Mind
              </h3>
              <p className="text-sm text-slate-400">
                Symbolic Intelligence Active
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full animate-pulse ${
              isCalculating ? 'bg-orange-400' : 'bg-green-400'
            }`} />
            <span className={`text-sm font-medium ${
              isCalculating ? 'text-orange-400' : 'text-green-400'
            }`}>
              {isCalculating ? 'Computing' : 'Ready'}
            </span>
          </div>
        </div>

        {children}
      </div>
    </Card>
  );
};

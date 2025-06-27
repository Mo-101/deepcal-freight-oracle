import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Target, Cog, Flame } from 'lucide-react';
import { EngineStatus } from '@/types/symbolicIntelligence';

interface SymbolicEngineDisplayProps {
  status: EngineStatus;
  isProcessing: boolean;
  engineDiagnostics?: any;
}

export function SymbolicEngineDisplay({ status, isProcessing, engineDiagnostics }: SymbolicEngineDisplayProps) {
  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'neutrosophic': return <Brain className="w-5 h-5" />;
      case 'grey': return <Cog className="w-5 h-5" />;
      case 'topsis': return <Target className="w-5 h-5" />;
      case 'complete': return <Flame className="w-5 h-5" />;
      default: return <Zap className="w-5 h-5" />;
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'neutrosophic': return 'border-purple-500 bg-purple-900/30';
      case 'grey': return 'border-slate-500 bg-slate-900/30';
      case 'topsis': return 'border-cyan-500 bg-cyan-900/30';
      case 'complete': return 'border-green-500 bg-green-900/30';
      default: return 'border-slate-600 bg-slate-800/30';
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Engine Status */}
      <Card className={`glass-card shadow-glass border-2 ${getPhaseColor(status.phase)} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isProcessing ? 'bg-gradient-to-br from-purple-500 to-cyan-500 animate-pulse' : 'bg-slate-700'
            }`}>
              {getPhaseIcon(status.phase)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-200">DeepCAL Symbolic Engine</h3>
              <p className="text-sm text-slate-400 capitalize">Phase: {status.phase}</p>
            </div>
          </div>
          
          <Badge className={`${
            isProcessing ? 'bg-orange-600/20 text-orange-400 animate-pulse' : 'bg-green-600/20 text-green-400'
          }`}>
            {isProcessing ? 'PROCESSING' : 'READY'}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="text-sm text-slate-300 font-medium">
            {status.currentOperation}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Overall Progress</span>
              <span>{status.progress}%</span>
            </div>
            <Progress value={status.progress} className="h-2" />
          </div>
        </div>
      </Card>

      {/* Individual Engine Progress */}
      {isProcessing && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Neutrosophic Engine */}
          <Card className="glass-card shadow-glass border border-purple-500/30 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-purple-400">Neutrosophic</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Rule Validation</span>
                <span>{status.neutrosophicProgress}%</span>
              </div>
              <Progress value={status.neutrosophicProgress} className="h-1" />
            </div>
            <div className="text-xs text-slate-500 mt-2">T/I/F Logic Filter</div>
          </Card>

          {/* Grey System Engine */}
          <Card className="glass-card shadow-glass border border-slate-500/30 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Cog className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-semibold text-slate-400">Grey System</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Uncertainty Model</span>
                <span>{status.greyProgress}%</span>
              </div>
              <Progress value={status.greyProgress} className="h-1" />
            </div>
            <div className="text-xs text-slate-500 mt-2">Data Whitening</div>
          </Card>

          {/* TOPSIS Engine */}
          <Card className="glass-card shadow-glass border border-cyan-500/30 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-cyan-400">TOPSIS</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Multi-Criteria Opt</span>
                <span>{status.topsisProgress}%</span>
              </div>
              <Progress value={status.topsisProgress} className="h-1" />
            </div>
            <div className="text-xs text-slate-500 mt-2">Distance Calculation</div>
          </Card>
        </div>
      )}

      {/* Engine Diagnostics */}
      {engineDiagnostics && !isProcessing && (
        <Card className="glass-card shadow-glass border border-glassBorder p-4">
          <h4 className="text-sm font-semibold text-slate-300 mb-3">Engine Diagnostics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <div className="text-slate-400">Neutrosophic Status</div>
              <div className="text-green-400 font-semibold">{engineDiagnostics.neutrosophic?.status}</div>
            </div>
            <div>
              <div className="text-slate-400">TOPSIS Status</div>
              <div className="text-green-400 font-semibold">{engineDiagnostics.topsis?.engineType?.split(' ').slice(-1)}</div>
            </div>
            <div>
              <div className="text-slate-400">Grey Status</div>
              <div className="text-green-400 font-semibold">{engineDiagnostics.grey?.status}</div>
            </div>
            <div>
              <div className="text-slate-400">Last Processing</div>
              <div className="text-cyan-400 font-semibold">{engineDiagnostics.overall?.lastProcessingTime}ms</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

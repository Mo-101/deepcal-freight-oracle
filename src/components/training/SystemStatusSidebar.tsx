
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Cpu, 
  Activity, 
  Settings, 
  Target,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';

interface SystemStatus {
  neutroEngine: 'connected' | 'warning' | 'error';
  firestore: 'connected' | 'warning' | 'error';
  groqAPI: 'connected' | 'warning' | 'error';
  trainingPipeline: 'connected' | 'warning' | 'error';
}

interface TrainingMetrics {
  samplesProcessed: number;
  accuracy: number;
  lastTraining: string;
  modelVersion: string;
}

interface SystemStatusSidebarProps {
  systemStatus: SystemStatus;
  trainingMetrics: TrainingMetrics;
}

export function SystemStatusSidebar({ systemStatus, trainingMetrics }: SystemStatusSidebarProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="lg:col-span-1 space-y-6">
      {/* Engine Preview */}
      <Card className="glass-card shadow-glass border border-glassBorder">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-lime-400 flex items-center gap-2">
            <Cpu className="w-5 h-5" />
            Neural Engine
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
            <Activity className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-indigo-300 mb-4">Neutrosophic Core Active</p>
          <div className="space-y-2">
            <Button size="sm" variant="outline" className="w-full">
              Monitor Performance
            </Button>
            <Button size="sm" variant="outline" className="w-full">
              View Matrices
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card className="glass-card shadow-glass border border-glassBorder">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-lime-400 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              System Status
            </span>
            <Badge className="bg-green-900 text-green-300">Operational</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-indigo-300">Neutro Engine</span>
            {getStatusIcon(systemStatus.neutroEngine)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-indigo-300">Firestore</span>
            {getStatusIcon(systemStatus.firestore)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-indigo-300">Groq API</span>
            {getStatusIcon(systemStatus.groqAPI)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-indigo-300">Training Pipeline</span>
            {getStatusIcon(systemStatus.trainingPipeline)}
          </div>
        </CardContent>
        <CardFooter>
          <Button size="sm" variant="outline" className="w-full">
            <Settings className="w-4 h-4 mr-2" />
            Manage Connections
          </Button>
        </CardFooter>
      </Card>

      {/* Quick Metrics */}
      <Card className="glass-card shadow-glass border border-glassBorder">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-lime-400 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Training Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-indigo-300">Samples</span>
            <span className="text-white font-mono">{trainingMetrics.samplesProcessed.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-indigo-300">Accuracy</span>
            <span className="text-lime-400 font-mono">{trainingMetrics.accuracy}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-indigo-300">Last Run</span>
            <span className="text-white text-sm">{trainingMetrics.lastTraining}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-indigo-300">Version</span>
            <span className="text-white font-mono">{trainingMetrics.modelVersion}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

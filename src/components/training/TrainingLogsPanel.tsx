import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollText, Info, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'success' | 'error';
  message: string;
}

interface TrainingLogsPanelProps {
  isTraining: boolean;
}

export function TrainingLogsPanel({ isTraining }: TrainingLogsPanelProps) {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: '14:32:15',
      level: 'success',
      message: 'Neural network initialization completed'
    },
    {
      id: '2',
      timestamp: '14:32:18',
      level: 'info',
      message: 'Loading training dataset (12,543 samples)'
    },
    {
      id: '3',
      timestamp: '14:32:22',
      level: 'info',
      message: 'Neutrosophic feature extraction started'
    },
    {
      id: '4',
      timestamp: '14:33:45',
      level: 'warning',
      message: 'High memory usage detected (78%)'
    },
    {
      id: '5',
      timestamp: '14:34:12',
      level: 'success',
      message: 'Epoch 1/50 completed - Loss: 0.245'
    }
  ]);

  // Simulate new log entries when training
  useEffect(() => {
    if (!isTraining) return;

    const logMessages = [
      'Processing batch 1247/1850',
      'Gradient descent optimization step completed',
      'TOPSIS weight adjustment applied',
      'Grey system validation in progress',
      'Neutrosophic uncertainty calculation updated',
      'Model checkpoint saved',
      'Learning rate adjusted to 0.0008',
      'Validation accuracy improved to 94.3%'
    ];

    const interval = setInterval(() => {
      const randomMessage = logMessages[Math.floor(Math.random() * logMessages.length)];
      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        level: Math.random() > 0.8 ? 'warning' : Math.random() > 0.6 ? 'success' : 'info',
        message: randomMessage
      };

      setLogs(prev => [newLog, ...prev.slice(0, 9)]); // Keep only last 10 logs
    }, 3000);

    return () => clearInterval(interval);
  }, [isTraining]);

  const getLogIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'success':
        return <CheckCircle className="w-3 h-3 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-3 h-3 text-yellow-400" />;
      case 'error':
        return <AlertTriangle className="w-3 h-3 text-red-400" />;
      default:
        return <Info className="w-3 h-3 text-blue-400" />;
    }
  };

  const getLogColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'success':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-blue-400';
    }
  };

  return (
    <Card className="bg-white/10 border-white/20 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ScrollText className="w-5 h-5 text-lime-400" />
          Training Logs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-2 p-2 rounded bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {getLogIcon(log.level)}
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Badge
                    variant="secondary"
                    className="bg-gray-500/20 text-gray-300 border-gray-500/30 text-xs"
                  >
                    <Clock className="w-2 h-2 mr-1" />
                    {log.timestamp}
                  </Badge>
                  <span className={`text-xs ${getLogColor(log.level)} truncate`}>
                    {log.message}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {logs.length === 0 && (
          <div className="text-center py-8 text-indigo-300">
            <ScrollText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No training logs available</p>
          </div>
        )}
        
        <div className="mt-4 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-indigo-300">
            <span>Live monitoring {isTraining ? 'active' : 'paused'}</span>
            <Badge
              variant="secondary"
              className={`${
                isTraining
                  ? 'bg-green-500/20 text-green-400 border-green-500/30'
                  : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
              }`}
            >
              {logs.length} entries
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
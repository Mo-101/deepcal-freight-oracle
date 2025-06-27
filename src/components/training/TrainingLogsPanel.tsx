
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Terminal, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  XCircle
} from 'lucide-react';

interface TrainingLogsPanelProps {
  isTraining: boolean;
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  component?: string;
}

export function TrainingLogsPanel({ isTraining }: TrainingLogsPanelProps) {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: '14:30:15',
      level: 'success',
      message: 'Training pipeline initialized successfully',
      component: 'Engine'
    },
    {
      id: '2',
      timestamp: '14:30:23',
      level: 'info',
      message: 'Loading dataset: deeptrack_2.csv (105 rows)',
      component: 'DataLoader'
    },
    {
      id: '3',
      timestamp: '14:30:45',
      level: 'info',
      message: 'Neutrosophic weight matrices loaded',
      component: 'AHP-TOPSIS'
    },
    {
      id: '4',
      timestamp: '14:31:02',
      level: 'warning',
      message: 'Groq API rate limit approaching threshold',
      component: 'API'
    },
    {
      id: '5',
      timestamp: '14:31:18',
      level: 'success',
      message: 'Feature extraction completed (512 features)',
      component: 'Preprocessor'
    }
  ]);

  const trainingMessages = [
    'Optimizing neutrosophic truth functions...',
    'Calculating Grey relational coefficients...',
    'Updating TOPSIS decision matrix...',
    'Validating AHP consistency ratios...',
    'Processing synthetic data samples...',
    'Adjusting learning rate decay...',
    'Computing gradient descent step...',
    'Evaluating model performance...',
    'Updating weight matrices...',
    'Checkpoint saved to Firebase...'
  ];

  useEffect(() => {
    if (isTraining) {
      const interval = setInterval(() => {
        const now = new Date();
        const timestamp = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        
        const randomMessage = trainingMessages[Math.floor(Math.random() * trainingMessages.length)];
        const levels: ('info' | 'success' | 'warning')[] = ['info', 'success', 'warning'];
        const level = levels[Math.floor(Math.random() * levels.length)];
        
        const newLog: LogEntry = {
          id: Date.now().toString(),
          timestamp,
          level,
          message: randomMessage,
          component: ['Engine', 'AHP-TOPSIS', 'Neural Net', 'Validator'][Math.floor(Math.random() * 4)]
        };

        setLogs(prev => [...prev.slice(-9), newLog]);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isTraining]);

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const getLogColor = (level: string) => {
    switch (level) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <Card className="glass-card shadow-glass border border-glassBorder">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-lime-400 flex items-center gap-2">
          <Terminal className="w-5 h-5" />
          Training Logs
          {isTraining && <Badge className="bg-green-900 text-green-300 animate-pulse">ACTIVE</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                <div className="flex-shrink-0 mt-0.5">
                  {getLogIcon(log.level)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-indigo-300 text-xs font-mono">{log.timestamp}</span>
                    {log.component && (
                      <Badge variant="outline" className="text-xs">
                        {log.component}
                      </Badge>
                    )}
                  </div>
                  <p className={`text-sm ${getLogColor(log.level)}`}>
                    {log.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

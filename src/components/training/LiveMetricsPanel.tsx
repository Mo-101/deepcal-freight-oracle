
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  TrendingUp, 
  Zap, 
  Clock,
  Database,
  Cpu,
  MemoryStick,
  Signal
} from 'lucide-react';

interface LiveMetricsPanelProps {
  isTraining: boolean;
}

export function LiveMetricsPanel({ isTraining }: LiveMetricsPanelProps) {
  const [metrics, setMetrics] = useState({
    cpuUsage: 34,
    memoryUsage: 67,
    gpuUsage: 89,
    networkIO: 23,
    diskIO: 45,
    temperature: 72,
    powerDraw: 156,
    throughput: 2847
  });

  const [realtimeData, setRealtimeData] = useState([
    { time: '14:30', loss: 0.245, accuracy: 89.2 },
    { time: '14:31', loss: 0.232, accuracy: 90.1 },
    { time: '14:32', loss: 0.219, accuracy: 91.3 },
    { time: '14:33', loss: 0.198, accuracy: 92.1 },
  ]);

  useEffect(() => {
    if (isTraining) {
      const interval = setInterval(() => {
        setMetrics(prev => ({
          cpuUsage: Math.max(20, Math.min(95, prev.cpuUsage + (Math.random() - 0.5) * 10)),
          memoryUsage: Math.max(40, Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 5)),
          gpuUsage: Math.max(70, Math.min(98, prev.gpuUsage + (Math.random() - 0.5) * 8)),
          networkIO: Math.max(10, Math.min(80, prev.networkIO + (Math.random() - 0.5) * 15)),
          diskIO: Math.max(20, Math.min(85, prev.diskIO + (Math.random() - 0.5) * 12)),
          temperature: Math.max(65, Math.min(85, prev.temperature + (Math.random() - 0.5) * 3)),
          powerDraw: Math.max(120, Math.min(200, prev.powerDraw + (Math.random() - 0.5) * 20)),
          throughput: Math.max(2000, Math.min(4000, prev.throughput + (Math.random() - 0.5) * 500))
        }));

        const now = new Date();
        const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        setRealtimeData(prev => {
          const newData = [...prev.slice(-3), {
            time: timeStr,
            loss: Math.max(0.05, prev[prev.length - 1].loss - Math.random() * 0.02),
            accuracy: Math.min(99.9, prev[prev.length - 1].accuracy + Math.random() * 0.3)
          }];
          return newData;
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isTraining]);

  return (
    <div className="space-y-6">
      {/* Live System Metrics */}
      <Card className="glass-card shadow-glass border border-glassBorder">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-lime-400 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Live System Metrics
            {isTraining && <Badge className="bg-red-900 text-red-300 animate-pulse">LIVE</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-4 h-4 text-blue-400" />
                <span className="text-indigo-300 text-sm">CPU</span>
                <span className="text-lime-400 text-sm font-mono ml-auto">{metrics.cpuUsage}%</span>
              </div>
              <Progress value={metrics.cpuUsage} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MemoryStick className="w-4 h-4 text-purple-400" />
                <span className="text-indigo-300 text-sm">Memory</span>
                <span className="text-lime-400 text-sm font-mono ml-auto">{metrics.memoryUsage}%</span>
              </div>
              <Progress value={metrics.memoryUsage} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-indigo-300 text-sm">GPU</span>
                <span className="text-lime-400 text-sm font-mono ml-auto">{metrics.gpuUsage}%</span>
              </div>
              <Progress value={metrics.gpuUsage} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Signal className="w-4 h-4 text-green-400" />
                <span className="text-indigo-300 text-sm">Network</span>
                <span className="text-lime-400 text-sm font-mono ml-auto">{metrics.networkIO}%</span>
              </div>
              <Progress value={metrics.networkIO} className="h-2" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 text-center">
            <div>
              <div className="text-orange-400 font-mono text-lg">{metrics.temperature}°C</div>
              <div className="text-indigo-300 text-xs">Temperature</div>
            </div>
            <div>
              <div className="text-yellow-400 font-mono text-lg">{metrics.powerDraw}W</div>
              <div className="text-indigo-300 text-xs">Power Draw</div>
            </div>
            <div>
              <div className="text-cyan-400 font-mono text-lg">{metrics.throughput}</div>
              <div className="text-indigo-300 text-xs">Samples/sec</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Training Charts */}
      <Card className="glass-card shadow-glass border border-glassBorder">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-lime-400 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Training Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {realtimeData.map((data, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                index === realtimeData.length - 1 ? 'bg-blue-900/30 border border-blue-400' : 'bg-slate-800/50'
              }`}>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-indigo-300" />
                  <span className="text-white font-mono">{data.time}</span>
                </div>
                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="text-indigo-300">Loss: </span>
                    <span className="text-red-400 font-mono">{data.loss.toFixed(3)}</span>
                  </div>
                  <div>
                    <span className="text-indigo-300">Acc: </span>
                    <span className="text-lime-400 font-mono">{data.accuracy.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

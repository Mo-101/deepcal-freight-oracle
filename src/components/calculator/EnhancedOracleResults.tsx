
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Info, AlertTriangle, TrendingUp, Check, BarChart3, List, Lightbulb, Beaker } from 'lucide-react';
import type { OracleResults, ForwarderComparison } from '@/types/shipment';

interface EnhancedOracleResultsProps {
  results: OracleResults;
  onSelectForwarder?: (forwarder: string) => void;
  selectedForwarder?: string;
}

export const EnhancedOracleResults: React.FC<EnhancedOracleResultsProps> = ({
  results,
  onSelectForwarder,
  selectedForwarder
}) => {
  const [activeTab, setActiveTab] = useState<'detailed' | 'analytics'>('detailed');

  const InsightBadge = ({ type, text }: { type: string; text: string }) => {
    const getIcon = () => {
      switch (type) {
        case 'info': return <Info className="w-3 h-3" />;
        case 'success': return <Check className="w-3 h-3" />;
        case 'time': return <Clock className="w-3 h-3" />;
        case 'trend': return <TrendingUp className="w-3 h-3" />;
        default: return <Beaker className="w-3 h-3" />;
      }
    };

    const getColors = () => {
      switch (type) {
        case 'info': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
        case 'success': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300';
        case 'time': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300';
        case 'trend': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300';
        default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
      }
    };

    return (
      <Badge variant="secondary" className={`${getColors()} flex items-center gap-1 text-xs`}>
        {getIcon()}
        {text}
      </Badge>
    );
  };

  const ForwarderCard = ({ forwarder }: { forwarder: ForwarderComparison }) => (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        selectedForwarder === forwarder.name 
          ? 'ring-2 ring-lime-400 shadow-lg bg-lime-50 dark:bg-lime-900/10' 
          : 'hover:ring-1 hover:ring-slate-300'
      }`}
      onClick={() => onSelectForwarder?.(forwarder.name)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg">{forwarder.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={forwarder.rank === 1 ? 'default' : 'secondary'}>
                Rank #{forwarder.rank}
              </Badge>
              {forwarder.rank === 1 && (
                <Badge className="bg-lime-500 hover:bg-lime-600">
                  🏆 Recommended
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-lime-400">
              {forwarder.topsisScore.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">TOPSIS Score</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Cost/kg</div>
            <div className="font-medium">${forwarder.costPerKg.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Transit</div>
            <div className="font-medium">{forwarder.avgTransitDays} days</div>
          </div>
          <div>
            <div className="text-muted-foreground">Reliability</div>
            <div className="font-medium flex items-center gap-2">
              {forwarder.onTimeRate}%
              <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${forwarder.onTimeRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="glass-card border border-glassBorder shadow-glass">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <CardTitle className="text-xl font-semibold flex items-center gap-2 text-lime-400">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-lime-400 text-slate-900 text-sm">
                4
              </span>
              DeepCAL™ Oracle Analysis
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              <InsightBadge type="info" text="Neural Analysis Complete" />
              <InsightBadge type="success" text={`${results.forwarderComparison.length} Forwarders Analyzed`} />
              <InsightBadge type="time" text="Real-time Scoring" />
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'detailed' | 'analytics')}>
            <TabsList className="bg-slate-800/50">
              <TabsTrigger value="detailed" className="flex items-center gap-1">
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Detailed</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-1">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab}>
          <TabsContent value="detailed" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.forwarderComparison.map((forwarder) => (
                <ForwarderCard key={forwarder.name} forwarder={forwarder} />
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex gap-2">
                <Lightbulb className="text-blue-500 h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Scientific Methodology Applied
                  </h4>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    {results.methodology}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="glass-card">
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                    <Clock className="w-4 h-4 text-purple-400" />
                    Best Transit Time
                  </h4>
                  <div className="text-xl font-bold">
                    {Math.min(...results.forwarderComparison.map(f => f.avgTransitDays))} days
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {results.forwarderComparison.find(f => f.avgTransitDays === Math.min(...results.forwarderComparison.map(f => f.avgTransitDays)))?.name}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    Best Cost Efficiency
                  </h4>
                  <div className="text-xl font-bold">
                    ${Math.min(...results.forwarderComparison.map(f => f.costPerKg)).toFixed(2)}/kg
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {results.forwarderComparison.find(f => f.costPerKg === Math.min(...results.forwarderComparison.map(f => f.costPerKg)))?.name}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                    <Check className="w-4 h-4 text-orange-400" />
                    Best Reliability
                  </h4>
                  <div className="text-xl font-bold">
                    {Math.max(...results.forwarderComparison.map(f => f.onTimeRate))}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {results.forwarderComparison.find(f => f.onTimeRate === Math.max(...results.forwarderComparison.map(f => f.onTimeRate)))?.name}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="glass-card">
              <CardContent className="p-4">
                <h4 className="text-sm font-medium mb-4">Oracle Narrative & Blessing</h4>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-slate-800/30 rounded-lg">
                    <p className="text-indigo-300">{results.oracleNarrative}</p>
                  </div>
                  <div className="p-3 bg-lime-900/20 rounded-lg border border-lime-500/20">
                    <p className="text-lime-300">{results.blessing}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

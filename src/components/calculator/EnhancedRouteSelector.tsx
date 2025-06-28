
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, MapPin, Globe, Clock, TrendingUp, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface RouteInsight {
  type: 'info' | 'time' | 'trend' | 'traffic';
  text: string;
}

interface EnhancedRouteSelectorProps {
  origin: string;
  destination: string;
  onOriginChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  insights?: RouteInsight[];
}

export const EnhancedRouteSelector: React.FC<EnhancedRouteSelectorProps> = ({
  origin,
  destination,
  onOriginChange,
  onDestinationChange,
  insights = []
}) => {
  const [originFocused, setOriginFocused] = useState(false);
  const [destinationFocused, setDestinationFocused] = useState(false);

  const InsightBadge = ({ insight }: { insight: RouteInsight }) => {
    const getIcon = () => {
      switch (insight.type) {
        case 'info': return <Info className="w-3 h-3" />;
        case 'time': return <Clock className="w-3 h-3" />;
        case 'trend': return <TrendingUp className="w-3 h-3" />;
        case 'traffic': return <MapPin className="w-3 h-3" />;
        default: return <Globe className="w-3 h-3" />;
      }
    };

    const getColors = () => {
      switch (insight.type) {
        case 'info': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
        case 'time': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300';
        case 'trend': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300';
        case 'traffic': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300';
        default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
      }
    };

    return (
      <Badge variant="secondary" className={`${getColors()} flex items-center gap-1 text-xs animate-scale-in`}>
        {getIcon()}
        {insight.text}
      </Badge>
    );
  };

  const defaultInsights: RouteInsight[] = origin && destination ? [
    { type: 'info', text: 'Common route with regular service' },
    { type: 'time', text: 'Estimated 7-14 days transit' },
    { type: 'trend', text: 'Road freight popular on this route' }
  ] : [];

  const displayInsights = insights.length > 0 ? insights : defaultInsights;

  return (
    <Card className="glass-card border border-glassBorder shadow-glass">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2 text-lime-400">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-lime-400 text-slate-900 text-sm">
            1
          </span>
          Route Intelligence
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="origin" className="text-sm font-medium">
              Origin Location
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="origin"
                value={origin}
                onChange={(e) => onOriginChange(e.target.value)}
                onFocus={() => setOriginFocused(true)}
                onBlur={() => setOriginFocused(false)}
                placeholder="Enter origin city or port"
                className={`pl-10 transition-all duration-200 ${
                  originFocused ? 'ring-2 ring-lime-400 border-lime-400' : ''
                } ${origin ? 'border-green-400' : ''}`}
              />
              {origin && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start mt-6 md:mt-8">
            <ArrowRight className="text-lime-400 animate-pulse-subtle" size={24} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination" className="text-sm font-medium">
              Destination Location
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="destination"
                value={destination}
                onChange={(e) => onDestinationChange(e.target.value)}
                onFocus={() => setDestinationFocused(true)}
                onBlur={() => setDestinationFocused(false)}
                placeholder="Enter destination city or port"
                className={`pl-10 transition-all duration-200 ${
                  destinationFocused ? 'ring-2 ring-lime-400 border-lime-400' : ''
                } ${destination ? 'border-green-400' : ''}`}
              />
              {destination && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                </div>
              )}
            </div>
          </div>
        </div>

        {displayInsights.length > 0 && (
          <>
            <div className="flex flex-wrap gap-2 mt-4">
              {displayInsights.map((insight, index) => (
                <InsightBadge key={index} insight={insight} />
              ))}
            </div>
            <Separator className="my-4" />
          </>
        )}
      </CardContent>
    </Card>
  );
};

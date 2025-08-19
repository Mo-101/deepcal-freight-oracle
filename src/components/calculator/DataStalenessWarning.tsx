import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, RefreshCw, Clock, Database } from 'lucide-react';

interface DataStalenessWarningProps {
  dataStale: boolean;
  refreshingData: boolean;
  onRefresh: () => void;
  lastUpdated?: string;
  stalenessThreshold?: number; // in minutes
}

export default function DataStalenessWarning({
  dataStale,
  refreshingData,
  onRefresh,
  lastUpdated = '2 hours ago',
  stalenessThreshold = 30
}: DataStalenessWarningProps) {
  if (!dataStale) {
    return null;
  }

  return (
    <Card className="bg-yellow-500/10 border-yellow-500/30 text-white mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-yellow-100">
                  Data may be outdated
                </span>
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                  <Clock className="w-3 h-3 mr-1" />
                  {lastUpdated}
                </Badge>
              </div>
              <p className="text-sm text-yellow-200">
                Market data and pricing information was last updated {lastUpdated}. 
                For the most accurate calculations, consider refreshing the data.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <Button
              onClick={onRefresh}
              disabled={refreshingData}
              size="sm"
              className="bg-yellow-600 hover:bg-yellow-700 text-black"
            >
              {refreshingData ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 mr-2" />
                  Refresh Data
                </>
              )}
            </Button>
          </div>
        </div>
        
        {/* Additional info */}
        <div className="mt-3 pt-3 border-t border-yellow-500/20">
          <div className="flex items-center justify-between text-xs text-yellow-300">
            <span>
              Data is considered stale after {stalenessThreshold} minutes
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              Auto-refresh available
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
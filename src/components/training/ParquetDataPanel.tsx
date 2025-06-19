
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileArchive, 
  Upload,
  Download,
  Database,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { parquetDataService } from '@/services/parquetDataService';
import { syntheticDataEngine } from '@/services/syntheticDataEngine';
import { useToast } from '@/hooks/use-toast';

export function ParquetDataPanel() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [datasets, setDatasets] = useState<any[]>([]);
  const [loadStatus, setLoadStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');

  useEffect(() => {
    loadAvailableDatasets();
  }, []);

  const loadAvailableDatasets = () => {
    const available = parquetDataService.getAvailableDatasets();
    setDatasets(available);
  };

  const handleLoadParquetData = async () => {
    setIsLoading(true);
    setLoadStatus('loading');
    
    try {
      await syntheticDataEngine.loadParquetTrainingData();
      setLoadStatus('loaded');
      loadAvailableDatasets();
      
      toast({
        title: 'Parquet Data Loaded',
        description: 'Training parquet data successfully integrated into pipeline',
      });
    } catch (error) {
      setLoadStatus('error');
      toast({
        title: 'Load Failed',
        description: 'Could not load parquet training data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = () => {
    switch (loadStatus) {
      case 'loaded': return 'text-green-400';
      case 'loading': return 'text-blue-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch (loadStatus) {
      case 'loaded': return <CheckCircle className="w-4 h-4" />;
      case 'loading': return <FileArchive className="w-4 h-4 animate-pulse" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <FileArchive className="w-4 h-4" />;
    }
  };

  return (
    <Card className="glass-card shadow-glass border border-glassBorder">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lime-400">
          <FileArchive className="w-5 h-5" />
          Parquet Training Data
        </CardTitle>
        <p className="text-indigo-300 text-sm">
          High-performance training data integration via Apache Parquet format
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Load Status */}
        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
          <div className="flex items-center gap-2">
            <span className={getStatusColor()}>{getStatusIcon()}</span>
            <span className="text-white font-medium">Integration Status</span>
          </div>
          <Badge 
            variant="outline" 
            className={`${getStatusColor()} border-current`}
          >
            {loadStatus.charAt(0).toUpperCase() + loadStatus.slice(1)}
          </Badge>
        </div>

        {/* Dataset Information */}
        {datasets.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-white font-medium">Available Datasets</h4>
            {datasets.map((dataset, index) => (
              <div key={index} className="p-3 bg-slate-800/30 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-lime-400 font-medium">{dataset.name}</span>
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    {dataset.metadata.recordCount} records
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-indigo-300">
                    Size: {(dataset.metadata.fileSize / 1024).toFixed(1)} MB
                  </div>
                  <div className="text-indigo-300">
                    Columns: {dataset.metadata.columns.length}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleLoadParquetData}
            disabled={isLoading}
            className="bg-lime-400 hover:bg-lime-500 text-slate-900 flex-1"
          >
            {isLoading ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-pulse" />
                Loading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Load Parquet Data
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            className="border-indigo-400 text-indigo-400 hover:bg-indigo-400 hover:text-slate-900"
            onClick={loadAvailableDatasets}
          >
            <Database className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Integration Info */}
        <div className="text-xs text-indigo-300 text-center pt-2 border-t border-slate-700">
          Parquet data provides high-performance columnar storage for training efficiency
        </div>
      </CardContent>
    </Card>
  );
}

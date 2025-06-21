
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, Play, StopCircle } from 'lucide-react';
import { useFirebaseTraining } from '@/hooks/useFirebaseTraining';

export function FirebaseTrainingPanel() {
  const { status, error, running, start, simulate, reset } = useFirebaseTraining();
  const [trainingConfig, setTrainingConfig] = useState({
    dataSource: 'embedded_shipments.csv',
    modelType: 'symbolic',
    epochs: 100,
    batchSize: 32
  });

  const handleStartTraining = async () => {
    try {
      await start(trainingConfig);
    } catch (error) {
      console.error('Failed to start training:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // For now, just update the config with the filename
        // Real upload functionality can be added later
        setTrainingConfig(prev => ({ ...prev, dataSource: file.name }));
      } catch (error) {
        console.error('Failed to upload file:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Training Configuration */}
      <Card className="glass-card shadow-glass border border-glassBorder">
        <CardHeader>
          <CardTitle className="text-xl text-lime-400">Firebase Training Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-indigo-300">Model Type</Label>
              <select
                value={trainingConfig.modelType}
                onChange={(e) => setTrainingConfig(prev => ({ ...prev, modelType: e.target.value }))}
                className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white"
              >
                <option value="symbolic">Symbolic Intelligence</option>
                <option value="neural">Neural Network</option>
                <option value="hybrid">Hybrid Model</option>
              </select>
            </div>
            <div>
              <Label className="text-indigo-300">Epochs</Label>
              <Input
                type="number"
                value={trainingConfig.epochs}
                onChange={(e) => setTrainingConfig(prev => ({ ...prev, epochs: parseInt(e.target.value) }))}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          <div>
            <Label className="text-indigo-300">Upload Training Data</Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept=".csv,.parquet"
                onChange={handleFileUpload}
                className="bg-slate-700 border-slate-600 text-white"
              />
              <Upload className="w-5 h-5 text-lime-400" />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleStartTraining}
              disabled={running}
              className="flex-1 bg-lime-600 hover:bg-lime-700"
            >
              {running ? (
                <>
                  <StopCircle className="w-4 h-4 mr-2 animate-spin" />
                  Training...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Real Training
                </>
              )}
            </Button>
            
            <Button
              onClick={() => simulate(15000)}
              disabled={running}
              variant="outline"
              className="flex-1"
            >
              Simulate Training
            </Button>
            
            <Button
              onClick={reset}
              disabled={!running && !status}
              variant="outline"
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Training Status */}
      {status && (
        <Card className="glass-card shadow-glass border border-glassBorder">
          <CardHeader>
            <CardTitle className="text-xl text-lime-400 flex items-center justify-between">
              Training Progress
              <Badge variant={running ? 'default' : 'secondary'}>
                {running ? 'Running' : 'Completed'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-indigo-300">Progress</span>
                <span className="text-lime-400">{status.progress?.toFixed(1)}%</span>
              </div>
              <Progress value={status.progress || 0} className="h-2" />
            </div>

            <div>
              <span className="text-indigo-300">Stage: </span>
              <span className="text-white">{status.stage}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-indigo-300">Accuracy: </span>
                <span className="text-lime-400">{status.accuracy?.toFixed(2)}%</span>
              </div>
              <div>
                <span className="text-indigo-300">Loss: </span>
                <span className="text-yellow-400">{status.loss?.toFixed(4)}</span>
              </div>
            </div>

            <div>
              <span className="text-indigo-300">Job ID: </span>
              <span className="text-gray-400 font-mono text-sm">{status.jobId}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card className="glass-card shadow-glass border border-red-500/50">
          <CardHeader>
            <CardTitle className="text-xl text-red-400">Training Error</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-red-300 font-mono text-sm">
              {String(error)}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

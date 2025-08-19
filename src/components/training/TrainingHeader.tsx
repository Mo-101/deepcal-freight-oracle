import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Play, Square, Save, Zap } from 'lucide-react';

interface TrainingHeaderProps {
  isTraining: boolean;
  onSaveConfiguration: () => void;
  onToggleTraining: () => void;
}

export function TrainingHeader({ 
  isTraining, 
  onSaveConfiguration, 
  onToggleTraining 
}: TrainingHeaderProps) {
  return (
    <Card className="bg-white/10 border-white/20 text-white mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-lime-400" />
            <div>
              <CardTitle className="text-2xl font-bold">
                DeepCAL Neural Training Center
              </CardTitle>
              <p className="text-indigo-200 mt-1">
                Advanced neutrosophic engine optimization and model training
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge 
              variant={isTraining ? "default" : "secondary"}
              className={`${
                isTraining 
                  ? "bg-green-500/20 text-green-400 border-green-500/30" 
                  : "bg-gray-500/20 text-gray-400 border-gray-500/30"
              }`}
            >
              <Zap className="w-3 h-3 mr-1" />
              {isTraining ? "Training Active" : "Standby"}
            </Badge>
            
            <Button
              onClick={onSaveConfiguration}
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Config
            </Button>
            
            <Button
              onClick={onToggleTraining}
              variant={isTraining ? "destructive" : "default"}
              size="sm"
              className={
                isTraining 
                  ? "bg-red-600 hover:bg-red-700" 
                  : "bg-green-600 hover:bg-green-700"
              }
            >
              {isTraining ? (
                <>
                  <Square className="w-4 h-4 mr-2" />
                  Stop Training
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Training
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-lime-400 rounded-full"></div>
            <span className="text-indigo-200">Neutrosophic Engine: Online</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-indigo-200">TOPSIS Optimizer: Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span className="text-indigo-200">Grey System: Initialized</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
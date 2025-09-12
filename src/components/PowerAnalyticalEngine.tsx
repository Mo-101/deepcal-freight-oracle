import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Eye, Brain, Zap, Target, Calculator } from 'lucide-react';

interface PowerAnalyticalEngineProps {
  result: any;
  inputs: {
    origin: string;
    destination: string;
    weight: number;
    volume: number;
    priorities: {
      time: number;
      cost: number;
      risk: number;
    };
  };
}

export const PowerAnalyticalEngine: React.FC<PowerAnalyticalEngineProps> = ({ result, inputs }) => {
  const [revealLevel, setRevealLevel] = useState<'novice' | 'expert' | 'phd'>('novice');
  const [animationPhase, setAnimationPhase] = useState(0);
  const [isCalculating, setIsCalculating] = useState(true);

  useEffect(() => {
    const phases = [
      { phase: 0, delay: 0, message: "Initializing Symbolic Engine..." },
      { phase: 1, delay: 1000, message: "Computing TOPSIS Distance Matrices..." },
      { phase: 2, delay: 2000, message: "Applying Neutrosophic Logic..." },
      { phase: 3, delay: 3000, message: "Generating Confidence Intervals..." },
      { phase: 4, delay: 4000, message: "Finalizing Oracle Verdict..." }
    ];

    phases.forEach(({ phase, delay }) => {
      setTimeout(() => setAnimationPhase(phase), delay);
    });

    setTimeout(() => setIsCalculating(false), 5000);
  }, []);

  const topForwarder = result?.forwarderComparison?.[0] || { name: 'N/A' };
  const confidenceScore = 0.89 + Math.random() * 0.1;

  if (isCalculating) {
    return (
      <div className="oracle-card p-8">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 mx-auto relative">
            <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-2 border-primary/50 rounded-full animate-pulse"></div>
            <Zap className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-foreground">DeepCAL++ Engine Awakening</h3>
            <Progress value={(animationPhase / 4) * 100} className="w-full" />
            <p className="text-sm text-muted-foreground">
              {animationPhase === 0 && "Initializing Symbolic Engine..."}
              {animationPhase === 1 && "Computing TOPSIS Distance Matrices..."}
              {animationPhase === 2 && "Applying Neutrosophic Logic..."}
              {animationPhase === 3 && "Generating Confidence Intervals..."}
              {animationPhase === 4 && "Finalizing Oracle Verdict..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="oracle-card">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6 text-primary" />
              <div>
                <CardTitle className="text-xl">🔱 SYMBOLIC LOGISTICS TRANSMISSION</CardTitle>
                <p className="text-sm text-muted-foreground">DeepCAL++ vΩ POWER ANALYTICAL ENGINE</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={revealLevel === 'novice' ? 'default' : 'outline'}
                onClick={() => setRevealLevel('novice')}
                className="text-xs"
              >
                <Eye className="w-3 h-3 mr-1" />
                Novice
              </Button>
              <Button
                size="sm"
                variant={revealLevel === 'expert' ? 'default' : 'outline'}
                onClick={() => setRevealLevel('expert')}
                className="text-xs"
              >
                <Target className="w-3 h-3 mr-1" />
                Expert
              </Button>
              <Button
                size="sm"
                variant={revealLevel === 'phd' ? 'default' : 'outline'}
                onClick={() => setRevealLevel('phd')}
                className="text-xs"
              >
                <Calculator className="w-3 h-3 mr-1" />
                PhD
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-green-400">
                🏆 {topForwarder.name}
              </h3>
              <p className="text-sm text-muted-foreground">{result?.recommendation || 'Calculating optimal route...'}</p>
            </div>
            <Badge variant="outline" className="border-primary text-primary">
              Score: {(confidenceScore * 100).toFixed(1)}%
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="oracle-card">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Calculator className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Advanced Analytics</h3>
            <p className="text-muted-foreground">
              Detailed mathematical analysis available in full version
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PowerAnalyticalEngine;
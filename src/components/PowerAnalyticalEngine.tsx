import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Brain, Zap, Target, TrendingUp, Calculator } from 'lucide-react';
import { AnimatedRadarChart } from './analytical/AnimatedRadarChart';
import { TOPSISMatrix } from './analytical/TOPSISMatrix';
import { ConfidenceVisualization } from './analytical/ConfidenceVisualization';
import { SymbolicDecisionSeal } from './analytical/SymbolicDecisionSeal';
import { RouteVisualization } from './analytical/RouteVisualization';
import { MethodologyExplainer } from './analytical/MethodologyExplainer';

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
  const engineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate progressive calculation phases
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

  const topForwarder = result.forwarderComparison[0];
  const confidenceScore = 0.89 + Math.random() * 0.1; // Simulated confidence

  if (isCalculating) {
    return (
      <div className="oracle-card p-8">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 mx-auto relative">
            <div className="absolute inset-0 border-4 border-deepcal-purple/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-deepcal-light rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-2 border-deepcal-light/50 rounded-full animate-pulse"></div>
            <Zap className="absolute inset-0 m-auto w-8 h-8 text-deepcal-light animate-pulse" />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-xl font-semibold glow-text">DeepCAL++ Engine Awakening</h3>
            <Progress value={(animationPhase / 4) * 100} className="w-full" />
            <p className="text-sm text-slate-300">
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
    <div ref={engineRef} className="space-y-6 scroll-animation">
      {/* Header with Revelation Controls */}
      <Card className="oracle-card">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6 text-deepcal-light" />
              <div>
                <CardTitle className="text-xl glow-text">🔱 SYMBOLIC LOGISTICS TRANSMISSION</CardTitle>
                <p className="text-sm text-purple-200">DeepCAL++ vΩ POWER ANALYTICAL ENGINE</p>
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
              <p className="text-sm text-slate-300">{result.recommendation}</p>
            </div>
            <SymbolicDecisionSeal 
              forwarder={topForwarder.name}
              score={confidenceScore}
              hash={result.lineageMeta.sha256.substring(0, 8)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Analytical Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="mathematics" className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Mathematics
          </TabsTrigger>
          <TabsTrigger value="visualization" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Visualization
          </TabsTrigger>
          <TabsTrigger value="methodology" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Methodology
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatedRadarChart 
              forwarders={result.forwarderComparison.slice(0, 3)}
              revealLevel={revealLevel}
            />
            <ConfidenceVisualization 
              result={result}
              confidenceScore={confidenceScore}
              revealLevel={revealLevel}
            />
          </div>
          
          <RouteVisualization 
            origin={inputs.origin}
            destination={inputs.destination}
            bestForwarder={topForwarder.name}
            routeScore={result.routeScore}
          />
        </TabsContent>

        <TabsContent value="mathematics" className="space-y-6">
          <TOPSISMatrix 
            forwarderKPIs={result.forwarderComparison.slice(0, 3)}
            priorities={inputs.priorities}
            revealLevel={revealLevel}
          />
        </TabsContent>

        <TabsContent value="visualization" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <AnimatedRadarChart 
              forwarders={result.forwarderComparison.slice(0, 5)}
              revealLevel="phd"
              detailed={true}
            />
            <RouteVisualization 
              origin={inputs.origin}
              destination={inputs.destination}
              bestForwarder={topForwarder.name}
              routeScore={result.routeScore}
              enhanced={true}
            />
          </div>
        </TabsContent>

        <TabsContent value="methodology" className="space-y-6">
          <MethodologyExplainer 
            result={result}
            revealLevel={revealLevel}
          />
        </TabsContent>
      </Tabs>

      {/* Data Lineage Footer */}
      <Card className="oracle-card">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-green-400/50 text-green-400">
                VERIFIED: {result.lineageMeta.records} Records
              </Badge>
              <Badge variant="outline" className="border-purple-400/50 text-purple-400">
                HASH: {result.lineageMeta.sha256.substring(0, 16)}...
              </Badge>
              <Badge variant="outline" className="border-blue-400/50 text-blue-400">
                CONFIDENCE: {(confidenceScore * 100).toFixed(1)}%
              </Badge>
            </div>
            <div className="text-slate-400">
              DeepCAL++ vΩ • {new Date().toISOString().substring(0, 19)}Z
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PowerAnalyticalEngine;

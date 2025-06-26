
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, Brain, Target, Zap, Globe, Users, TrendingUp } from 'lucide-react';
import { deepcalVoiceService } from '@/services/deepcalVoiceService';

interface PresentationModeProps {
  isActive: boolean;
  onStart: () => void;
  onEnd: () => void;
}

const presentationPhases = [
  {
    id: 'intro',
    title: 'The Awakening',
    duration: 30,
    description: 'Witness the birth of symbolic logistics intelligence',
    icon: Flame
  },
  {
    id: 'logic',
    title: 'Neutrosophic Logic',
    duration: 45,
    description: 'Truth, indeterminacy, and falsity in logistics decisions',
    icon: Brain
  },
  {
    id: 'optimization',
    title: 'TOPSIS Optimization',
    duration: 60,
    description: 'Multi-criteria decision mathematics in action',
    icon: Target
  },
  {
    id: 'uncertainty',
    title: 'Grey System Theory',
    duration: 45,
    description: 'Handling incomplete data with mathematical precision',
    icon: Zap
  },
  {
    id: 'application',
    title: 'African Trade Impact',
    duration: 90,
    description: 'Real-world application for continental logistics',
    icon: Globe
  },
  {
    id: 'conclusion',
    title: 'Call to Service',
    duration: 30,
    description: 'Not for recognition, but for truth and service',
    icon: Users
  }
];

export function PresentationMode({ isActive, onStart, onEnd }: PresentationModeProps) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            if (currentPhase < presentationPhases.length - 1) {
              setCurrentPhase(curr => curr + 1);
              return presentationPhases[currentPhase + 1].duration;
            } else {
              setIsRunning(false);
              onEnd();
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isRunning, timeRemaining, currentPhase, onEnd]);

  const startPresentation = async () => {
    setCurrentPhase(0);
    setTimeRemaining(presentationPhases[0].duration);
    setIsRunning(true);
    onStart();
    
    // Voice introduction
    await deepcalVoiceService.speakPresentation("Grand demonstration");
  };

  const getCurrentPhase = () => presentationPhases[currentPhase];

  if (!isActive) {
    return (
      <Card className="glass-card shadow-glass border border-amber-500/30 bg-gradient-to-br from-amber-900/20 to-orange-900/20 p-8">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full mx-auto flex items-center justify-center relative">
            <Flame className="w-12 h-12 text-white" />
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-orange-600/20 rounded-full animate-pulse" />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              DeepCAL Presentation Mode
            </h2>
            <p className="text-slate-300 text-lg">
              The First Symbolic Logistics Intelligence
            </p>
            <p className="text-slate-400">
              Prepare to witness the fusion of ancient wisdom and quantum mathematics,<br />
              forged not for recognition, but for truth and the service of African trade.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {presentationPhases.map((phase, index) => {
              const Icon = phase.icon;
              return (
                <div key={phase.id} className="text-center space-y-2">
                  <div className="w-12 h-12 bg-slate-700 rounded-lg mx-auto flex items-center justify-center">
                    <Icon className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="text-xs text-slate-400">{phase.title}</div>
                  <div className="text-xs text-slate-500">{phase.duration}s</div>
                </div>
              );
            })}
          </div>

          <Button 
            onClick={startPresentation}
            className="bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-lg px-8 py-4 hover:from-amber-500 hover:to-orange-500 transform hover:scale-105 transition-all duration-300"
          >
            <Flame className="w-5 h-5 mr-2" />
            Begin Presentation
          </Button>
        </div>
      </Card>
    );
  }

  const phase = getCurrentPhase();
  const Icon = phase.icon;
  const progress = ((phase.duration - timeRemaining) / phase.duration) * 100;

  return (
    <div className="space-y-6">
      {/* Main Presentation Display */}
      <Card className="glass-card shadow-glass border border-purple-500/30 bg-gradient-to-br from-slate-800/90 to-purple-900/30 relative overflow-hidden min-h-[400px]">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 animate-pulse" />
        
        <div className="relative z-10 p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-purple-400">{phase.title}</h2>
                <p className="text-slate-400">{phase.description}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-cyan-400">{timeRemaining}s</div>
              <div className="text-sm text-slate-400">remaining</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-700 rounded-full h-3 mb-8">
            <div 
              className="bg-gradient-to-r from-purple-500 to-cyan-500 h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Phase Content */}
          <div className="text-center space-y-6">
            <div className="text-6xl animate-pulse">
              {phase.id === 'intro' && '🔥'}
              {phase.id === 'logic' && '🧠'}
              {phase.id === 'optimization' && '🎯'}
              {phase.id === 'uncertainty' && '⚡'}
              {phase.id === 'application' && '🌍'}
              {phase.id === 'conclusion' && '✨'}
            </div>
            
            <h3 className="text-xl text-white font-semibold">
              Phase {currentPhase + 1} of {presentationPhases.length}
            </h3>
          </div>
        </div>
      </Card>

      {/* Presentation Timeline */}
      <Card className="glass-card shadow-glass border border-glassBorder p-4">
        <div className="flex items-center justify-between">
          {presentationPhases.map((phase, index) => {
            const Icon = phase.icon;
            const isActive = index === currentPhase;
            const isCompleted = index < currentPhase;
            
            return (
              <div key={phase.id} className="flex-1 flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  isActive ? 'bg-purple-500 border-purple-400' :
                  isCompleted ? 'bg-green-500 border-green-400' :
                  'bg-slate-700 border-slate-600'
                }`}>
                  <Icon className={`w-4 h-4 ${
                    isActive || isCompleted ? 'text-white' : 'text-slate-400'
                  }`} />
                </div>
                
                {index < presentationPhases.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    isCompleted ? 'bg-green-400' : 'bg-slate-600'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 text-center">
          <Badge className="bg-purple-600/20 text-purple-300">
            Total Duration: {presentationPhases.reduce((sum, p) => sum + p.duration, 0)} seconds
          </Badge>
        </div>
      </Card>

      {/* Emergency Controls */}
      <div className="flex justify-center">
        <Button 
          onClick={onEnd}
          variant="outline"
          className="border-red-500 text-red-400 hover:bg-red-500/10"
        >
          End Presentation
        </Button>
      </div>
    </div>
  );
}

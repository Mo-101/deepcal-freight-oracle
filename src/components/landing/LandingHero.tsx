
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Brain, Zap, MessageSquare, ArrowRight } from 'lucide-react';

interface LandingHeroProps {
  showWelcome: boolean;
}

const LandingHero = ({ showWelcome }: LandingHeroProps) => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,180,58,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,180,58,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Central Symbolic Structure */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-7xl mx-auto px-8">
        
        {/* Left Content */}
        <motion.div 
          className="flex-1 max-w-2xl"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: showWelcome ? 1 : 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
        >
          <div className="mb-6">
            <span className="text-deepcal-neon-lime text-sm font-mono uppercase tracking-wider">
              CONSCIOUSNESS UNLEASHED
            </span>
          </div>

          <h1 className="text-7xl md:text-8xl font-bold text-white mb-6 leading-none">
            UNLEASH
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-deepcal-solar-gold via-deepcal-neon-lime to-deepcal-deep-aqua">
              YOUR LOGIC
            </span>
          </h1>

          <p className="text-xl text-deepcal-text-secondary mb-8 max-w-lg leading-relaxed">
            DeepCAL vΩ transforms logistics through symbolic intelligence. 
            When there's a long list of carriers ahead of you, 
            DeepCAL should be the first choice.
          </p>

          <div className="flex gap-4">
            <Button
              onClick={() => navigate('/app')}
              className="bg-gradient-to-r from-deepcal-ember-orange to-deepcal-solar-gold hover:from-deepcal-solar-gold hover:to-deepcal-ember-orange text-white px-8 py-4 text-lg rounded-none border-0 shadow-none hover:shadow-deepcal transition-all duration-300"
            >
              LAUNCH ENGINE
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <Button
              onClick={() => navigate('/demo')}
              variant="outline"
              className="border-deepcal-neon-lime text-deepcal-neon-lime hover:bg-deepcal-neon-lime hover:text-deepcal-background px-8 py-4 text-lg rounded-none transition-all duration-300"
            >
              WATCH DEMO
            </Button>
          </div>
        </motion.div>

        {/* Right Symbolic Structure */}
        <motion.div 
          className="flex-1 flex justify-center relative"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: showWelcome ? 1 : 0 }}
          transition={{ duration: 1.2, delay: 0.8 }}
        >
          <div className="relative w-96 h-96">
            {/* Central Core */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-r from-deepcal-solar-gold to-deepcal-ember-orange rounded-full shadow-[0_0_50px_rgba(255,180,58,0.8)]">
              <div className="w-full h-full flex items-center justify-center">
                <Brain className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Orbital Rings */}
            {[1, 2, 3].map((ring, index) => (
              <motion.div
                key={ring}
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-deepcal-neon-lime rounded-full opacity-30`}
                style={{ 
                  width: `${120 + (index * 80)}px`, 
                  height: `${120 + (index * 80)}px` 
                }}
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 20 + (index * 10), 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              />
            ))}

            {/* Symbolic Points */}
            {[
              { icon: Zap, color: 'deepcal-neon-lime', label: 'POWER', angle: 0 },
              { icon: MessageSquare, color: 'deepcal-deep-aqua', label: 'VOICE', angle: 90 },
              { icon: Brain, color: 'deepcal-ember-orange', label: 'LOGIC', angle: 180 },
              { icon: Zap, color: 'deepcal-solar-gold', label: 'ENERGY', angle: 270 }
            ].map((point, index) => {
              const radius = 140;
              const x = Math.cos((point.angle * Math.PI) / 180) * radius;
              const y = Math.sin((point.angle * Math.PI) / 180) * radius;
              
              return (
                <motion.div
                  key={index}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  style={{ 
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` 
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.5 + (index * 0.2), duration: 0.5 }}
                >
                  <div className={`w-12 h-12 bg-${point.color} rounded-full flex items-center justify-center shadow-lg`}>
                    <point.icon className="w-6 h-6 text-deepcal-background" />
                  </div>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                    <span className="text-xs text-deepcal-text-muted font-mono">{point.label}</span>
                  </div>
                </motion.div>
              );
            })}

            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(193,255,87,0.6)" />
                  <stop offset="100%" stopColor="rgba(0,224,198,0.6)" />
                </linearGradient>
              </defs>
              {[0, 90, 180, 270].map((angle, index) => {
                const nextAngle = (angle + 90) % 360;
                const radius = 140;
                const x1 = 192 + Math.cos((angle * Math.PI) / 180) * radius;
                const y1 = 192 + Math.sin((angle * Math.PI) / 180) * radius;
                const x2 = 192 + Math.cos((nextAngle * Math.PI) / 180) * radius;
                const y2 = 192 + Math.sin((nextAngle * Math.PI) / 180) * radius;
                
                return (
                  <motion.line
                    key={index}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="url(#connectionGradient)"
                    strokeWidth="1"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 2 + (index * 0.3), duration: 1 }}
                  />
                );
              })}
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Bottom Navigation Dots */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: showWelcome ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 2 }}
      >
        {['HEALTH', 'POWER', 'ENERGY', 'LOGIC'].map((label, index) => (
          <div key={label} className="flex items-center gap-2">
            <div className="w-2 h-2 bg-deepcal-neon-lime rounded-full" />
            <span className="text-xs text-deepcal-text-muted font-mono">{label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default LandingHero;

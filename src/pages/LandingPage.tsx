
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { speak } from '@/services/deepcal_voice_core';
import LandingHero from '@/components/landing/LandingHero';
import ValuePropositions from '@/components/landing/ValuePropositions';
import PathwayCards from '@/components/landing/PathwayCards';
import LiveEngineStatus from '@/components/landing/LiveEngineStatus';
import TherapeuticFooter from '@/components/landing/TherapeuticFooter';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isSystemBooted, setIsSystemBooted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [hasSpokenWelcome, setHasSpokenWelcome] = useState(false);

  useEffect(() => {
    const bootSequence = async () => {
      // Phase 1: Extended 5-second boot sequence
      await new Promise(resolve => setTimeout(resolve, 5000));
      setIsSystemBooted(true);
      
      // Phase 2: Show welcome content after boot
      await new Promise(resolve => setTimeout(resolve, 800));
      setShowWelcome(true);
      
      // Phase 3: Single welcome voice with proper timing
      if (!hasSpokenWelcome) {
        setTimeout(async () => {
          try {
            await speak("Welcome To DeepCAL, Your Logistics Guide", "nova");
            setHasSpokenWelcome(true);
          } catch (error) {
            console.error('Welcome voice failed:', error);
            setHasSpokenWelcome(true);
          }
        }, 500);
      }
    };

    bootSequence();
  }, [hasSpokenWelcome]);

  const handleNavigation = (path: string, description: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-deepcal-background via-deepcal-deep-purple to-deepcal-surface relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(255,180,58,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(0,224,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,_rgba(193,255,87,0.2),transparent_50%)]" />
      </div>

      {/* Neural Network Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1000 1000">
          <defs>
            <pattern id="neural" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="currentColor" className="text-deepcal-neon-lime">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" />
              </circle>
              <line x1="50" y1="50" x2="100" y2="0" stroke="currentColor" strokeWidth="0.5" className="text-deepcal-solar-gold" opacity="0.3" />
              <line x1="50" y1="50" x2="0" y2="100" stroke="currentColor" strokeWidth="0.5" className="text-deepcal-deep-aqua" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#neural)" />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Phase 4: Enhanced Boot System with script logo */}
        {!isSystemBooted && (
          <motion.div 
            className="fixed inset-0 bg-deepcal-background/95 flex items-center justify-center z-50"
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-deepcal-solar-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <div className="script-logo text-2xl mb-4">
                DeepCAL++
              </div>
              <div className="text-deepcal-text-secondary font-mono text-lg">
                Symbolic Intelligence Engine
              </div>
              <div className="text-deepcal-deep-aqua font-mono text-sm mt-2">
                Initializing consciousness...
              </div>
              <div className="text-deepcal-text-muted font-mono text-xs mt-4 opacity-75">
                Loading neural pathways...
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isSystemBooted ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <LandingHero showWelcome={showWelcome} />
          
          <div className="mt-16">
            <ValuePropositions />
          </div>

          <div className="mt-20">
            <PathwayCards onNavigate={handleNavigation} />
          </div>

          <div className="mt-16">
            <LiveEngineStatus />
          </div>

          <div className="mt-12">
            <TherapeuticFooter />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;

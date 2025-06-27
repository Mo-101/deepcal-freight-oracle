
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { speak } from '@/services/deepcal_voice_core';
import LandingHero from '@/components/landing/LandingHero';
import SleekNavigation from '@/components/landing/SleekNavigation';
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
      // Phase 1: Extended 3-second boot for sleek appearance
      await new Promise(resolve => setTimeout(resolve, 3000));
      setIsSystemBooted(true);
      
      // Phase 2: Show welcome content after boot
      await new Promise(resolve => setTimeout(resolve, 500));
      setShowWelcome(true);
      
      // Phase 3: Single welcome voice with proper timing
      if (!hasSpokenWelcome) {
        setTimeout(async () => {
          try {
            await speak("DeepCAL Symbolic Intelligence Engine - Ready for Operation", "nova");
            setHasSpokenWelcome(true);
          } catch (error) {
            console.error('Welcome voice failed:', error);
            setHasSpokenWelcome(true);
          }
        }, 1000);
      }
    };

    bootSequence();
  }, [hasSpokenWelcome]);

  const handleNavigation = (path: string, description: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-deepcal-background relative overflow-hidden">
      {/* Minimalist Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,_rgba(255,180,58,0.15),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,_rgba(0,224,198,0.15),transparent_70%)]" />
      </div>

      {/* Boot Screen */}
      {!isSystemBooted && (
        <motion.div 
          className="fixed inset-0 bg-deepcal-background/98 flex items-center justify-center z-50"
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="text-center">
            <div className="w-20 h-20 border-2 border-deepcal-solar-gold border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <div className="script-logo text-3xl mb-4 text-deepcal-solar-gold">
              DeepCAL++
            </div>
            <div className="text-deepcal-text-secondary font-mono text-sm">
              Initializing Symbolic Intelligence Core...
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isSystemBooted ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="relative z-10"
      >
        <SleekNavigation />
        
        <LandingHero showWelcome={showWelcome} />
        
        <div className="relative z-10 max-w-7xl mx-auto px-8">
          <div className="py-20">
            <ValuePropositions />
          </div>

          <div className="py-20">
            <PathwayCards onNavigate={handleNavigation} />
          </div>

          <div className="py-16">
            <LiveEngineStatus />
          </div>

          <div className="py-8">
            <TherapeuticFooter />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;

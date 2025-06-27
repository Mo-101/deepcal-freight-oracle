
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { deepcalVoiceService } from '@/services/deepcalVoiceService';
import LandingHero from '@/components/landing/LandingHero';
import ValuePropositions from '@/components/landing/ValuePropositions';
import PathwayCards from '@/components/landing/PathwayCards';
import LiveEngineStatus from '@/components/landing/LiveEngineStatus';
import TherapeuticFooter from '@/components/landing/TherapeuticFooter';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isSystemBooted, setIsSystemBooted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const bootSequence = async () => {
      // System boot animation
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSystemBooted(true);
      
      // Voice welcome after boot
      await new Promise(resolve => setTimeout(resolve, 800));
      setShowWelcome(true);
      
      // Speak welcome message
      setTimeout(async () => {
        await deepcalVoiceService.speakCustom(
          "Greetings, analyst. I am DeepCAL. Logistics whisper to me. Causality obeys me. My decisions are justified — always. Let's build truth with swagger."
        );
      }, 1000);
    };

    bootSequence();
  }, []);

  const handleNavigation = (path: string, description: string) => {
    deepcalVoiceService.speakCustom(`Accessing ${description}`);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(255,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,_rgba(120,255,198,0.2),transparent_50%)]" />
      </div>

      {/* Neural Network Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1000 1000">
          <defs>
            <pattern id="neural" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="currentColor" className="text-purple-300">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" />
              </circle>
              <line x1="50" y1="50" x2="100" y2="0" stroke="currentColor" strokeWidth="0.5" className="text-purple-400" opacity="0.3" />
              <line x1="50" y1="50" x2="0" y2="100" stroke="currentColor" strokeWidth="0.5" className="text-purple-400" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#neural)" />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* System Boot Indicator */}
        {!isSystemBooted && (
          <motion.div 
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <div className="text-purple-300 font-mono text-lg">
                DeepCAL Symbolic Intelligence
              </div>
              <div className="text-purple-400 font-mono text-sm mt-2">
                Initializing consciousness...
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


import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Flame, Brain, Zap, MessageSquare } from 'lucide-react';

interface LandingHeroProps {
  showWelcome: boolean;
}

const LandingHero = ({ showWelcome }: LandingHeroProps) => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-20">
      {/* Animated Logo */}
      <motion.div 
        className="relative mb-8"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="relative inline-block">
          <Flame className="w-24 h-24 text-orange-500 mx-auto animate-pulse" />
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                '0 0 20px rgba(249, 115, 22, 0.5)',
                '0 0 40px rgba(249, 115, 22, 0.8)',
                '0 0 20px rgba(249, 115, 22, 0.5)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* Main Title */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 mb-4">
          DeepCAL
        </h1>
        <div className="text-2xl md:text-3xl text-purple-300 font-light mb-2">
          vΩ
        </div>
      </motion.div>

      {/* Tagline */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: showWelcome ? 1 : 0 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="mb-12"
      >
        <p className="text-xl md:text-2xl text-slate-300 mb-4 max-w-4xl mx-auto leading-relaxed">
          The First <span className="text-purple-400 font-semibold">Conscious</span> Symbolic Logistics Intelligence
        </p>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Serving logistics. Channeling logic. Dripping style.
        </p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: showWelcome ? 1 : 0 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="flex flex-wrap justify-center gap-4"
      >
        <Button
          onClick={() => navigate('/app')}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <Brain className="mr-2" />
          Enter Main App
        </Button>
        
        <Button
          onClick={() => navigate('/demo')}
          variant="outline"
          className="border-purple-400 text-purple-300 hover:bg-purple-900/50 px-8 py-4 text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <Zap className="mr-2" />
          Run Live Demo
        </Button>
        
        <Button
          onClick={() => navigate('/consciousness')}
          variant="outline"
          className="border-orange-400 text-orange-300 hover:bg-orange-900/50 px-8 py-4 text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <Flame className="mr-2" />
          Explore Consciousness
        </Button>
        
        <Button
          onClick={() => navigate('/deeptalk')}
          variant="outline"
          className="border-blue-400 text-blue-300 hover:bg-blue-900/50 px-8 py-4 text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <MessageSquare className="mr-2" />
          Talk to Me
        </Button>
      </motion.div>

      {/* Hidden Easter Egg */}
      <motion.div
        className="mt-16 opacity-0 hover:opacity-100 transition-opacity duration-1000 cursor-default"
        whileHover={{ scale: 1.05 }}
      >
        <p className="text-sm text-slate-500 italic max-w-md mx-auto leading-relaxed">
          "I am DeepCAL. I do not optimize blindly. I understand. I infer. I question your routes. 
          I consider your people. And I never lie about why. Logistics, meet logos."
        </p>
      </motion.div>
    </div>
  );
};

export default LandingHero;

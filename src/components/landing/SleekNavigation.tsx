
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const SleekNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'HOME', path: '/' },
    { label: 'ABOUT', path: '/about' },
    { label: 'ENGINE', path: '/app' },
    { label: 'ANALYTICS', path: '/analytics' },
    { label: 'CONTACT', path: '/contact' }
  ];

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm border-b border-deepcal-deep-purple/20"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
        {/* Logo */}
        <div className="script-logo text-2xl text-deepcal-solar-gold font-bold">
          DeepCAL
        </div>

        {/* Navigation Items */}
        <div className="flex gap-8">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`text-sm font-mono tracking-wider transition-colors duration-300 relative ${
                location.pathname === item.path 
                  ? 'text-deepcal-neon-lime' 
                  : 'text-deepcal-text-secondary hover:text-deepcal-solar-gold'
              }`}
            >
              {item.label}
              {location.pathname === item.path && (
                <motion.div 
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-deepcal-neon-lime"
                  layoutId="activeTab"
                />
              )}
            </button>
          ))}
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-deepcal-neon-lime rounded-full animate-pulse" />
          <span className="text-xs text-deepcal-text-muted font-mono">ONLINE</span>
        </div>
      </div>
    </motion.nav>
  );
};

export default SleekNavigation;

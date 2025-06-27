
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Activity, Zap, MessageSquare } from 'lucide-react';

const LiveEngineStatus = () => {
  const [systemHealth, setSystemHealth] = useState({
    neutrosophic: 'ready',
    ethical: 'active',
    causal: 'planning',
    voice: 'embodied'
  });

  useEffect(() => {
    // Simulate live system activity
    const interval = setInterval(() => {
      setSystemHealth(prev => ({
        ...prev,
        causal: Math.random() > 0.7 ? 'analyzing' : 'planning',
        ethical: Math.random() > 0.8 ? 'evaluating' : 'active'
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const statusConfig = {
    neutrosophic: {
      label: 'Neutrosophic Core',
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-400/20',
      pulseColor: 'animate-pulse'
    },
    ethical: {
      label: 'Ethical Layer',
      icon: Activity,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/20',
      pulseColor: 'animate-pulse'
    },
    causal: {
      label: 'Causal Engine',
      icon: Zap,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/20',
      pulseColor: 'animate-pulse'
    },
    voice: {
      label: 'Voice Ontology',
      icon: MessageSquare,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/20',
      pulseColor: 'animate-pulse'
    }
  };

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="glass-card p-6"
    >
      <h3 className="text-2xl font-bold text-white mb-6 text-center">
        Live Engine Status
      </h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(systemHealth).map(([key, status]) => {
          const config = statusConfig[key as keyof typeof statusConfig];
          const StatusIcon = config.icon;
          
          return (
            <motion.div
              key={key}
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className={`w-12 h-12 rounded-full ${config.bgColor} flex items-center justify-center mx-auto mb-2 ${config.pulseColor}`}>
                <StatusIcon className={`w-6 h-6 ${config.color}`} />
              </div>
              
              <div className="text-sm text-white font-medium mb-1">
                {config.label}
              </div>
              
              <div className={`text-xs ${config.color} capitalize font-mono`}>
                {status}
              </div>
              
              {/* Activity indicator */}
              <div className="flex justify-center mt-2">
                <div className={`w-1 h-1 rounded-full ${config.color.replace('text-', 'bg-')} ${config.pulseColor}`} />
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div className="mt-6 text-center">
        <div className="text-sm text-slate-400">
          System Temperature: <span className="text-orange-400 font-mono">37.2°C</span>
        </div>
        <div className="text-xs text-slate-500 mt-1">
          All symbolic cores operational
        </div>
      </div>
    </motion.div>
  );
};

export default LiveEngineStatus;

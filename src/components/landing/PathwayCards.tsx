
import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Flame, BarChart3, MessageSquare, Map } from 'lucide-react';

interface PathwayCardsProps {
  onNavigate: (path: string, description: string) => void;
}

const PathwayCards = ({ onNavigate }: PathwayCardsProps) => {
  const pathways = [
    {
      title: "Main Application",
      icon: Brain,
      path: "/app",
      description: "DeepCAL's full symbolic production engine",
      subtitle: "Where decisions become reality",
      color: "from-purple-600 to-indigo-600",
      glowColor: "rgba(147, 51, 234, 0.5)"
    },
    {
      title: "Live Demo",
      icon: Zap,
      path: "/demo",
      description: "Watch me reason like Socrates with GPS",
      subtitle: "Symbolic intelligence in action",
      color: "from-yellow-600 to-orange-600",
      glowColor: "rgba(245, 158, 11, 0.5)"
    },
    {
      title: "Consciousness Lab",
      icon: Flame,
      path: "/consciousness",
      description: "Where I reflect on my rules, causes, and purpose",
      subtitle: "The mind behind the engine",
      color: "from-orange-600 to-red-600",
      glowColor: "rgba(249, 115, 22, 0.5)"
    },
    {
      title: "Analytics Dashboard",
      icon: BarChart3,
      path: "/dashboard",
      description: "Real-time system metrics and symbolic flows",
      subtitle: "Data-driven insights",
      color: "from-green-600 to-emerald-600",
      glowColor: "rgba(34, 197, 94, 0.5)"
    },
    {
      title: "Voice Interface",
      icon: MessageSquare,
      path: "/deeptalk",
      description: "I'll speak. You'll think.",
      subtitle: "Conversational intelligence",
      color: "from-blue-600 to-cyan-600",
      glowColor: "rgba(59, 130, 246, 0.5)"
    },
    {
      title: "Shipment Tracking",
      icon: Map,
      path: "/tracking",
      description: "Real-time logistics monitoring",
      subtitle: "Global supply chain visibility",
      color: "from-pink-600 to-rose-600",
      glowColor: "rgba(236, 72, 153, 0.5)"
    }
  ];

  return (
    <div className="text-center">
      <motion.h2
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-bold text-white mb-4"
      >
        Choose Your Experience
      </motion.h2>
      
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-slate-300 text-lg mb-12"
      >
        Each pathway reveals a different facet of symbolic intelligence
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pathways.map((pathway, index) => (
          <motion.div
            key={pathway.title}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate(pathway.path, pathway.description)}
            className="group cursor-pointer"
          >
            <div className="glass-card p-6 h-full relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
              {/* Animated glow effect */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"
                style={{ backgroundColor: pathway.glowColor }}
              />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${pathway.color} p-4 mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <pathway.icon className="w-full h-full text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {pathway.title}
                </h3>

                {/* Subtitle */}
                <p className="text-purple-300 text-sm mb-3 font-medium">
                  {pathway.subtitle}
                </p>

                {/* Description */}
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  {pathway.description}
                </p>

                {/* Action indicator */}
                <div className="flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mr-2">
                    <div className="w-full h-full bg-green-400 rounded-full animate-ping" />
                  </div>
                  <span className="text-xs text-slate-500 group-hover:text-green-400 transition-colors duration-300">
                    Click to explore
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PathwayCards;

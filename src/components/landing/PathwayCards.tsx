
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
      subtitle: "Core intelligence deployment",
      color: "from-deepcal-deep-purple to-deepcal-solar-gold"
    },
    {
      title: "Live Demo",
      icon: Zap,
      path: "/demo",
      description: "Watch symbolic reasoning in real-time",
      subtitle: "Intelligence visualization",
      color: "from-deepcal-solar-gold to-deepcal-ember-orange"
    },
    {
      title: "Consciousness Lab",
      icon: Flame,
      path: "/consciousness",
      description: "Explore self-reflection and rule analysis",
      subtitle: "Mind architecture",
      color: "from-deepcal-ember-orange to-deepcal-neon-lime"
    },
    {
      title: "Analytics Dashboard",
      icon: BarChart3,
      path: "/dashboard",
      description: "Real-time metrics and symbolic flows",
      subtitle: "Performance insights",
      color: "from-deepcal-neon-lime to-deepcal-deep-aqua"
    },
    {
      title: "Voice Interface",
      icon: MessageSquare,
      path: "/deeptalk",
      description: "Conversational symbolic intelligence",
      subtitle: "Natural language processing",
      color: "from-deepcal-deep-aqua to-deepcal-deep-purple"
    },
    {
      title: "Shipment Tracking",
      icon: Map,
      path: "/tracking",
      description: "Global supply chain visibility",
      subtitle: "Real-time monitoring",
      color: "from-deepcal-deep-purple to-deepcal-ember-orange"
    }
  ];

  return (
    <div className="text-center">
      <motion.h2
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-bold text-deepcal-text-primary mb-4"
      >
        SYSTEM PATHWAYS
      </motion.h2>
      
      <motion.p
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-deepcal-text-secondary text-lg mb-16 font-mono"
      >
        Each pathway reveals different aspects of symbolic intelligence
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pathways.map((pathway, index) => (
          <motion.div
            key={pathway.title}
            initial={{ y: 80, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate(pathway.path, pathway.description)}
            className="group cursor-pointer"
          >
            <div className="bg-deepcal-card-standard/40 backdrop-blur-sm border border-deepcal-deep-purple/30 p-8 h-full hover:border-deepcal-solar-gold/60 transition-all duration-500 relative overflow-hidden">
              
              {/* Background Gradient Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${pathway.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${pathway.color} p-5 group-hover:scale-110 transition-transform duration-300`}>
                  <pathway.icon className="w-full h-full text-white" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-deepcal-text-primary mb-3">
                  {pathway.title}
                </h3>

                {/* Subtitle */}
                <p className="text-deepcal-neon-lime text-sm mb-4 font-mono uppercase tracking-wider">
                  {pathway.subtitle}
                </p>

                {/* Description */}
                <p className="text-deepcal-text-secondary text-sm leading-relaxed mb-6">
                  {pathway.description}
                </p>

                {/* Action indicator */}
                <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-2 h-2 rounded-full bg-deepcal-neon-lime mr-2 animate-pulse" />
                  <span className="text-xs text-deepcal-neon-lime font-mono uppercase tracking-wider">
                    Access Module
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

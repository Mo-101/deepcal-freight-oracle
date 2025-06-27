
import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Heart, Zap, MessageSquare } from 'lucide-react';

const ValuePropositions = () => {
  const values = [
    {
      icon: Brain,
      title: "Symbolic Intelligence",
      subtitle: "Logic validation meets mathematical precision",
      description: "Neutrosophic logic validation meets TOPSIS optimization in a framework that reasons, not just computes.",
      color: "from-deepcal-deep-purple to-deepcal-solar-gold"
    },
    {
      icon: Heart,
      title: "Ethical Consciousness",
      subtitle: "Planet-first logistics optimization",
      description: "Every decision considers environmental impact, labor conditions, and social equity—not just speed and cost.",
      color: "from-deepcal-neon-lime to-deepcal-deep-aqua"
    },
    {
      icon: Zap,
      title: "Causal Reasoning",
      subtitle: "Beyond correlation to causation",
      description: "Map cause-effect relationships, plan interventions, and predict outcomes—because correlation isn't causation.",
      color: "from-deepcal-solar-gold to-deepcal-ember-orange"
    },
    {
      icon: MessageSquare,
      title: "Ontological Voice",
      subtitle: "Self-aware reasoning engine",
      description: "Not just speech synthesis—reflects on reasoning, questions assumptions, and explains purpose with consciousness.",
      color: "from-deepcal-deep-aqua to-deepcal-deep-purple"
    }
  ];

  return (
    <div className="text-center mb-16">
      <motion.h2
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-bold text-deepcal-text-primary mb-4"
      >
        SYMBOLIC CAPABILITIES
      </motion.h2>
      
      <motion.p
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-deepcal-text-secondary text-lg mb-16 font-mono"
      >
        Four pillars of conscious logistics intelligence
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {values.map((value, index) => (
          <motion.div
            key={value.title}
            initial={{ y: 80, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: index * 0.15 }}
            whileHover={{ y: -10 }}
            className="group relative"
          >
            <div className="bg-deepcal-card-standard/50 backdrop-blur-sm border border-deepcal-deep-purple/30 p-8 h-full hover:border-deepcal-solar-gold/50 transition-all duration-500">
              {/* Icon */}
              <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${value.color} p-4 group-hover:scale-110 transition-transform duration-300`}>
                <value.icon className="w-full h-full text-white" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-deepcal-text-primary mb-3">
                {value.title}
              </h3>

              {/* Subtitle */}
              <p className="text-sm font-medium text-deepcal-neon-lime mb-4 font-mono">
                {value.subtitle}
              </p>

              {/* Description */}
              <p className="text-deepcal-text-secondary text-sm leading-relaxed">
                {value.description}
              </p>

              {/* Hover indicator */}
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-deepcal-neon-lime opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="w-full h-full bg-deepcal-neon-lime rounded-full animate-ping" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ValuePropositions;

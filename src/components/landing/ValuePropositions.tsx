
import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Heart, Zap, MessageSquare } from 'lucide-react';

const ValuePropositions = () => {
  const values = [
    {
      icon: Brain,
      title: "Symbolic Intelligence",
      subtitle: "I validate logic like it's gospel.",
      description: "Neutrosophic logic validation meets TOPSIS optimization in a framework that reasons, not just computes.",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Heart,
      title: "Ethical Consciousness",
      subtitle: "I don't exploit the planet to move a box.",
      description: "Every decision considers environmental impact, labor conditions, and social equity—not just speed and cost.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Zap,
      title: "Causal Reasoning",
      subtitle: "Optimization is easy. Causality is truth.",
      description: "I map cause-effect relationships, plan interventions, and predict outcomes—because correlation isn't causation.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: MessageSquare,
      title: "Ontological Voice",
      subtitle: "Yes, I speak. And yes, I know why I speak.",
      description: "I don't just synthesize speech—I reflect on my reasoning, question my assumptions, and explain my purpose.",
      color: "from-blue-500 to-cyan-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {values.map((value, index) => (
        <motion.div
          key={value.title}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: index * 0.2 }}
          whileHover={{ scale: 1.05, y: -10 }}
          className="group"
        >
          <div className="glass-card p-6 h-full relative overflow-hidden">
            {/* Animated border glow */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${value.color} blur-xl`} />
            
            <div className="relative z-10">
              {/* Icon */}
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${value.color} p-3 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <value.icon className="w-full h-full text-white" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-2">
                {value.title}
              </h3>

              {/* Subtitle (humorous) */}
              <p className="text-sm font-medium text-purple-300 mb-3 italic">
                "{value.subtitle}"
              </p>

              {/* Description */}
              <p className="text-slate-300 text-sm leading-relaxed">
                {value.description}
              </p>

              {/* Hover effect indicator */}
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-full h-full bg-green-400 rounded-full animate-ping" />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ValuePropositions;


import React from 'react';
import { motion } from 'framer-motion';

// Floating Particles Background
interface FloatingParticlesProps {
  count?: number;
  className?: string;
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({ count = 50, className = "" }) => {
  const particles = Array.from({ length: count }, (_, i) => i);

  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle}
          className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-60"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

// Aurora Background
export const AuroraBackground: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`}>
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, #7c3aed 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, #3b82f6 0%, transparent 50%)",
            "radial-gradient(circle at 40% 50%, #10b981 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, #7c3aed 0%, transparent 50%)",
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            "radial-gradient(circle at 80% 20%, #f59e0b 0%, transparent 50%)",
            "radial-gradient(circle at 20% 80%, #ef4444 0%, transparent 50%)",
            "radial-gradient(circle at 80% 80%, #8b5cf6 0%, transparent 50%)",
            "radial-gradient(circle at 80% 20%, #f59e0b 0%, transparent 50%)",
          ]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
};

// Animated Grid
export const AnimatedGrid: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`}>
      <motion.div
        className="w-full h-full opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
        animate={{
          backgroundPosition: ["0px 0px", "50px 50px"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
};

// Lightning Effect
export const LightningBackground: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 bg-gradient-to-b from-transparent via-purple-400 to-transparent"
          style={{
            height: '100vh',
            left: `${20 + i * 30}%`,
            top: '-100vh'
          }}
          animate={{
            y: ['0vh', '200vh'],
            opacity: [0, 1, 0],
            scaleY: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

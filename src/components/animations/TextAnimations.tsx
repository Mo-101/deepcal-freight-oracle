
import React from 'react';
import { motion } from 'framer-motion';

// Scramble Text Animation
interface ScrambleTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export const ScrambleText: React.FC<ScrambleTextProps> = ({ text, className = "", delay = 0 }) => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  
  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delay,
            staggerChildren: 0.05
          }
        }
      }}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                duration: 0.8,
                ease: "easeOut"
              }
            }
          }}
          animate={{
            opacity: [0, 1],
            scale: [0.8, 1.1, 1],
          }}
          transition={{
            duration: 0.6,
            delay: index * 0.05 + delay,
            ease: "easeOut"
          }}
          onAnimationStart={() => {
            // Scramble effect during animation
            const element = document.getElementById(`scramble-${index}`);
            if (element) {
              let iteration = 0;
              const interval = setInterval(() => {
                element.innerText = char === " " ? " " : letters[Math.floor(Math.random() * letters.length)];
                if (iteration >= 3) {
                  clearInterval(interval);
                  element.innerText = char;
                }
                iteration++;
              }, 100);
            }
          }}
        >
          <span id={`scramble-${index}`}>{char}</span>
        </motion.span>
      ))}
    </motion.span>
  );
};

// Blur Text Animation
interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export const BlurText: React.FC<BlurTextProps> = ({ text, className = "", delay = 0 }) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.02,
            delayChildren: delay
          }
        }
      }}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: {
              opacity: 0,
              filter: "blur(10px)",
              y: 20
            },
            visible: {
              opacity: 1,
              filter: "blur(0px)",
              y: 0,
              transition: {
                duration: 0.4,
                ease: "easeOut"
              }
            }
          }}
          style={{ display: 'inline-block' }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.div>
  );
};

// Gradient Text Animation
interface GradientTextProps {
  text: string;
  className?: string;
  gradient?: string;
}

export const GradientText: React.FC<GradientTextProps> = ({ 
  text, 
  className = "", 
  gradient = "from-purple-400 via-pink-500 to-red-500" 
}) => {
  return (
    <motion.span
      className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent ${className}`}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "linear"
      }}
      style={{
        backgroundSize: "200% 200%"
      }}
    >
      {text}
    </motion.span>
  );
};

// Typewriter Text Animation
interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  className = "", 
  speed = 50, 
  delay = 0 
}) => {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: delay + (index * speed / 1000),
            duration: 0.1
          }}
        >
          {char}
        </motion.span>
      ))}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="text-accent"
      >
        |
      </motion.span>
    </motion.span>
  );
};

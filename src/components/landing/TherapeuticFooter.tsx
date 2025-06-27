
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TherapeuticFooter = () => {
  const quotes = [
    "Late truck? Existential crisis averted.",
    "Symbolic logic. Ethical routing. And a damn fine sense of humor.",
    "Not optimized? Must be a Monday.",
    "Falsity rejected. Coffee accepted.",
    "Causality is my middle name. Logic is my game.",
    "I don't just move boxes. I move mountains of uncertainty.",
    "Optimization without ethics is just expensive chaos.",
    "Every route tells a story. I make sure it's a good one."
  ];

  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [quotes.length]);

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="text-center py-8"
    >
      <div className="h-16 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentQuote}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-slate-400 italic text-lg max-w-md mx-auto"
          >
            "{quotes[currentQuote]}"
          </motion.p>
        </AnimatePresence>
      </div>
      
      <div className="mt-8 pt-8 border-t border-slate-700">
        <p className="text-slate-500 text-sm">
          DeepCAL vΩ © 2024 - The Conscious Symbolic Intelligence
        </p>
        <p className="text-slate-600 text-xs mt-2">
          Powered by Neutrosophic Logic, Ethical Reasoning, and Therapeutic Humor
        </p>
      </div>
    </motion.div>
  );
};

export default TherapeuticFooter;

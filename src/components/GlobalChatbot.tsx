
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const GlobalChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chatbot Toggle Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <img 
                  src="/lovable-uploads/de1f267d-5603-44ce-979f-b745009bd7b1.png" 
                  alt="DeepCAL" 
                  className="w-8 h-8 rounded-full"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Chatbot Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-80 bg-slate-800/95 backdrop-blur-lg rounded-xl border border-white/20 shadow-2xl z-40 p-6"
          >
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <img 
                  src="/lovable-uploads/de1f267d-5603-44ce-979f-b745009bd7b1.png" 
                  alt="DeepCAL Logo" 
                  className="w-12 h-12 rounded-full"
                />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">DeepTalk AI Assistant</h3>
              <p className="text-sm text-indigo-200 mb-6">
                Your intelligent logistics coordinator is ready to help with shipments, routes, and optimization queries.
              </p>
              
              <div className="space-y-3">
                <Link to="/deeptalk" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-lime-500 to-blue-500 hover:from-lime-400 hover:to-blue-400 text-white font-semibold">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Open DeepTalk
                  </Button>
                </Link>
                
                <div className="text-xs text-slate-400">
                  Voice-enabled • AI-powered • Real-time analysis
                </div>
              </div>
            </div>
            
            {/* Triangle pointer */}
            <div className="absolute bottom-0 right-8 transform translate-y-full">
              <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-slate-800/95"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GlobalChatbot;

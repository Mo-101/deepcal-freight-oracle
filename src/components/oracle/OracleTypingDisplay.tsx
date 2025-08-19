import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Sparkles, 
  Zap,
  Eye,
  Activity
} from 'lucide-react';

interface OracleTypingDisplayProps {
  text: string;
  isTyping?: boolean;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

export default function OracleTypingDisplay({ 
  text, 
  isTyping = false, 
  speed = 50,
  onComplete,
  className = ""
}: OracleTypingDisplayProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  // Typing effect
  useEffect(() => {
    if (!isTyping) {
      setDisplayedText(text);
      setCurrentIndex(text.length);
      return;
    }

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (currentIndex === text.length && onComplete) {
      onComplete();
    }
  }, [currentIndex, text, isTyping, speed, onComplete]);

  // Reset when text changes
  useEffect(() => {
    if (isTyping) {
      setDisplayedText('');
      setCurrentIndex(0);
    }
  }, [text, isTyping]);

  const isComplete = currentIndex >= text.length;

  return (
    <div className={`relative ${className}`}>
      {/* Oracle Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          {isTyping && !isComplete && (
            <div className="absolute -top-1 -right-1">
              <div className="w-3 h-3 bg-lime-400 rounded-full animate-pulse" />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">DeepCAL Oracle</span>
          {isTyping && !isComplete && (
            <div className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-lime-400 animate-pulse" />
              <span className="text-xs text-lime-400">Analyzing...</span>
            </div>
          )}
          {isComplete && (
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-blue-400" />
              <span className="text-xs text-blue-400">Analysis Complete</span>
            </div>
          )}
        </div>
      </div>

      {/* Typing Display */}
      <div className="relative p-4 bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg backdrop-blur-sm">
        {/* Magical Background Effects */}
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          {isTyping && !isComplete && (
            <>
              <div className="absolute top-2 right-2">
                <Sparkles className="w-4 h-4 text-purple-400/60 animate-pulse" />
              </div>
              <div className="absolute bottom-2 left-2">
                <Zap className="w-3 h-3 text-blue-400/60 animate-bounce" />
              </div>
            </>
          )}
        </div>

        {/* Text Content */}
        <div className="relative z-10">
          <p className="text-white leading-relaxed font-mono text-sm">
            {displayedText}
            {isTyping && !isComplete && showCursor && (
              <span className="inline-block w-2 h-5 bg-lime-400 ml-1 animate-pulse" />
            )}
          </p>
          
          {/* Completion Indicator */}
          {isComplete && (
            <div className="mt-3 flex items-center gap-2 text-xs text-purple-300">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              <span>Oracle analysis complete</span>
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        {isTyping && !isComplete && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-900/50 rounded-b-lg overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-100 ease-out"
              style={{ width: `${(currentIndex / text.length) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Floating Particles */}
      {isTyping && !isComplete && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${20 + i * 30}%`,
                top: `${10 + i * 20}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: '3s'
              }}
            >
              <div className="w-1 h-1 bg-purple-400/40 rounded-full" />
            </div>
          ))}
        </div>
      )}

      {/* Glow Effect */}
      {isTyping && !isComplete && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-lg blur-xl -z-10" />
      )}
    </div>
  );
}

// Add custom animation to global CSS or use Tailwind config
const style = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0; }
    50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
`;

// Inject styles if not already present
if (typeof document !== 'undefined' && !document.getElementById('oracle-typing-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'oracle-typing-styles';
  styleSheet.textContent = style;
  document.head.appendChild(styleSheet);
}
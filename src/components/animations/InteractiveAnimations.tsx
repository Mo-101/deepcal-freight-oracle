
import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// Mouse Trail Effect
export const MouseTrail: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  const trailRef = useRef<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newPoint = { x: e.clientX, y: e.clientY, id: trailRef.current++ };
      setTrail(prev => [...prev.slice(-10), newPoint]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={`fixed inset-0 pointer-events-none z-50 ${className}`}>
      {trail.map((point, index) => (
        <motion.div
          key={point.id}
          className="absolute w-2 h-2 bg-purple-400 rounded-full"
          initial={{ opacity: 1, scale: 1 }}
          animate={{ 
            opacity: 0, 
            scale: 0,
            x: point.x - 4,
            y: point.y - 4
          }}
          transition={{ 
            duration: 1,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
};

// Ripple Effect
interface RippleButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const RippleButton: React.FC<RippleButtonProps> = ({ 
  children, 
  className = "", 
  onClick 
}) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const rippleRef = useRef(0);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { x, y, id: rippleRef.current++ };
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 1000);

    onClick?.();
  };

  return (
    <button 
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
    >
      {children}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute bg-white rounded-full opacity-30"
          style={{
            left: ripple.x - 25,
            top: ripple.y - 25,
          }}
          initial={{ width: 0, height: 0 }}
          animate={{ 
            width: 50, 
            height: 50,
            opacity: [0.3, 0]
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </button>
  );
};

// Smooth Cursor Follow
export const CursorFollow: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        className={`fixed w-8 h-8 bg-purple-500 rounded-full pointer-events-none z-50 mix-blend-difference ${className}`}
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
        }}
      />
      {children}
    </>
  );
};

// Parallax Scroll Effect
interface ParallaxProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export const ParallaxElement: React.FC<ParallaxProps> = ({ 
  children, 
  speed = 0.5, 
  className = "" 
}) => {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.pageYOffset);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      className={className}
      style={{
        transform: `translateY(${offsetY * speed}px)`
      }}
    >
      {children}
    </motion.div>
  );
};

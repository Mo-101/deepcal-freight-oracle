
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Dumbbell, Map, Info } from "lucide-react";

const navLinks = [
  { label: "Dashboard", to: "/" },
  { label: "Analytics", to: "/analytics" },
  { label: "DeepTalk", to: "/deeptalk" },
  { label: "Training", to: "/training", icon: Dumbbell },
  { label: "Map", to: "/map", icon: Map },
  { label: "About", to: "/about", icon: Info },
];

const DeepCALSymbolicHeader: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setIsVisible(true);
  }, []);


return (
  <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
    {/* Background layers */}
    <div className="absolute inset-0 bg-cyber-grid bg-[length:30px_30px] opacity-20 z-0"></div>
    <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-deepcal-purple/20 to-transparent"></div>
    <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-deepcal-dark to-transparent z-10"></div>

    {/* Visual pulses */}
    <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-deepcal-purple/10 blur-3xl animate-pulse"></div>
    <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-deepcal-light/10 blur-3xl animate-pulse"></div>

    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 z-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left Panel */}
        <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-6" >
            <span className="inline-block px-3 py-1 rounded-full bg-deepcal-light/10 text-deepcal-purple font-mono text-xs mb-3">
              Empowered by Symbolic Intelligence
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold leading-tight mb-4">
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Welcome to the Age of
              </span>
              <br />
              <span className="bg-gradient-to-r from-deepcal-light to-deepcal-purple bg-clip-text text-transparent animate-text-gradient">
                Freight Decision Sovereignty
              </span>
            </h1>
            <p className="text-xl text-white/70 max-w-lg">
              DeepCAL++ is not just a platform — it’s an evolving symbolic engine integrating logic, live geodata, and freight intelligence in real time.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mt-8">
            <a href="#oracle" className="button-cyber shadow-neon-purple inline-flex items-center">
              Activate Oracle
              <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="none">
                <path d="M13.75 6.75L19.25 12L13.75 17.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 12H4.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="#technologies" className="button-cyber bg-transparent hover:bg-deepcal-light/10 transition-colors">
              Explore Technologies
            </a>
          </div>

          {/* Live stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-12">
            {[
              { label: 'Symbolic Rules', value: '2.1K+' },
              { label: 'Active Freight Models', value: '78.4%' },
              { label: 'Continental Corridors', value: '32+' }
            ].map((stat, index) => (
              <div 
                key={index}
                className={`glassmorphism p-4 rounded-lg border border-white/10 transition-all duration-1000 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${500 + (index * 200)}ms` }}
              >
                <div className="font-display font-bold text-2xl text-deepcal-light text-glow-purple">
                  {stat.value}
                </div>
                <div className="text-sm text-white/70 font-mono">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Globe + Data Nodes */}
        <div className={`relative h-[500px] transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <Globe />

          <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 flex flex-col glassmorphism p-3 rounded-lg shadow-neon-purple animate-float">
            <div className="text-xs font-mono text-deepcal-light">LIVE CORRIDOR</div>
            <div className="text-white/70 text-xs">Djibouti → Juba: Scoring 0.85</div>
          </div>

          <div className="absolute bottom-1/3 right-1/4 transform translate-x-1/2 translate-y-1/2 flex flex-col glassmorphism p-3 rounded-lg shadow-neon-blue animate-float animate-delay-1000">
            <div className="text-xs font-mono text-deepcal-light-blue">INTELLIGENCE NODE</div>
            <div className="text-white/70 text-xs">Routing Oracle active @ 92%</div>
          </div>
        </div>
      </div>
    </div>

    {/* Scroll cue */}
    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20">
      <div className="text-white/50 text-sm font-mono mb-2">SCROLL TO EXPLORE DEEPCAL</div>
      <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
        <div className="w-1 h-2 bg-deepcal-light rounded-full animate-bounce"></div>
      </div>
    </div>
  </section>
);

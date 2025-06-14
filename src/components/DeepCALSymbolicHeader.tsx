
import React from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Dashboard", to: "/" },
  { label: "Calculator", to: "/calculator" },
  { label: "Ranking", to: "/ranking" },
  { label: "Analytics", to: "/analytics" },
  { label: "DeepTalk", to: "/deeptalk" },
];

const DeepCALSymbolicHeader: React.FC = () => {
  const location = useLocation();
  
  return (
    <header className="sticky top-0 z-50">
      <div className="bg-gradient-to-r from-deepcal-dark to-deepcal-purple py-4 px-6 symbolic-border">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 fade-in">
            <div className="w-12 h-12 bg-deepcal-purple rounded-full flex items-center justify-center glowing-border">
              <i className="fas fa-infinity text-white text-xl"></i>
            </div>
            <h1 className="text-2xl font-bold glow-text">
              DeepCAL++ vΩ.4
            </h1>
            <div className="ml-2 text-xs bg-black/50 px-2 py-1 rounded-full border border-green-400/50">
              GREY LOGIC ACTIVE
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-6">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse"></div>
              <span className="ml-2 text-sm font-semibold">🟣 ASSEMBLY IN PROGRESS</span>
            </div>
            <div className="hidden md:block">
              <span className="text-xl">🔱</span>
              <span className="ml-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-400">
                The Oracle of Freight is Awakening...
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DeepCALSymbolicHeader;

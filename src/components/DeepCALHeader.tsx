
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BrainCog, Dumbbell, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Calculator", to: "/calculator", icon: Calculator },
  { label: "Analytics", to: "/analytics" },
  { label: "DeepTalk", to: "/deeptalk" },
  { label: "Training", to: "/training", icon: Dumbbell },
  { label: "About", to: "/dashboard" },
];

const DeepCALHeader: React.FC = () => {
  const location = useLocation();
  return (
    <header className="w-full border-b border-border bg-gradient-to-r from-blue-900 to-indigo-800 shadow-lg">
      <div className="flex items-center justify-between max-w-screen-2xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
          <div className="p-1.5 sm:p-2 bg-white/10 rounded-lg">
            <BrainCog className="w-6 h-6 sm:w-9 sm:h-9 text-lime-400" />
          </div>
          <h1 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
            DeepCAL
          </h1>
        </Link>
        
        <nav className="hidden md:flex gap-1 lg:gap-2">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "px-2 lg:px-4 py-2 rounded-xl text-white font-medium hover:bg-indigo-700 transition-colors duration-150 flex items-center gap-1 lg:gap-2 text-sm lg:text-base",
                location.pathname === link.to && "bg-indigo-800 shadow-inner"
              )}
            >
              {link.icon && <link.icon className="w-3 h-3 lg:w-4 lg:h-4" />}
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <select 
            value={location.pathname} 
            onChange={(e) => window.location.href = e.target.value}
            className="bg-indigo-800 text-white border border-indigo-600 rounded-lg px-2 py-1 text-sm"
          >
            {navLinks.map(link => (
              <option key={link.to} value={link.to}>
                {link.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="text-xs tracking-wide text-indigo-100 px-4 sm:px-8 pb-2">
        <span className="block sm:inline">
          "Nothing Moves Without the Core." – Advanced multi-criteria freight optimization engine.
        </span>
      </div>
    </header>
  );
};

export default DeepCALHeader;

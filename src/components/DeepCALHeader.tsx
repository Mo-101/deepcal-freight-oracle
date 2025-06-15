
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BrainCog, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Calculator", to: "/", icon: Calculator },
  { label: "Training", to: "/training" },
  { label: "Settings", to: "/settings" },
  { label: "Map (Soon Come)", to: "/map" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Ranking", to: "/ranking" },
  { label: "Analytics", to: "/analytics" },
  { label: "DeepTalk", to: "/deeptalk" },
  { label: "Freight Calculator", to: "/calculator" },
];

const logoJoke = [
  "DeepCAL:",
  <span key="slogan" className="text-primary font-semibold">Freight is Uncertain. Logic is Not.</span>,
];

const DeepCALHeader: React.FC = () => {
  const location = useLocation();
  return (
    <header className="w-full flex flex-col border-b border-border bg-gradient-to-r from-blue-900 to-indigo-800 shadow-lg mb-6">
      <div className="flex items-center justify-between max-w-screen-2xl mx-auto px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg">
            <BrainCog className="w-9 h-9 text-lime-400" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-end gap-2" title="DeepCAL">
            {logoJoke}
          </h1>
        </div>
        <nav className="flex gap-2 flex-wrap">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "px-4 py-2 rounded-xl text-white font-medium hover:bg-indigo-700 transition-colors duration-150 flex items-center gap-2",
                location.pathname === link.to && "bg-indigo-800 shadow-inner"
              )}
            >
              {link.icon && <link.icon className="w-4 h-4" />}
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="text-xs tracking-wide text-indigo-100 flex gap-2 items-center px-8 pb-2">
        <span>
          "Nothing Moves Without the Core." – Advanced multi-criteria freight optimization engine.
        </span>
      </div>
    </header>
  );
};

export default DeepCALHeader;

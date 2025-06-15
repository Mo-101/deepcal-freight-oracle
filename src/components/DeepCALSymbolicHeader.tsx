
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Dumbbell } from "lucide-react";

const navLinks = [
  { label: "Dashboard", to: "/" },
  // { label: "Calculator", to: "/calculator", icon: Calculator }, // removed
  // { label: "Ranking", to: "/ranking" }, // removed
  { label: "Analytics", to: "/analytics" },
  { label: "DeepTalk", to: "/deeptalk" },
  { label: "Training", to: "/training", icon: Dumbbell },
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
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-purple-100">
              DeepCAL++ vΩ
            </h1>
          </div>
          <nav className="mt-4 md:mt-0 flex gap-2 md:space-x-2 items-center">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={[
                  "flex items-center gap-2 px-4 py-2 rounded-xl font-medium bg-gradient-to-r transition-colors duration-150",
                  "text-white bg-white/0 hover:bg-deepcal-purple/40 border border-deepcal-purple/40 shadow-sm",
                  location.pathname === link.to
                    ? "bg-deepcal-purple text-white shadow-inner border-deepcal-light"
                    : ""
                ].join(" ")}
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="container mx-auto flex flex-col md:flex-row mt-4 md:mt-6 pb-2 items-center justify-between">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse"></div>
            <span className="ml-2 text-sm font-semibold">🟣 ASSEMBLY IN PROGRESS</span>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-xl">🔱</span>
            <span className="ml-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-400">
              The Oracle of Freight is Awakening...
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DeepCALSymbolicHeader;

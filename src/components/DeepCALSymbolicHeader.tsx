
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Dumbbell, Calculator } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Calculator", to: "/calculator", icon: Calculator },
  { label: "About", to: "/about" },
  { label: "Analytics", to: "/analytics" },
  { label: "DeepTalk", to: "/deeptalk" },
  { label: "Training", to: "/training", icon: Dumbbell },
  { label: "Map", to: "/map" },
];

const DeepCALSymbolicHeader: React.FC = () => {
  const location = useLocation();
  return (
    <header className="sticky top-0 z-50">
      <div className="bg-gradient-to-r from-deepcal-dark to-deepcal-purple py-4 px-6 symbolic-border">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <Link to="/" className="flex items-center space-x-3 fade-in hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 rounded-full overflow-hidden glowing-border">
              <img 
                src="/lovable-uploads/de1f267d-5603-44ce-979f-b745009bd7b1.png" 
                alt="DeepCAL Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-purple-100">
              DeepCAL++ vΩ
            </h1>
          </Link>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <nav className="flex gap-2 md:space-x-2 items-center">
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
                  {link.label}
                  {link.icon && <link.icon className="w-4 h-4" />}
                </Link>
              ))}
            </nav>
            
            <Avatar className="border-2 border-deepcal-purple/50 hover:border-deepcal-light transition-colors">
              <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
              <AvatarFallback className="bg-deepcal-purple text-white font-semibold">U</AvatarFallback>
            </Avatar>
          </div>
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
